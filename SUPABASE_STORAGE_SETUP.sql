-- =====================================================
-- SUPABASE STORAGE SETUP FOR VIDEO UPLOADS
-- =====================================================
-- Run this SQL in your Supabase dashboard > SQL Editor
-- This will create the storage bucket and policies needed for video uploads
-- =====================================================

-- Create videos storage bucket (if it doesn't already exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('videos', 'videos', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;

-- Create storage policies for videos bucket
CREATE POLICY "Users can view their own videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your video upload storage bucket is now configured.
-- You can now upload videos through the application.
-- =====================================================
