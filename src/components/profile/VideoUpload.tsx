import { useState, useEffect } from "react";
import { Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { VideoSubscriptionService } from "@/services/videoSubscriptionService";
import DragDropZone from "@/components/upload/DragDropZone";
import UploadProgressBar from "@/components/upload/UploadProgressBar";
import VideoLinkInput from "@/components/upload/VideoLinkInput";

interface VideoUploadProps {
  onUploadSuccess?: () => void;
}

const VideoUpload = ({ onUploadSuccess }: VideoUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "complete" | "error">("idle");
  const [uploadMode, setUploadMode] = useState<"file" | "link">("link");
  const [isLinkValid, setIsLinkValid] = useState(false);
  const [linkMetadata, setLinkMetadata] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoLink: "",
    focusArea: "",
    coachIds: [] as string[]
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coaches, setCoaches] = useState<Array<{id: string, display_name: string, username: string}>>([]);
  const [quotaInfo, setQuotaInfo] = useState<any>(null);
  const [quotaLoading, setQuotaLoading] = useState(false);

  const focusAreas = [
    "Serve Technique",
    "Backhand",
    "Forehand",
    "Footwork",
    "Match Strategy",
    "Return of Serve",
    "Net Play",
    "Overall Game Analysis"
  ];

  useEffect(() => {
    const checkQuota = async () => {
      if (!user) return;
      
      setQuotaLoading(true);
      try {
        const quota = await VideoSubscriptionService.checkVideoUploadQuota(user.id);
        setQuotaInfo(quota);
      } catch (error) {
        console.error('Error checking quota:', error);
      } finally {
        setQuotaLoading(false);
      }
    };

    checkQuota();
  }, [user]);

  useEffect(() => {
    const fetchCoaches = async () => {
      if (!user) return;
      
      try {
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('sport_id')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return;
        }

        if (!userProfile?.sport_id) {
          console.log("User has no sport selected");
          return;
        }

        const { data: coachRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'coach');

        if (rolesError) {
          console.error("Error fetching coach roles:", rolesError);
          return;
        }

        if (coachRoles && coachRoles.length > 0) {
          const coachUserIds = coachRoles.map((role: any) => role.user_id);
          
          const { data: coachProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('user_id, display_name, username')
            .in('user_id', coachUserIds);

          if (profilesError) {
            console.error("Error fetching coach profiles:", profilesError);
            return;
          }

          if (coachProfiles) {
            const mappedCoaches = coachProfiles.map((coach: any) => ({
              id: coach.user_id,
              display_name: coach.display_name || coach.username || 'Unnamed Coach',
              username: coach.username || ''
            }));
            setCoaches(mappedCoaches);
          }
        } else {
          console.log("No coaches found in user_roles table");
        }
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };

    fetchCoaches();
  }, [user]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (!formData.title) {
      setFormData(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, "") }));
    }
  };

  const handleFileClear = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleLinkValidate = (isValid: boolean, metadata?: any) => {
    setIsLinkValid(isValid);
    setLinkMetadata(metadata);
  };

  const handleUpload = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please ensure you're logged in",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your video",
        variant: "destructive"
      });
      return;
    }

    if (formData.coachIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one coach for your video analysis",
        variant: "destructive"
      });
      return;
    }

    const hasFile = uploadMode === "file" && selectedFile;
    const hasLink = uploadMode === "link" && (formData.videoLink || isLinkValid);

    if (!hasFile && !hasLink) {
      toast({
        title: "Error",
        description: uploadMode === "file" 
          ? "Please select a video file" 
          : "Please enter a valid video link",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(20);

    try {
      setUploadProgress(50);
      setUploadStatus("processing");

      if (formData.coachIds.length > 0) {
        const { error: coachError } = await supabase
          .from('video_coaches')
          .insert(
            formData.coachIds.map(coachId => ({
              player_id: user.id,
              video_id: null,
              video_link: formData.videoLink || null,
              coach_id: coachId,
              title: formData.title,
              description: formData.description,
              focus_areas: formData.focusArea,
              video_platform: linkMetadata?.platform || null,
            }))
          );

        if (coachError) {
          throw coachError;
        }
      }

      setUploadProgress(80);

      if (quotaInfo?.users_sub_id) {
        const { error } = await supabase
          .from('users_subscription')
          .update({
            usages_count: (quotaInfo?.usages_count || 0) + 1,
          } as any)
          .eq('id', quotaInfo?.users_sub_id);

        if (error) {
          console.warn('Failed to update subscription count:', error);
        }
      }

      setUploadProgress(100);
      setUploadStatus("complete");

      toast({
        title: "Upload successful",
        description: "Your video has been submitted for analysis"
      });

      setFormData({
        title: "",
        description: "",
        videoLink: "",
        focusArea: "",
        coachIds: []
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsLinkValid(false);
      setLinkMetadata(null);

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setUploadStatus("idle");
        onUploadSuccess?.();
      }, 1500);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus("error");
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive"
      });
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setUploadStatus("idle");
      }, 2000);
    }
  };

  return (
    <div className="space-y-4">
      {quotaLoading ? (
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      ) : quotaInfo && (
        <div className={`rounded-lg p-4 ${quotaInfo.canUpload ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${quotaInfo.canUpload ? 'text-green-800' : 'text-red-800'}`}>
                Upload Status: {quotaInfo.canUpload ? 'Available' : 'Limit Reached'}
              </p>
              <p className={`text-xs ${quotaInfo.canUpload ? 'text-green-600' : 'text-red-600'}`}>
                {quotaInfo?.usages_count}/{quotaInfo.videosLimit} videos used this month
                {!quotaInfo.canUpload && quotaInfo.daysRemaining > 0 && 
                  ` • Next upload in ${quotaInfo.daysRemaining} days`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Upload Video for Analysis
          </CardTitle>
          <CardDescription>
            Upload your game footage for professional analysis by our expert coaches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-title">Video Title *</Label>
            <Input
              id="video-title"
              placeholder="e.g., Serve practice session"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-description">Description</Label>
            <Textarea
              id="video-description"
              placeholder="Describe what you'd like the coach to focus on..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <Label>Video Source</Label>
            <Tabs value={uploadMode} onValueChange={(v) => setUploadMode(v as "file" | "link")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="link">Video Link</TabsTrigger>
                <TabsTrigger value="file">Upload File</TabsTrigger>
              </TabsList>
              
              <TabsContent value="link" className="mt-4">
                <VideoLinkInput
                  value={formData.videoLink}
                  onChange={(value) => setFormData({ ...formData, videoLink: value })}
                  onValidate={handleLinkValidate}
                  disabled={uploading}
                />
              </TabsContent>
              
              <TabsContent value="file" className="mt-4">
                <DragDropZone
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  onClear={handleFileClear}
                  previewUrl={previewUrl}
                  disabled={uploading}
                  maxSize={500 * 1024 * 1024}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="focus-area">Focus Area</Label>
            <Select value={formData.focusArea} onValueChange={(value) => setFormData({ ...formData, focusArea: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select area to focus on" />
              </SelectTrigger>
              <SelectContent>
                {focusAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coach-selection">Select Coaches *</Label>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Choose one or more coaches to analyze your video
              </p>
              <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {coaches.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No coaches available for your sport
                  </p>
                ) : (
                  coaches.map((coach) => (
                    <label
                      key={coach.id}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.coachIds.includes(coach.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, coachIds: [...formData.coachIds, coach.id] });
                          } else {
                            setFormData({ ...formData, coachIds: formData.coachIds.filter(id => id !== coach.id) });
                          }
                        }}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium">{coach.display_name}</span>
                        {coach.username && (
                          <span className="text-xs text-muted-foreground ml-2">
                            @{coach.username}
                          </span>
                        )}
                      </div>
                    </label>
                  ))
                )}
              </div>
              {formData.coachIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-xs text-muted-foreground">Selected:</span>
                  {formData.coachIds.map((coachId) => {
                    const coach = coaches.find(c => c.id === coachId);
                    return coach ? (
                      <span
                        key={coachId}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                      >
                        {coach.display_name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>

          {uploading && (
            <UploadProgressBar
              progress={uploadProgress}
              status={uploadStatus}
              showPercentage={true}
            />
          )}

          <Button 
            onClick={handleUpload} 
            disabled={uploading || !formData.title.trim() || formData.coachIds.length === 0 || 
              (uploadMode === "file" ? !selectedFile : !formData.videoLink)}
            className="w-full"
          >
            {uploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-pulse" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoUpload;
