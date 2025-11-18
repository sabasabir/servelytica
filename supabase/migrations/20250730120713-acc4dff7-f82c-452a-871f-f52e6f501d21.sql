-- Create video_feedback table for coach feedback on videos
CREATE TABLE public.video_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL,
  coach_id UUID NOT NULL, 
  player_id UUID NOT NULL,
  feedback_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.video_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for video feedback
CREATE POLICY "Coaches can create feedback for assigned videos" 
ON public.video_feedback 
FOR INSERT 
WITH CHECK (
  auth.uid() = coach_id AND 
  is_coach_assigned_to_video(video_id, auth.uid())
);

CREATE POLICY "Coaches can update their own feedback" 
ON public.video_feedback 
FOR UPDATE 
USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can view their own feedback" 
ON public.video_feedback 
FOR SELECT 
USING (auth.uid() = coach_id);

CREATE POLICY "Players can view feedback on their videos" 
ON public.video_feedback 
FOR SELECT 
USING (
  auth.uid() = player_id OR 
  EXISTS (
    SELECT 1 FROM videos 
    WHERE videos.id = video_feedback.video_id 
    AND videos.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_video_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_video_feedback_updated_at
  BEFORE UPDATE ON public.video_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_video_feedback_updated_at();

-- Add foreign key constraints
ALTER TABLE public.video_feedback 
ADD CONSTRAINT video_feedback_video_id_fkey 
FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;

ALTER TABLE public.video_feedback 
ADD CONSTRAINT video_feedback_coach_id_fkey 
FOREIGN KEY (coach_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.video_feedback 
ADD CONSTRAINT video_feedback_player_id_fkey 
FOREIGN KEY (player_id) REFERENCES auth.users(id) ON DELETE CASCADE;