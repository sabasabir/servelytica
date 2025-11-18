-- Enhanced Blog and Community Content System Schema

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Article tags relationship
CREATE TABLE IF NOT EXISTS article_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(article_id, tag_id)
);

-- Update articles table for enhanced features
ALTER TABLE articles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));
ALTER TABLE articles ADD COLUMN IF NOT EXISTS seo_title VARCHAR(100);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS seo_description VARCHAR(160);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_image VARCHAR(500);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Likes/reactions table (for articles and comments)
CREATE TABLE IF NOT EXISTS reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('article', 'comment', 'forum_post', 'answer')),
    content_id UUID NOT NULL,
    reaction_type VARCHAR(20) DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'insightful', 'helpful')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_type, content_id)
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('article', 'forum_post', 'question')),
    content_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_type, content_id)
);

-- User follows table
CREATE TABLE IF NOT EXISTS user_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL,
    following_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK(follower_id != following_id)
);

-- Forum categories
CREATE TABLE IF NOT EXISTS forum_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    parent_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum threads/discussions
CREATE TABLE IF NOT EXISTS forum_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
    author_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'pinned', 'archived')),
    is_pinned BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum posts/replies
CREATE TABLE IF NOT EXISTS forum_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
    author_id UUID NOT NULL,
    parent_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Q&A Questions
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    tags TEXT[],
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'answered', 'closed')),
    views INTEGER DEFAULT 0,
    has_accepted_answer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Q&A Answers
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL,
    content TEXT NOT NULL,
    is_accepted BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User reputation/points system
CREATE TABLE IF NOT EXISTS user_reputation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    articles_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    questions_count INTEGER DEFAULT 0,
    answers_count INTEGER DEFAULT 0,
    accepted_answers_count INTEGER DEFAULT 0,
    helpful_votes_received INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reputation events log
