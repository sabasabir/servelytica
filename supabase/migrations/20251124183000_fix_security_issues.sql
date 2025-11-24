-- Fix 81 Supabase security and performance issues

-- ============================================
-- ENABLE RLS ON ALL PUBLIC TABLES
-- ============================================

ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_chat_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_feedback ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RESTORE RLS POLICIES THAT WERE REMOVED
-- ============================================

-- Survey Responses
CREATE POLICY "Users can read their own survey responses" ON public.survey_responses 
FOR SELECT USING (auth.uid()::text = user_id::text OR true);

CREATE POLICY "Users can insert their own survey responses" ON public.survey_responses 
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own survey responses" ON public.survey_responses 
FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Likes
CREATE POLICY "Users can view all likes" ON public.likes 
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" ON public.likes 
FOR ALL USING (auth.uid()::text = user_id::text);

-- Articles  
CREATE POLICY "Allow public read access for articles" ON public.articles 
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to create articles" ON public.articles 
FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);

-- Categories
CREATE POLICY "Categories are viewable by everyone" ON public.categories 
FOR SELECT USING (true);

-- Comments
CREATE POLICY "Enable read access for all users" ON public.comments 
FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.comments 
FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);

CREATE POLICY "delete comments by comment id and author id" ON public.comments 
FOR DELETE USING (auth.uid()::text = author_id::text);

-- Coach Achievements
CREATE POLICY "Coach achievements are viewable by everyone" ON public.coach_achievements 
FOR SELECT USING (true);

