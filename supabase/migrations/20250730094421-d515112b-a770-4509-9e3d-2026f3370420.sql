-- Create table to track video analysis usage
CREATE TABLE public.analysis_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  analysis_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  reset_date TIMESTAMPTZ NOT NULL,
  subscription_plan_id UUID NOT NULL REFERENCES public.pricing(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analysis_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for analysis usage
CREATE POLICY "Users can view their own analysis usage"
ON public.analysis_usage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analysis usage"
ON public.analysis_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_analysis_usage_user_reset ON public.analysis_usage(user_id, reset_date);

-- Update pricing table to include analysis limits
ALTER TABLE public.pricing 
ADD COLUMN IF NOT EXISTS analysis_limit INTEGER DEFAULT 0;

-- Update existing pricing plans with analysis limits
UPDATE public.pricing SET analysis_limit = 1 WHERE name = 'Free';
UPDATE public.pricing SET analysis_limit = 5 WHERE name = 'Advanced';  
UPDATE public.pricing SET analysis_limit = 20 WHERE name = 'Pro';

-- Function to check if user can create new analysis
CREATE OR REPLACE FUNCTION public.can_create_analysis(user_id_param UUID)
RETURNS TABLE(can_create BOOLEAN, analyses_used INTEGER, analyses_limit INTEGER, next_reset_date TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_subscription RECORD;
  current_analyses_count INTEGER;
  next_reset TIMESTAMPTZ;
BEGIN
  -- Get current active subscription
  SELECT us.*, p.analysis_limit 
  INTO current_subscription
  FROM public.users_subscription us
  JOIN public.pricing p ON us.pricing_plan_id = p.id
  WHERE us.user_id = user_id_param 
  AND us.status = 'active'
  ORDER BY us.created_at DESC
  LIMIT 1;
  
  IF current_subscription IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, 0, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;
  
  -- Calculate current period based on last analysis or subscription start
  SELECT COALESCE(MAX(reset_date), current_subscription.start_date + INTERVAL '30 days')
  INTO next_reset
  FROM public.analysis_usage
  WHERE user_id = user_id_param 
  AND reset_date > now();
  
  -- If no future reset date, use 30 days from now
  IF next_reset IS NULL OR next_reset <= now() THEN
    next_reset := now() + INTERVAL '30 days';
  END IF;
  
  -- Count analyses in current period
  SELECT COUNT(*)
  INTO current_analyses_count
  FROM public.analysis_usage
  WHERE user_id = user_id_param
  AND reset_date = next_reset;
  
  RETURN QUERY SELECT 
    (current_analyses_count < current_subscription.analysis_limit),
    current_analyses_count,
    current_subscription.analysis_limit,
    next_reset;
END;
$$;