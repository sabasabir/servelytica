-- Update the handle_new_user function to include sport_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, username, sport_id)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'display_name',
    NEW.raw_user_meta_data ->> 'username',
    (NEW.raw_user_meta_data ->> 'sport_id')::uuid
  );
  
  -- Use the role from user metadata, default to 'player' if not provided
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'player')::public.app_role
  );
  
  RETURN NEW;
END;
$function$;