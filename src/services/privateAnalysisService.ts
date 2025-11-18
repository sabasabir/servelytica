import { supabase } from '@/integrations/supabase/client';

export interface CoachStudentRelationship {
  id: string;
  coach_id: string;
  student_id: string;
  status: 'pending' | 'active' | 'inactive' | 'rejected';
  created_at: string;
  updated_at: string;
  accepted_at?: string;
  notes?: string;
  coach?: any;
  student?: any;
}

export interface PrivateAnalysisSession {
  id: string;
  coach_id: string;
  student_id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  session_type: 'video_analysis' | 'technique_review' | 'match_review' | 'training_plan';
  scheduled_for?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  coach?: any;
  student?: any;
}

export interface SessionVideo {
  id: string;
  session_id: string;
  video_id?: string;
  video_url?: string;
  video_file_path?: string;
  title?: string;
  description?: string;
  uploaded_by: string;
  duration_seconds?: number;
  thumbnail_url?: string;
  created_at: string;
}

export interface SessionComment {
  id: string;
  session_id: string;
  user_id: string;
  parent_comment_id?: string;
  comment_text: string;
  video_timestamp_seconds?: number;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  edited: boolean;
  user?: any;
}

export interface SessionAnnotation {
  id: string;
  session_id: string;
  video_id?: string;
  user_id: string;
  annotation_type: 'line' | 'arrow' | 'circle' | 'rectangle' | 'text' | 'angle' | 'freehand';
  coordinates: any;
  color: string;
  label?: string;
  video_timestamp_seconds?: number;
  frame_number?: number;
  created_at: string;
}

