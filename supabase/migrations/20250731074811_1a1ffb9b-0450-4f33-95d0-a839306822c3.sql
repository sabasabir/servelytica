-- Check current constraint and update it to allow 'completed' status
-- First, drop the existing constraint
ALTER TABLE video_coaches DROP CONSTRAINT IF EXISTS video_coaches_status_check;

-- Add new constraint that allows both 'pending' and 'completed'
ALTER TABLE video_coaches ADD CONSTRAINT video_coaches_status_check 
CHECK (status IN ('pending', 'completed'));