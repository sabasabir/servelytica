-- Create storage policies for coaches to access assigned videos

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

-- Policy for users to upload their own videos  
CREATE POLICY "Users can upload their own videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for users to update their own videos
CREATE POLICY "Users can update their own videos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for users to delete their own videos
CREATE POLICY "Users can delete their own videos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);