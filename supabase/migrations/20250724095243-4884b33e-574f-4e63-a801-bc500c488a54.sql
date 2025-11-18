-- Add unique constraint to prevent duplicate coach assignments
ALTER TABLE public.video_coaches 
ADD CONSTRAINT video_coaches_video_id_coach_id_key 
UNIQUE (video_id, coach_id);