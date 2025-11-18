
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, X, Loader2, AlertCircle } from "lucide-react";
import { VideoData } from "@/services/profileService";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoData | null;
  videoUrl: string | null;
}

const VideoModal = ({ isOpen, onClose, video, videoUrl }: VideoModalProps) => {
    // console.log("i am here", isOpen, video)
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsLoading(true);
      setHasError(false);
    }
  }, [isOpen, videoUrl]);

  const togglePlay = () => {
    if (videoRef.current && !isLoading && !hasError) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

//   if (!video || !videoUrl) return null;
  if (!videoUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-black" aria-describedby="video-modal-description">
        <DialogHeader className="p-4 bg-black text-white">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold">
              {/* {video.title || video.file_name} */}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {/* <DialogDescription id="video-modal-description" className="text-gray-300">
            Watch your uploaded table tennis video with full playback controls
          </DialogDescription> */}
        </DialogHeader>
        
        <div className="relative">
          {hasError ? (
            <div className="w-full h-[70vh] bg-gray-900 flex flex-col items-center justify-center text-white">
              <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Video Load Error</h3>
              <p className="text-gray-300 text-center max-w-md">
                Unable to load the video. This may be due to network issues or the video file being unavailable.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 text-white border-white hover:bg-white/20"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              {/* <video
                ref={videoRef}
                src={video?.video?.video_link}
                className="w-full h-auto max-h-[70vh] object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onLoadStart={handleLoadStart}
                onCanPlay={handleCanPlay}
                onError={handleError}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
              /> */}

              
              
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
                    <p>Loading video...</p>
                  </div>
                </div>
              )}

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    disabled={isLoading || hasError}
                    className="text-white hover:bg-white/20"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                  
                  <div className="flex-1 flex items-center space-x-2">
                    <span className="text-white text-sm min-w-[40px]">
                      {formatTime(currentTime)}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      disabled={isLoading || hasError}
                      className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`
                      }}
                    />
                    <span className="text-white text-sm min-w-[40px]">
                      {formatTime(duration)}
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    disabled={isLoading || hasError}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="p-4 bg-black text-white">
          <div className="flex justify-between items-center text-sm">
            <div>
              <p className="text-gray-300">
                {/* Uploaded: {video.uploaded_at ? new Date(video.uploaded_at).toLocaleDateString() : "N/A"} */}
              </p>
              <p className="text-gray-300">
                {/* Focus Area: {video.focus_area || "General"} */}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {/* {video.analyzed ? (
                <span className="px-2 py-1 bg-green-600 text-white rounded text-xs">
                  Analyzed
                </span>
              ) : (
                <span className="px-2 py-1 bg-yellow-600 text-white rounded text-xs">
                  Pending Analysis
                </span>
              )} */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
