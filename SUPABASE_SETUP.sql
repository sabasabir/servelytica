-- ============================================
-- COPY AND PASTE ALL THIS INTO SUPABASE SQL EDITOR
-- https://app.supabase.com → SQL Editor → New Query
-- Then click RUN
-- ============================================

-- Drop existing tables if they exist (to avoid conflicts)
DROP TABLE IF EXISTS motion_analysis_results CASCADE;
DROP TABLE IF EXISTS motion_analysis_frames CASCADE;
DROP TABLE IF EXISTS motion_analysis_annotations CASCADE;
DROP TABLE IF EXISTS motion_analysis_sessions CASCADE;

-- Create motion_analysis_sessions table
CREATE TABLE IF NOT EXISTS motion_analysis_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    video_id uuid,
    video_url text,
    video_file_path text,
    title text NOT NULL,
    description text,
    sport_type text DEFAULT 'table-tennis',
    media_type text DEFAULT 'video' NOT NULL,
    analysis_status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create motion_analysis_results table
CREATE TABLE IF NOT EXISTS motion_analysis_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    analysis_type text NOT NULL,
    score numeric(3, 2),
    feedback text,
    areas_of_improvement jsonb,
    strengths jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Create motion_analysis_frames table
CREATE TABLE IF NOT EXISTS motion_analysis_frames (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    frame_number integer NOT NULL,
    timestamp_ms integer NOT NULL,
    annotations jsonb,
    pose_data jsonb,
    technique_notes text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create motion_analysis_annotations table
CREATE TABLE IF NOT EXISTS motion_analysis_annotations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    frame_id uuid,
    session_id uuid NOT NULL,
    annotation_type text NOT NULL,
    coordinates jsonb NOT NULL,
    color text DEFAULT '#FF0000',
    label text,
    created_at timestamp with time zone DEFAULT now()
);

-- DISABLE RLS ON ALL TABLES
ALTER TABLE IF EXISTS motion_analysis_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS motion_analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS motion_analysis_frames DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS motion_analysis_annotations DISABLE ROW LEVEL SECURITY;

-- Verify tables were created successfully
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('motion_analysis_sessions', 'motion_analysis_results', 'motion_analysis_frames', 'motion_analysis_annotations')
ORDER BY tablename;
