-- Create storage policy for coaches to access assigned videos

-- First, drop the existing policy if it exists to replace it
DROP POLICY IF EXISTS "Coaches can view assigned videos" ON storage.objects;

-- Policy for coaches to view videos they are assigned to  
CREATE POLICY "Coaches can view assigned videos" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'videos' AND 
  (
    -- Original uploader can access
    auth.uid()::text = (storage.foldername(name))[1] OR
    -- Coaches assigned to the video can access
    EXISTS (
      SELECT 1 FROM public.video_coaches vc
      JOIN public.videos v ON vc.video_id = v.id
      WHERE vc.coach_id = auth.uid()
      AND v.file_path = name
    )
  )
);