import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Video, Square, PlayCircle, ArrowLeft, Upload, Loader2, Settings } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UploadProgressBar from "@/components/upload/UploadProgressBar";

interface CameraVideoRecorderProps {
  onBack: () => void;
  onComplete: (data: any) => void;
}

type VideoQuality = "720p" | "1080p" | "4k";

const CameraVideoRecorder = ({ onBack, onComplete }: CameraVideoRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "complete" | "error">("idle");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [supportedMimeType, setSupportedMimeType] = useState<string | null>(null);
  const [isMediaRecorderSupported, setIsMediaRecorderSupported] = useState(true);
  const [videoQuality, setVideoQuality] = useState<VideoQuality>("1080p");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const qualitySettings: Record<VideoQuality, { width: number; height: number; frameRate: number; videoBitrate: number }> = {
    "720p": { width: 1280, height: 720, frameRate: 30, videoBitrate: 2_500_000 },
    "1080p": { width: 1920, height: 1080, frameRate: 30, videoBitrate: 5_000_000 },
    "4k": { width: 3840, height: 2160, frameRate: 30, videoBitrate: 15_000_000 }
  };

  const getSupportedMimeType = (): string | null => {
    if (!window.MediaRecorder) {
      setIsMediaRecorderSupported(false);
      return null;
    }

    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4;codecs=h264,aac',
      'video/mp4;codecs=h264',
      'video/mp4'
    ];

    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return mimeType;
      }
    }

    return null;
  };

  useEffect(() => {
    const mimeType = getSupportedMimeType();
    setSupportedMimeType(mimeType);
    
    if (!mimeType) {
      toast({
        title: "Video Recording Not Supported",
        description: "Your browser doesn't support video recording. Please try using a different browser.",
        variant: "destructive"
      });
      return;
    }
    
    startCamera();
    return () => {
      stopCamera();
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  const pendingQualityChange = useRef<string | null>(null);
  
  useEffect(() => {
    if (isRecording || mediaRecorderRef.current?.state === 'recording') {
      pendingQualityChange.current = videoQuality;
      return;
    }
    
    if (!isPreviewing && hasPermission) {
      stopCamera();
      startCamera();
    }
  }, [videoQuality]);
  
  useEffect(() => {
    if (!isRecording && pendingQualityChange.current && pendingQualityChange.current !== videoQuality) {
      pendingQualityChange.current = null;
    }
  }, [isRecording, videoQuality]);

  const startCamera = async () => {
    const settings = qualitySettings[videoQuality];
    
    const tryGetUserMedia = async (constraints: MediaStreamConstraints): Promise<MediaStream | null> => {
      try {
        return await navigator.mediaDevices.getUserMedia(constraints);
      } catch {
        return null;
      }
    };

    try {
      let stream = await tryGetUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: settings.width },
          height: { ideal: settings.height },
          frameRate: { ideal: settings.frameRate }
        }, 
        audio: {
          sampleRate: 48000,
          channelCount: 2,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      if (!stream) {
        stream = await tryGetUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          }, 
          audio: true
        });
      }
      
      if (!stream) {
        stream = await tryGetUserMedia({ video: { facingMode: 'user' }, audio: true });
      }
      
      if (!stream) {
        throw new Error('Unable to access camera with any settings');
      }
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const actualSettings = videoTrack.getSettings();
        console.log('[CAMERA] Actual video settings:', actualSettings);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to record video.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const startRecording = () => {
    if (!streamRef.current || !supportedMimeType) {
      toast({
        title: "Recording Not Available",
        description: "Video recording is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    const settings = qualitySettings[videoQuality];
    const safeBitrate = Math.min(settings.videoBitrate, 8_000_000);

    try {
      chunksRef.current = [];
      const recorderOptions: MediaRecorderOptions = { mimeType: supportedMimeType };
      
      try {
        recorderOptions.videoBitsPerSecond = safeBitrate;
        recorderOptions.audioBitsPerSecond = 128000;
      } catch {
        console.warn('[CAMERA] Bitrate configuration not supported, using defaults');
      }
      
      const mediaRecorder = new MediaRecorder(streamRef.current, recorderOptions);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: supportedMimeType });
        setRecordedBlob(blob);
        setIsPreviewing(true);
        
        if (previewRef.current) {
          previewRef.current.src = URL.createObjectURL(blob);
        }
        
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingDuration(0);
      
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Failed",
        description: "Failed to start video recording. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const retake = () => {
    setRecordedBlob(null);
    setIsPreviewing(false);
    setRecordingDuration(0);
    chunksRef.current = [];
    startCamera();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpload = async () => {
    if (!recordedBlob || !user || !supportedMimeType) return;

    setUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(10);
    
    try {
      const fileExt = supportedMimeType.includes('mp4') ? 'mp4' : 'webm';
      
      const file = new File([recordedBlob], `recording-${Date.now()}.${fileExt}`, {
        type: supportedMimeType
      });

      setUploadProgress(30);

      const filePath = `videos/${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setUploadProgress(60);
      setUploadStatus("processing");

      const { data: session, error: sessionError } = await (supabase
        .from('motion_analysis_sessions' as any)
        .insert({
          user_id: user.id,
          title: title || `Video Recording - ${new Date().toLocaleDateString()}`,
          description: description,
          video_file_path: filePath,
          sport_type: 'table-tennis',
          media_type: 'video',
          analysis_status: 'pending'
        })
        .select()
        .single() as any);

      if (sessionError) throw sessionError;

      setUploadProgress(100);
      setUploadStatus("complete");

      toast({
        title: "Upload Successful",
        description: "Your video recording has been uploaded.",
      });

      stopCamera();
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setUploadStatus("idle");
        onComplete(session);
      }, 1500);

    } catch (error: any) {
      console.error('Error uploading video:', error);
      console.error('Full error details:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        error: error
      });
      setUploadStatus("error");
      
      let errorMessage = error?.message || error?.error_description || "Failed to upload video. Please try again.";
      
      // Check for RLS policy violation
      if (errorMessage.includes('row-level security') || errorMessage.includes('RLS') || errorMessage.includes('policy')) {
        errorMessage = `Storage Policy Error: ${errorMessage}. Storage policies have been updated - please hard refresh (Ctrl+Shift+R) and try again.`;
      }
      
      // Check for storage bucket errors
      if (errorMessage.includes('bucket') || errorMessage.includes('storage') || errorMessage.includes('permission')) {
        errorMessage = `Storage Error: ${errorMessage}. Please check storage bucket permissions.`;
      }
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 10000
      });
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setUploadStatus("idle");
      }, 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {!isPreviewing && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Quality
          </Button>
        )}
      </div>

      {showSettings && !isPreviewing && (
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <Label>Video Quality</Label>
          <Select value={videoQuality} onValueChange={(v) => setVideoQuality(v as VideoQuality)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="720p">720p HD (Recommended)</SelectItem>
              <SelectItem value="1080p">1080p Full HD</SelectItem>
              <SelectItem value="4k">4K Ultra HD</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Higher quality = larger file size. 1080p is recommended for most devices.
          </p>
        </div>
      )}

      {!isMediaRecorderSupported && (
        <Alert variant="destructive">
          <AlertDescription>
            Video recording is not supported in your browser. Please use a modern browser like Chrome, Firefox, or Edge.
          </AlertDescription>
        </Alert>
      )}

      {isMediaRecorderSupported && (
        <div className="space-y-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {!isPreviewing ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={previewRef}
                controls
                className="w-full h-full object-cover"
              />
            )}
            
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-mono">
                  {formatDuration(recordingDuration)}
                </span>
              </div>
            )}
            
            {!isPreviewing && hasPermission && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full">
                <span className="text-white text-xs">
                  {videoQuality} • {qualitySettings[videoQuality].frameRate}fps
                </span>
              </div>
            )}
          </div>

          {uploading && (
            <UploadProgressBar
              progress={uploadProgress}
              status={uploadStatus}
              showPercentage={true}
            />
          )}

          {!isPreviewing && hasPermission && (
            <div className="flex justify-center">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full w-20 h-20"
                >
                  <Video className="h-8 w-8" />
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full w-20 h-20 animate-pulse"
                >
                  <Square className="h-8 w-8" />
                </Button>
              )}
            </div>
          )}

          {isPreviewing && recordedBlob && !uploading && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={retake} className="flex-1">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Retake
                </Button>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="video-title">Title</Label>
                  <Input
                    id="video-title"
                    placeholder="Name your recording"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video-description">Description (Optional)</Label>
                  <Textarea
                    id="video-description"
                    placeholder="Add notes about what you want analyzed..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleUpload}
                  className="w-full bg-tt-orange hover:bg-orange-600 text-white"
                  disabled={uploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Recording
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraVideoRecorder;
