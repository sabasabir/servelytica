-- Clean up orphaned records in video_coaches table and add foreign key constraints

-- Remove orphaned records from video_coaches table where coach_id doesn't exist in profiles
DELETE FROM public.video_coaches 
WHERE coach_id NOT IN (SELECT user_id FROM public.profiles);

-- Add foreign key constraint for video_coaches.video_id → videos.id
ALTER TABLE public.video_coaches 
ADD CONSTRAINT fk_video_coaches_video_id 
FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;

-- Add foreign key constraint for video_coaches.coach_id → profiles.user_id  
ALTER TABLE public.video_coaches 
ADD CONSTRAINT fk_video_coaches_coach_id 
FOREIGN KEY (coach_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;