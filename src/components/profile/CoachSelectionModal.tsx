import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Coach {
  id: string;
  user_id: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  profile_image?: string;
}

interface CoachSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  videoTitle: string;
  currentCoaches: Array<{ id: string; display_name: string; }>;
  onCoachesUpdated: () => void;
}

const CoachSelectionModal = ({ 
  isOpen, 
  onClose, 
  videoId, 
  videoTitle, 
  currentCoaches,
  onCoachesUpdated 
}: CoachSelectionModalProps) => {
  const [availableCoaches, setAvailableCoaches] = useState<Coach[]>([]);
  const [selectedCoachIds, setSelectedCoachIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchAvailableCoaches();
      // Map current coaches to their IDs (which are user_ids in the video_coaches table)
      const currentCoachUserIds = currentCoaches.map(coach => coach.id);
    //   console.log('Setting selected coach IDs:', currentCoachUserIds);
      setSelectedCoachIds(currentCoachUserIds);
    }
  }, [isOpen, currentCoaches]);

  const fetchAvailableCoaches = async () => {
    setLoading(true);
    try {
      // Get current user and their sport
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: currentUserProfile, error: profileError } = await supabase
        .from('profiles')
        .select('sport_id')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Fetch coach user IDs first
      const { data: coachRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'coach');

      if (rolesError) {
        console.error('Error fetching coach roles:', rolesError);
        toast({
          title: "Error",
          description: "Failed to load coaches. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!coachRoles || coachRoles.length === 0) {
        setAvailableCoaches([]);
        return;
      }

      const coachUserIds = coachRoles.map(role => role.user_id);

      // Fetch coach profiles filtered by sport and include profile images
      const { data: coaches, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, display_name, bio, avatar_url, profile_image')
        .in('user_id', coachUserIds)
        .eq('sport_id', currentUserProfile.sport_id);

      if (profilesError) {
        console.error('Error fetching coach profiles:', profilesError);
        toast({
          title: "Error",
          description: "Failed to load coaches. Please try again.",
          variant: "destructive",
        });
        return;
      }

    //   console.log('Available coaches fetched:', coaches);
      setAvailableCoaches(coaches || []);
    } catch (error) {
      console.error('Error fetching coaches:', error);
      toast({
        title: "Error",
        description: "Failed to load coaches. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCoachToggle = (coachId: string) => {
    setSelectedCoachIds(prev => 
      prev.includes(coachId) 
        ? prev.filter(id => id !== coachId)
        : [...prev, coachId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const currentCoachIds = currentCoaches.map(coach => coach.id);
      
      // Find coaches to add and remove
      const coachesToAdd = selectedCoachIds.filter(id => !currentCoachIds.includes(id));
      const coachesToRemove = currentCoachIds.filter(id => !selectedCoachIds.includes(id));

      // Remove coaches
      if (coachesToRemove.length > 0) {
        const { error: removeError } = await supabase
          .from('video_coaches')
          .delete()
          .eq('video_id', videoId)
          .in('coach_id', coachesToRemove);

        if (removeError) {
          console.error('Error removing coaches:', removeError);
          toast({
            title: "Error",
            description: "Failed to remove some coaches. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      // Add new coaches
      if (coachesToAdd.length > 0) {
        const coachAssignments = coachesToAdd.map(coachId => ({
          video_id: videoId,
          coach_id: coachId
        }));

        const { error: addError } = await supabase
          .from('video_coaches')
          .upsert(coachAssignments, { 
            onConflict: 'video_id,coach_id',
            ignoreDuplicates: false 
          });

        if (addError) {
          console.error('Error adding coaches:', addError);
          toast({
            title: "Error",
            description: "Failed to add some coaches. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      // Mark video as analyzed when coaches are assigned or updated so they can see it
      if (selectedCoachIds.length > 0) {
        // console.log('Marking video as analyzed for video ID:', videoId);
        const { error: updateError } = await supabase
          .from('videos')
          .update({ analyzed: true })
          .eq('id', videoId);

        if (updateError) {
        //   console.error("Failed to mark video as analyzed:", updateError);
          toast({
            title: "Warning",
            description: "Video assigned successfully but may not appear in coach's analyzed tab immediately.",
            variant: "destructive",
          });
        } else {
        //   console.log('Successfully marked video as analyzed');
        }
      } else if (selectedCoachIds.length === 0 && currentCoaches.length > 0) {
        // If all coaches were removed, mark video as not analyzed
        // console.log('Marking video as not analyzed for video ID:', videoId);
        const { error: updateError } = await supabase
          .from('videos')
          .update({ analyzed: false })
          .eq('id', videoId);

        if (updateError) {
          console.error("Failed to mark video as not analyzed:", updateError);
        } else {
          console.log('Successfully marked video as not analyzed');
        }
      }

      toast({
        title: "Success",
        description: "Coach assignments updated successfully.",
      });

      onCoachesUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating coach assignments:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Coaches</DialogTitle>
          <DialogDescription>
            Select coaches to assign to "{videoTitle}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading coaches...</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {availableCoaches.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No coaches available
                </p>
              ) : (
                availableCoaches.map((coach) => (
                  <div key={coach.user_id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id={coach.user_id}
                      checked={selectedCoachIds.includes(coach.user_id)}
                      onCheckedChange={() => handleCoachToggle(coach.user_id)}
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={coach.avatar_url || coach.profile_image || ''} 
                        alt={coach.display_name || 'Coach'} 
                      />
                      <AvatarFallback>
                        {coach.display_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <label
                        htmlFor={coach.user_id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {coach.display_name}
                      </label>
                      {coach.bio && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {coach.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="min-w-[80px]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoachSelectionModal;