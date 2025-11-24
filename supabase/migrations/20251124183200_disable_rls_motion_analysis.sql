-- Disable RLS on motion analysis and video upload tables

-- Drop all RLS policies on motion analysis tables
DROP POLICY IF EXISTS "Users can view their own analysis" ON public.motion_analysis_results;
DROP POLICY IF EXISTS "Users can insert their own analysis" ON public.motion_analysis_results;
DROP POLICY IF EXISTS "Coaches can view assigned analysis" ON public.motion_analysis_results;

DROP POLICY IF EXISTS "Users can view their own motion tracking" ON public.motion_tracking_data;
DROP POLICY IF EXISTS "Users can insert motion tracking data" ON public.motion_tracking_data;
DROP POLICY IF EXISTS "Coaches can view tracking data" ON public.motion_tracking_data;

-- Disable RLS on all motion analysis related tables
ALTER TABLE IF EXISTS public.motion_analysis_annotations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.motion_analysis_frames DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.motion_analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.motion_analysis_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.motion_tracking_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.private_analysis_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analysis_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analysis_notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analysis_usage DISABLE ROW LEVEL SECURITY;

-- Also ensure RLS is disabled on video upload tables
ALTER TABLE IF EXISTS public.videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.video_coaches DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.video_feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.session_videos DISABLE ROW LEVEL SECURITY;
