
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";

import { ProfileData } from "@/services/profileService";

interface GamePreferencesProps {
  user: ProfileData;
  isEditing: boolean;
  editedUser: Partial<ProfileData>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCancel: () => void;
  handleSave: () => void;
}

const GamePreferences = ({ 
  user, 
  isEditing, 
  editedUser, 
  handleChange, 
  handleCancel, 
  handleSave 
}: GamePreferencesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Preferences</CardTitle>
        <CardDescription>
          Configure your playing preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="playing_experience">Playing Experience</Label>
              <Input 
                id="playing_experience" 
                name="playing_experience" 
                value={editedUser.playing_experience || ""} 
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_play_style">Preferred Play Style</Label>
              <Input 
                id="preferred_play_style" 
                name="preferred_play_style" 
                value={editedUser.preferred_play_style || ""} 
                onChange={handleChange}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-600">Playing Experience</h3>
              <p>{user.playing_experience || "Not set"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-600">Preferred Play Style</h3>
              <p>{user.preferred_play_style || "Not set"}</p>
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

export default GamePreferences;
