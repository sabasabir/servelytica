import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Check, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MotionAnalysisUploadProps {
  onUploadComplete: (sessionId: string) => void;
}

const MotionAnalysisUpload = ({ onUploadComplete }: MotionAnalysisUploadProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 500 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a video smaller than 500MB.",
          variant: "destructive"
        });
        return;
      }
      
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile || !user) {
      toast({
        title: "Missing Information",
        description: "Please select a video file and ensure you're logged in.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      // Upload video to storage
      const fileExt = videoFile.name.split('.').pop();
      const filePath = `motion-analysis/${user.id}/${Date.now()}.${fileExt}`;
      
      setUploadProgress(30);
      
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, videoFile);
      
      if (uploadError) throw uploadError;
      
      setUploadProgress(60);
      
      // Create motion analysis session
      const { data: session, error: sessionError } = await supabase
        .from('motion_analysis_sessions')
        .insert({
          user_id: user.id,
          title: formData.title || `Motion Analysis - ${new Date().toLocaleDateString()}`,
          description: formData.description,
          video_file_path: filePath,
          sport_type: 'table-tennis',
          analysis_status: 'pending'
        })
        .select()
        .single();
      
      if (sessionError) throw sessionError;
      
      setUploadProgress(80);
      
      // Create placeholder results (in real app, this would be done by AI service)
      const analysisTypes = ['stroke', 'footwork', 'body_position', 'timing', 'overall'];
      const resultsData = analysisTypes.map(type => ({
        session_id: session.id,
        analysis_type: type,
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        feedback: generatePlaceholderFeedback(type, formData.strokeType),
        areas_of_improvement: generateAreasOfImprovement(type),
        strengths: generateStrengths(type)
      }));
      
      const { error: resultsError } = await supabase
        .from('motion_analysis_results')
        .insert(resultsData);
      
      if (resultsError) throw resultsError;
      
      setUploadProgress(100);
      
      // Update session status
      await supabase
        .from('motion_analysis_sessions')
        .update({ analysis_status: 'completed' })
        .eq('id', session.id);
      
      toast({
        title: "Upload Successful",
        description: "Your video has been uploaded and analysis is complete.",
      });
      
      onUploadComplete(session.id);
      
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
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
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Session Title</Label>
          <Input
            id="title"
            placeholder="e.g., Forehand Loop Practice Session"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Description */}
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

        {/* Analysis Type */}
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

        {/* Video Upload */}
        <div className="space-y-2">
          <Label>Video Upload</Label>
          <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            uploading ? 'border-blue-500 bg-blue-50' : 
            videoFile ? 'border-green-500 bg-green-50' : 
            'border-gray-300 hover:border-tt-blue'
          }`}>
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
                <div>
                  <p className="font-medium">Uploading and analyzing...</p>
                  <Progress value={uploadProgress} className="mt-4" />
                  <p className="text-sm text-gray-500 mt-2">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : !videoFile ? (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-gray-500 mx-auto" />
                <div>
                  <p className="text-gray-600">
                    Drag and drop your video here, or click to browse
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Supports MP4, MOV, AVI up to 500MB
                  </p>
                </div>
                <Button type="button" variant="outline" className="relative">
                  Select Video
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Check className="h-12 w-12 text-green-500 mx-auto" />
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
                  onClick={() => setVideoFile(null)}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Our AI will analyze your video for technique, body positioning, timing, and provide
            detailed feedback to help improve your game. Analysis typically takes 1-2 minutes.
          </AlertDescription>
        </Alert>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-tt-orange hover:bg-orange-600 text-white"
          disabled={uploading || !videoFile}
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