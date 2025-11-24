import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import VideoModal from "@/components/VideoModal";
import { VideoFeedbackForm } from "@/components/feedback/VideoFeedbackForm";
import { ProfileService, VideoData } from "@/services/profileService";
import { supabase } from "@/integrations/supabase/client";
import { Video, Play, MessageSquare, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PendingVideosListProps {
  coachId?: string;
}

export const PendingVideosList = ({ coachId }: PendingVideosListProps) => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [feedbackFormOpen, setFeedbackFormOpen] = useState(false);
  const [videoUrlLoading, setVideoUrlLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPendingVideos();
  }, [coachId]);

  const loadPendingVideos = async () => {
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
    //   console.log('Loading pending videos for coach:', targetCoachId);
      
      const pendingVideos = await ProfileService.getPendingVideos(targetCoachId);
    //   console.log({pendingVideos});
      setVideos(pendingVideos);
    } catch (error) {
      console.error('Error loading pending videos:', error);
      toast({
        title: "Error",
        description: "Failed to load pending videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      const url = await getVideoUrl(video);
      if (url) {
        setSelectedVideo({ ...video, file_path: url });
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

  const openFeedbackForm = (video: VideoData) => {
    // console.log({video})
    setSelectedVideo(video);
    setFeedbackFormOpen(true);
  };

  const handleFeedbackSuccess = () => {
    setFeedbackFormOpen(false);
    setSelectedVideo(null);
    // Reload pending videos to update the list
    loadPendingVideos();
    toast({
      title: "Success",
      description: "Feedback submitted successfully",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Videos Pending Analysis
          </CardTitle>
          <CardDescription>Review and analyze student submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading pending videos...</p>
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
            <Clock className="h-5 w-5" />
            Videos Pending Analysis
          </CardTitle>
          <CardDescription>Review and analyze student submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No videos pending analysis</p>
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
            <Clock className="h-5 w-5" />
            Videos Pending Analysis ({videos.length})
          </CardTitle>
          <CardDescription>Review and analyze student submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video Title</TableHead>
                <TableHead>Video Description</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Focus Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => {
                return (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">
                    {video?.title || video?.file_name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {(video as any).description || "-"}
                  </TableCell>
                  <TableCell>{video?.student_name || "Unknown"}</TableCell>
                  <TableCell>
                    {video.uploaded_at ? new Date(video.uploaded_at).toLocaleDateString() : 'Unknown'}
                  </TableCell>
                  <TableCell>{video.focus_area || "General"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                      {video.status || "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openVideoModal(video)}
                        disabled={videoUrlLoading}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Play
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openFeedbackForm(video)}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Analyze
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Video Modal */}
      {selectedVideo && videoModalOpen && (
        <VideoModal
          video={selectedVideo}
          videoUrl={selectedVideo?.file_path}
          isOpen={videoModalOpen}
          onClose={() => {
            setVideoModalOpen(false);
            setSelectedVideo(null);
          }}
        />
      )}

      {/* Feedback Form */}
      {selectedVideo && feedbackFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <VideoFeedbackForm
              video={selectedVideo}
              onSuccess={handleFeedbackSuccess}
              onCancel={() => {
                setFeedbackFormOpen(false);
                setSelectedVideo(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};