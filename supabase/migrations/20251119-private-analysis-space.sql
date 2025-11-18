-- Private Analysis Space Schema

-- Coach-Student Relationships table
CREATE TABLE IF NOT EXISTS coach_student_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(coach_id, student_id)
);

-- Private Analysis Sessions table
CREATE TABLE IF NOT EXISTS private_analysis_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  session_type VARCHAR(50) NOT NULL DEFAULT 'video_analysis' CHECK (session_type IN ('video_analysis', 'technique_review', 'match_review', 'training_plan')),
  scheduled_for TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (coach_id, student_id) REFERENCES coach_student_relationships(coach_id, student_id) ON DELETE CASCADE
);

-- Session Videos table
CREATE TABLE IF NOT EXISTS session_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES private_analysis_sessions(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  video_url TEXT,
  video_file_path TEXT,
  title VARCHAR(255),
  description TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  duration_seconds INTEGER,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Session Comments table (for async discussion)
CREATE TABLE IF NOT EXISTS session_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES private_analysis_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES session_comments(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  video_timestamp_seconds FLOAT,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  edited BOOLEAN DEFAULT false
);

-- Session Annotations table (drawing/markup tools)
CREATE TABLE IF NOT EXISTS session_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES private_analysis_sessions(id) ON DELETE CASCADE,
  video_id UUID REFERENCES session_videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  annotation_type VARCHAR(50) NOT NULL CHECK (annotation_type IN ('line', 'arrow', 'circle', 'rectangle', 'text', 'angle', 'freehand')),
  coordinates JSONB NOT NULL,
  color VARCHAR(7) DEFAULT '#FF0000',
  label TEXT,
  video_timestamp_seconds FLOAT,
  frame_number INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Session Notes table (private notes for coach/student)
CREATE TABLE IF NOT EXISTS session_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES private_analysis_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_type VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (note_type IN ('general', 'technique', 'tactical', 'physical', 'mental', 'goals')),
  note_text TEXT NOT NULL,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Analysis Requests table
CREATE TABLE IF NOT EXISTS analysis_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  request_type VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (request_type IN ('general', 'serve', 'stroke', 'footwork', 'match_analysis', 'technique')),
  priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  request_message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'declined')),
  session_id UUID REFERENCES private_analysis_sessions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Session Progress Tracking table
CREATE TABLE IF NOT EXISTS session_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES private_analysis_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('technique_score', 'consistency', 'power', 'accuracy', 'footwork', 'tactical')),
  metric_value DECIMAL(5, 2),
  notes TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  recorded_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS analysis_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('new_request', 'request_accepted', 'new_feedback', 'session_update', 'new_comment', 'new_annotation')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_session_id UUID REFERENCES private_analysis_sessions(id) ON DELETE CASCADE,
  related_request_id UUID REFERENCES analysis_requests(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX idx_coach_student_relationships_coach_id ON coach_student_relationships(coach_id);
CREATE INDEX idx_coach_student_relationships_student_id ON coach_student_relationships(student_id);
CREATE INDEX idx_private_analysis_sessions_coach_id ON private_analysis_sessions(coach_id);
CREATE INDEX idx_private_analysis_sessions_student_id ON private_analysis_sessions(student_id);
CREATE INDEX idx_session_comments_session_id ON session_comments(session_id);
CREATE INDEX idx_session_annotations_session_id ON session_annotations(session_id);
CREATE INDEX idx_analysis_requests_student_id ON analysis_requests(student_id);
CREATE INDEX idx_analysis_requests_coach_id ON analysis_requests(coach_id);
CREATE INDEX idx_analysis_notifications_user_id ON analysis_notifications(user_id);
CREATE INDEX idx_analysis_notifications_is_read ON analysis_notifications(is_read);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE coach_student_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_notifications ENABLE ROW LEVEL SECURITY;

-- Coach-Student Relationships policies
CREATE POLICY "Users can view their own relationships" ON coach_student_relationships
  FOR SELECT USING (auth.uid() = coach_id OR auth.uid() = student_id);

CREATE POLICY "Coaches can create relationships" ON coach_student_relationships
  FOR INSERT WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Users can update their own relationships" ON coach_student_relationships
  FOR UPDATE USING (auth.uid() = coach_id OR auth.uid() = student_id);

-- Private Analysis Sessions policies
CREATE POLICY "Users can view their own sessions" ON private_analysis_sessions
  FOR SELECT USING (auth.uid() = coach_id OR auth.uid() = student_id);

CREATE POLICY "Coaches can create sessions" ON private_analysis_sessions
  FOR INSERT WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Session participants can update" ON private_analysis_sessions
  FOR UPDATE USING (auth.uid() = coach_id OR auth.uid() = student_id);

-- Session Videos policies
CREATE POLICY "Session participants can view videos" ON session_videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM private_analysis_sessions
      WHERE private_analysis_sessions.id = session_videos.session_id
      AND (private_analysis_sessions.coach_id = auth.uid() OR private_analysis_sessions.student_id = auth.uid())
    )
  );

