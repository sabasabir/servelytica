
import { useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Play, Trash2, Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { VideoData, ProfileService } from "@/services/profileService";
import VideoModal from "@/components/VideoModal";
import CoachSelectionModal from "@/components/profile/CoachSelectionModal";
import { supabase } from "@/integrations/supabase/client";
import { VideoFeedbackDisplay } from "@/components/feedback/VideoFeedbackDisplay";

interface VideosListProps {
  videos: VideoData[];
  onVideoUpdate: () => void;
}

const VideosList = ({ videos, onVideoUpdate }: VideosListProps) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [videoUrlLoading, setVideoUrlLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [coachModalOpen, setCoachModalOpen] = useState(false);
  const [selectedVideoForCoachUpdate, setSelectedVideoForCoachUpdate] = useState<VideoData | null>(null);
  const [selectedVideoForFeedback, setSelectedVideoForFeedback] = useState<VideoData | null>(null);
  const [videoFeedbacks, setVideoFeedbacks] = useState<Map<string, boolean>>(new Map());
  const { toast } = useToast();


  const getVideoUrl = async (video: VideoData): Promise<string | null> => {
    try {
      const { data } = await supabase.storage
        .from('videos')
        .createSignedUrl(video.file_path, 3600); // 1 hour expiry
      
      return data?.signedUrl || null;
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

  const handleDeleteVideo = async (videoId: string) => {
    setDeleteLoading(videoId);
    try {
      const success = await ProfileService.deleteVideo(videoId);
      if (success) {
        onVideoUpdate(); // Refresh the videos list
        toast({
          title: "Video deleted",
          description: "Your video has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete video. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the video.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const openCoachModal = (video: VideoData) => {
    setSelectedVideoForCoachUpdate(video);
    setCoachModalOpen(true);
  };

  const handleCoachesUpdated = () => {
    onVideoUpdate(); // Refresh the videos list to show updated coach assignments
  };

  // Check if video has feedback
  const checkVideoFeedback = async (videoId: string) => {
    try {
      const { data, error } = await supabase
        .from('video_feedback')
        .select('id')
        .eq('video_id', videoId)
        .limit(1);

      if (error) {
        console.error('Error checking video feedback:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking video feedback:', error);
      return false;
    }
  };

  // Load feedback status for all videos
  const loadFeedbackStatus = async () => {
    const feedbackMap = new Map<string, boolean>();
    for (const video of videos) {
      const hasFeedback = await checkVideoFeedback(video.id);
      feedbackMap.set(video.id, hasFeedback);
    }
    setVideoFeedbacks(feedbackMap);
  };

  // Load feedback status when videos change
  React.useEffect(() => {
    if (videos.length > 0) {
      loadFeedbackStatus();
    }
  }, [videos]);

  const showVideoFeedback = (video: VideoData) => {
    setSelectedVideoForFeedback(video);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Videos</CardTitle>
        <CardDescription>
          View and manage your uploaded training videos
        </CardDescription>
      </CardHeader>
      <CardContent>
        
        <Table>
          <TableCaption>Your uploaded videos</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Coaches</TableHead>
              <TableHead>Focus Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell className="font-medium">{video.title || video.file_name}</TableCell>
                <TableCell>{video.created_at ? new Date(video.created_at).toLocaleDateString() : "N/A"}</TableCell>
                <TableCell>
                        <div
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary gap-1"
                        >
                          <span>{video?.coach?.display_name}</span>
                          <span className={`px-1 py-0.5 rounded text-xs ${
                            video.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {video.status === 'completed' ? '✓' : '⏳'}
                          </span>
                        </div>
                  {/* {video.coaches && video.coaches.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {video.coaches.map((coach) => (
                        <div
                          key={coach.id}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary gap-1"
                        >
                          <span>{coach.display_name}</span>
                          <span className={`px-1 py-0.5 rounded text-xs ${
                            coach.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {coach.status === 'completed' ? '✓' : '⏳'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No coaches assigned</span>
                  )} */}
                </TableCell>
                <TableCell>{video.focus_areas || "General"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                        <span
                          key={video?.id}
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            video?.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {video?.status === 'completed' ? 'Analyzed' : 'Pending'}
                        </span>
                    {/* {video.coaches && video.coaches.length > 0 ? (
                      video.coaches.map((coach) => (
                        <span
                          key={coach.id}
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            coach.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {coach.display_name}: {coach.status === 'completed' ? 'Analyzed' : 'Pending'}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">No coaches assigned</span>
                    )} */}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                    //   onClick={() => openVideoModal(video)}
                      onClick={() => window.open(video?.video_link, '_blank')}
                      disabled={videoUrlLoading}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Play
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showVideoFeedback(video)}
                    >
                      Feedback
                    </Button>
                    {/* {!videoFeedbacks.get(video.id) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCoachModal(video)}
                        title="Update Coaches"
                      >
                        <UserPlus className="h-3 w-3" />
                      </Button>
                    )} */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deleteLoading === video.id}
                        >
                          {deleteLoading === video.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Video</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{video.title || video.file_name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteVideo(video.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      
      {/* Video Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        video={selectedVideo}
        videoUrl={selectedVideoUrl}
      />

      {/* Coach Selection Modal */}
      {selectedVideoForCoachUpdate && (
        <CoachSelectionModal
          isOpen={coachModalOpen}
          onClose={() => setCoachModalOpen(false)}
          videoId={selectedVideoForCoachUpdate.id}
          videoTitle={selectedVideoForCoachUpdate.title || selectedVideoForCoachUpdate.file_name}
          currentCoaches={selectedVideoForCoachUpdate.coaches || []}
          onCoachesUpdated={handleCoachesUpdated}
        />
      )}

      {/* Show feedback for the selected video */}
      {selectedVideoForFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedVideoForFeedback(null)}
              className="absolute top-2 right-2 z-10"
            >
              ✕
            </Button>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Feedback for: {selectedVideoForFeedback.title || selectedVideoForFeedback.file_name}
              </h3>
              <VideoFeedbackDisplay videoId={selectedVideoForFeedback.id} />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VideosList;
