-- Fix infinite recursion by using security definer function
-- First, drop the problematic policy
DROP POLICY IF EXISTS "Users can view their own videos and coaches can view assigned videos" ON public.videos;

-- Create a security definer function to check if user is assigned as coach to a video
CREATE OR REPLACE FUNCTION public.is_coach_assigned_to_video(_video_id uuid, _coach_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.video_coaches 
    WHERE video_id = _video_id 
    AND coach_id = _coach_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create new policy using the security definer function
CREATE POLICY "Users can view their own videos and coaches can view assigned videos" 
ON public.videos 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR 
  public.is_coach_assigned_to_video(id, auth.uid())
);