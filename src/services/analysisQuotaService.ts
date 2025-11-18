import { supabase } from "@/integrations/supabase/client";

export interface AnalysisQuota {
  canCreate: boolean;
  analysesUsed: number;
  analysesLimit: number;
  nextResetDate: Date | null;
}

export interface AnalysisUsage {
  id: string;
  user_id: string;
  video_id: string;
  analysis_date: string;
  reset_date: string;
  subscription_plan_id: string;
  created_at: string;
}

export class AnalysisQuotaService {
  static async checkUserQuota(userId: string): Promise<AnalysisQuota> {
    try {
      console.log('Calling can_create_analysis RPC for user:', userId);
      const { data, error } = await supabase.rpc('can_create_analysis', {
        user_id_param: userId
      });

      if (error) {
        console.error('Error checking analysis quota:', error);
        return {
          canCreate: false,
          analysesUsed: 0,
          analysesLimit: 0,
          nextResetDate: null
        };
      }

      console.log('RPC response:', data);
      
      // The RPC returns a single record in a specific format
      if (!data) {
        console.log('No data returned from RPC');
        return {
          canCreate: false,
          analysesUsed: 0,
          analysesLimit: 0,
          nextResetDate: null
        };
      }

      // Parse the response - the function returns a tuple-like result
      let result: any;
      if (typeof data === 'string') {
        // If it's a string like "(t,0,1,"2025-08-29 10:06:53.117943+00")"
        const stringData = data as string;
        const match = stringData.match(/\(([^,]+),(\d+),(\d+),"([^"]+)"\)/);
        if (match) {
          result = {
            can_create: match[1] === 't',
            analyses_used: parseInt(match[2]),
            analyses_limit: parseInt(match[3]),
            next_reset_date: match[4]
          };
        }
      } else if (Array.isArray(data) && data.length > 0) {
        result = data[0];
      } else {
        result = data;
      }

      if (!result) {
        console.log('Could not parse RPC result');
        return {
          canCreate: false,
          analysesUsed: 0,
          analysesLimit: 0,
          nextResetDate: null
        };
      }

      console.log('Parsed result:', result);

      return {
        canCreate: result.can_create || false,
        analysesUsed: result.analyses_used || 0,
        analysesLimit: result.analyses_limit || 0,
        nextResetDate: result.next_reset_date ? new Date(result.next_reset_date) : null
      };
    } catch (error) {
      console.error('Error in checkUserQuota:', error);
      return {
        canCreate: false,
        analysesUsed: 0,
        analysesLimit: 0,
        nextResetDate: null
      };
    }
  }

  static async recordAnalysisUsage(userId: string, videoId: string): Promise<boolean> {
    try {
      console.log('Recording analysis usage for user:', userId, 'video:', videoId);
      
      // Get user's current subscription
      const { data: subscription, error: subError } = await supabase
        .from('users_subscription')
        .select('pricing_plan_id, start_date')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subError) {
        console.error('Error getting user subscription:', subError);
        return false;
      }

      if (!subscription) {
        console.error('No active subscription found for user:', userId);
        return false;
      }

      console.log('Found subscription:', subscription);

      // Calculate reset date (30 days from now)
      const resetDate = new Date();
      resetDate.setDate(resetDate.getDate() + 30);

      console.log('Inserting analysis usage record with reset date:', resetDate.toISOString());

      // Record the analysis usage
      const { data, error } = await supabase
        .from('analysis_usage')
        .insert({
          user_id: userId,
          video_id: videoId,
          reset_date: resetDate.toISOString(),
          subscription_plan_id: subscription.pricing_plan_id
        })
        .select();

      if (error) {
        console.error('Error recording analysis usage:', error);
        return false;
      }

      console.log('Successfully recorded analysis usage:', data);
      return true;
    } catch (error) {
      console.error('Error in recordAnalysisUsage:', error);
      return false;
    }
  }

  static async getUserAnalysisHistory(userId: string): Promise<AnalysisUsage[]> {
    try {
      const { data, error } = await supabase
        .from('analysis_usage')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting analysis history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserAnalysisHistory:', error);
      return [];
    }
  }

  static formatResetDate(resetDate: Date | null): string {
    if (!resetDate) return 'N/A';
    
    const now = new Date();
    const diffInDays = Math.ceil((resetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 0) {
      return 'Available now';
    } else if (diffInDays === 1) {
      return 'Tomorrow';
    } else {
      return `${diffInDays} days`;
    }
  }
}