import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Coach {
  id?: string;
  display_name?: string;
  years_coaching?: number;
  bio?: string;
}

const AdminCoachForm = ({
  coach,
  onClose,
  onSave
}: {
  coach: Coach | null;
  onClose: () => void;
  onSave: () => void;
}) => {
  const [formData, setFormData] = useState({
    display_name: coach?.display_name || "",
    years_coaching: coach?.years_coaching || 0,
    bio: coach?.bio || ""
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (coach?.id) {
        // Update
        const { error } = await supabase
          .from('coach_profiles')
          .update(formData)
          .eq('id', coach.id);

        if (error) throw error;
        toast({ title: "Success", description: "Coach updated" });
      } else {
        // Create
        const { error } = await supabase
          .from('coach_profiles')
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Success", description: "Coach created" });
      }

      onSave();
    } catch (error) {
      console.error("Error saving coach:", error);
      toast({ title: "Error", description: "Failed to save coach", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{coach ? "Edit Coach" : "Add Coach"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="years_coaching">Years Coaching</Label>
            <Input
              id="years_coaching"
              type="number"
              value={formData.years_coaching}
              onChange={(e) => setFormData({ ...formData, years_coaching: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCoachForm;
