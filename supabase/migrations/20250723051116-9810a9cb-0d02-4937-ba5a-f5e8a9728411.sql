-- Add sport column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN sport_id UUID REFERENCES public.sports(id);

-- Add index for better performance
CREATE INDEX idx_profiles_sport_id ON public.profiles(sport_id);