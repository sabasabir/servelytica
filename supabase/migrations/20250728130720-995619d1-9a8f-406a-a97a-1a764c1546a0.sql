-- Add unique constraint to username column in profiles table
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_username_unique UNIQUE (username);

-- Also make username NOT NULL since it should be required for all users
ALTER TABLE public.profiles 
ALTER COLUMN username SET NOT NULL;