import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Video, ArrowLeft, Upload, Loader2 } from "lucide-react";

interface LibraryUploaderProps {
  onBack: () => void;
  onComplete: (data: any) => void;
}

const LibraryUploader = ({ onBack, onComplete }: LibraryUploaderProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type (video formats)
      const allowedTypes = [
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'video/x-msvideo',
        'video/avi'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file (MP4, WebM, MOV, AVI).",
          variant: "destructive"
        });
        return;
      }
      
      // 500MB limit for videos
      if (file.size > 500 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a video smaller than 500MB.",
          variant: "destructive"
        });
        return;
      }
      
      setVideoFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Auto-fill title from filename if empty
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
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
    try {
      // Upload to Supabase Storage
      const fileExt = videoFile.name.split('.').pop();
      const filePath = `videos/${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, videoFile);

      if (uploadError) throw uploadError;

      // Create session entry for the video with media_type
      const { data: session, error: sessionError } = await supabase
        .from('motion_analysis_sessions')
        .insert({
          user_id: user.id,
          title: title || videoFile.name,
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
        description: "Your video has been uploaded and is ready for analysis.",
      });

      onComplete(session);

    } catch (error: any) {
      console.error('Error uploading video:', error);
      const errorMessage = error?.message || error?.error_description || "Failed to upload video. Please try again.";
      toast({
        title: "Upload Failed",
        description: errorMessage,
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

      <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        uploading ? 'border-blue-500 bg-blue-50' : 
        videoFile ? 'border-green-500 bg-green-50' : 
        'border-gray-300 hover:border-tt-blue'
      }`}>
        {!videoFile ? (
          <div className="space-y-4">
            <Video className="h-12 w-12 text-gray-500 mx-auto" />
            <div>
              <p className="text-gray-600">
                Upload a video from your device for analysis
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Supports MP4, WebM, MOV, AVI up to 500MB
              </p>
            </div>
            <Button type="button" variant="outline" className="relative">
              Select Video
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/avi"
                onChange={handleFileChange}
              />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {previewUrl && (
              <video
                src={previewUrl}
                controls
                className="w-full max-h-64 rounded-lg mx-auto"
              />
            )}
            <div>
              <p className="font-medium">{videoFile.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => {
                setVideoFile(null);
                setPreviewUrl(null);
              }}
            >
              Remove
            </Button>
          </div>
        )}
      </div>

      {videoFile && (
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
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LibraryUploader;
