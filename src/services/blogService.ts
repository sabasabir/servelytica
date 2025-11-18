import { supabase } from '@/integrations/supabase/client';
import { Article, Tag, Category, Comment, Reaction, Bookmark } from '@/types/Blog';

// Article Management
export const articleService = {
  async getArticles(filters?: {
    status?: string;
    category_id?: string;
    author_id?: string;
    tags?: string[];
    search?: string;
    page?: number;
    limit?: number;
  }) {
    let query = supabase
      .from('articles')
      .select(`
        *,
        author:author_id(user_id, display_name, avatar_url),
        category:category_id(id, name, slug),
        reactions:reactions!reactions_content_id_fkey(count),
        comments(count),
        bookmarks:bookmarks!bookmarks_content_id_fkey(count)
      `)
      .eq('status', filters?.status || 'published')
      .order('published_at', { ascending: false });

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters?.author_id) {
      query = query.eq('author_id', filters.author_id);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
    }

    const limit = filters?.limit || 10;
    const page = filters?.page || 1;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async getArticleById(id: string, incrementView = false) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:author_id(user_id, display_name, avatar_url),
        category:category_id(id, name, slug),
        tags:article_tags(tag:tag_id(id, name, slug))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (incrementView) {
      await supabase
        .from('articles')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);
    }

    return data;
  },

  async createArticle(article: Partial<Article>) {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateArticle(id: string, updates: Partial<Article>) {
    const { data, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteArticle(id: string) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getTrendingArticles(limit = 5) {
    const { data, error } = await supabase
      .from('trending_articles')
      .select('*')
      .limit(limit);

    if (error) throw error;
    return data;
  }
};

// Tags Management
export const tagService = {
  async getTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  async getPopularTags(limit = 10) {
    const { data, error } = await supabase
      .from('popular_tags')
      .select('*')
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async addTagsToArticle(articleId: string, tagIds: string[]) {
    const articleTags = tagIds.map(tagId => ({
      article_id: articleId,
      tag_id: tagId
    }));

    const { error } = await supabase
      .from('article_tags')
      .insert(articleTags);

    if (error) throw error;
  },

  async removeTagFromArticle(articleId: string, tagId: string) {
    const { error } = await supabase
      .from('article_tags')
      .delete()
      .eq('article_id', articleId)
      .eq('tag_id', tagId);

    if (error) throw error;
  }
};

// Comments Management
export const commentService = {
  async getComments(articleId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:author_id(user_id, display_name, avatar_url),
        reactions:reactions!reactions_content_id_fkey(count)
      `)
      .eq('article_id', articleId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch replies for each comment
    const commentsWithReplies = await Promise.all(
      data.map(async (comment) => {
        const { data: replies } = await supabase
          .from('comments')
          .select(`
            *,
            author:author_id(user_id, display_name, avatar_url),
            reactions:reactions!reactions_content_id_fkey(count)
          `)
          .eq('parent_id', comment.id)
          .order('created_at');

        return { ...comment, replies };
      })
    );

    return commentsWithReplies;
  },

  async createComment(comment: Partial<Comment>) {
    const { data, error } = await supabase
      .from('comments')
      .insert([comment])
      .select(`
        *,
        author:author_id(user_id, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async updateComment(id: string, content: string) {
    const { data, error } = await supabase
      .from('comments')
      .update({ content, edited_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteComment(id: string) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Reactions Management
export const reactionService = {
  async toggleReaction(
    userId: string,
    contentType: 'article' | 'comment' | 'forum_post' | 'answer',
    contentId: string,
    reactionType: 'like' | 'love' | 'insightful' | 'helpful'
  ) {
    // Check if reaction exists
    const { data: existing } = await supabase
      .from('reactions')
      .select('*')
      .eq('user_id', userId)
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .single();

    if (existing) {
      if (existing.reaction_type === reactionType) {
        // Remove reaction
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existing.id);
        
        if (error) throw error;
        return null;
      } else {
        // Update reaction type
        const { data, error } = await supabase
          .from('reactions')
          .update({ reaction_type: reactionType })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } else {
      // Create new reaction
      const { data, error } = await supabase
        .from('reactions')
        .insert([{
          user_id: userId,
          content_type: contentType,
          content_id: contentId,
          reaction_type: reactionType
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  async getReactionsCount(contentType: string, contentId: string) {
    const { count, error } = await supabase
      .from('reactions')
      .select('*', { count: 'exact', head: true })
      .eq('content_type', contentType)
      .eq('content_id', contentId);

    if (error) throw error;
    return count || 0;
  }
};

// Bookmarks Management
export const bookmarkService = {
  async toggleBookmark(
    userId: string,
    contentType: 'article' | 'forum_post' | 'question',
    contentId: string
  ) {
    // Check if bookmark exists
    const { data: existing } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .single();

    if (existing) {
      // Remove bookmark
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', existing.id);
      
      if (error) throw error;
      return false;
    } else {
      // Create bookmark
      const { error } = await supabase
        .from('bookmarks')
        .insert([{
          user_id: userId,
          content_type: contentType,
          content_id: contentId
        }]);

      if (error) throw error;
      return true;
    }
  },

  async getUserBookmarks(userId: string, contentType?: string) {
    let query = supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (contentType) {
      query = query.eq('content_type', contentType);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
};

// Categories Management
export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }
};

// Search Service
export const searchService = {
  async searchContent(query: string, filters?: {
    content_type?: string[];
    category_id?: string;
    tags?: string[];
    author_id?: string;
    date_from?: string;
    date_to?: string;
  }) {
    const results: any[] = [];

    // Search articles
    if (!filters?.content_type || filters.content_type.includes('article')) {
      const { data: articles } = await supabase
        .from('articles')
        .select(`
          id, title, excerpt, published_at, 
          author:author_id(display_name, avatar_url),
          category:category_id(name)
        `)
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(10);

      if (articles) {
        results.push(...articles.map(a => ({ ...a, type: 'article' })));
      }
    }

    // Search forum threads
    if (!filters?.content_type || filters.content_type.includes('forum')) {
      const { data: threads } = await supabase
        .from('forum_threads')
        .select(`
          id, title, created_at,
          author:author_id(display_name, avatar_url),
          category:category_id(name)
        `)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(10);

      if (threads) {
        results.push(...threads.map(t => ({ ...t, type: 'forum' })));
      }
    }

    // Search questions
    if (!filters?.content_type || filters.content_type.includes('question')) {
      const { data: questions } = await supabase
        .from('questions')
        .select(`
          id, title, created_at,
          author:author_id(display_name, avatar_url)
        `)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(10);

      if (questions) {
        results.push(...questions.map(q => ({ ...q, type: 'question' })));
      }
    }

    return results;
  }
};