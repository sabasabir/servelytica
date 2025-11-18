-- Create video_coaches junction table for many-to-many relationship
CREATE TABLE public.video_coaches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL,
  coach_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(video_id, coach_id)
);

-- Enable Row Level Security
ALTER TABLE public.video_coaches ENABLE ROW LEVEL SECURITY;

-- Create policies for video_coaches table
CREATE POLICY "Players can insert coaches for their videos" 
ON public.video_coaches 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.videos 
    WHERE id = video_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Players can view coaches for their videos" 
ON public.video_coaches 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.videos 
    WHERE id = video_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Coaches can view their assigned videos" 
ON public.video_coaches 
FOR SELECT 
USING (auth.uid() = coach_id);

CREATE POLICY "Players can delete coaches from their videos" 
ON public.video_coaches 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.videos 
    WHERE id = video_id AND user_id = auth.uid()
  )
);

-- Migrate existing data from videos.coach_id to video_coaches
INSERT INTO public.video_coaches (video_id, coach_id)
SELECT id, coach_id 
FROM public.videos 
WHERE coach_id IS NOT NULL;

-- Remove the old coach_id column from videos table
ALTER TABLE public.videos DROP COLUMN coach_id;