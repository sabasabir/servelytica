import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CreateProfileModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateProfileModal = ({ open, onClose, onSuccess }: CreateProfileModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sports, setSports] = useState<Array<{id: string, name: string}>>([]);
  
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
    location: '',
    playingExperience: '',
    preferredPlayStyle: '',
    sportId: '',
  });

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const { data } = await supabase.from('sports').select('id, name').order('name');
      if (data) setSports(data);
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateProfile = async () => {
    if (!user) return;
    
    if (!formData.displayName.trim() || !formData.username.trim()) {
      toast({
        title: "Validation Error",
        description: "Display name and username are required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        userId: user.id,
        displayName: formData.displayName,
        username: formData.username,
        bio: formData.bio || null,
        location: formData.location || null,
        playingExperience: formData.playingExperience || null,
        preferredPlayStyle: formData.preferredPlayStyle || null,
        sportId: formData.sportId || null,
      };

      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      toast({
        title: "Success!",
        description: "Profile created successfully",
      });

      setFormData({
        displayName: '',
        username: '',
        bio: '',
        location: '',
        playingExperience: '',
        preferredPlayStyle: '',
        sportId: '',
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Your Profile</DialogTitle>
          <DialogDescription>
            Set up your profile to get started on Servelytica
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              name="displayName"
              placeholder="Your name"
              value={formData.displayName}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              name="username"
              placeholder="Your username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          {/* Sport */}
          <div className="space-y-2">
            <Label htmlFor="sportId">Sport</Label>
            <Select 
              value={formData.sportId} 
              onValueChange={(value) => handleSelectChange('sportId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your sport" />
              </SelectTrigger>
              <SelectContent>
                {sports.map(sport => (
                  <SelectItem key={sport.id} value={sport.id}>
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Your location"
              value={formData.location}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          {/* Playing Experience */}
          <div className="space-y-2">
            <Label htmlFor="playingExperience">Playing Experience</Label>
            <Select 
              value={formData.playingExperience} 
              onValueChange={(value) => handleSelectChange('playingExperience', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Play Style */}
          <div className="space-y-2">
            <Label htmlFor="preferredPlayStyle">Preferred Play Style</Label>
            <Select 
              value={formData.preferredPlayStyle} 
              onValueChange={(value) => handleSelectChange('preferredPlayStyle', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your play style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aggressive">Aggressive</SelectItem>
                <SelectItem value="defensive">Defensive</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="tactical">Tactical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProfile}
              disabled={loading}
              className="flex-1 bg-tt-orange hover:bg-orange-600"
            >
              {loading ? 'Creating...' : 'Create Profile'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfileModal;
