import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import VideoModal from "@/components/VideoModal";
import { VideoFeedbackDisplay } from "@/components/feedback/VideoFeedbackDisplay";
import { ProfileService, VideoData } from "@/services/profileService";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Play, MessageSquare, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompletedVideosListProps {
  coachId?: string;
}

interface VideoFeedback {
  id: string;
  feedback_text: string;
  rating: number;
  created_at: string;
  coach_id: string;
  video_id: string;
}

export const CompletedVideosList = ({ coachId }: CompletedVideosListProps) => {
  const [videos, setVideos] = useState<VideoData[]>([]);
//   const [feedbacks, setFeedbacks] = useState<Map<string, VideoFeedback>>(new Map());
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [feedbackDisplayOpen, setFeedbackDisplayOpen] = useState(false);
  const [videoUrlLoading, setVideoUrlLoading] = useState(false);
  const { toast } = useToast();

//   console.log({feedbacks})

  useEffect(() => {
    loadCompletedVideos();
  }, [coachId]);

  const loadCompletedVideos = async () => {
    try {
      setLoading(true);
      
      // Get current user if no coachId is provided
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !coachId) {
        console.error('No user authenticated and no coachId provided');
        setVideos([]);
        return;
      }
      
      const targetCoachId = coachId || user?.id;
    //   console.log('Loading completed videos for coach:', targetCoachId);
      
      const completedVideos = await ProfileService.getAnalyzedVideos(targetCoachId);
    //   console.log('Loaded completed videos:', completedVideos);
      setVideos(completedVideos);
      
      // Load feedback for each video
      if (completedVideos.length > 0) {
        await loadFeedbacks(completedVideos.map(v => v.id));
      }
    } catch (error) {
      console.error('Error loading completed videos:', error);
      toast({
        title: "Error",
        description: "Failed to load completed videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFeedbacks = async (videoIds: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: feedbackData, error } = await supabase
        .from('video_feedback')
        .select('*')
        // .in('video_id', videoIds)
        .in('video_coaches_id', videoIds)
        .eq('coach_id', user.id);

        // console.log({feedbackData})

      if (error) {
        console.error('Error loading feedbacks:', error);
        return;
      }

      const feedbackMap = {};
      feedbackData?.forEach(feedback => {
        feedbackMap[feedback.video_coaches_id] = feedback;
      });
      setFeedbacks(feedbackMap);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    }
  };

  const getVideoUrl = async (video: VideoData): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('videos')
        .createSignedUrl(video.file_path, 3600);

      if (error) {
        console.error('Error creating signed URL:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error getting video URL:', error);
      return null;
    }
  };

  const openVideoModal = async (video: VideoData) => {
    setVideoUrlLoading(true);
    try {
      const videoUrl = await getVideoUrl(video);
      if (videoUrl) {
        setSelectedVideo({ ...video, file_path: videoUrl });
        setVideoModalOpen(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to load video",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error opening video:', error);
      toast({
        title: "Error",
        description: "Failed to open video",
        variant: "destructive",
      });
    } finally {
      setVideoUrlLoading(false);
    }
  };

  const openFeedbackDisplay = (video: VideoData) => {
    setSelectedVideo(video);
    setFeedbackDisplayOpen(true);
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Analyzed Videos
          </CardTitle>
          <CardDescription>Videos with completed analysis and feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading analyzed videos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (videos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Analyzed Videos
          </CardTitle>
          <CardDescription>Videos with completed analysis and feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No videos analyzed yet</p>
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
            <CheckCircle className="h-5 w-5" />
            Analyzed Videos ({videos.length})
          </CardTitle>
          <CardDescription>Videos with completed analysis and feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video Title</TableHead>
                 <TableHead>Video Description</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Analysis Date</TableHead>
                <TableHead>Focus Area</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => {
                const feedback = feedbacks[video.id];
                return (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">
                    {video?.title || video?.file_name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {video.description}
                  </TableCell>
                    <TableCell>{video?.profiles?.display_name}</TableCell>
                    
                    <TableCell>
                      {video?.created_at 
                        ? new Date(video?.created_at).toLocaleDateString() 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{video.focus_areas || "General"}</TableCell>
                    <TableCell>
                        {/* {console.log("feedbacks get", typeoffeedbacks[video.id])} */}
                      {feedback?.rating ? renderRating(feedback.rating) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        Completed
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(video?.video_link, '_blank')}
                          disabled={videoUrlLoading}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Play
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openFeedbackDisplay(video)}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          View Feedback
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Video Modal */}
      {selectedVideo && videoModalOpen && (
        <VideoModal
          video={selectedVideo}
          videoUrl={selectedVideo.file_path}
          isOpen={videoModalOpen}
          onClose={() => {
            setVideoModalOpen(false);
            setSelectedVideo(null);
          }}
        />
      )}

      {/* Feedback Display */}
      {selectedVideo && feedbackDisplayOpen && (
        <div className="fixed !mt-0 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Video Feedback</CardTitle>
                <CardDescription>
                  Feedback for: {selectedVideo.title || selectedVideo.file_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VideoFeedbackDisplay video={selectedVideo} videoId={selectedVideo.id} />
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFeedbackDisplayOpen(false);
                      setSelectedVideo(null);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};