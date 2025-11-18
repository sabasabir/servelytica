import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play, Calendar, User, Target, MessageSquare } from "lucide-react";
import { ProfileService, VideoData } from "@/services/profileService";
import { supabase } from "@/integrations/supabase/client";
import VideoModal from "@/components/VideoModal";
import { useToast } from "@/hooks/use-toast";
import { VideoFeedbackForm } from "@/components/feedback/VideoFeedbackForm";
import { useUserRole } from "@/hooks/useUserRole";

interface AnalyzedVideosListProps {
  coachId?: string; // Optional coachId to filter videos
}

export const AnalyzedVideosList = ({ coachId }: AnalyzedVideosListProps) => {
  const [analyzedVideos, setAnalyzedVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [videoUrlLoading, setVideoUrlLoading] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState<string | null>(null);
  const [videosWithFeedback, setVideosWithFeedback] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { isCoach } = useUserRole();

  useEffect(() => {
    loadAnalyzedVideos();
  }, [coachId]);

  const loadAnalyzedVideos = async () => {
    try {
      setLoading(true);
      const videos = await ProfileService.getAnalyzedVideos(coachId);
      setAnalyzedVideos(videos);
      
      // Check which videos have feedback
      await checkFeedbackStatus(videos);
    } catch (error) {
      console.error('Error loading analyzed videos:', error);
      toast({
        title: "Error",
        description: "Failed to load analyzed videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFeedbackStatus = async (videos: VideoData[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('video_feedback')
        .select('video_id')
        .eq('coach_id', user.id)
        .in('video_id', videos.map(v => v.id));

        // console.log({data})

      if (!error && data) {
        const videoIdsWithFeedback = new Set(data.map(f => f.video_id));
        setVideosWithFeedback(videoIdsWithFeedback);
      }
    } catch (error) {
      console.error('Error checking feedback status:', error);
    }
  };

  const getVideoUrl = async (video: VideoData): Promise<string | null> => {
    try {
    //   console.log('Getting video URL for file_path:', video.file_path);
    //   console.log('Video user_id:', video.user_id);
      
      // For coaches accessing student videos, we need to try the exact stored path
      const pathsToTry = [
        video.file_path, // Original stored path (should be user_id/timestamp.ext)
        `${video.user_id}/${video.file_name}`, // user_id/filename format
        video.file_name, // Just the filename as fallback
      ];
      
      for (const path of pathsToTry) {
        // console.log('Trying path:', path);
        const { data, error } = await supabase.storage
          .from('videos')
          .createSignedUrl(path, 3600); // 1 hour expiry
        
        if (!error && data?.signedUrl) {
        //   console.log('Successfully generated signed URL with path:', path);
          return data.signedUrl;
        }
        
        if (error) {
          console.log('Failed with path:', path, 'Error:', error.message);
        }
      }
      
      // If all paths fail, show error
      console.error('All path attempts failed for video:', video);
      toast({
        title: "Error",
        description: "Video file not found in storage. Please contact support.",
        variant: "destructive",
      });
      return null;
    } catch (error) {
      console.error('Error getting video URL:', error);
      toast({
        title: "Error",
        description: "Failed to load video. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const openVideoModal = async (video: VideoData) => {
    setVideoUrlLoading(true);
    try {
      const videoUrl = await getVideoUrl(video);
      if (videoUrl) {
        setSelectedVideo(video);
        setSelectedVideoUrl(videoUrl);
        setVideoModalOpen(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to load video. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error opening video modal:', error);
      toast({
        title: "Error",
        description: "Failed to load video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVideoUrlLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Analyzed Videos
          </CardTitle>
          <CardDescription>
            Videos assigned to the coach that have been analyzed and reviewed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (analyzedVideos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Analyzed Videos
          </CardTitle>
          <CardDescription>
            Videos assigned to the coach that have been analyzed and reviewed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Play className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No analyzed videos yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Videos assigned to the coach for analysis will appear here once the analysis is complete.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Analyzed Videos
          </CardTitle>
          <CardDescription>
            Videos assigned to the coach that have been analyzed and reviewed ({analyzedVideos.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              Videos assigned to the coach with feedback
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Video</TableHead>
                <TableHead>Focus Area</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden sm:table-cell">Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyzedVideos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {video.title || video.file_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {video.file_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {video.focus_areas || "General"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {video.created_at 
                          ? new Date(video.created_at).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {video?.profiles?.display_name && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {video?.profiles?.display_name}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                      Analyzed
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openVideoModal(video)}
                        disabled={videoUrlLoading}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {isCoach && !videosWithFeedback.has(video.id) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFeedbackForm(video.id)}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Feedback
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        video={selectedVideo}
        videoUrl={selectedVideoUrl}
      />

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <VideoFeedbackForm
              video={analyzedVideos.find(v => v.id === showFeedbackForm)!}
              onSuccess={() => {
                setShowFeedbackForm(null);
                loadAnalyzedVideos(); // Refresh the list and feedback status
              }}
              onCancel={() => setShowFeedbackForm(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};