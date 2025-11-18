-- Update the videos table RLS policy to allow coaches to see videos assigned to them
-- First, drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own videos" ON public.videos;

-- Create a new policy that allows both video owners and assigned coaches to view videos
CREATE POLICY "Users can view their own videos and coaches can view assigned videos" 
ON public.videos 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (
    SELECT 1 FROM public.video_coaches 
    WHERE video_coaches.video_id = videos.id 
    AND video_coaches.coach_id = auth.uid()
  )
);