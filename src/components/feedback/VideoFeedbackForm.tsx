import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VideoData } from "@/services/profileService";

interface VideoFeedbackFormProps {
  video: VideoData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const VideoFeedbackForm = ({ video, onSuccess, onCancel }: VideoFeedbackFormProps) => {
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState<any>(null);
  const [checkingFeedback, setCheckingFeedback] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const { toast } = useToast();

  // Check if feedback already exists for this video-coach combination
  const checkExistingFeedback = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: feedback } = await supabase
        .from('video_feedback')
        .select('*')
        .eq('video_id', video.id)
        .eq('coach_id', user.id)
        .maybeSingle();

      setExistingFeedback(feedback);
    } catch (error) {
      console.error('Error checking existing feedback:', error);
    } finally {
      setCheckingFeedback(false);
    }
  };

  useEffect(() => {
    checkExistingFeedback();
  }, [video.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackText.trim()) {
      toast({
        title: "Error",
        description: "Please enter your feedback",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Error", 
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }


    // Upload selected files to Supabase Storage if any
    const uploadedFiles: string[] = [];
    if (selectedFiles && selectedFiles.length > 0) {
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const filePath = `feedback/${video.id}/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });
        if (uploadError) {
        toast({
          title: "Error",
          description: `Failed to upload file: ${file.name}`,
          variant: "destructive",
        });
        continue;
        }
        uploadedFiles.push(filePath);
      }
    }

      // Submit feedback
      const { error: feedbackError } = await supabase
        .from('video_feedback')
        .insert({
          video_id: video.video_id,
          coach_id: user.id,
          player_id: video.player_id,
          feedback_text: feedbackText.trim(),
          rating: rating,
          video_coaches_id: video.id,
        });

      if (feedbackError) throw feedbackError;

      // Update video coach status to completed
      const { error: statusError, data: videoData } = await supabase
        .from('video_coaches')
        .update({ status: 'completed' })
        // .eq('video_id', video.id)
        .eq('coach_id', user.id);


      if (statusError) throw statusError;

      toast({
        title: "Success",
        description: "Feedback submitted successfully",
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingFeedback) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Checking feedback status...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (existingFeedback) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Feedback Already Submitted
          </CardTitle>
          <CardDescription>
            You have already provided feedback for: {video.title || video.file_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Your Rating</Label>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: existingFeedback.rating || 0 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {existingFeedback.rating} star{existingFeedback.rating > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div>
            <Label>Your Feedback</Label>
            <div className="mt-1 p-3 rounded-md bg-muted">
              {existingFeedback.feedback_text}
            </div>
          </div>

          {onCancel && (
            <div className="pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Close
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Provide Feedback
        </CardTitle>
        <CardDescription>
          Share your analysis and feedback for: {video.title || video.file_name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rating">Rating (1-5 stars)</Label>
            <Select value={rating.toString()} onValueChange={(value) => setRating(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: num }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-2">{num} star{num > 1 ? 's' : ''}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        {/* File select input for .txt, .pdf, .doc, .docx, images */}
        <div>
          <Label htmlFor="files">Attach Files (optional)</Label>
          <input
            id="files"
            type="file"
            multiple
            accept=".txt,.pdf,.doc,.docx,image/*"
            className="mt-1 block w-full"
            onChange={(e) => {
              if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
              }
            }}
          />
        </div>

          <div>
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Provide detailed feedback on technique, areas for improvement, strengths, etc..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={6}
              className="mt-1"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};