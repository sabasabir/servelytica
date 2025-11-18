
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Mail, Upload } from "lucide-react";
import { ProfileData } from "@/services/profileService";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileCardProps {
  user: ProfileData;
  isEditing: boolean;
  onEdit: () => void;
  previewImage: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileCard = ({ 
  user, 
  isEditing, 
  onEdit, 
  previewImage, 
  handleImageUpload 
}: ProfileCardProps) => {
  const { user: authUser } = useAuth();
  
  return (
    <Card className="md:col-span-1">
      <CardHeader className="flex flex-col items-center">
        <div className="relative group mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage 
              src={previewImage || user.profile_image || user.avatar_url || ""} 
              alt={user.display_name || user.username || "User"} 
              className="object-cover"
            />
            <AvatarFallback className="bg-tt-orange text-white text-xl">
              {(user.display_name || user.username || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Label 
                htmlFor="profileImage" 
                className="bg-black bg-opacity-50 rounded-full p-2 cursor-pointer hover:bg-opacity-70 transition-all"
              >
                <Upload className="h-6 w-6 text-white" />
                <span className="sr-only">Upload profile picture</span>
              </Label>
              <Input 
                type="file" 
                id="profileImage" 
                accept="image/*"
                className="hidden" 
                onChange={handleImageUpload}
              />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl font-bold text-center">{user.display_name || user.username || "User"}</CardTitle>
        <CardDescription className="text-center flex items-center justify-center gap-1">
          <Mail className="h-4 w-4" /> {authUser?.email || "No email"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Username</p>
          <p>@{user.username}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Member Since</p>
          <p>{user.member_since ? new Date(user.member_since).toLocaleDateString() : "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Location</p>
          <p>{user.location}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full border-tt-orange text-tt-orange hover:bg-tt-orange hover:text-white"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-2" /> Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
