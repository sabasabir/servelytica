-- Disable RLS on video upload related tables

-- Drop all RLS policies on video upload tables
DROP POLICY IF EXISTS "Users can view their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can insert their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can update their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can delete their own videos" ON public.videos;
DROP POLICY IF EXISTS "Coaches can mark assigned videos as analyzed" ON public.videos;

DROP POLICY IF EXISTS "Players can insert coaches for their videos" ON public.video_coaches;
DROP POLICY IF EXISTS "Players can view coaches for their videos" ON public.video_coaches;
DROP POLICY IF EXISTS "Coaches can view their assigned videos" ON public.video_coaches;
DROP POLICY IF EXISTS "Players can delete coaches from their videos" ON public.video_coaches;
DROP POLICY IF EXISTS "Coaches can update status of their assigned videos" ON public.video_coaches;

DROP POLICY IF EXISTS "Coaches can create feedback for assigned videos" ON public.video_feedback;
DROP POLICY IF EXISTS "Coaches can update their own feedback" ON public.video_feedback;
DROP POLICY IF EXISTS "Coaches can view their own feedback" ON public.video_feedback;
DROP POLICY IF EXISTS "Players can view feedback on their videos" ON public.video_feedback;

DROP POLICY IF EXISTS "Session participants can view videos" ON public.session_videos;
DROP POLICY IF EXISTS "Session participants can upload videos" ON public.session_videos;

-- Disable RLS on video upload tables
ALTER TABLE public.videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_coaches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_feedback DISABLE ROW LEVEL SECURITY;

-- Disable RLS on session_videos if it exists
ALTER TABLE IF EXISTS public.session_videos DISABLE ROW LEVEL SECURITY;