export interface SessionNote {
  id: string;
  session_id: string;
  user_id: string;
  note_type: 'general' | 'technique' | 'tactical' | 'physical' | 'mental' | 'goals';
  note_text: string;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnalysisRequest {
  id: string;
  student_id: string;
  coach_id: string;
  video_id?: string;
  request_type: 'general' | 'serve' | 'stroke' | 'footwork' | 'match_analysis' | 'technique';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  request_message?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined';
  session_id?: string;
  created_at: string;
  responded_at?: string;
  completed_at?: string;
  student?: any;
  coach?: any;
  video?: any;
}

export interface AnalysisNotification {
  id: string;
  user_id: string;
  notification_type: 'new_request' | 'request_accepted' | 'new_feedback' | 'session_update' | 'new_comment' | 'new_annotation';
  title: string;
  message: string;
  related_session_id?: string;
  related_request_id?: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export class PrivateAnalysisService {
  // Coach-Student Relationships
  static async getCoachStudentRelationships(userId: string, role: 'coach' | 'player'): Promise<CoachStudentRelationship[]> {
    try {
      const column = role === 'coach' ? 'coach_id' : 'student_id';
      const { data, error } = await supabase
        .from('coach_student_relationships')
        .select(`
          *,
          coach:coach_id(user_id, username, display_name, avatar_url),
          student:student_id(user_id, username, display_name, avatar_url)
        `)
        .eq(column, userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching relationships:', error);
      return [];
    }
  }

  static async createRelationship(coachId: string, studentId: string, notes?: string): Promise<CoachStudentRelationship | null> {
    try {
      const { data, error } = await supabase
        .from('coach_student_relationships')
        .insert({
          coach_id: coachId,
          student_id: studentId,
          status: 'pending',
          notes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating relationship:', error);
      return null;
    }
  }

  static async updateRelationshipStatus(relationshipId: string, status: string): Promise<boolean> {
    try {
      const updates: any = { status, updated_at: new Date().toISOString() };
      if (status === 'active') {
        updates.accepted_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('coach_student_relationships')
        .update(updates)
        .eq('id', relationshipId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating relationship status:', error);
      return false;
    }
  }

  // Private Analysis Sessions
  static async getUserSessions(userId: string, role: 'coach' | 'player'): Promise<PrivateAnalysisSession[]> {
    try {
      const column = role === 'coach' ? 'coach_id' : 'student_id';
      const { data, error } = await supabase
        .from('private_analysis_sessions')
        .select(`
          *,
          coach:coach_id(user_id, username, display_name, avatar_url),
          student:student_id(user_id, username, display_name, avatar_url)
        `)
        .eq(column, userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  }

  static async createSession(
    coachId: string,
    studentId: string,
    title: string,
    description?: string,
    sessionType: string = 'video_analysis'
  ): Promise<PrivateAnalysisSession | null> {
    try {
      const { data, error } = await supabase
        .from('private_analysis_sessions')
        .insert({
          coach_id: coachId,
          student_id: studentId,
          title,
          description,
          session_type: sessionType,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  }

  static async getSessionById(sessionId: string): Promise<PrivateAnalysisSession | null> {
    try {
      const { data, error } = await supabase
        .from('private_analysis_sessions')
        .select(`
          *,
          coach:coach_id(user_id, username, display_name, avatar_url),
          student:student_id(user_id, username, display_name, avatar_url)
        `)
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    }
  }

  static async updateSessionStatus(sessionId: string, status: string): Promise<boolean> {
    try {
      const updates: any = { status, updated_at: new Date().toISOString() };
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('private_analysis_sessions')
        .update(updates)
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating session status:', error);
      return false;
    }
  }

  // Session Videos
  static async getSessionVideos(sessionId: string): Promise<SessionVideo[]> {
    try {
      const { data, error } = await supabase
        .from('session_videos')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching session videos:', error);
      return [];
    }
  }

  static async addVideoToSession(sessionId: string, videoData: Partial<SessionVideo>): Promise<SessionVideo | null> {
    try {
      const { data, error } = await supabase
        .from('session_videos')
        .insert({
          session_id: sessionId,
          ...videoData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding video to session:', error);
      return null;
    }
  }

  // Session Comments
  static async getSessionComments(sessionId: string): Promise<SessionComment[]> {
    try {
      const { data, error } = await supabase
        .from('session_comments')
        .select(`
          *,
          user:user_id(user_id, username, display_name, avatar_url)
        `)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  static async addComment(
    sessionId: string,
    userId: string,
    commentText: string,
    videoTimestamp?: number,
    parentCommentId?: string
  ): Promise<SessionComment | null> {
    try {
      const { data, error } = await supabase
        .from('session_comments')
        .insert({
          session_id: sessionId,
          user_id: userId,
          comment_text: commentText,
          video_timestamp_seconds: videoTimestamp,
          parent_comment_id: parentCommentId
        })
        .select(`
          *,
          user:user_id(user_id, username, display_name, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  }

  // Session Annotations
  static async getSessionAnnotations(sessionId: string): Promise<SessionAnnotation[]> {
    try {
      const { data, error } = await supabase
        .from('session_annotations')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching annotations:', error);
      return [];
    }
  }

  static async addAnnotation(annotationData: Partial<SessionAnnotation>): Promise<SessionAnnotation | null> {
    try {
      const { data, error } = await supabase
        .from('session_annotations')
        .insert(annotationData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding annotation:', error);
      return null;
    }
  }

  // Session Notes
  static async getSessionNotes(sessionId: string, userId: string): Promise<SessionNote[]> {
    try {
      const { data, error } = await supabase
        .from('session_notes')
        .select('*')
        .eq('session_id', sessionId)
        .or(`user_id.eq.${userId},is_shared.eq.true`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  }

  static async addNote(
    sessionId: string,
    userId: string,
    noteText: string,
    noteType: string = 'general',
    isShared: boolean = false
  ): Promise<SessionNote | null> {
    try {
      const { data, error } = await supabase
        .from('session_notes')
        .insert({
          session_id: sessionId,
          user_id: userId,
          note_text: noteText,
          note_type: noteType,
          is_shared: isShared
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding note:', error);
      return null;
    }
  }

  // Analysis Requests
  static async getUserRequests(userId: string, role: 'coach' | 'player'): Promise<AnalysisRequest[]> {
    try {
      const column = role === 'coach' ? 'coach_id' : 'student_id';
      const { data, error } = await supabase
        .from('analysis_requests')
        .select(`
          *,
          student:student_id(user_id, username, display_name, avatar_url),
          coach:coach_id(user_id, username, display_name, avatar_url),
          video:video_id(id, title, file_path, uploaded_at)
        `)
        .eq(column, userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching requests:', error);
      return [];
    }
  }

  static async createRequest(
    studentId: string,
    coachId: string,
    requestType: string,
    requestMessage?: string,
    videoId?: string,
    priority: string = 'normal'
  ): Promise<AnalysisRequest | null> {
    try {
      const { data, error } = await supabase
        .from('analysis_requests')
        .insert({
          student_id: studentId,
          coach_id: coachId,
          request_type: requestType,
          request_message: requestMessage,
          video_id: videoId,
          priority,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating request:', error);
      return null;
    }
  }

  static async updateRequestStatus(requestId: string, status: string, sessionId?: string): Promise<boolean> {
    try {
      const updates: any = { status };
      
      if (status === 'accepted') {
        updates.responded_at = new Date().toISOString();
      } else if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }
      
      if (sessionId) {
        updates.session_id = sessionId;
      }

      const { error } = await supabase
        .from('analysis_requests')
        .update(updates)
        .eq('id', requestId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating request status:', error);
      return false;
    }
  }

  // Notifications
  static async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<AnalysisNotification[]> {
    try {
      let query = supabase
        .from('analysis_notifications')
        .select('*')
        .eq('user_id', userId);

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('analysis_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  static async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('analysis_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  // Session Progress
  static async getSessionProgress(sessionId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('session_progress')
        .select('*')
        .eq('session_id', sessionId)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching progress:', error);
      return [];
    }
  }

  static async recordProgress(
    sessionId: string,
    studentId: string,
    recordedBy: string,
    metricType: string,
    metricValue: number,
    notes?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('session_progress')
        .insert({
          session_id: sessionId,
          student_id: studentId,
          recorded_by: recordedBy,
          metric_type: metricType,
          metric_value: metricValue,
          notes
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error recording progress:', error);
      return false;
    }
  }
}