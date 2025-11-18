-- Add status column to video_coaches table
ALTER TABLE public.video_coaches 
ADD COLUMN status text NOT NULL DEFAULT 'pending';

-- Add constraint to ensure only valid status values
ALTER TABLE public.video_coaches 
ADD CONSTRAINT video_coaches_status_check 
CHECK (status IN ('pending', 'completed'));