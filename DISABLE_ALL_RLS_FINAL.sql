-- ========================================
-- COMPLETE RLS DISABLE FOR ALL TABLES
-- Run this in Supabase SQL Editor to enable uploads
-- ========================================

-- Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_statuses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_coaches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_frames DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_annotations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_specialties DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_availability DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_subscription DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_bookmarks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_reactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_stream_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_viewers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_library_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_folder_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.predefined_dates DISABLE ROW LEVEL SECURITY;

-- Drop all RLS policies if they exist
DO $$ 
DECLARE 
    p record;
BEGIN 
    FOR p IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
    END LOOP;
END $$;

-- Confirm all RLS is disabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
