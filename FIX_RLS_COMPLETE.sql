-- ============================================
-- COPY THIS INTO: https://app.supabase.com → SQL Editor → New Query → RUN
-- This disables RLS on ALL tables to fix upload errors
-- ============================================

-- Disable RLS on ALL tables
ALTER TABLE IF EXISTS public.videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.video_coaches DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.motion_analysis_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.motion_analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.motion_analysis_frames DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.motion_analysis_annotations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coach_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users_subscription DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analysis_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analysis_usage DISABLE ROW LEVEL SECURITY;

-- Drop ALL RLS policies (to ensure they're completely gone)
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.videos;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.videos;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.video_coaches;
DROP POLICY IF EXISTS "Enable read for all users" ON public.video_coaches;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.motion_analysis_sessions;
DROP POLICY IF EXISTS "Enable insert for authenticated" ON public.motion_analysis_results;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users_subscription;

-- Drop ANY other RLS policies on these tables
DROP POLICY IF EXISTS "Enable insert" ON public.videos;
DROP POLICY IF EXISTS "Enable read" ON public.videos;
DROP POLICY IF EXISTS "Enable update" ON public.videos;
DROP POLICY IF EXISTS "Enable delete" ON public.videos;
DROP POLICY IF EXISTS "Enable all" ON public.videos;

-- Verify RLS is disabled on all tables
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('videos', 'video_coaches', 'motion_analysis_sessions', 'motion_analysis_results', 'profiles', 'coach_profiles', 'users_subscription')
ORDER BY tablename;
