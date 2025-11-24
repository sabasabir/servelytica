
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Upload, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { processVideo } from "@/services/videoProcessing";
import { supabase } from "@/integrations/supabase/client";
import { AnalysisQuotaService, type AnalysisQuota } from "@/services/analysisQuotaService";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VideoUploadFormProps {
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  formData: {
    title: string;
    description: string;
    focusArea: string;
    coachIds: string[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    focusArea: string;
    coachIds: string[];
  }>>;
  onSubmit: (e: React.FormEvent) => void;
}

const VideoUploadForm = ({
  uploading,
  setUploading,
  videoFile,
  setVideoFile,
  formData,
  setFormData,
  onSubmit
}: VideoUploadFormProps) => {
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<'coach' | 'player' | null>(null);
  const [loading, setLoading] = useState(true);
  const [coaches, setCoaches] = useState<Array<{id: string, display_name: string, username: string}>>([]);
  const [quota, setQuota] = useState<AnalysisQuota | null>(null);
  const [loadingQuota, setLoadingQuota] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Get user role from metadata or a profiles table
          // For simplicity, we're assuming there's user metadata with a role field
          // In a real app, you might need to fetch this from a profiles table
          const role = user.user_metadata?.role as 'coach' | 'player' || 'player';
          setUserRole(role);
          
          // Check quota for players
          if (role === 'player') {
            const userQuota = await AnalysisQuotaService.checkUserQuota(user.id);
            setQuota(userQuota);
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
        setLoadingQuota(false);
      }
    };
    
    checkUserRole();
  }, []);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        // First get coach user_ids
        const { data: coachRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'coach');

        if (rolesError) {
          console.error("Error fetching coach roles:", rolesError);
          return;
        }

        if (coachRoles && coachRoles.length > 0) {
          const coachUserIds = coachRoles.map(role => role.user_id);
          
          // Then get their profiles
          const { data: coachProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('user_id, display_name, username')
            .in('user_id', coachUserIds);

          if (profilesError) {
            console.error("Error fetching coach profiles:", profilesError);
            return;
          }

          if (coachProfiles) {
            setCoaches(coachProfiles.map(coach => ({
              id: coach.user_id,
              display_name: coach.display_name || coach.username || 'Unnamed Coach',
              username: coach.username || ''
            })));
          }
        }
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };

    fetchCoaches();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is a video
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file.",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (limit to 5GB)
      if (file.size > 5120 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a video smaller than 5GB.",
          variant: "destructive"
        });
        return;
      }
      
      setVideoFile(file);
      
      // Process video in the background without showing UI
      try {
        await processVideo(file);
      } catch (error) {
        toast({
          title: "Processing failed",
          description: "Failed to process video. Please try again.",
          variant: "destructive"
        });
        setVideoFile(null);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoachSelectionChange = (coachId: string) => {
    setFormData(prev => ({
      ...prev,
      coachIds: prev.coachIds.includes(coachId)
        ? prev.coachIds.filter(id => id !== coachId)
        : [...prev.coachIds, coachId]
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          name="title" 
          placeholder="e.g., Tournament Match vs. John Doe" 
          value={formData.title}
          onChange={handleInputChange}
        />
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          placeholder="Describe your match, opponent's playing style, and your current skill level..." 
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
      
      {/* Focus Areas */}
      <div className="space-y-2">
        <Label htmlFor="focusArea">Focus Area</Label>
        <Select 
          onValueChange={(value) => handleSelectChange("focusArea", value)}
          value={formData.focusArea}
        >
          <SelectTrigger>
            <SelectValue placeholder="What aspect do you want feedback on?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overall">Overall Game Assessment</SelectItem>
            <SelectItem value="technique">Technique & Form</SelectItem>
            <SelectItem value="footwork">Footwork & Movement</SelectItem>
            <SelectItem value="service">Service & Receive</SelectItem>
            <SelectItem value="tactics">Strategy & Tactics</SelectItem>
            <SelectItem value="mental">Mental Game</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Video Upload */}
      <div className="space-y-2">
        <Label htmlFor="video">Video Upload</Label>
        <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${uploading ? 'border-blue-500 bg-blue-50' : videoFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-tt-blue'}`}>
          {uploading ? (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-blue-500 animate-spin" />
              </div>
              <div>
                <p className="font-medium">Uploading your video</p>
                <p className="text-sm text-gray-500 mt-1">
                  Please wait while we process your video...
                </p>
              </div>
            </div>
          ) : !videoFile ? (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Drag and drop your video here, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports MP4, MOV, AVI up to 5GB
                </p>
              </div>
              <Button type="button" variant="outline" className="relative" onClick={() => document.getElementById('videoInput')?.click()}>
                Select Video
                <input
                  id="videoInput"
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="font-medium">
                  {videoFile.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={() => setVideoFile(null)}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Quota Info - Only show to players */}
      {userRole === 'player' && quota && (
        <Alert className={quota.canCreate ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
          <AlertTriangle className={`h-4 w-4 ${quota.canCreate ? "text-green-600" : "text-orange-600"}`} />
          <AlertDescription className={quota.canCreate ? "text-green-700" : "text-orange-700"}>
            <div className="space-y-1">
              <p className="font-medium">
                Analysis Quota: {quota.analysesUsed}/{quota.analysesLimit} used this month
              </p>
              {!quota.canCreate && quota.nextResetDate && (
                <p className="text-sm">
                  Next analysis available in {AnalysisQuotaService.formatResetDate(quota.nextResetDate)}
                </p>
              )}
              {quota.canCreate && (
                <p className="text-sm">
                  You can upload {quota.analysesLimit - quota.analysesUsed} more video{quota.analysesLimit - quota.analysesUsed !== 1 ? 's' : ''} for analysis.
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Coach Selection - Only show to players */}
      {userRole !== 'coach' && (
        <div className="space-y-2">
          <Label htmlFor="coachSelection">Select Coaches</Label>
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
                      onChange={() => handleCoachSelectionChange(coach.id)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      disabled={userRole === 'player' && quota && !quota.canCreate}
                    />
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${userRole === 'player' && quota && !quota.canCreate ? 'text-muted-foreground' : ''}`}>
                        {coach.display_name}
                      </span>
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
      )}
      
      {/* Submit Button */}
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-tt-orange hover:bg-orange-600 text-white"
          disabled={uploading || !videoFile || (userRole === 'player' && quota && !quota.canCreate)}
        >
          {uploading ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              Upload and Continue
              <span className="ml-2">→</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default VideoUploadForm;
