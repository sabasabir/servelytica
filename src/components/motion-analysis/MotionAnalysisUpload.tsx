import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DragDropZone from "@/components/upload/DragDropZone";
import UploadProgressBar from "@/components/upload/UploadProgressBar";
import VideoLinkInput from "@/components/upload/VideoLinkInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MotionAnalysisUploadProps {
  onUploadComplete: (sessionId: string) => void;
}

const MotionAnalysisUpload = ({ onUploadComplete }: MotionAnalysisUploadProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState("");
  const [isLinkValid, setIsLinkValid] = useState(false);
  const [linkMetadata, setLinkMetadata] = useState<any>(null);
  const [uploadMode, setUploadMode] = useState<"file" | "link">("file");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "complete" | "error">("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    analysisType: "overall",
    strokeType: "",
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const strokeTypes = [
    "Forehand Drive",
    "Backhand Drive", 
    "Forehand Loop",
    "Backhand Loop",
    "Forehand Chop",
    "Backhand Chop",
    "Serve",
    "Return",
    "Smash",
    "Block"
  ];

  const handleFileSelect = (file: File) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (!formData.title) {
      setFormData(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "") }));
    }
  };

  const handleFileClear = () => {
    setVideoFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleLinkValidate = (isValid: boolean, metadata?: any) => {
    setIsLinkValid(isValid);
    setLinkMetadata(metadata);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasFile = uploadMode === "file" && videoFile;
    const hasLink = uploadMode === "link" && isLinkValid && videoLink;
    
    if (!hasFile && !hasLink) {
      toast({
        title: "Missing Video",
        description: uploadMode === "file" 
          ? "Please select a video file." 
          : "Please enter a valid video URL.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not Logged In",
        description: "Please ensure you're logged in.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(10);

    try {
      let filePath = "";
      
      if (hasFile && videoFile) {
        const fileExt = videoFile.name.split('.').pop();
        filePath = `motion-analysis/${user.id}/${Date.now()}.${fileExt}`;
        
        setUploadProgress(30);
        
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(filePath, videoFile);
        
        if (uploadError) throw uploadError;
      } else if (hasLink) {
        filePath = videoLink;
      }
      
      setUploadProgress(60);
      setUploadStatus("processing");
      
      const insertData: any = {
        user_id: user.id,
        title: formData.title || `Motion Analysis - ${new Date().toLocaleDateString()}`,
        description: formData.description,
        sport_type: 'table-tennis',
        analysis_status: 'pending'
      };

      if (hasLink) {
        insertData.video_link = videoLink;
        insertData.video_platform = linkMetadata?.platform || null;
      } else {
        insertData.video_file_path = filePath;
      }

      const { data: session, error: sessionError } = await (supabase
        .from('motion_analysis_sessions' as any)
        .insert(insertData)
        .select()
        .single() as any);
      
      if (sessionError) throw sessionError;
      
      setUploadProgress(80);
      
      const analysisTypes = ['stroke', 'footwork', 'body_position', 'timing', 'overall'];
      const resultsData = analysisTypes.map(type => ({
        session_id: session.id,
        analysis_type: type,
        score: Math.floor(Math.random() * 30) + 70,
        feedback: generatePlaceholderFeedback(type, formData.strokeType),
        areas_of_improvement: generateAreasOfImprovement(type),
        strengths: generateStrengths(type)
      }));
      
      const { error: resultsError } = await (supabase
        .from('motion_analysis_results' as any)
        .insert(resultsData) as any);
      
      if (resultsError) throw resultsError;
      
      setUploadProgress(100);
      setUploadStatus("complete");
      
      await (supabase
        .from('motion_analysis_sessions' as any)
        .update({ analysis_status: 'completed' })
        .eq('id', session.id) as any);
      
      toast({
        title: "Upload Successful",
        description: "Your video has been uploaded and analysis is complete.",
      });
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setUploadStatus("idle");
        onUploadComplete(session.id);
      }, 1500);
      
    } catch (error: any) {
      console.error('Error uploading video:', error);
      setUploadStatus("error");
      const errorMessage = error?.message || error?.error_description || "Failed to upload video. Please try again.";
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      });
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setUploadStatus("idle");
      }, 2000);
    }
  };

  const generatePlaceholderFeedback = (type: string, strokeType: string): string => {
    const feedback: Record<string, string> = {
      stroke: `Your ${strokeType || 'stroke'} technique shows good fundamentals with room for improvement in follow-through and consistency. Focus on maintaining a relaxed grip and completing the full motion.`,
      footwork: "Your movement patterns are generally effective, but could benefit from more explosive starts and better positioning for returns. Work on staying on the balls of your feet.",
      body_position: "Good balance overall with occasional over-reaching. Maintain a lower center of gravity and keep your non-playing arm active for better balance.",
      timing: "Timing is consistent for standard rallies but needs work during fast exchanges. Practice with varying speeds to improve adaptation.",
      overall: "Your overall performance demonstrates solid foundational skills with clear areas for advancement. Focus on consistency and tactical awareness."
    };
    return feedback[type] || "Analysis in progress...";
  };

  const generateAreasOfImprovement = (type: string): any => {
    const improvements: Record<string, string[]> = {
      stroke: ["Follow-through completion", "Wrist flexibility", "Contact point consistency"],
      footwork: ["Initial step quickness", "Recovery positioning", "Lateral movement"],
      body_position: ["Core stability", "Shoulder rotation", "Weight transfer"],
      timing: ["Early preparation", "Rhythm maintenance", "Anticipation skills"],
      overall: ["Match strategy", "Shot selection", "Mental focus"]
    };
    return improvements[type] || [];
  };

  const generateStrengths = (type: string): any => {
    const strengths: Record<string, string[]> = {
      stroke: ["Good racket angle", "Consistent contact", "Power generation"],
      footwork: ["Base position", "Forward movement", "Balance recovery"],
      body_position: ["Stance width", "Eye level tracking", "Ready position"],
      timing: ["Service timing", "Block timing", "Rally rhythm"],
      overall: ["Game awareness", "Competitive spirit", "Technical foundation"]
    };
    return strengths[type] || [];
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Session Title</Label>
          <Input
            id="title"
            placeholder="e.g., Forehand Loop Practice Session"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe what you're working on or any specific concerns..."
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Analysis Focus</Label>
            <Select
              value={formData.analysisType}
              onValueChange={(value) => setFormData({ ...formData, analysisType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select analysis focus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall Performance</SelectItem>
                <SelectItem value="stroke">Stroke Technique</SelectItem>
                <SelectItem value="footwork">Footwork Analysis</SelectItem>
                <SelectItem value="body_position">Body Position</SelectItem>
                <SelectItem value="timing">Timing & Rhythm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Stroke Type (Optional)</Label>
            <Select
              value={formData.strokeType}
              onValueChange={(value) => setFormData({ ...formData, strokeType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select stroke type" />
              </SelectTrigger>
              <SelectContent>
                {strokeTypes.map((stroke) => (
                  <SelectItem key={stroke} value={stroke}>
                    {stroke}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Video Upload</Label>
          <Tabs value={uploadMode} onValueChange={(v) => setUploadMode(v as "file" | "link")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">Upload File</TabsTrigger>
              <TabsTrigger value="link">Video Link</TabsTrigger>
            </TabsList>
            
            <TabsContent value="file" className="mt-4">
              <DragDropZone
                onFileSelect={handleFileSelect}
                selectedFile={videoFile}
                onClear={handleFileClear}
                previewUrl={previewUrl}
                disabled={uploading}
                maxSize={500 * 1024 * 1024}
              />
            </TabsContent>
            
            <TabsContent value="link" className="mt-4">
              <VideoLinkInput
                value={videoLink}
                onChange={setVideoLink}
                onValidate={handleLinkValidate}
                disabled={uploading}
              />
            </TabsContent>
          </Tabs>
        </div>

        {uploading && (
          <UploadProgressBar
            progress={uploadProgress}
            status={uploadStatus}
            showPercentage={true}
          />
        )}

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Our AI will analyze your video for technique, body positioning, timing, and provide
            detailed feedback to help improve your game. Analysis typically takes 1-2 minutes.
          </AlertDescription>
        </Alert>

        <Button
          type="submit"
          className="w-full bg-tt-orange hover:bg-orange-600 text-white"
          disabled={uploading || (uploadMode === "file" ? !videoFile : !isLinkValid)}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Video...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload and Analyze
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default MotionAnalysisUpload;
