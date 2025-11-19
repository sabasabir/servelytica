import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Mic, Square, Play, Pause, RotateCcw, ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AudioRecorderProps {
  onBack: () => void;
  onComplete: (data: any) => void;
}

const AudioRecorder = ({ onBack, onComplete }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [supportedMimeType, setSupportedMimeType] = useState<string | null>(null);
  const [isMediaRecorderSupported, setIsMediaRecorderSupported] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const getSupportedMimeType = (): string | null => {
    if (!window.MediaRecorder) {
      setIsMediaRecorderSupported(false);
      return null;
    }

    const mimeTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/mpeg',
      'audio/ogg;codecs=opus'
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
        title: "Audio Recording Not Supported",
        description: "Your browser doesn't support audio recording. Please try using a different browser.",
        variant: "destructive"
      });
    }
  }, []);

  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setHasPermission(false);
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to record audio.",
        variant: "destructive"
      });
    }
  };

  const startRecording = async () => {
    if (!supportedMimeType) {
      toast({
        title: "Recording Not Available",
        description: "Audio recording is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, {
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
        
        if (audioRef.current) {
          audioRef.current.src = URL.createObjectURL(blob);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setHasPermission(true);
      setRecordingTime(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Failed",
        description: "Failed to start audio recording. Please check microphone permissions.",
        variant: "destructive"
      });
      setHasPermission(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const retake = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    chunksRef.current = [];
    if (audioRef.current) {
      audioRef.current.src = '';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpload = async () => {
    if (!recordedBlob || !user || !supportedMimeType) return;

    setUploading(true);
    try {
      // Determine file extension based on MIME type
      let fileExt = 'webm';
      if (supportedMimeType.includes('mp4')) fileExt = 'mp4';
      else if (supportedMimeType.includes('mpeg')) fileExt = 'mp3';
      else if (supportedMimeType.includes('ogg')) fileExt = 'ogg';

      const file = new File([recordedBlob], `audio-${Date.now()}.${fileExt}`, {
        type: supportedMimeType
      });

      // Upload to Supabase Storage with proper path
      const filePath = `audio/${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create session entry for the audio with media_type
      const { data: session, error: sessionError } = await supabase
        .from('motion_analysis_sessions')
        .insert({
          user_id: user.id,
          title: title || `Audio Note - ${new Date().toLocaleDateString()}`,
          description: description,
          video_file_path: filePath,
          sport_type: 'table-tennis',
          media_type: 'audio',
          analysis_status: 'completed'
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      toast({
        title: "Upload Successful",
        description: "Your audio recording has been uploaded.",
      });

      onComplete(session);

    } catch (error) {
      console.error('Error uploading audio:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload audio. Please try again.",
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

      {hasPermission === false && (
        <Alert variant="destructive">
          <AlertDescription>
            Microphone permission required. Please allow microphone access to continue.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
            <Mic className={`h-12 w-12 ${isRecording ? 'text-red-600 animate-pulse' : 'text-red-500'}`} />
          </div>

          <div className="text-2xl font-mono font-bold">
            {formatTime(recordingTime)}
          </div>

          {isRecording && (
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
              Recording...
            </div>
          )}
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />

      <div className="flex gap-2 justify-center flex-wrap">
        {!recordedBlob && !isRecording && (
          <Button
            onClick={hasPermission ? startRecording : requestPermission}
            className="bg-tt-orange hover:bg-orange-600 text-white"
          >
            <Mic className="mr-2 h-4 w-4" />
            {hasPermission === null ? 'Allow Microphone' : 'Start Recording'}
          </Button>
        )}

        {isRecording && (
          <Button onClick={stopRecording} variant="destructive">
            <Square className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        )}

        {recordedBlob && (
          <>
            {!isPlaying ? (
              <Button onClick={playAudio} variant="outline">
                <Play className="mr-2 h-4 w-4" />
                Play
              </Button>
            ) : (
              <Button onClick={pauseAudio} variant="outline">
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            )}
            <Button onClick={retake} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake
            </Button>
          </>
        )}
      </div>

      {recordedBlob && (
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="audio-title">Title</Label>
            <Input
              id="audio-title"
              placeholder="Give your audio note a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audio-description">Description (Optional)</Label>
            <Textarea
              id="audio-description"
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
                Upload Audio
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