CREATE TABLE IF NOT EXISTS reputation_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    points_change INTEGER NOT NULL,
    description TEXT,
    related_content_type VARCHAR(20),
    related_content_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    related_content_type VARCHAR(20),
    related_content_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update comments table for nested replies
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_article_tags_article ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_tag ON article_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_reactions_content ON reactions(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_category ON forum_threads(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_author ON forum_threads(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_thread ON forum_posts(thread_id);
CREATE INDEX IF NOT EXISTS idx_questions_author ON questions(author_id);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- Create views for easier data retrieval
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    p.user_id,
    p.display_name,
    p.avatar_url,
    COALESCE(ur.points, 0) as reputation_points,
    COALESCE(ur.level, 1) as reputation_level,
    COUNT(DISTINCT a.id) as articles_count,
    COUNT(DISTINCT c.id) as comments_count,
    COUNT(DISTINCT q.id) as questions_count,
    COUNT(DISTINCT ans.id) as answers_count,
    COUNT(DISTINCT f1.following_id) as following_count,
    COUNT(DISTINCT f2.follower_id) as followers_count
FROM profiles p
LEFT JOIN user_reputation ur ON p.user_id = ur.user_id
LEFT JOIN articles a ON p.user_id = a.author_id AND a.status = 'published'
LEFT JOIN comments c ON p.user_id = c.author_id
LEFT JOIN questions q ON p.user_id = q.author_id
LEFT JOIN answers ans ON p.user_id = ans.author_id
LEFT JOIN user_follows f1 ON p.user_id = f1.follower_id
LEFT JOIN user_follows f2 ON p.user_id = f2.following_id
GROUP BY p.user_id, p.display_name, p.avatar_url, ur.points, ur.level;

-- Create view for trending articles
CREATE OR REPLACE VIEW trending_articles AS
SELECT 
    a.*,
    COUNT(DISTINCT r.id) as reaction_count,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT b.id) as bookmark_count
FROM articles a
LEFT JOIN reactions r ON r.content_type = 'article' AND r.content_id = a.id
LEFT JOIN comments c ON c.article_id = a.id
LEFT JOIN bookmarks b ON b.content_type = 'article' AND b.content_id = a.id
WHERE a.status = 'published' 
    AND a.published_at > NOW() - INTERVAL '30 days'
GROUP BY a.id
ORDER BY (COUNT(DISTINCT r.id) * 3 + COUNT(DISTINCT c.id) * 2 + a.views) DESC;

-- Create view for popular tags
CREATE OR REPLACE VIEW popular_tags AS
SELECT 
    t.id,
    t.name,
    t.slug,
    COUNT(DISTINCT at.article_id) as article_count
FROM tags t
LEFT JOIN article_tags at ON t.id = at.tag_id
LEFT JOIN articles a ON at.article_id = a.id AND a.status = 'published'
GROUP BY t.id, t.name, t.slug
ORDER BY article_count DESC;

-- Functions for reputation management
CREATE OR REPLACE FUNCTION update_user_reputation(
    p_user_id UUID,
    p_event_type VARCHAR(50),
    p_points INTEGER,
    p_description TEXT DEFAULT NULL,
    p_content_type VARCHAR(20) DEFAULT NULL,
    p_content_id UUID DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    -- Insert or update user reputation
    INSERT INTO user_reputation (user_id, points)
    VALUES (p_user_id, p_points)
    ON CONFLICT (user_id)
    DO UPDATE SET 
        points = user_reputation.points + p_points,
        updated_at = NOW();
    
    -- Log the event
    INSERT INTO reputation_events (
        user_id, event_type, points_change, description, 
        related_content_type, related_content_id
    ) VALUES (
        p_user_id, p_event_type, p_points, p_description,
        p_content_type, p_content_id
    );
    
    -- Update level based on points
    UPDATE user_reputation 
    SET level = CASE 
        WHEN points >= 10000 THEN 5
        WHEN points >= 5000 THEN 4
        WHEN points >= 1000 THEN 3
        WHEN points >= 100 THEN 2
        ELSE 1
    END
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_forum_categories_updated_at BEFORE UPDATE ON forum_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_forum_threads_updated_at BEFORE UPDATE ON forum_threads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_user_reputation_updated_at BEFORE UPDATE ON user_reputation
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update forum thread last_activity_at
CREATE OR REPLACE FUNCTION update_thread_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE forum_threads 
    SET last_activity_at = NOW()
    WHERE id = NEW.thread_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_thread_activity_on_post
    AFTER INSERT ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_thread_activity();

-- Row Level Security (RLS) policies
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for reactions
CREATE POLICY "Users can view all reactions" ON reactions
    FOR SELECT USING (true);
    
CREATE POLICY "Users can manage their own reactions" ON reactions
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" ON bookmarks
    FOR SELECT USING (auth.uid()::text = user_id::text);
    
CREATE POLICY "Users can manage their own bookmarks" ON bookmarks
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Policies for follows
CREATE POLICY "Users can view all follows" ON user_follows
    FOR SELECT USING (true);
    
CREATE POLICY "Users can manage their own follows" ON user_follows
    FOR ALL USING (auth.uid()::text = follower_id::text);

-- Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);
    
CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);
    
CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Insert default forum categories
INSERT INTO forum_categories (name, slug, description, icon, display_order) VALUES
    ('General Discussion', 'general', 'General tennis and sports discussions', 'MessageCircle', 1),
    ('Technique & Training', 'technique', 'Discuss techniques, training methods, and drills', 'Target', 2),
    ('Equipment Reviews', 'equipment', 'Reviews and discussions about rackets, shoes, and gear', 'Package', 3),
    ('Tournament Talk', 'tournaments', 'Discuss professional and amateur tournaments', 'Trophy', 4),
    ('Coaching Corner', 'coaching', 'Tips and advice from coaches', 'Users', 5),
    ('Video Analysis', 'analysis', 'Share and discuss video analyses', 'Video', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO tags (name, slug, description) VALUES
    ('Beginner', 'beginner', 'Content suitable for beginners'),
    ('Intermediate', 'intermediate', 'Content for intermediate players'),
    ('Advanced', 'advanced', 'Content for advanced players'),
    ('Technique', 'technique', 'Technical skills and form'),
    ('Strategy', 'strategy', 'Game strategy and tactics'),
    ('Fitness', 'fitness', 'Physical fitness and conditioning'),
    ('Mental', 'mental', 'Mental aspects of the game'),
    ('Equipment', 'equipment', 'Equipment related content'),
    ('Tournament', 'tournament', 'Tournament related content'),
    ('Training', 'training', 'Training methods and drills')
ON CONFLICT (slug) DO NOTHING;