import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import DragDropZone from "@/components/upload/DragDropZone";
import UploadProgressBar from "@/components/upload/UploadProgressBar";

interface LibraryUploaderProps {
  onBack: () => void;
  onComplete: (data: any) => void;
}

const LibraryUploader = ({ onBack, onComplete }: LibraryUploaderProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "complete" | "error">("idle");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (file: File) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleFileClear = () => {
    setVideoFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !user) {
      toast({
        title: "Missing Information",
        description: "Please select a video file.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(10);
    
    try {
      const fileExt = videoFile.name.split('.').pop();
      const filePath = `videos/${user.id}/${Date.now()}.${fileExt}`;
      
      setUploadProgress(30);
      
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, videoFile);

      if (uploadError) throw uploadError;

      setUploadProgress(60);
      setUploadStatus("processing");

      const { data: analysisSession, error: sessionError } = await (supabase
        .from('motion_analysis_sessions' as any)
        .insert({
          user_id: user.id,
          title: title || videoFile.name,
          description: description,
          video_file_path: filePath,
          sport_type: 'table-tennis',
          analysis_status: 'pending'
        })
        .select()
        .single() as any);

      if (sessionError) throw sessionError;

      setUploadProgress(100);
      setUploadStatus("complete");

      toast({
        title: "Upload Successful",
        description: "Your video has been uploaded and is ready for analysis.",
      });

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setUploadStatus("idle");
        onComplete(analysisSession);
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
        errorMessage = `RLS Error: ${errorMessage}. RLS has been disabled - please hard refresh (Ctrl+Shift+R) and try again.`;
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
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <DragDropZone
        onFileSelect={handleFileSelect}
        selectedFile={videoFile}
        onClear={handleFileClear}
        previewUrl={previewUrl}
        disabled={uploading}
        maxSize={500 * 1024 * 1024}
      />

      {uploading && (
        <UploadProgressBar
          progress={uploadProgress}
          status={uploadStatus}
          showPercentage={true}
        />
      )}

      {videoFile && !uploading && (
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="video-title">Title</Label>
            <Input
              id="video-title"
              placeholder="Video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-description">Description (Optional)</Label>
            <Textarea
              id="video-description"
              placeholder="Add notes about this video (e.g., what you want analyzed, focus areas)"
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
            Upload Video
          </Button>
        </div>
      )}
    </div>
  );
};

export default LibraryUploader;
