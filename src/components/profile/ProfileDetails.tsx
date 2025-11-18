
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";
import { ProfileData } from "@/services/profileService";

interface ProfileDetailsProps {
  user: ProfileData;
  isEditing: boolean;
  editedUser: Partial<ProfileData>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCancel: () => void;
  handleSave: () => void;
}

const ProfileDetails = ({ 
  user, 
  isEditing, 
  editedUser, 
  handleChange, 
  handleCancel, 
  handleSave 
}: ProfileDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>
          Manage your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input 
                id="display_name" 
                name="display_name" 
                value={editedUser.display_name || ""} 
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                name="username" 
                value={editedUser.username || ""} 
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                value={editedUser.bio || ""} 
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location" 
                value={editedUser.location || ""} 
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={editedUser.phone || ""} 
                onChange={handleChange}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-600">Display Name</h3>
              <p>{user.display_name || "Not set"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Username</h3>
              <p>@{user.username || "Not set"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Bio</h3>
              <p>{user.bio || "No bio provided"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Location</h3>
              <p>{user.location || "Not set"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Phone</h3>
              <p>{user.phone || "Not set"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Role</h3>
              <p className="capitalize">{user.role || "Player"}</p>
            </div>
          </div>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-tt-blue hover:bg-tt-blue/90"
          >
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProfileDetails;
