
import { MapPin, User, Mail, Phone as PhoneIcon, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface Achievement {
  year: string;
  title: string;
  description: string;
}

interface CoachDetailsProps {
  coach: {
    id: number;
    name: string;
    image: string;
    title: string;
    rating: number;
    reviews: number;
    responseTime: string;
    specialties: string[];
    experience: string;
    category: string;
    achievements: Achievement[];
  };
  isEditing?: boolean;
  editedCoach?: any;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSave?: () => void;
  handleCancel?: () => void;
}

const CoachReviews = ({ coach, isEditing = false, editedCoach, handleChange, handleSave, handleCancel }: CoachDetailsProps) => {
  const { user: authUser } = useAuth();
  
  return (
    <div className="space-y-8">
      {/* Profile Details Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <p className="text-gray-600 mb-6">See your all reviews</p>
        
        {/* {isEditing ? (
          <div className="space-y-6">
            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input 
                id="display_name" 
                name="display_name" 
                value={editedCoach?.display_name || ""} 
                onChange={handleChange}
                placeholder="Your display name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
                <Input 
                  id="username" 
                  name="username" 
                  value={editedCoach?.username || ""} 
                  onChange={handleChange}
                  placeholder="username"
                  className="pl-8 mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                value={editedCoach?.bio || ""} 
                onChange={handleChange}
                className="min-h-[100px] mt-1"
                placeholder="Tell others about yourself..."
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location" 
                value={editedCoach?.location || ""} 
                onChange={handleChange}
                placeholder="City, Country"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={editedCoach?.phone || ""} 
                onChange={handleChange}
                placeholder="Your phone number"
                className="mt-1"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-600">Display Name</h3>
                <p className="text-gray-900">{editedCoach?.display_name || coach.name || "Not specified"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-600">Username</h3>
                <p className="text-gray-900">@{editedCoach?.username || "Not specified"}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-600">Bio</h3>
                <p className="text-gray-900">{editedCoach?.bio || coach.title || "Not specified"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-600">Location</h3>
                <p className="text-gray-900">{editedCoach?.location || "Not specified"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <PhoneIcon className="h-5 w-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-600">Phone</h3>
                <p className="text-gray-900">{editedCoach?.phone || "Not provided"}</p>
              </div>
            </div>
          </div>
        )} */}
      </section>
    </div>
  );
};

export default CoachReviews;
