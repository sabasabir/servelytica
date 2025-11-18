-- Fix database function security warnings by setting immutable search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  free_plan_id UUID;
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, display_name, username, sport_id)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'display_name',
    NEW.raw_user_meta_data ->> 'username',
    (NEW.raw_user_meta_data ->> 'sport_id')::uuid
  );
  
  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'player')::public.app_role
  );
  
  -- Get the free plan ID
  SELECT id INTO free_plan_id 
  FROM public.pricing 
  WHERE name = 'Free' 
  LIMIT 1;
  
  -- Create default free subscription if free plan exists
  IF free_plan_id IS NOT NULL THEN
    INSERT INTO public.users_subscription (
      user_id, 
      pricing_plan_id, 
      subscription_type, 
      status, 
      start_date, 
      end_date,
      price_paid,
      auto_renew
    )
    VALUES (
      NEW.id,
      free_plan_id,
      'free',
      'active',
      now(),
      NULL, -- Free plans don't expire
      0,
      false
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix has_role function security warning
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

-- Add missing RLS policies for user_roles table to prevent privilege escalation
CREATE POLICY "Users cannot update their own roles" 
ON public.user_roles 
FOR UPDATE 
USING (false);

CREATE POLICY "Users cannot delete their own roles" 
ON public.user_roles 
FOR DELETE 
USING (false);

-- Only allow admins to update/delete roles (if needed in the future)
CREATE POLICY "Admins can update user roles" 
ON public.user_roles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles" 
ON public.user_roles 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));