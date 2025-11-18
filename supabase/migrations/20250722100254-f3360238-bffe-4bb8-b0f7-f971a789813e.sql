-- Extend profiles table with additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS playing_experience TEXT,
ADD COLUMN IF NOT EXISTS preferred_play_style TEXT,
ADD COLUMN IF NOT EXISTS member_since TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS profile_image TEXT;

-- Create performance_metrics table
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on performance_metrics
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for performance_metrics
CREATE POLICY "Users can view their own performance metrics"
ON public.performance_metrics
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own performance metrics"
ON public.performance_metrics
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own performance metrics"
ON public.performance_metrics
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own performance metrics"
ON public.performance_metrics
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for performance_metrics updated_at
CREATE TRIGGER update_performance_metrics_updated_at
BEFORE UPDATE ON public.performance_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();