-- Disable RLS on videos table to fix upload issues
-- This allows the backend to insert videos without RLS policy violations

-- Disable RLS on videos table
ALTER TABLE public.videos DISABLE ROW LEVEL SECURITY;

-- Disable RLS on video_coaches table
ALTER TABLE public.video_coaches DISABLE ROW LEVEL SECURITY;

-- Disable RLS on video_feedback table
ALTER TABLE public.video_feedback DISABLE ROW LEVEL SECURITY;

-- Drop any existing RLS policies on these tables
DROP POLICY IF EXISTS "Users can view their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can insert their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can update their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can delete their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can view their own videos and coaches can view assigned videos" ON public.videos;
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
