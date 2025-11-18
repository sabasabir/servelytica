-- Add RLS policy to allow coaches to update status of their assigned videos
CREATE POLICY "Coaches can update status of their assigned videos" 
ON video_coaches 
FOR UPDATE 
USING (auth.uid() = coach_id)
WITH CHECK (auth.uid() = coach_id);