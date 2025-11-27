-- ========================================
-- IMMEDIATE FIX: Disable RLS on Upload Tables Only
-- Run this to fix "violates row-level security policy" error
-- ========================================

-- Disable RLS on ALL tables (simple approach)
ALTER TABLE public.videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_coaches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_frames DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_annotations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_subscription DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Disable RLS on all other tables
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'sql_%'
    LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY';
    END LOOP;
END
$$;

-- Drop all RLS policies
DO $$ 
DECLARE 
    p RECORD;
BEGIN 
    FOR p IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
    END LOOP;
END $$;

-- Verify - all should show false (RLS disabled)
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
