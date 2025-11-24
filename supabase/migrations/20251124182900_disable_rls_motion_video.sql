-- Disable RLS policies on motion analysis tables
ALTER TABLE public.motion_analysis_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_frames DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_annotations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_tracking_data DISABLE ROW LEVEL SECURITY;

-- Disable RLS policies on video-related tables
ALTER TABLE public.videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_coaches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage.objects DISABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies on motion analysis tables
DROP POLICY IF EXISTS "Users can view own motion analysis sessions" ON public.motion_analysis_sessions;
DROP POLICY IF EXISTS "Users can create own motion analysis sessions" ON public.motion_analysis_sessions;
DROP POLICY IF EXISTS "Users can update own motion analysis sessions" ON public.motion_analysis_sessions;
DROP POLICY IF EXISTS "Users can delete own motion analysis sessions" ON public.motion_analysis_sessions;
DROP POLICY IF EXISTS "Users can view motion analysis results" ON public.motion_analysis_results;
DROP POLICY IF EXISTS "Users can view motion analysis frames" ON public.motion_analysis_frames;
DROP POLICY IF EXISTS "Users can view motion analysis annotations" ON public.motion_analysis_annotations;
DROP POLICY IF EXISTS "Users can view motion tracking data" ON public.motion_tracking_data;

-- Drop existing RLS policies on video tables
DROP POLICY IF EXISTS "Users can view their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can insert their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can update their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can delete their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can view their own videos and coaches can view assigned videos" ON public.videos;
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

-- Drop storage policies
DROP POLICY IF EXISTS "Users can view their own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;
DROP POLICY IF EXISTS "Coaches can view assigned videos" ON storage.objects;
