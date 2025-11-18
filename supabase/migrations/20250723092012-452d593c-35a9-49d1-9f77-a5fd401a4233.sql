
-- Create enum for subscription types
CREATE TYPE public.subscription_type AS ENUM ('monthly', 'yearly', 'free');

-- Create enum for subscription status
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');

-- Create users_subscription table
CREATE TABLE public.users_subscription (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pricing_plan_id UUID NOT NULL REFERENCES public.pricing(id) ON DELETE CASCADE,
  subscription_type public.subscription_type NOT NULL DEFAULT 'free',
  status public.subscription_status NOT NULL DEFAULT 'pending',
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  price_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  auto_renew BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on users_subscription table
ALTER TABLE public.users_subscription ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users_subscription
CREATE POLICY "Users can view their own subscription" 
ON public.users_subscription 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" 
ON public.users_subscription 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
ON public.users_subscription 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_users_subscription_user_id ON public.users_subscription(user_id);
CREATE INDEX idx_users_subscription_status ON public.users_subscription(status);

-- Add trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_users_subscription_updated_at
  BEFORE UPDATE ON public.users_subscription
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update the handle_new_user function to create a default free subscription
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
