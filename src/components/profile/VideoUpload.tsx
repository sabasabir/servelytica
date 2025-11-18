import { useState, useEffect } from "react";
import { Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { VideoSubscriptionService } from "@/services/videoSubscriptionService";

interface VideoUploadProps {
  onUploadSuccess?: () => void;
}

const VideoUpload = ({ onUploadSuccess }: VideoUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
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


  // Check quota when component mounts
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

//   console.log({user})

  useEffect(() => {
    const fetchCoaches = async () => {
      if (!user) return;
      
      try {
        // console.log("Fetching coaches for user sport...");
        
        // First get the current user's sport
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('sport_id')
          .eq('user_id', user.id)
          .single();

        // console.log("User profile result:", { userProfile, profileError });

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return;
        }

        if (!userProfile?.sport_id) {
          console.log("User has no sport selected");
          return;
        }

        // Get coach user_ids
        const { data: coachRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id: user_id (*)')
          .eq('role', 'coach');

        // console.log("Coach roles result:", { coachRoles, rolesError });

        if (rolesError) {
          console.error("Error fetching coach roles:", rolesError);
          return;
        }

        if (coachRoles && coachRoles.length > 0) {
        //   const coachUserIds = coachRoles.map(role => role.user_id);
        //   console.log("Coach user IDs:", coachUserIds);
          
        //   // Get coach profiles filtered by sport
        //   const { data: coachProfiles, error: profilesError } = await supabase
        //     .from('profiles')
        //     .select('user_id, display_name, username')
        //     .in('user_id', coachUserIds)
        //     .eq('sport_id', userProfile.sport_id);
            
        //     console.log({coachProfiles})

        //   console.log("Coach profiles result:", { coachProfiles, profilesError });

        //   if (profilesError) {
        //     console.error("Error fetching coach profiles:", profilesError);
        //     return;
        //   }

        //   if (coachProfiles) {
        //     const mappedCoaches = coachProfiles.map(coach => ({
        //       id: coach.user_id,
        //       display_name: coach.display_name || coach.username || 'Unnamed Coach',
        //       username: coach.username || ''
        //     }));
        //     console.log("Mapped coaches:", mappedCoaches);
        //     setCoaches(mappedCoaches);
        //   }

          const mappedCoaches = coachRoles.map(coach => ({
              id: coach?.user_id?.user_id,
              display_name: coach?.user_id?.display_name || coach?.user_id?.username || 'Unnamed Coach',
              username: coach?.user_id?.username || ''
            }));
            // console.log("Mapped coaches:", mappedCoaches);
            setCoaches(mappedCoaches);
        } else {
          console.log("No coaches found in user_roles table");
        }
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };

    fetchCoaches();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a video file smaller than 50MB",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };


  const handleUpload = async () => {

    // {quotaInfo?.usages_count}/{quotaInfo.videosLimit}
    if(quotaInfo?.usages_count >= quotaInfo?.videosLimit) {
        toast({
          title: "Error",
          description: "Please subscribe for more video upload credits",
          variant: "destructive"
        });
        return;
    }
    // if (!selectedFile || !user) {
    if (!user) {
      toast({
        title: "Error",
        description: "Please select a file and ensure you're logged in",
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

    // Check quota before upload
    if (quotaInfo && !quotaInfo.canUpload) {
      toast({
        title: "Upload limit reached",
        description: `You have reached your upload limit. Next upload available in ${quotaInfo.daysRemaining} days.`,
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

    setUploading(true);

    try {
      // Create file path with user ID and timestamp //! TODO: don't remove below codes: Warnings
    //   const fileExt = selectedFile.name.split('.').pop();
    //   const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    //   // Upload to Supabase Storage
    //   const { error: uploadError } = await supabase.storage
    //     .from('videos')
    //     .upload(filePath, selectedFile);

    //   if (uploadError) {
    //     throw uploadError;
    //   }

      // Save video record to database
    //   const { data: videoData, error: dbError } = await supabase
    //     .from('videos')
    //     .insert({
    //       user_id: user.id,
    //       file_path: filePath,
    //       file_name: selectedFile.name,
    //       file_size: selectedFile.size,
    //       title: formData.title,
    //       description: formData.description,
    //       focus_area: formData.focusArea
    //     })
    //     .select()
    //     .single();

    //   if (dbError) {
    //     throw dbError;
    //   }

      // Insert coach assignments
    //   if (videoData && formData.coachIds.length > 0) {
      if (formData.coachIds.length > 0) {
        const { error: coachError } = await supabase
          .from('video_coaches')
          .insert(
            formData.coachIds.map(coachId => ({
              player_id: user.id,
              video_id: null,
              video_link: formData?.videoLink,
              coach_id: coachId,
              title: formData.title,
              description: formData.description,
              focus_areas: formData.focusArea,
            }))
          );

        if (coachError) {
          throw coachError;
        }
      }

       const { data: subData, error } = await supabase
            .from('users_subscription')
            .update({
              usages_count: quotaInfo?.usages_count + 1,
            })
            .eq('id', quotaInfo?.users_sub_id);

        if(error) {
            toast({
              title: "Subscription Update failed",
              description: "Video upload count error "
            });

        }

      toast({
        title: "Upload successful",
        description: "Your video has been uploaded for analysis"
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        videoLink: "",
        focusArea: "",
        coachIds: []
      });
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('video-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      // Call the callback to trigger navigation and refresh
      onUploadSuccess?.();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

//   console.log({quotaInfo})

  return (
    <div className="space-y-4">
      {/* Subscription Status */}
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

        <div className="space-y-2">
          <Label htmlFor="video-title">Video Link *</Label>
          <Input
            id="video-title"
            placeholder="e.g., Serve practice session"
            value={formData.videoLink}
            required
            onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
          />
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

        {/* <div className="space-y-2">
          <Label htmlFor="video-file">Video File *</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <input
              id="video-file"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="video-file"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {selectedFile ? selectedFile.name : "Click to select video file"}
              </span>
              <span className="text-xs text-muted-foreground">
                Supports MP4, MOV, AVI (Max 50MB)
              </span>
            </label>
          </div>
        </div> */}

        <Button 
          onClick={handleUpload} 
        //   disabled={uploading || !selectedFile || !formData.title.trim() || formData.coachIds.length === 0 || (quotaInfo && !quotaInfo.canUpload)}
          disabled={uploading || !formData.title.trim() || formData.coachIds.length === 0 || (quotaInfo && !quotaInfo.canUpload) || quotaInfo?.usages_count >= quotaInfo?.videosLimit}
          className="w-full"
        >
          {uploading ? "Uploading..." : (quotaInfo && !quotaInfo.canUpload ? "Upload Limit Reached" : "Upload Video")}
        </Button>
      </CardContent>
    </Card>
    </div>
  );
};

export default VideoUpload;