CREATE POLICY "Session participants can upload videos" ON session_videos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM private_analysis_sessions
      WHERE private_analysis_sessions.id = session_videos.session_id
      AND (private_analysis_sessions.coach_id = auth.uid() OR private_analysis_sessions.student_id = auth.uid())
    )
  );

-- Session Comments policies
CREATE POLICY "Session participants can view comments" ON session_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM private_analysis_sessions
      WHERE private_analysis_sessions.id = session_comments.session_id
      AND (private_analysis_sessions.coach_id = auth.uid() OR private_analysis_sessions.student_id = auth.uid())
    )
  );

CREATE POLICY "Session participants can create comments" ON session_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM private_analysis_sessions
      WHERE private_analysis_sessions.id = session_comments.session_id
      AND (private_analysis_sessions.coach_id = auth.uid() OR private_analysis_sessions.student_id = auth.uid())
    )
  );

CREATE POLICY "Users can update own comments" ON session_comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Session Annotations policies
CREATE POLICY "Session participants can view annotations" ON session_annotations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM private_analysis_sessions
      WHERE private_analysis_sessions.id = session_annotations.session_id
      AND (private_analysis_sessions.coach_id = auth.uid() OR private_analysis_sessions.student_id = auth.uid())
    )
  );

CREATE POLICY "Session participants can create annotations" ON session_annotations
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM private_analysis_sessions
      WHERE private_analysis_sessions.id = session_annotations.session_id
      AND (private_analysis_sessions.coach_id = auth.uid() OR private_analysis_sessions.student_id = auth.uid())
    )
  );

-- Session Notes policies
CREATE POLICY "Users can view own notes and shared notes" ON session_notes
  FOR SELECT USING (
    (auth.uid() = user_id OR is_shared = true) AND
    EXISTS (
      SELECT 1 FROM private_analysis_sessions
      WHERE private_analysis_sessions.id = session_notes.session_id
      AND (private_analysis_sessions.coach_id = auth.uid() OR private_analysis_sessions.student_id = auth.uid())
    )
  );

CREATE POLICY "Users can create own notes" ON session_notes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM private_analysis_sessions
      WHERE private_analysis_sessions.id = session_notes.session_id
      AND (private_analysis_sessions.coach_id = auth.uid() OR private_analysis_sessions.student_id = auth.uid())
    )
  );

CREATE POLICY "Users can update own notes" ON session_notes
  FOR UPDATE USING (auth.uid() = user_id);

-- Analysis Requests policies
CREATE POLICY "Users can view their requests" ON analysis_requests
  FOR SELECT USING (auth.uid() = student_id OR auth.uid() = coach_id);

CREATE POLICY "Students can create requests" ON analysis_requests
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Request participants can update" ON analysis_requests
  FOR UPDATE USING (auth.uid() = student_id OR auth.uid() = coach_id);

-- Session Progress policies
CREATE POLICY "Session participants can view progress" ON session_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM private_analysis_sessions
      WHERE private_analysis_sessions.id = session_progress.session_id
      AND (private_analysis_sessions.coach_id = auth.uid() OR private_analysis_sessions.student_id = auth.uid())
    )
  );

CREATE POLICY "Coaches can record progress" ON session_progress
  FOR INSERT WITH CHECK (
    auth.uid() = recorded_by AND
    EXISTS (
      SELECT 1 FROM private_analysis_sessions
      WHERE private_analysis_sessions.id = session_progress.session_id
      AND private_analysis_sessions.coach_id = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON analysis_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON analysis_notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON analysis_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions for notifications
CREATE OR REPLACE FUNCTION notify_analysis_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify coach of new request
  IF NEW.status = 'pending' AND OLD.status IS NULL THEN
    INSERT INTO analysis_notifications (user_id, notification_type, title, message, related_request_id)
    VALUES (
      NEW.coach_id,
      'new_request',
      'New Analysis Request',
      'You have a new analysis request from a student',
      NEW.id
    );
  END IF;
  
  -- Notify student when request is accepted
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    INSERT INTO analysis_notifications (user_id, notification_type, title, message, related_request_id)
    VALUES (
      NEW.student_id,
      'request_accepted',
      'Request Accepted',
      'Your analysis request has been accepted',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER analysis_request_notification
  AFTER INSERT OR UPDATE ON analysis_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_analysis_request();

-- Function to notify on new comments
CREATE OR REPLACE FUNCTION notify_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_coach_id UUID;
  v_student_id UUID;
  v_other_user_id UUID;
BEGIN
  -- Get session participants
  SELECT coach_id, student_id INTO v_coach_id, v_student_id
  FROM private_analysis_sessions
  WHERE id = NEW.session_id;
  
  -- Determine who to notify
  IF NEW.user_id = v_coach_id THEN
    v_other_user_id := v_student_id;
  ELSE
    v_other_user_id := v_coach_id;
  END IF;
  
  -- Create notification
  INSERT INTO analysis_notifications (user_id, notification_type, title, message, related_session_id)
  VALUES (
    v_other_user_id,
    'new_comment',
    'New Comment',
    'You have a new comment in your analysis session',
    NEW.session_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER session_comment_notification
  AFTER INSERT ON session_comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_comment();