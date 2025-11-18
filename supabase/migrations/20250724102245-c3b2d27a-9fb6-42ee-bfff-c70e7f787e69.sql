-- Fix the security definer function by setting search_path
CREATE OR REPLACE FUNCTION public.is_coach_assigned_to_video(_video_id uuid, _coach_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.video_coaches 
    WHERE video_id = _video_id 
    AND coach_id = _coach_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = '';