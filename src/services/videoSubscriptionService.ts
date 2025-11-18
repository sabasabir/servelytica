import { supabase } from "@/integrations/supabase/client";

export interface VideoQuota {
  canUpload: boolean;
  videosUploaded: number;
  videosLimit: number;
  nextAvailableDate: Date | null;
  daysRemaining: number;
}

export class VideoSubscriptionService {
  static async checkVideoUploadQuota(userId: string): Promise<VideoQuota> {
    try {
      console.log('Checking video upload quota for user:', userId);
      
      // Get user's current active subscription
      const { data: subscription, error: subError } = await supabase
        .from('users_subscription')
        .select(`
          id,
          pricing_plan_id,
          start_date,
          usages_count,
          pricing!inner(analysis_limit)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        console.log({subscription})

      if (subError) {
        console.error('Error getting user subscription:', subError);
        return {
          canUpload: false,
          videosUploaded: 0,
          videosLimit: 0,
          nextAvailableDate: null,
          daysRemaining: 0
        };
      }

      if (!subscription) {
        console.error('No active subscription found for user:', userId);
        return {
          canUpload: false,
          videosUploaded: 0,
          videosLimit: 0,
          nextAvailableDate: null,
          daysRemaining: 0
        };
      }

      const videosLimit = (subscription.pricing as any).analysis_limit || 0;
      console.log('User subscription found with videos limit:', videosLimit);

      // If limit is 0 or unlimited (-1), allow uploads
      if (videosLimit <= 0) {
        return {
          canUpload: true,
          videosUploaded: 0,
          videosLimit: videosLimit,
          users_sub_id: subscription?.id,
          usages_count: subscription?.usages_count,
          nextAvailableDate: null,
          daysRemaining: 0
        };
      }

      // Get user's uploaded videos in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentVideos, error: videosError } = await supabase
        .from('videos')
        .select('id, uploaded_at')
        .eq('user_id', userId)
        .gte('uploaded_at', thirtyDaysAgo.toISOString())
        .order('uploaded_at', { ascending: false });

      if (videosError) {
        console.error('Error fetching recent videos:', videosError);
        return {
          canUpload: false,
          videosUploaded: 0,
          videosLimit: videosLimit,
          users_sub_id: subscription?.id,
          usages_count: subscription?.usages_count,
          nextAvailableDate: null,
          daysRemaining: 0
        };
      }

      const videosUploaded = recentVideos?.length || 0;
      console.log('Videos uploaded in last 30 days:', videosUploaded);

      // Check if user can upload more videos
      const canUpload = videosUploaded < videosLimit;

      // If user has reached limit, find when they can upload next
      let nextAvailableDate: Date | null = null;
      let daysRemaining = 0;

      if (!canUpload && recentVideos && recentVideos.length > 0) {
        // Find the oldest video that's still within the 30-day window
        const oldestVideo = recentVideos[recentVideos.length - 1];
        nextAvailableDate = new Date(oldestVideo.uploaded_at);
        nextAvailableDate.setDate(nextAvailableDate.getDate() + 30);
        
        const now = new Date();
        daysRemaining = Math.ceil((nextAvailableDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysRemaining <= 0) {
          // The 30-day period has passed, user can upload again
          return {
            canUpload: true,
            videosUploaded: videosUploaded,
            videosLimit: videosLimit,
            users_sub_id: subscription?.id,
            usages_count: subscription?.usages_count,
            nextAvailableDate: null,
            daysRemaining: 0
        };
    }
}

return {
    canUpload,
    videosUploaded,
    videosLimit,
    users_sub_id: subscription?.id,
    usages_count: subscription?.usages_count,
        nextAvailableDate,
        daysRemaining
      };
    } catch (error) {
      console.error('Error in checkVideoUploadQuota:', error);
      return {
        canUpload: false,
        videosUploaded: 0,
        videosLimit: 0,
        nextAvailableDate: null,
        daysRemaining: 0
      };
    }
  }

  static formatNextAvailableDate(nextAvailableDate: Date | null): string {
    if (!nextAvailableDate) return 'Available now';
    
    const now = new Date();
    const diffInDays = Math.ceil((nextAvailableDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 0) {
      return 'Available now';
    } else if (diffInDays === 1) {
      return 'Tomorrow';
    } else {
      return `${diffInDays} days`;
    }
  }
}