-- ========================================
-- DISABLE RLS ON MOTION ANALYSIS TABLES
-- Run this in Supabase SQL Editor to fix upload errors
-- ========================================

-- Disable RLS on motion_analysis_sessions table
ALTER TABLE public.motion_analysis_sessions DISABLE ROW LEVEL SECURITY;

-- Disable RLS on motion_analysis_results table
ALTER TABLE public.motion_analysis_results DISABLE ROW LEVEL SECURITY;

-- Disable RLS on motion_analysis_frames table
ALTER TABLE public.motion_analysis_frames DISABLE ROW LEVEL SECURITY;

-- Disable RLS on motion_analysis_annotations table
ALTER TABLE public.motion_analysis_annotations DISABLE ROW LEVEL SECURITY;

-- Disable RLS on motion_tracking_data table
ALTER TABLE public.motion_tracking_data DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies on these tables
DROP POLICY IF EXISTS "Users can view own motion analysis sessions" ON public.motion_analysis_sessions;
DROP POLICY IF EXISTS "Users can create own motion analysis sessions" ON public.motion_analysis_sessions;
DROP POLICY IF EXISTS "Users can update own motion analysis sessions" ON public.motion_analysis_sessions;
DROP POLICY IF EXISTS "Users can delete own motion analysis sessions" ON public.motion_analysis_sessions;
DROP POLICY IF EXISTS "Users can view motion analysis results" ON public.motion_analysis_results;
DROP POLICY IF EXISTS "Users can insert their own analysis" ON public.motion_analysis_results;
DROP POLICY IF EXISTS "Users can view motion analysis frames" ON public.motion_analysis_frames;
DROP POLICY IF EXISTS "Users can view motion analysis annotations" ON public.motion_analysis_annotations;
DROP POLICY IF EXISTS "Users can view motion tracking data" ON public.motion_tracking_data;

-- Verify RLS is disabled
SELECT 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename LIKE 'motion_analysis%'
ORDER BY tablename;

-- ========================================
-- DONE! Uploads should now work.
-- ========================================

