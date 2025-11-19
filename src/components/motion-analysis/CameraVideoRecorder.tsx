import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Video, Square, PlayCircle, ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CameraVideoRecorderProps {
  onBack: () => void;
  onComplete: (data: any) => void;
}

const CameraVideoRecorder = ({ onBack, onComplete }: CameraVideoRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [supportedMimeType, setSupportedMimeType] = useState<string | null>(null);
  const [isMediaRecorderSupported, setIsMediaRecorderSupported] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const getSupportedMimeType = (): string | null => {
    if (!window.MediaRecorder) {
      setIsMediaRecorderSupported(false);
      return null;
    }

    const mimeTypes = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
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
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
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

    try {
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: supportedMimeType
      });
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
      };

      mediaRecorder.start();
      setIsRecording(true);
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
    chunksRef.current = [];
    startCamera();
  };

  const handleUpload = async () => {
    if (!recordedBlob || !user || !supportedMimeType) return;

    setUploading(true);
    try {
      // Determine file extension based on MIME type
      const fileExt = supportedMimeType.includes('mp4') ? 'mp4' : 'webm';
      
      // Convert to File object
      const file = new File([recordedBlob], `recording-${Date.now()}.${fileExt}`, {
        type: supportedMimeType
      });

      // Upload to Supabase Storage with proper path
      const filePath = `videos/${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create motion analysis session with media_type
      const { data: session, error: sessionError } = await supabase
        .from('motion_analysis_sessions')
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
        .single();

      if (sessionError) throw sessionError;

      toast({
        title: "Upload Successful",
        description: "Your video recording has been uploaded.",
      });

      stopCamera();
      onComplete(session);

    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {!isMediaRecorderSupported && (
        <Alert variant="destructive">
          <AlertDescription>
            Video recording is not supported in your browser. Please use a modern browser like Chrome, Firefox, or Edge.
          </AlertDescription>
        </Alert>
      )}

      {!hasPermission && isMediaRecorderSupported && (
        <Alert>
          <AlertDescription>
            Camera permission required. Please allow camera access to continue.
          </AlertDescription>
        </Alert>
      )}

      <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
        {!isPreviewing ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={previewRef}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {isRecording && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full" />
            Recording
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-center">
        {!isPreviewing && !isRecording && (
          <Button
            onClick={startRecording}
            className="bg-tt-orange hover:bg-orange-600 text-white"
            disabled={!hasPermission}
          >
            <Video className="mr-2 h-4 w-4" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <Button
            onClick={stopRecording}
            variant="destructive"
          >
            <Square className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        )}

        {isPreviewing && (
          <>
            <Button
              onClick={retake}
              variant="outline"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Retake
            </Button>
          </>
        )}
      </div>

      {isPreviewing && (
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="video-title">Title</Label>
            <Input
              id="video-title"
              placeholder="Give your recording a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-description">Description (Optional)</Label>
            <Textarea
              id="video-description"
              placeholder="Add notes about this recording"
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
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Recording
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CameraVideoRecorder;
