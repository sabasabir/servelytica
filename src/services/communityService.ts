import { supabase } from '@/integrations/supabase/client';
import { 
  ForumCategory, 
  ForumThread, 
  ForumPost, 
  Question, 
  Answer,
  UserFollow,
  UserReputation,
  Notification
} from '@/types/Blog';

// Forum Management
export const forumService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('forum_categories')
      .select(`
        *,
        threads:forum_threads(count),
        posts:forum_posts(count)
      `)
      .order('display_order');

    if (error) throw error;
    return data;
  },

  async getThreads(categoryId?: string, filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    let query = supabase
      .from('forum_threads')
      .select(`
        *,
        category:category_id(name, slug),
        author:author_id(user_id, display_name, avatar_url),
        posts:forum_posts(count),
        last_post:forum_posts(
          id, 
          created_at, 
          author:author_id(display_name)
        )
      `)
      .order('is_pinned', { ascending: false })
      .order('last_activity_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
    }

    const limit = filters?.limit || 20;
    const page = filters?.page || 1;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async getThread(threadId: string, incrementView = false) {
    const { data, error } = await supabase
      .from('forum_threads')
      .select(`
        *,
        category:category_id(id, name, slug),
        author:author_id(user_id, display_name, avatar_url)
      `)
      .eq('id', threadId)
      .single();

    if (error) throw error;

    if (incrementView) {
      await supabase
        .from('forum_threads')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', threadId);
    }

    return data;
  },

  async createThread(thread: Partial<ForumThread>) {
    const { data, error } = await supabase
      .from('forum_threads')
      .insert([thread])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateThread(id: string, updates: Partial<ForumThread>) {
    const { data, error } = await supabase
      .from('forum_threads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPosts(threadId: string) {
    const { data, error } = await supabase
      .from('forum_posts')
      .select(`
        *,
        author:author_id(user_id, display_name, avatar_url),
        reactions:reactions!reactions_content_id_fkey(count)
      `)
      .eq('thread_id', threadId)
      .is('parent_id', null)
      .order('created_at');

    if (error) throw error;

    // Fetch replies for each post
    const postsWithReplies = await Promise.all(
      data.map(async (post) => {
        const { data: replies } = await supabase
          .from('forum_posts')
          .select(`
            *,
            author:author_id(user_id, display_name, avatar_url),
            reactions:reactions!reactions_content_id_fkey(count)
          `)
          .eq('parent_id', post.id)
          .order('created_at');

        return { ...post, replies };
      })
    );

    return postsWithReplies;
  },

  async createPost(post: Partial<ForumPost>) {
    const { data, error } = await supabase
      .from('forum_posts')
      .insert([post])
      .select(`
        *,
        author:author_id(user_id, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async markPostAsSolution(postId: string, threadId: string) {
    // Remove existing solution
    await supabase
      .from('forum_posts')
      .update({ is_solution: false })
      .eq('thread_id', threadId);

    // Mark new solution
    const { data, error } = await supabase
      .from('forum_posts')
      .update({ is_solution: true })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Q&A Management
export const qaService = {
  async getQuestions(filters?: {
    status?: string;
    category?: string;
    tags?: string[];
    search?: string;
    page?: number;
    limit?: number;
  }) {
    let query = supabase
      .from('questions')
      .select(`
        *,
        author:author_id(user_id, display_name, avatar_url),
        answers(count),
        reactions:reactions!reactions_content_id_fkey(count)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
    }

    const limit = filters?.limit || 20;
    const page = filters?.page || 1;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async getQuestion(questionId: string, incrementView = false) {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        author:author_id(user_id, display_name, avatar_url)
      `)
      .eq('id', questionId)
      .single();

    if (error) throw error;

    if (incrementView) {
      await supabase
        .from('questions')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', questionId);
    }

    return data;
  },

  async createQuestion(question: Partial<Question>) {
    const { data, error } = await supabase
      .from('questions')
      .insert([question])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAnswers(questionId: string) {
    const { data, error } = await supabase
      .from('answers')
      .select(`
        *,
        author:author_id(user_id, display_name, avatar_url),
        reactions:reactions!reactions_content_id_fkey(count)
      `)
      .eq('question_id', questionId)
      .order('is_accepted', { ascending: false })
      .order('created_at');

    if (error) throw error;
    return data;
  },

  async createAnswer(answer: Partial<Answer>) {
    const { data, error } = await supabase
      .from('answers')
      .insert([answer])
      .select(`
        *,
        author:author_id(user_id, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async acceptAnswer(answerId: string, questionId: string) {
    // Remove existing accepted answer
    await supabase
      .from('answers')
      .update({ is_accepted: false })
      .eq('question_id', questionId);

    // Mark new accepted answer
    const { data, error } = await supabase
      .from('answers')
      .update({ is_accepted: true })
      .eq('id', answerId)
      .select()
      .single();

    if (error) throw error;

    // Update question status
    await supabase
      .from('questions')
      .update({ 
        has_accepted_answer: true,
        status: 'answered'
      })
      .eq('id', questionId);

    return data;
  }
};

// User Follow System
export const followService = {
  async followUser(followerId: string, followingId: string) {
    const { data, error } = await supabase
      .from('user_follows')
      .insert([{
        follower_id: followerId,
        following_id: followingId
      }])
      .select()
      .single();

    if (error) throw error;

    // Create notification
    await notificationService.createNotification({
      user_id: followingId,
      type: 'new_follower',
      title: 'New Follower',
      message: 'Someone started following you',
      related_content_type: 'user',
      related_content_id: followerId
    });

    return data;
  },

  async unfollowUser(followerId: string, followingId: string) {
    const { error } = await supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw error;
  },

  async isFollowing(followerId: string, followingId: string) {
    const { data, error } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    return !!data;
  },

  async getFollowers(userId: string) {
    const { data, error } = await supabase
      .from('user_follows')
      .select(`
        *,
        follower:follower_id(user_id, display_name, avatar_url)
      `)
      .eq('following_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getFollowing(userId: string) {
    const { data, error } = await supabase
      .from('user_follows')
      .select(`
        *,
        following:following_id(user_id, display_name, avatar_url)
      `)
      .eq('follower_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// User Reputation System
export const reputationService = {
  async getUserReputation(userId: string) {
    const { data, error } = await supabase
      .from('user_reputation')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Not found is ok
    
    // Return default reputation if not found
    if (!data) {
      return {
        user_id: userId,
        points: 0,
        level: 1,
        articles_count: 0,
        comments_count: 0,
        questions_count: 0,
        answers_count: 0,
        accepted_answers_count: 0,
        helpful_votes_received: 0
      };
    }

    return data;
  },

  async awardPoints(
    userId: string,
    eventType: string,
    points: number,
    description?: string,
    contentType?: string,
    contentId?: string
  ) {
    // Call the database function to update reputation
    const { error } = await supabase.rpc('update_user_reputation', {
      p_user_id: userId,
      p_event_type: eventType,
      p_points: points,
      p_description: description,
      p_content_type: contentType,
      p_content_id: contentId
    });

    if (error) throw error;
  },

  async getReputationHistory(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from('reputation_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getLeaderboard(limit = 10) {
    const { data, error } = await supabase
      .from('user_reputation')
      .select(`
        *,
        user:user_id(display_name, avatar_url)
      `)
      .order('points', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
};

// Notifications System
export const notificationService = {
  async getNotifications(userId: string, unreadOnly = false) {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },

  async createNotification(notification: Partial<Notification>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUnreadCount(userId: string) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  }
};

// User Profile Service
export const userProfileService = {
  async getUserStats(userId: string) {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserContent(userId: string, contentType: 'articles' | 'questions' | 'answers' | 'comments') {
    let query;

    switch (contentType) {
      case 'articles':
        query = supabase
          .from('articles')
          .select(`
            id, title, excerpt, published_at, views,
            category:category_id(name),
            reactions:reactions!reactions_content_id_fkey(count),
            comments(count)
          `)
          .eq('author_id', userId)
          .eq('status', 'published')
          .order('published_at', { ascending: false });
        break;

      case 'questions':
        query = supabase
          .from('questions')
          .select(`
            id, title, created_at, views, status,
            answers(count)
          `)
          .eq('author_id', userId)
          .order('created_at', { ascending: false });
        break;

      case 'answers':
        query = supabase
          .from('answers')
          .select(`
            id, content, created_at, is_accepted,
            question:question_id(title),
            reactions:reactions!reactions_content_id_fkey(count)
          `)
          .eq('author_id', userId)
          .order('created_at', { ascending: false });
        break;

      case 'comments':
        query = supabase
          .from('comments')
          .select(`
            id, content, created_at,
            article:article_id(title),
            reactions:reactions!reactions_content_id_fkey(count)
          `)
          .eq('author_id', userId)
          .order('created_at', { ascending: false });
        break;

      default:
        return [];
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
};