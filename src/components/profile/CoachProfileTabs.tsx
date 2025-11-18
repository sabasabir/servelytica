
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, CheckCircle, Video, Play, Target, Trophy, Brain, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CoachProfileTabsProps {
  onDataUpdate: () => void;
}

const CoachProfileTabs = ({ onDataUpdate }: CoachProfileTabsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [pendingVideos, setPendingVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // console.log('🔄 CoachProfileTabs useEffect triggered');
    // console.log('📋 User object:', user);
    // console.log('🆔 User ID:', user?.id);
    // console.log('📧 User email:', user?.email);
    
    if (user) {
      fetchPendingVideos();
    } else {
      console.log('❌ No user found, skipping fetchPendingVideos');
    }
  }, [user]);

  const fetchPendingVideos = useCallback(async (isRetry = false) => {
    if (!user) {
      console.log('❌ fetchPendingVideos: No user found');
      return;
    }
    
    // console.log(`🚀 Starting fetchPendingVideos (${isRetry ? 'retry' : 'initial'})`);
    // console.log('👤 Coach User ID:', user.id);
    
    try {
      setLoading(true);
      setError(null);
      
    //   console.log('📋 Step 1: Fetching video assignments from video_coaches table...');
      
      // First, get videos assigned to this coach through video_coaches table
      const { data: videoAssignments, error: assignmentsError } = await supabase
        .from('video_coaches')
        .select('video_id')
        .eq('coach_id', user.id);

    //   console.log('📋 Video assignments query result:', {
    //     data: videoAssignments,
    //     error: assignmentsError,
    //     count: videoAssignments?.length || 0
    //   });

      if (assignmentsError) {
        console.error('❌ Error fetching video assignments:', assignmentsError);
        throw new Error(`Failed to fetch video assignments: ${assignmentsError.message}`);
      }

      if (!videoAssignments || videoAssignments.length === 0) {
        console.log('📝 No video assignments found for this coach');
        setPendingVideos([]);
        return;
      }

      const videoIds = videoAssignments.map(assignment => assignment.video_id);
    //   console.log('🎬 Video IDs to fetch:', videoIds);

    //   console.log('📋 Step 2: Fetching videos data...');
      
      // Get the videos for this coach
      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .in('id', videoIds)
        .eq('analyzed', false)
        .order('uploaded_at', { ascending: false });

    //   console.log('🎬 Videos query result:', {
    //     data: videos,
    //     error: videosError,
    //     count: videos?.length || 0,
    //     videoIds: videos?.map(v => v.id) || []
    //   });

      if (videosError) {
        console.error('❌ Error fetching pending videos:', videosError);
        throw new Error(`Failed to fetch videos: ${videosError.message}`);
      }

      if (!videos || videos.length === 0) {
        console.log('📝 No pending videos found (all videos may be analyzed)');
        setPendingVideos([]);
        return;
      }

    //   console.log('📋 Step 3: Fetching player profiles...');
      
      // Get unique user IDs to fetch player profiles
      const userIds = [...new Set(videos.map(video => video.user_id))];
    //   console.log('👥 Player user IDs to fetch:', userIds);
      
      // Fetch player profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, username')
        .in('user_id', userIds);

    //   console.log('👥 Profiles query result:', {
    //     data: profiles,
    //     error: profilesError,
    //     count: profiles?.length || 0
    //   });

      if (profilesError) {
        console.error('❌ Error fetching player profiles:', profilesError);
        throw new Error(`Failed to fetch player profiles: ${profilesError.message}`);
      }

      // Create a map of user_id to profile for quick lookup
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });

    //   console.log('📋 Step 4: Combining data...');
      
      // Combine video data with player information
      const combinedData = videos.map(video => {
        const playerProfile = profileMap.get(video.user_id);
        const result = {
          id: video.id,
          playerName: playerProfile?.display_name || playerProfile?.username || 'Unknown Player',
          title: video.title || 'Untitled Video',
          uploadDate: new Date(video.uploaded_at || video.created_at).toLocaleDateString(),
          focusArea: video.focus_area,
          description: video.description,
          fileName: video.file_name,
          rawVideo: video // For debugging
        };
        // console.log('🎬 Combined video data:', result);
        return result;
      });

    //   console.log('✅ Successfully processed pending videos:', combinedData.length);
      setPendingVideos(combinedData);
      setRetryCount(0);
      
      if (isRetry) {
        toast({
          title: "Success",
          description: "Successfully loaded pending videos",
        });
      }
      
    } catch (error) {
      console.error('❌ Error in fetchPendingVideos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "Error loading videos",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const players = [
    {
      id: 1,
      name: "Alex Thompson",
      avatar: "/placeholder.svg",
      level: "Intermediate",
      joinDate: "2024-01-15",
      progress: 75,
      lastSession: "2024-07-10"
    },
    {
      id: 2,
      name: "Maria Garcia",
      avatar: "/placeholder.svg",
      level: "Beginner",
      joinDate: "2024-02-20",
      progress: 45,
      lastSession: "2024-07-08"
    }
  ];

  const analyzedVideos = [
    {
      id: 1,
      playerName: "Alex Thompson",
      title: "Forehand Drive Analysis",
      analyzedDate: "2024-07-10",
      score: 85,
      feedback: "Excellent timing and form. Focus on follow-through consistency.",
      improvements: ["Follow-through", "Footwork positioning"]
    },
    {
      id: 2,
      playerName: "Maria Garcia",
      title: "Match Analysis - Quarter Finals",
      analyzedDate: "2024-07-09",
      score: 78,
      feedback: "Good tactical awareness. Work on defensive transitions.",
      improvements: ["Defensive play", "Shot selection"]
    }
  ];

  const playerServices = [
    { icon: Play, title: "Live Coaching", description: "Real-time coaching sessions" },
    { icon: Target, title: "Opponent Analysis", description: "Analyze opponent strategies" },
    { icon: Trophy, title: "Custom Training Program", description: "Personalized training plans" },
    { icon: Brain, title: "Advanced Match Strategy", description: "Strategic match planning" }
  ];

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-full md:w-auto overflow-x-auto">
        <TabsTrigger value="pending" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2 min-w-0 flex-1 md:flex-initial">
          <Clock className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Pending Videos</span>
          <span className="sm:hidden">Pending</span>
        </TabsTrigger>
        <TabsTrigger value="analyzed" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2 min-w-0 flex-1 md:flex-initial">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Analyzed Videos</span>
          <span className="sm:hidden">Analyzed</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Videos Pending Analysis</CardTitle>
          </CardHeader>
            <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
                  <p>Loading pending videos...</p>
                  <p className="text-sm mt-2">Checking coach assignments...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                  <p className="text-destructive font-medium">Error loading videos</p>
                  <p className="text-sm text-muted-foreground mt-2">{error}</p>
                  <Button 
                    onClick={() => {
                      setRetryCount(prev => prev + 1);
                      fetchPendingVideos(true);
                    }} 
                    variant="outline" 
                    className="mt-4"
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry {retryCount > 0 && `(${retryCount})`}
                  </Button>
                </div>
              ) : pendingVideos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending videos for analysis</p>
                  <p className="text-sm mt-2">Videos uploaded by players will appear here</p>
                  <Button 
                    onClick={() => fetchPendingVideos(true)} 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              ) : (
                pendingVideos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Video className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">Player: {video.playerName}</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded: {video.uploadDate}
                        </p>
                        {video.focusArea && (
                          <p className="text-sm text-muted-foreground">
                            Focus: {video.focusArea}
                          </p>
                        )}
                        {video.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary">
                        Pending
                      </Badge>
                      <Button>Analyze</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>


      <TabsContent value="analyzed" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Analyzed Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyzedVideos.map((video) => (
                <div key={video.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">Player: {video.playerName}</p>
                      <p className="text-sm text-muted-foreground">Analyzed: {video.analyzedDate}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{video.score}%</div>
                      <div className="text-sm text-muted-foreground">Performance Score</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <h4 className="font-medium mb-1">Feedback:</h4>
                    <p className="text-sm text-muted-foreground">{video.feedback}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Areas for Improvement:</h4>
                    <div className="flex space-x-2">
                      {video.improvements.map((improvement, index) => (
                        <Badge key={index} variant="outline">{improvement}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CoachProfileTabs;
