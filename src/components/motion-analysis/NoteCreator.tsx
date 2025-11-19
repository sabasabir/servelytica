import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FileText, ArrowLeft, Save, Loader2 } from "lucide-react";

interface NoteCreatorProps {
  onBack: () => void;
  onComplete: (data: any) => void;
}

const NoteCreator = ({ onBack, onComplete }: NoteCreatorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !user) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for your note.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      // Create a note session entry with media_type
      const { data: session, error: sessionError } = await supabase
        .from('motion_analysis_sessions')
        .insert({
          user_id: user.id,
          title: title,
          description: content,
          sport_type: 'table-tennis',
          media_type: 'note',
          analysis_status: 'completed'
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      toast({
        title: "Note Saved",
        description: "Your note has been saved successfully.",
      });

      onComplete(session);

    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save note. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-6 w-6 text-yellow-600" />
          <h3 className="text-lg font-semibold">Create Note</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              placeholder="e.g., Training Session Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note-content">Content</Label>
            <Textarea
              id="note-content"
              placeholder="Write your notes here... (technique observations, goals, reminders, etc.)"
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-gray-500">
              {content.length} characters
            </p>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-tt-orange hover:bg-orange-600 text-white"
            disabled={saving || !title.trim() || !content.trim()}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Note
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoteCreator;