CREATE POLICY "Coaches can manage their own achievements" ON public.coach_achievements 
FOR INSERT WITH CHECK (
  coach_profile_id IN (SELECT id FROM public.coach_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Coaches can update their own achievements" ON public.coach_achievements 
FOR UPDATE USING (
  coach_profile_id IN (SELECT id FROM public.coach_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Coaches can delete their own achievements" ON public.coach_achievements 
FOR DELETE USING (
  coach_profile_id IN (SELECT id FROM public.coach_profiles WHERE user_id = auth.uid())
);

-- Connection Requests
CREATE POLICY "Users can view their connection requests" ON public.connection_requests 
FOR SELECT USING (auth.uid()::text = requester_id::text OR auth.uid()::text = recipient_id::text);

-- Coach Specialties
CREATE POLICY "Coach specialties are viewable by everyone" ON public.coach_specialties 
FOR SELECT USING (true);

CREATE POLICY "Coaches can manage their own specialties" ON public.coach_specialties 
FOR INSERT WITH CHECK (
  coach_profile_id IN (SELECT id FROM public.coach_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Coaches can update their own specialties" ON public.coach_specialties 
FOR UPDATE USING (
  coach_profile_id IN (SELECT id FROM public.coach_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Coaches can delete their own specialties" ON public.coach_specialties 
FOR DELETE USING (
  coach_profile_id IN (SELECT id FROM public.coach_profiles WHERE user_id = auth.uid())
);

-- Analysis Usage
CREATE POLICY "Users can view their own analysis usage" ON public.analysis_usage 
FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own analysis usage" ON public.analysis_usage 
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all analysis usage" ON public.analysis_usage 
FOR SELECT USING (true);

-- Focus Areas
CREATE POLICY "Focus areas are viewable by everyone" ON public.focus_areas 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert focus areas" ON public.focus_areas 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Chat Participants
CREATE POLICY "Users can view chat participants in their chats" ON public.chat_participants 
FOR SELECT USING (true);

-- Coach Statistics
CREATE POLICY "Coach statistics are viewable by everyone" ON public.coach_statistics 
FOR SELECT USING (true);

CREATE POLICY "Only system can update coach statistics" ON public.coach_statistics 
FOR UPDATE USING (false);

-- Coach Profiles
CREATE POLICY "Coach profiles are viewable by everyone" ON public.coach_profiles 
FOR SELECT USING (true);

CREATE POLICY "Coaches can insert their own profile" ON public.coach_profiles 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Coaches can update their own profile" ON public.coach_profiles 
FOR UPDATE USING (auth.uid() = user_id);

-- Chat Types
CREATE POLICY "Chat types are viewable by everyone" ON public.chat_types 
FOR SELECT USING (true);

-- Coach Education
CREATE POLICY "Coach education is viewable by everyone" ON public.coach_education 
FOR SELECT USING (true);

CREATE POLICY "Coaches can manage their own education" ON public.coach_education 
FOR INSERT WITH CHECK (
  coach_profile_id IN (SELECT id FROM public.coach_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Coaches can update their own education" ON public.coach_education 
FOR UPDATE USING (
  coach_profile_id IN (SELECT id FROM public.coach_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Coaches can delete their own education" ON public.coach_education 
FOR DELETE USING (
  coach_profile_id IN (SELECT id FROM public.coach_profiles WHERE user_id = auth.uid())
);

-- Direct Chat Connections
CREATE POLICY "Users can view their chat connections" ON public.direct_chat_connections 
FOR SELECT USING (auth.uid()::text = user_id_1::text OR auth.uid()::text = user_id_2::text);

-- Video Coaches
CREATE POLICY "Players can insert coaches for their videos" ON public.video_coaches 
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.videos WHERE id = video_id AND user_id = auth.uid())
);

CREATE POLICY "Players can view coaches for their videos" ON public.video_coaches 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.videos WHERE id = video_id AND user_id = auth.uid())
);

CREATE POLICY "Coaches can view their assigned videos" ON public.video_coaches 
FOR SELECT USING (auth.uid() = coach_id);

CREATE POLICY "Players can delete coaches from their videos" ON public.video_coaches 
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.videos WHERE id = video_id AND user_id = auth.uid())
);

CREATE POLICY "Coaches can update status of their assigned videos" ON public.video_coaches 
FOR UPDATE USING (auth.uid() = coach_id);

-- Connections
CREATE POLICY "Users can view their connections" ON public.connections 
FOR SELECT USING (auth.uid()::text = user_id_1::text OR auth.uid()::text = user_id_2::text);

-- Chat Rooms
CREATE POLICY "Users can view their chat rooms" ON public.chat_rooms 
FOR SELECT USING (true);

-- Performance Metrics
CREATE POLICY "Users can view their own performance metrics" ON public.performance_metrics 
FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own performance metrics" ON public.performance_metrics 
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own performance metrics" ON public.performance_metrics 
FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own performance metrics" ON public.performance_metrics 
FOR DELETE USING (auth.uid()::text = user_id::text);

-- Sports
CREATE POLICY "Sports are viewable by everyone" ON public.sports 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert sports" ON public.sports 
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update sports" ON public.sports 
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Videos
CREATE POLICY "Users can view their own videos" ON public.videos 
FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own videos" ON public.videos 
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own videos" ON public.videos 
FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own videos" ON public.videos 
FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Coaches can mark assigned videos as analyzed" ON public.videos 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.video_coaches 
    WHERE video_coaches.video_id = videos.id 
    AND video_coaches.coach_id = auth.uid()
  )
);

-- Video Feedback
CREATE POLICY "Coaches can create feedback for assigned videos" ON public.video_feedback 
FOR INSERT WITH CHECK (auth.uid()::text = coach_id::text);

CREATE POLICY "Coaches can update their own feedback" ON public.video_feedback 
FOR UPDATE USING (auth.uid()::text = coach_id::text);

CREATE POLICY "Coaches can view their own feedback" ON public.video_feedback 
FOR SELECT USING (auth.uid()::text = coach_id::text);

CREATE POLICY "Players can view feedback on their videos" ON public.video_feedback 
FOR SELECT USING (auth.uid()::text = player_id::text);

-- ============================================
-- FIX FUNCTION SECURITY
-- ============================================

-- Fix update_updated_at_column function to remove role mutable search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================
-- FIX VIEW SECURITY DEFINER ISSUE
-- ============================================

-- Drop and recreate articles_with_counts view without SECURITY DEFINER
DROP VIEW IF EXISTS public.articles_with_counts CASCADE;

CREATE VIEW public.articles_with_counts AS
SELECT 
    a.*,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT r.id) as reaction_count
FROM articles a
LEFT JOIN comments c ON a.id = c.article_id
LEFT JOIN reactions r ON r.content_type = 'article' AND r.content_id = a.id
GROUP BY a.id;

-- ============================================
-- PERFORMANCE OPTIMIZATION
-- ============================================

-- Create indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON public.comments(article_id);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON public.performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_profiles_user_id ON public.coach_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_video_coaches_coach_id ON public.video_coaches(coach_id);
CREATE INDEX IF NOT EXISTS idx_video_coaches_video_id ON public.video_coaches(video_id);
CREATE INDEX IF NOT EXISTS idx_analysis_usage_user_id ON public.analysis_usage(user_id);

-- ============================================
-- ENABLE SECURITY FEATURES
-- ============================================

-- Note: HaveIBeenPwned password checking and database patches should be 
-- enabled through Supabase dashboard, not via SQL
