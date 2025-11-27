-- ============================================
-- COPY THIS INTO: https://app.supabase.com → SQL Editor → New Query → RUN
-- ============================================

-- Create motion_analysis_sessions if not exists
CREATE TABLE IF NOT EXISTS public.motion_analysis_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  video_id uuid,
  video_url text,
  video_file_path text,
  title text NOT NULL,
  description text,
  sport_type text DEFAULT 'table-tennis'::text,
  media_type text NOT NULL DEFAULT 'video'::text,
  analysis_status text DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT motion_analysis_sessions_pkey PRIMARY KEY (id)
);

-- Create motion_analysis_results if not exists
CREATE TABLE IF NOT EXISTS public.motion_analysis_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  analysis_type text NOT NULL,
  score numeric,
  feedback text,
  areas_of_improvement jsonb,
  strengths jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT motion_analysis_results_pkey PRIMARY KEY (id)
);

-- Create motion_analysis_frames if not exists
CREATE TABLE IF NOT EXISTS public.motion_analysis_frames (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  frame_number integer NOT NULL,
  timestamp_ms integer NOT NULL,
  annotations jsonb,
  pose_data jsonb,
  technique_notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT motion_analysis_frames_pkey PRIMARY KEY (id)
);

-- Create motion_analysis_annotations if not exists
CREATE TABLE IF NOT EXISTS public.motion_analysis_annotations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  frame_id uuid,
  session_id uuid NOT NULL,
  annotation_type text NOT NULL,
  coordinates jsonb NOT NULL,
  color text DEFAULT '#FF0000'::text,
  label text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT motion_analysis_annotations_pkey PRIMARY KEY (id)
);

-- DISABLE RLS (Remove security policies)
ALTER TABLE IF EXISTS public.motion_analysis_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.motion_analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.motion_analysis_frames DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.motion_analysis_annotations DISABLE ROW LEVEL SECURITY;

-- Verify success
SELECT 'Tables created successfully!' as status;
