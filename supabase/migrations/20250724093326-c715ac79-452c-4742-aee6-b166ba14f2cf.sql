-- Add missing foreign key constraints to fix the coach assignment relationships

-- Add foreign key constraint for video_coaches.video_id → videos.id
ALTER TABLE public.video_coaches 
ADD CONSTRAINT fk_video_coaches_video_id 
FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;

-- Add foreign key constraint for video_coaches.coach_id → profiles.user_id  
ALTER TABLE public.video_coaches 
ADD CONSTRAINT fk_video_coaches_coach_id 
FOREIGN KEY (coach_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;