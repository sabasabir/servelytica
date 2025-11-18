import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Zap, TrendingUp } from "lucide-react";
import { AnalysisQuotaService, type AnalysisQuota } from "@/services/analysisQuotaService";
import { supabase } from "@/integrations/supabase/client";

interface UserSubscription {
  pricing_plan_id: string;
  status: string;
  start_date: string;
  end_date: string | null;
  pricing: {
    name: string;
    analysis_limit: number;
  };
}

export const AnalysisQuotaCard = () => {
  const [quota, setQuota] = useState<AnalysisQuota | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotaInfo = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
        //   console.log('Fetching quota for user:', userData.user.id, userData.user.email);
          
          // Fetch current subscription
          const { data: subData, error } = await supabase
            .from('users_subscription')
            .select(`
              pricing_plan_id,
              status,
              usages_count,
              start_date,
              end_date,
              pricing!inner(name, analysis_limit)
            `)
            .eq('user_id', userData.user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        //   console.log('Subscription data:', subData, 'Error:', error);

          if (!error && subData) {
            setSubscription(subData as UserSubscription);
            
            // Count videos uploaded this month
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            
            // console.log('Date range for video counting:', {
            //   startOfMonth: startOfMonth.toISOString(),
            //   endOfMonth: endOfMonth.toISOString(),
            //   userId: userData.user.id
            // });
            
            const { data: videosData, error: videosError } = await supabase
              .from('videos')
              .select('id, uploaded_at')
              .eq('user_id', userData.user.id)
              .gte('uploaded_at', startOfMonth.toISOString())
              .lte('uploaded_at', endOfMonth.toISOString());
            
            // console.log('Videos query result:', videosData, 'Error:', videosError);
            
            if (!videosError) {
              const videosUploaded = videosData?.length || 0;
              const analysisLimit = subData.pricing.analysis_limit;
              
            //   console.log('Video count calculation:', {
            //     videosUploaded,
            //     analysisLimit,
            //     canCreate: videosUploaded < analysisLimit
            //   });
              
              setQuota({
                canCreate: videosUploaded < analysisLimit,
                analysesUsed: videosUploaded,
                usages_count: subData?.usages_count,
                analysesLimit: analysisLimit,
                nextResetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1)
              });
            } else {
              console.error('Error fetching videos:', videosError);
            }
          } else {
            console.error('No active subscription found for user:', userData.user.id);
            // Try to get any subscription to show something
            const { data: anySubData } = await supabase
              .from('users_subscription')
              .select(`
                pricing_plan_id,
                status,
                usages_count,
                start_date,
                end_date,
                pricing!inner(name, analysis_limit)
              `)
              .eq('user_id', userData.user.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            // console.log('Any subscription found:', anySubData);
            
            if (anySubData) {
              setSubscription(anySubData as UserSubscription);
              
              // Still count videos even if subscription is not active
              const now = new Date();
              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
              const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
              
              const { data: videosData } = await supabase
                .from('videos')
                .select('id, uploaded_at')
                .eq('user_id', userData.user.id)
                .gte('uploaded_at', startOfMonth.toISOString())
                .lte('uploaded_at', endOfMonth.toISOString());
              
              const videosUploaded = videosData?.length || 0;
              const analysisLimit = anySubData.pricing.analysis_limit;
              
              setQuota({
                canCreate: videosUploaded < analysisLimit,
                usages_count: anySubData?.usages_count,
                analysesUsed: videosUploaded,
                analysesLimit: analysisLimit,
                nextResetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1)
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching quota info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotaInfo();
  }, []);

  const refreshQuota = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user && subscription) {
      // Count videos uploaded this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('id')
        .eq('user_id', userData.user.id)
        .gte('uploaded_at', startOfMonth.toISOString())
        .lte('uploaded_at', endOfMonth.toISOString());
      
      if (!videosError) {
        const videosUploaded = videosData?.length || 0;
        const analysisLimit = subscription.pricing.analysis_limit;
        
        setQuota({
          canCreate: videosUploaded < analysisLimit,
          usages_count: subscription?.usages_count,
          analysesUsed: videosUploaded,
          analysesLimit: analysisLimit,
          nextResetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        });
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Analysis Quota
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quota || !subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Analysis Quota
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No subscription information available.</p>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = quota.analysesLimit > 0 ? (quota.analysesUsed / quota.analysesLimit) * 100 : 0;
  const remaining = Math.max(0, quota.analysesLimit - quota.analysesUsed);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Analysis Quota
          </CardTitle>
          <CardDescription>
            {subscription.pricing.name} Plan
          </CardDescription>
        </div>
        <Badge variant={quota.canCreate ? "default" : "destructive"}>
          {quota.canCreate ? "Available" : "Exceeded"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Used this month</span>
            <span className="font-medium">
              {quota.usages_count} / {quota.analysesLimit}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          {/* Subscription Usage Details */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Subscription Usage
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Plan:</span>
                <div className="font-medium">{subscription.pricing.name}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Monthly Limit:</span>
                <div className="font-medium">{quota.analysesLimit} uploads</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Used:</span>
                <div className="font-medium">{quota.analysesUsed} uploads</div>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <div className={`font-medium ${quota.canCreate ? 'text-green-600' : 'text-red-600'}`}>
                  {quota.canCreate ? 'Active' : 'Exceeded'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Remaining
            </div>
            <div className="font-medium text-lg">
              {remaining > 0 ? remaining : 0}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Next Reset
            </div>
            <div className="font-medium text-sm">
              {quota.nextResetDate 
                ? AnalysisQuotaService.formatResetDate(quota.nextResetDate)
                : 'N/A'
              }
            </div>
          </div>
        </div>

        {!quota.canCreate && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              You've reached your monthly analysis limit. 
              {quota.nextResetDate && (
                <span className="block mt-1">
                  Your quota will reset in {AnalysisQuotaService.formatResetDate(quota.nextResetDate)}.
                </span>
              )}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshQuota}
            disabled={loading}
          >
            Refresh
          </Button>
          {!quota.canCreate && (
            <Button size="sm" className="bg-tt-orange hover:bg-orange-600">
              Upgrade Plan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};