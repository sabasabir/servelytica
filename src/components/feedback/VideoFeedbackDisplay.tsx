import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Calendar, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Feedback {
  id: string;
  feedback_text: string;
  rating: number;
  created_at: string;
  coach_name?: string;
  coach_username?: string;
}

interface VideoFeedbackDisplayProps {
  videoId: string;
  video?: any;
  className?: string;
}

export const VideoFeedbackDisplay = ({ video, videoId, className }: VideoFeedbackDisplayProps) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

//   console.log({video})

  useEffect(() => {
    loadFeedback();
  }, [videoId]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      
      // Get feedback with coach profile information
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
          *
          `)
          .eq('video_coaches_id', videoId)
          .order('created_at', { ascending: false });
        //   video_coaches_id: video_coaches_id (*)

        // console.log({data})

      if (error) throw error;

      // Get coach profile information for each feedback
      const feedbackWithCoaches = await Promise.all(
        (data || []).map(async (fb) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, username')
            .eq('user_id', fb.coach_id)
            .single();

          return {
            ...fb,
            coach_name: profile?.display_name,
            coach_username: profile?.username,
          };
        })
      );

      setFeedback(feedbackWithCoaches);
    } catch (error) {
      console.error('Error loading feedback:', error);
      toast({
        title: "Error",
        description: "Failed to load feedback",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Coach Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (feedback.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Coach Feedback
          </CardTitle>
          <CardDescription>
            Feedback from your assigned coach will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No feedback yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Your coach will provide feedback and analysis once they've reviewed your video.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Coach Feedback ({feedback.length})
        </CardTitle>
        <CardDescription>
          Analysis and feedback from your assigned coach
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedback.map((fb) => (
          <div key={fb.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {fb.coach_name || fb.coach_username || 'Coach'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: fb.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Badge variant="secondary">{fb.rating}/5</Badge>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed">{fb.feedback_text}</p>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(fb.created_at).toLocaleDateString()} at{' '}
                {new Date(fb.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};