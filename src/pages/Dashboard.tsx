
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowUpRight, Clock, Play, CheckCircle, AlertCircle, Upload, FileVideo, Loader2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProfileService, VideoData } from "@/services/profileService";
import VideoModal from "@/components/VideoModal";
import { useAuth } from "@/contexts/AuthContext";
import ReactPlayer from 'react-player'
import videoThumbnail from '../../public/lovable-uploads/video_thumbnail.jpg';
import { VideoFeedbackDisplay } from "@/components/feedback/VideoFeedbackDisplay";

const Dashboard = () => {
    const {user} = useAuth();
  const [activeTab, setActiveTab] = useState("uploads");
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [videoUrlLoading, setVideoUrlLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [feedbackDisplayOpen, setFeedbackDisplayOpen] = useState(false);
  const { toast } = useToast();

//   console.log({selectedVideo})

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // const userVideos = await ProfileService.getUserVideos();
        // setVideos(userVideos);
        const { data, error } = await supabase
        .from('video_feedback')
        // .select(`
        //   id,
        //   feedback_text,
        //   rating,
        //   created_at,
        //   coach_id,
        //   `)
        .select(`
            *, 
            video: video_coaches_id (*)
            `)
            // videos: video_coaches_id (*),
            // video: video_coaches_id (*, player: player_id (*)) //! nested bro
            // profiles:player_id (*)
          .eq('player_id', user?.id)
          .order('created_at', { ascending: false });
        //   console.log({user, data})  
          setVideos(data || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user?.id]);

  // Filter videos for uploaded games (all videos)
  const uploadedGames = videos;
  
  // Filter videos for coach analysis (only analyzed videos)
  const coachAnalyses = videos.filter(video => video?.video?.status === "completed");

  const getVideoUrl = async (video: VideoData): Promise<string | null> => {
    try {
      if (!video.file_path) {
        console.error('No file path for video:', video.id);
        return null;
      }

      // Create a signed URL for private bucket access
      const { data, error } = await supabase.storage
        .from('videos')
        .createSignedUrl(video.file_path, 3600); // 1 hour expiry

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

  const openVideo = (link) => {
    window.open(link, '_blank');
  }

    const openFeedbackDisplay = (video: VideoData) => {
      setSelectedVideo(video);
      setFeedbackDisplayOpen(true);
    };

  const openVideoModal = async (video: VideoData) => {
    // console.log({video})
      setSelectedVideo(video);
    // setVideoUrlLoading(true);
    // try {
    //   const videoUrl = await getVideoUrl(video);
    //   if (videoUrl) {
    //     setSelectedVideo(video);
    //     // setSelectedVideoUrl(videoUrl);
    //     setVideoModalOpen(true);
    //   } else {
    //     console.error('Failed to get video URL for video:', video.id);
    //   }
    // } catch (error) {
    //   console.error('Error opening video modal:', error);
    // } finally {
    //   setVideoUrlLoading(false);
    // }
  };

  const handleDeleteVideo = async (videoId: string) => {
    setDeleteLoading(videoId);
    try {
      const success = await ProfileService.deleteVideo(videoId);
      if (success) {
        setVideos(prevVideos => prevVideos.filter(video => video.id !== videoId));
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
  
  const renderStatusBadge = (analyzed: boolean | null) => {
    if (analyzed) {
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" /> Analyzed</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  const VideoCard = ({ video }: { video: VideoData }) => {
    const [videoError, setVideoError] = useState(false);
    const [thumbnailLoading, setThumbnailLoading] = useState(false);
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    
    // useEffect(() => {
    //   const fetchVideoUrl = async () => {
    //     try {
    //       const url = await getVideoUrl(video);
    //       setSignedUrl(url);
    //     } catch (error) {
    //       console.error('Error fetching video URL for thumbnail:', error);
    //       setVideoError(true);
    //     } finally {
    //       setThumbnailLoading(false);
    //     }
    //   };

    //   fetchVideoUrl();
    // }, [video.id]);
    
    // If no video URL or video failed to load, show placeholder
    if (!signedUrl || videoError) {
      const placeholders = [
        "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1611251135345-18ae96d3292c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1626259609456-a2290a8f98f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      ];
      const index = video.id.length % placeholders.length;
      
      return (
        <Card className="overflow-hidden hover-scale">
          <div className="relative h-48">
            {thumbnailLoading ? (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <img 
                // src={placeholders[index]}
                src={videoThumbnail}
                alt={video?.video?.title || video.file_name} 
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-2 right-2">
              {renderStatusBadge(video?.video?.status === 'completed')}
            </div>
            {!thumbnailLoading && (
              <div 
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                // onClick={() => openVideoModal(video)}
                onClick={() => openVideo(video?.video?.video_link)}
              >
                {videoUrlLoading ? (
                  <Loader2 className="h-16 w-16 text-white animate-spin" />
                ) : (
                  <Play className="h-16 w-16 text-white" />
                )}
              </div>
            )}
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{video?.video?.title || video.file_name}</CardTitle>
            <CardDescription className="flex justify-between">
              <span>Uploaded: {video?.video?.created_at ? new Date(video?.video?.created_at).toLocaleDateString() : "N/A"}</span>
              <span>Focus: {video?.video?.focus_areas || "General"}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                //   onClick={() => openVideoModal(video)}
                  onClick={() => openVideo(video?.video?.video_link)}
                  disabled={videoUrlLoading || thumbnailLoading}
                >
                  {videoUrlLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                  Watch Video
                </Button>
                {video?.feedback_text && (
                  <Button onClick={() => openFeedbackDisplay(video)} size="sm" className="bg-tt-blue text-white hover:bg-blue-800">
                    View Analysis
                  </Button>
                )}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                      Are you sure you want to delete "{video?.video?.title || video.file_name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDeleteVideo(video.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="overflow-hidden hover-scale">
        <div className="relative h-48">
          {thumbnailLoading ? (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>

            {/* <video 
              src={signedUrl}
              preload="metadata"
              className="w-full h-full object-cover cursor-pointer"
              onError={() => setVideoError(true)}
              onClick={() => openVideoModal(video)}
              onLoadedMetadata={(e) => {
                  // Set the video to show the frame at 1 second as thumbnail
                  const video = e.target as HTMLVideoElement;
                  video.currentTime = 1;
                }}
                //   onLoadStart={() => setThumbnailLoading(true)}
                onCanPlay={() => setThumbnailLoading(false)}
                /> */}
                <ReactPlayer src={selectedVideo?.video?.video_link} />
                </>
          )}
          <div className="absolute top-2 right-2">
            {renderStatusBadge(video?.feedback_text)}
          </div>
          {!thumbnailLoading && (
            <div 
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            //   onClick={() => openVideoModal(video)}
            onClick={() => openVideo(video?.video?.video_link)}
            >
              {videoUrlLoading ? (
                <Loader2 className="h-16 w-16 text-white animate-spin" />
              ) : (
                <Play className="h-16 w-16 text-white" />
              )}
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{video?.video?.title || video.file_name}</CardTitle>
          <CardDescription className="flex justify-between">
            <span>Uploaded: {video?.video?.created_at ? new Date(video?.video?.created_at).toLocaleDateString() : "N/A"}</span>
            <span>Focus: {video?.video?.focus_areas || "General"}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
                
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                // onClick={() => openVideoModal(video)}
                onClick={() => openVideo(video?.video?.video_link)}
                disabled={videoUrlLoading}
              >
                {videoUrlLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                Watch Video
              </Button>
              {video?.feedback_text && (
                <Button onClick={() => openFeedbackDisplay(video)} size="sm" className="bg-tt-blue text-white hover:bg-blue-800">
                  View Analysis
                </Button>
              )}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                    Are you sure you want to delete "{video?.video?.title || video.file_name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => handleDeleteVideo(video.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-tt-blue mb-2">Your Dashboard</h1>
            <p className="text-gray-600">
              Manage your uploaded games and view coach analyses
            </p>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="uploads" className="w-full" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="uploads">Uploaded Games</TabsTrigger>
                <TabsTrigger value="analyses">Coach Analyses</TabsTrigger>
              </TabsList>
              
              <div className="mt-8">
                <TabsContent value="uploads" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-tt-blue">Your Uploaded Games</h2>
                    <Link to="/upload">
                      <Button className="bg-tt-orange text-white hover:bg-orange-600">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Game
                      </Button>
                    </Link>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tt-blue mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading your videos...</p>
                    </div>
                  ) : uploadedGames.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {uploadedGames.map(video => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No videos uploaded yet</h3>
                        <p className="text-gray-500 mb-4">Upload your first table tennis game to get started</p>
                        <Link to="/upload">
                          <Button className="bg-tt-orange text-white hover:bg-orange-600">
                            Upload Your First Game
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="analyses" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-tt-blue">Your Coach Analyses</h2>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tt-blue mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading your analyses...</p>
                    </div>
                  ) : coachAnalyses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {coachAnalyses.map(video => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <FileVideo className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No coach analyses yet</h3>
                        <p className="text-gray-500 mb-4">Your coach analyses will appear here once they're completed</p>
                        <Link to="/upload">
                          <Button className="bg-tt-orange text-white hover:bg-orange-600">
                            Upload a Game for Analysis
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Video Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        video={selectedVideo}
        videoUrl={selectedVideoUrl}
      />

       {/* Feedback Display */}
            {selectedVideo && feedbackDisplayOpen && (
              <div className="fixed !mt-0 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Video Feedback</CardTitle> 
                      <CardDescription>
                        Feedback for: {selectedVideo?.video?.title || selectedVideo.file_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <VideoFeedbackDisplay video={selectedVideo?.video} videoId={selectedVideo?.video?.id} />
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
      
      <Footer />
    </div>
  );
};

export default Dashboard;
