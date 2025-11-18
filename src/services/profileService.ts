import { supabase } from "@/integrations/supabase/client";

export interface ProfileData {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  playing_experience: string | null;
  preferred_play_style: string | null;
  member_since: string | null;
  profile_image: string | null;
  role: 'player' | 'coach' | 'admin' | null;
}

export interface PerformanceMetric {
  id: string;
  month: string;
  rating: number;
  wins: number;
  losses: number;
}

export interface VideoData {
  id: string;
  title: string | null;
  file_name: string;
  file_path: string;
  uploaded_at: string | null;
  analyzed: boolean | null;
  focus_area: string | null;
  user_id?: string; // The player who uploaded the video
  coaches?: Array<{ id: string; display_name: string; status?: string; }>;
  student_name?: string; // For coaches to see which student uploaded the video
  status?: string; // For coach-specific status
}

export class ProfileService {
  static async getCurrentUserProfile(): Promise<ProfileData | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    // Fetch user role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError) {
      console.error('Error fetching user role:', roleError);
    }

    return {
      ...profile,
      role: roleData?.role || null
    };
  }

  static async updateProfile(profileData: Partial<ProfileData>): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Exclude role from profile update since it's stored in user_roles table
    const { role, ...profileUpdateData } = profileData;

    const { error } = await supabase
      .from('profiles')
      .update(profileUpdateData)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }

    return true;
  }

  static async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching performance metrics:', error);
      return [];
    }

    return data || [];
  }

  static async getUserVideos(): Promise<VideoData[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      // First get videos for the current user
      const { data: videos, error: videosError } = await supabase
        .from('video_coaches')
        .select(`*, coach: coach_id (*)`)
        // .select('id, title, file_name, file_path, uploaded_at, analyzed, focus_area')
        .eq('player_id', user.id)
        .order('created_at', { ascending: false });


        console.log("i am getting videos", {videos})
      if (videosError) {
        console.error('Error fetching videos:', videosError);
        return [];
      }

      if (!videos || videos.length === 0) {
          return [];
        }
     
     
        return videos;

      // Get coach assignments for all videos with status
    //   const videoIds = videos.map(video => video.id);
    //   const { data: coachAssignments, error: coachError } = await supabase
    //     .from('video_coaches')
    //     .select(`
    //       video_id,
    //       coach_id,
    //       status,
    //       profiles!fk_video_coaches_coach_id(user_id, display_name)
    //     `)
    //     .in('video_id', videoIds);

    //   if (coachError) {
    //     console.error('Error fetching coach assignments:', coachError);
    //     // Return videos without coach data if coach fetch fails
    //     return videos;
    //   }

      // Group coaches by video_id with status
    //   const coachesByVideo = new Map<string, Array<{ id: string; display_name: string; status?: string; }>>();
    //   coachAssignments?.forEach(assignment => {
    //     if (!coachesByVideo.has(assignment.video_id)) {
    //       coachesByVideo.set(assignment.video_id, []);
    //     }
    //     coachesByVideo.get(assignment.video_id)?.push({
    //       id: assignment.coach_id,
    //       display_name: (assignment.profiles as any)?.display_name || 'Unknown Coach',
    //       status: assignment.status
    //     });
    //   });

      // Combine videos with their coaches
    //   return videos.map(video => ({
    //     ...video,
    //     coaches: coachesByVideo.get(video.id) || []
    //   }));
    } catch (error) {
      console.error('Error fetching user videos:', error);
      return [];
    }
  }

  static async getAssignedVideos(): Promise<VideoData[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      // Get videos assigned to the current coach
      const { data: assignedVideos, error: assignedError } = await supabase
        .from('video_coaches')
        .select(`
          video_id,
          videos(
            id,
            title,
            file_name,
            file_path,
            uploaded_at,
            analyzed,
            focus_area,
            user_id
          )
        `)
        .eq('coach_id', user.id);

      if (assignedError) {
        console.error('Error fetching assigned videos:', assignedError);
        return [];
      }

      if (!assignedVideos || assignedVideos.length === 0) {
        return [];
      }

      // Get video user IDs to fetch student names
      const videoUserIds = assignedVideos.map(assignment => (assignment.videos as any).user_id);
      const { data: studentProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, display_name, username')
        .in('user_id', videoUserIds);

      if (profileError) {
        console.error('Error fetching student profiles:', profileError);
      }

      // Create a map of user_id to student names
      const studentMap = new Map<string, string>();
      studentProfiles?.forEach(profile => {
        studentMap.set(profile.user_id, profile.display_name || profile.username || 'Unknown Student');
      });

      // Transform the data
      return assignedVideos.map(assignment => {
        const video = assignment.videos as any;
        return {
          id: video.id,
          title: video.title,
          file_name: video.file_name,
          file_path: video.file_path,
          uploaded_at: video.uploaded_at,
          analyzed: video.analyzed,
          focus_area: video.focus_area,
          user_id: video.user_id,
          student_name: studentMap.get(video.user_id) || 'Unknown Student'
        };
      });
    } catch (error) {
      console.error('Error fetching assigned videos:', error);
      return [];
    }
  }

  static async getPendingVideos(coachId?: string): Promise<VideoData[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const currentCoachId = coachId || user.id;
      console.log('getPendingVideos called for coach:', currentCoachId);
      
      // Fetch videos assigned to the coach that are still pending
      const { data: pendingVideos, error: pendingError } = await supabase
        .from('video_coaches')
        .select(`*, profiles:player_id (*)`)
        // .select(`
        //   video_id,
        //   status,
        //   videos!inner(
        //     id,
        //     title,
        //     file_name,
        //     file_path,
        //     uploaded_at,
        //     focus_area,
        //     user_id
        //   )
        // `)
        // .eq('coach_id', currentCoachId)
        .eq('status', 'pending');
        console.log({pendingVideos})

      if (pendingError) {
        console.error('Error fetching pending videos for coach:', pendingError);
        return [];
      }

      return pendingVideos;

      console.log('Pending videos result:', pendingVideos);

      if (!pendingVideos || pendingVideos.length === 0) {
        console.log('No pending videos found for coach:', currentCoachId);
        return [];
      }

      // Get video user IDs to fetch student names
      const videoUserIds = pendingVideos.map(assignment => (assignment.videos as any).user_id);
      const { data: studentProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, display_name, username')
        .in('user_id', videoUserIds);

      if (profileError) {
        console.error('Error fetching student profiles:', profileError);
      }

      // Create a map of user_id to student names
      const studentMap = new Map<string, string>();
      studentProfiles?.forEach(profile => {
        studentMap.set(profile.user_id, profile.display_name || profile.username || 'Unknown Student');
      });

      // Transform the data
      const result = pendingVideos.map(assignment => {
        const video = assignment.videos as any;
        return {
          id: video.id,
          title: video.title,
          file_name: video.file_name,
          file_path: video.file_path,
          uploaded_at: video.uploaded_at,
          analyzed: false, // These are pending videos so not analyzed yet
          focus_area: video.focus_area,
          user_id: video.user_id,
          student_name: studentMap.get(video.user_id) || 'Unknown Student',
          status: assignment.status
        };
      });

      console.log('Transformed pending videos result:', result);
      return result;
    } catch (error) {
      console.error('Error fetching pending videos:', error);
      return [];
    }
  }

  static async getAnalyzedVideos(coachId?: string): Promise<VideoData[]> {
    try {
      console.log('getAnalyzedVideos called with coachId:', coachId);
      
      if (coachId) {
        // Fetch videos assigned to the specific coach that have been completed (feedback provided)
        console.log('Fetching completed videos for specific coach:', coachId);
        const { data: assignedVideos, error: assignedError } = await supabase
          .from('video_coaches')
          .select(`*, profiles: player_id (*)`)
            // video_id,
            // status,
            // videos!inner(
            //   id,
            //   title,
            //   file_name,
            //   file_path,
            //   uploaded_at,
            //   focus_area,
            //   user_id
            // )
        //   .eq('coach_id', coachId)
          .eq('status', 'completed'); // Only fetch completed videos

          console.log({assignedVideos})

        if (assignedError) {
          console.error('Error fetching assigned videos for coach:', assignedError);
          return [];
        }

        console.log('Assigned videos result:', assignedVideos);

        if (!assignedVideos || assignedVideos.length === 0) {
          console.log('No completed videos found for coach:', coachId);
          return [];
        }

        return assignedVideos || [];

        // Get video user IDs to fetch student names
        const videoUserIds = assignedVideos.map(assignment => (assignment.videos as any).user_id);
        const { data: studentProfiles, error: profileError } = await supabase
          .from('profiles')
          .select('user_id, display_name, username')
          .in('user_id', videoUserIds);

        if (profileError) {
          console.error('Error fetching student profiles:', profileError);
        }

        // Create a map of user_id to student names
        const studentMap = new Map<string, string>();
        studentProfiles?.forEach(profile => {
          studentMap.set(profile.user_id, profile.display_name || profile.username || 'Unknown Student');
        });

        console.log('Student map:', studentMap);

        // Transform the data
        const result = assignedVideos.map(assignment => {
          const video = assignment.videos as any;
          return {
            id: video.id,
            title: video.title,
            file_name: video.file_name,
            file_path: video.file_path,
            uploaded_at: video.uploaded_at,
            analyzed: true, // These are completed videos so always analyzed
            focus_area: video.focus_area,
            user_id: video.user_id,
            student_name: studentMap.get(video.user_id) || 'Unknown Student',
            status: assignment.status
          };
        });

        console.log('Transformed videos result:', result);
        return result;
      } else {
        // Original behavior: Check user role and fetch based on role
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (roleData?.role === 'coach') {
          // For coaches without specific ID: get all their completed videos
          return this.getAnalyzedVideos(user.id);
        } else {
          // For players: get their own videos with feedback
          const { data: videosWithFeedback, error } = await supabase
            .from('video_feedback')
            .select(`
              video_id,
              videos!inner(
                id,
                title,
                file_name,
                file_path,
                uploaded_at,
                focus_area,
                user_id
              )
            `)
            .eq('videos.user_id', user.id);

          if (error) {
            console.error('Error fetching player videos with feedback:', error);
            return [];
          }

          // Get unique videos (in case multiple coaches provided feedback)
          const uniqueVideos = new Map();
          videosWithFeedback?.forEach(item => {
            const video = item.videos as any;
            if (!uniqueVideos.has(video.id)) {
              uniqueVideos.set(video.id, {
                id: video.id,
                title: video.title,
                file_name: video.file_name,
                file_path: video.file_path,
                uploaded_at: video.uploaded_at,
                analyzed: true,
                focus_area: video.focus_area,
                user_id: video.user_id
              });
            }
          });

          return Array.from(uniqueVideos.values());
        }
      }
    } catch (error) {
      console.error('Error fetching analyzed videos:', error);
      return [];
    }
  }

  static async createPerformanceMetric(metric: Omit<PerformanceMetric, 'id'>): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('performance_metrics')
      .insert({
        ...metric,
        user_id: user.id
      });

    if (error) {
      console.error('Error creating performance metric:', error);
      return false;
    }

    return true;
  }

  static async deleteVideo(videoId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    try {
      // First, get the video to find the file path
      const { data: video, error: fetchError } = await supabase
        .from('videos')
        .select('file_path')
        .eq('id', videoId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching video for deletion:', fetchError);
        return false;
      }

      // Delete the file from storage
      if (video?.file_path) {
        const { error: storageError } = await supabase.storage
          .from('videos')
          .remove([video.file_path]);

        if (storageError) {
          console.error('Error deleting video file from storage:', storageError);
          // Continue with database deletion even if storage deletion fails
        }
      }

      // Delete the database record
      const { error: deleteError } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error deleting video from database:', deleteError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }
}