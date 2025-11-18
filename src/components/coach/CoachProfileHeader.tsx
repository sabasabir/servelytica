
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CoachProfileHeaderProps {
  coach: {
    name: string;
    username: string;
    profileImage: string;
    specialties: Array<{ name: string; proficiency: string }>;
  };
  isEditing: boolean;
  previewImage: string | null;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CoachProfileHeader = ({
  coach,
  isEditing,
  previewImage,
  handleEdit,
  handleCancel,
  handleSave,
  handleImageUpload
}: CoachProfileHeaderProps) => {
  const { user: authUser } = useAuth();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="relative group mb-4 flex justify-center">
        <Avatar className="h-32 w-32">
          <AvatarImage 
            src={previewImage || coach.profileImage || ""} 
            alt={coach.name} 
            className="object-cover"
          />
          <AvatarFallback className="bg-tt-orange text-white text-2xl">
            {coach.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Label 
              htmlFor="coach-profile-image" 
              className="bg-black bg-opacity-50 rounded-full p-3 cursor-pointer hover:bg-opacity-70 transition-all"
            >
              <Upload className="h-6 w-6 text-white" />
              <span className="sr-only">Upload profile picture</span>
            </Label>
            <Input 
              type="file" 
              id="coach-profile-image" 
              accept="image/*"
              className="hidden" 
              onChange={handleImageUpload}
            />
          </div>
        )}
      </div>
      
      <h2 className="text-xl font-bold mb-1">{coach.name}</h2>
      <div className="text-gray-600 mb-2 flex items-center justify-center gap-1">
        <Mail className="h-4 w-4" /> 
        {authUser?.email || "No email"}
      </div>
      <p className="text-gray-500 text-sm mb-4">@{coach.username}</p>
      
      <div className="flex justify-center space-x-2 flex-wrap mb-4">
        {coach.specialties.map((specialty, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
          >
            {specialty.name}
          </span>
        ))}
      </div>
      
      {/* Edit button removed as per user request */}
      
      {isEditing && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-tt-blue hover:bg-blue-700 text-white"
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoachProfileHeader;
