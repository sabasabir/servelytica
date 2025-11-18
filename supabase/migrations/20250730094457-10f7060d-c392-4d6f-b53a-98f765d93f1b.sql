-- Fix security warning by setting search_path on function
CREATE OR REPLACE FUNCTION public.can_create_analysis(user_id_param UUID)
RETURNS TABLE(can_create BOOLEAN, analyses_used INTEGER, analyses_limit INTEGER, next_reset_date TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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