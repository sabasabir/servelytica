
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartLine, FileVideo, Upload } from "lucide-react";
import ProfileDetails from "./ProfileDetails";
import GamePreferences from "./GamePreferences";
import PerformanceMetrics from "./PerformanceMetrics";
import VideosList from "./VideosList";
import VideoUpload from "./VideoUpload";

import { ProfileData, PerformanceMetric, VideoData } from "@/services/profileService";

interface ProfileTabsProps {
  user: ProfileData;
  isEditing: boolean;
  editedUser: Partial<ProfileData>;
  performanceData: PerformanceMetric[];
  videos: VideoData[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCancel: () => void;
  handleSave: () => void;
  onDataUpdate: () => void;
}

const ProfileTabs = ({
  user,
  isEditing,
  editedUser,
  performanceData,
  videos,
  handleChange,
  handleCancel,
  handleSave,
  onDataUpdate
}: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState("details");

  const handleUploadSuccess = () => {
    // Navigate to videos tab and refresh data
    setActiveTab("videos");
    onDataUpdate();
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="details">Profile Details</TabsTrigger>
        <TabsTrigger value="preferences">Game Preferences</TabsTrigger>
        <TabsTrigger value="performance">
          <ChartLine className="h-4 w-4 mr-1 inline-block" />
          Performance
        </TabsTrigger>
        <TabsTrigger value="videos">
          <FileVideo className="h-4 w-4 mr-1 inline-block" />
          My Videos
        </TabsTrigger>
        <TabsTrigger value="upload">
          <Upload className="h-4 w-4 mr-1 inline-block" />
          Upload Video
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="details">
        <ProfileDetails 
          user={user}
          isEditing={isEditing}
          editedUser={editedUser}
          handleChange={handleChange}
          handleCancel={handleCancel}
          handleSave={handleSave}
        />
      </TabsContent>
      
      <TabsContent value="preferences">
        <GamePreferences 
          user={user}
          isEditing={isEditing}
          editedUser={editedUser}
          handleChange={handleChange}
          handleCancel={handleCancel}
          handleSave={handleSave}
        />
      </TabsContent>

      <TabsContent value="performance">
        <PerformanceMetrics performanceData={performanceData} />
      </TabsContent>

      <TabsContent value="videos">
        <VideosList videos={videos} onVideoUpdate={onDataUpdate} />
      </TabsContent>

      <TabsContent value="upload">
        <VideoUpload onUploadSuccess={handleUploadSuccess} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
