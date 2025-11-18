export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  featured_image?: string;
  image?: string;
  category_id: string;
  category?: Category;
  author_id: string;
  author?: UserProfile;
  tags?: Tag[];
  published_at?: string;
  views: number;
  read_time: number;
  created_at: string;
  updated_at: string;
  likes_count?: number;
  comments_count?: number;
  bookmarks_count?: number;
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  article_id: string;
  author_id: string;
  author?: UserProfile;
  parent_id?: string;
  content: string;
  is_pinned: boolean;
  edited_at?: string;
  created_at: string;
  replies?: Comment[];
  reactions_count?: number;
  user_reaction?: string;
}

export interface Reaction {
  id: string;
  user_id: string;
  content_type: 'article' | 'comment' | 'forum_post' | 'answer';
  content_id: string;
  reaction_type: 'like' | 'love' | 'insightful' | 'helpful';
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  content_type: 'article' | 'forum_post' | 'question';
  content_id: string;
  created_at: string;
}

export interface UserProfile {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  reputation_points?: number;
  reputation_level?: number;
  articles_count?: number;
  comments_count?: number;
  questions_count?: number;
  answers_count?: number;
  followers_count?: number;
  following_count?: number;
  is_following?: boolean;
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent_id?: string;
  display_order: number;
  threads_count?: number;
  posts_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ForumThread {
  id: string;
  category_id: string;
  category?: ForumCategory;
  author_id: string;
  author?: UserProfile;
  title: string;
  content: string;
  status: 'open' | 'closed' | 'pinned' | 'archived';
  is_pinned: boolean;
  views: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  posts_count?: number;
  last_post?: ForumPost;
}

export interface ForumPost {
  id: string;
  thread_id: string;
  author_id: string;
  author?: UserProfile;
  parent_id?: string;
  content: string;
  is_solution: boolean;
  edited_at?: string;
  created_at: string;
  replies?: ForumPost[];
  reactions_count?: number;
  user_reaction?: string;
}

export interface Question {
  id: string;
  author_id: string;
  author?: UserProfile;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  status: 'open' | 'answered' | 'closed';
  views: number;
  has_accepted_answer: boolean;
  created_at: string;
  updated_at: string;
  answers_count?: number;
  votes_count?: number;
}

export interface Answer {
  id: string;
  question_id: string;
  author_id: string;
  author?: UserProfile;
  content: string;
  is_accepted: boolean;
  edited_at?: string;
  created_at: string;
  votes_count?: number;
  user_vote?: number;
}

export interface UserReputation {
  id: string;
  user_id: string;
  points: number;
  level: number;
  articles_count: number;
  comments_count: number;
  questions_count: number;
  answers_count: number;
  accepted_answers_count: number;
  helpful_votes_received: number;
  created_at: string;
  updated_at: string;
}

export interface ReputationEvent {
  id: string;
  user_id: string;
  event_type: string;
  points_change: number;
  description?: string;
  related_content_type?: string;
  related_content_id?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message?: string;
  related_content_type?: string;
  related_content_id?: string;
  is_read: boolean;
  created_at: string;
}