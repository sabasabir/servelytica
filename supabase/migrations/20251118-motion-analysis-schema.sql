-- Create motion_analysis_sessions table
CREATE TABLE public.motion_analysis_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
    video_url TEXT,
    video_file_path TEXT,
    title TEXT NOT NULL,
    description TEXT,
    sport_type TEXT DEFAULT 'table-tennis',
    analysis_status TEXT DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create motion_analysis_results table
CREATE TABLE public.motion_analysis_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.motion_analysis_sessions(id) ON DELETE CASCADE,
    analysis_type TEXT NOT NULL CHECK (analysis_type IN ('stroke', 'footwork', 'body_position', 'timing', 'overall')),
    score DECIMAL(3,2) CHECK (score >= 0 AND score <= 100),
    feedback TEXT,
    areas_of_improvement JSONB,
    strengths JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create motion_analysis_frames table for frame-by-frame analysis
CREATE TABLE public.motion_analysis_frames (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.motion_analysis_sessions(id) ON DELETE CASCADE,
    frame_number INTEGER NOT NULL,
    timestamp_ms INTEGER NOT NULL,
    annotations JSONB,
    pose_data JSONB,
    technique_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create motion_analysis_annotations table for overlay annotations
CREATE TABLE public.motion_analysis_annotations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    frame_id UUID REFERENCES public.motion_analysis_frames(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.motion_analysis_sessions(id) ON DELETE CASCADE,
    annotation_type TEXT NOT NULL CHECK (annotation_type IN ('line', 'arrow', 'circle', 'rectangle', 'text', 'angle')),
    coordinates JSONB NOT NULL,
    color TEXT DEFAULT '#FF0000',
    label TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create motion_tracking_data table
CREATE TABLE public.motion_tracking_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.motion_analysis_sessions(id) ON DELETE CASCADE,
    timestamp_ms INTEGER NOT NULL,
    joint_positions JSONB,
    velocity_data JSONB,
    acceleration_data JSONB,
    angle_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_motion_sessions_user_id ON public.motion_analysis_sessions(user_id);
CREATE INDEX idx_motion_sessions_status ON public.motion_analysis_sessions(analysis_status);
CREATE INDEX idx_motion_results_session_id ON public.motion_analysis_results(session_id);
CREATE INDEX idx_motion_frames_session_id ON public.motion_analysis_frames(session_id);
CREATE INDEX idx_motion_frames_timestamp ON public.motion_analysis_frames(session_id, timestamp_ms);
CREATE INDEX idx_motion_annotations_session_id ON public.motion_analysis_annotations(session_id);
CREATE INDEX idx_motion_tracking_session_id ON public.motion_tracking_data(session_id);
CREATE INDEX idx_motion_tracking_timestamp ON public.motion_tracking_data(session_id, timestamp_ms);

-- Add RLS policies
ALTER TABLE public.motion_analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_analysis_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motion_tracking_data ENABLE ROW LEVEL SECURITY;

-- Users can view their own motion analysis sessions
CREATE POLICY "Users can view own motion analysis sessions" ON public.motion_analysis_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own motion analysis sessions
CREATE POLICY "Users can create own motion analysis sessions" ON public.motion_analysis_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own motion analysis sessions
CREATE POLICY "Users can update own motion analysis sessions" ON public.motion_analysis_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own motion analysis sessions
CREATE POLICY "Users can delete own motion analysis sessions" ON public.motion_analysis_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Users can view motion analysis results for their sessions
CREATE POLICY "Users can view motion analysis results" ON public.motion_analysis_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.motion_analysis_sessions
            WHERE id = motion_analysis_results.session_id
            AND user_id = auth.uid()
        )
    );

-- Users can view motion analysis frames for their sessions
CREATE POLICY "Users can view motion analysis frames" ON public.motion_analysis_frames
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.motion_analysis_sessions
            WHERE id = motion_analysis_frames.session_id
            AND user_id = auth.uid()
        )
    );

-- Users can view motion analysis annotations for their sessions
CREATE POLICY "Users can view motion analysis annotations" ON public.motion_analysis_annotations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.motion_analysis_sessions
            WHERE id = motion_analysis_annotations.session_id
            AND user_id = auth.uid()
        )
    );

-- Users can view motion tracking data for their sessions
CREATE POLICY "Users can view motion tracking data" ON public.motion_tracking_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.motion_analysis_sessions
            WHERE id = motion_tracking_data.session_id
            AND user_id = auth.uid()
        )
    );