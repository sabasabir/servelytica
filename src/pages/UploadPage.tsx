import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import VideoUploadForm from "@/components/upload/VideoUploadForm";
import { uploadFileToStorage, saveMediaRecord } from "@/services/uploadService";
import { AnalysisQuotaService } from "@/services/analysisQuotaService";
import { QuotaExceededDialog } from "@/components/profile/QuotaExceededDialog";

const UploadPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    focusArea: "",
    coachIds: [] as string[]
  });
  const [quotaExceededDialogOpen, setQuotaExceededDialogOpen] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<{
    analysesUsed: number;
    analysesLimit: number;
    nextResetDate: Date | null;
  } | null>(null);
  
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please upload a video file.",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload videos.",
          variant: "destructive"
        });
        setUploading(false);
        return;
      }

      // Check quota BEFORE any upload using the proper RPC function
      console.log('Checking quota for user:', userData.user.id);
      const quota = await AnalysisQuotaService.checkUserQuota(userData.user.id);
      console.log('Quota check result:', quota);
      
      if (!quota.canCreate) {
        console.log('Quota exceeded, showing dialog');
        setQuotaInfo({
          analysesUsed: quota.analysesUsed,
          analysesLimit: quota.analysesLimit,
          nextResetDate: quota.nextResetDate
        });
        setQuotaExceededDialogOpen(true);
        setUploading(false);
        return;
      }

      // Upload file to storage
      const uploadResult = await uploadFileToStorage(videoFile, userData.user.id);
      
      if (!uploadResult.success || !uploadResult.filePath) {
        throw new Error(uploadResult.error || "Failed to upload file");
      }

      // Save video record with form data
      const { data: videoData, error: saveError } = await supabase
        .from('videos')
        .insert({
          user_id: userData.user.id,
          file_path: uploadResult.filePath,
          file_name: videoFile.name,
          file_size: videoFile.size,
          title: formData.title || null,
          description: formData.description || null,
          focus_area: formData.focusArea || null,
          analyzed: false,
          uploaded_at: new Date().toISOString()
        })
        .select()
        .single();

      if (saveError) {
        throw new Error("Failed to save video record: " + saveError.message);
      }

      // Record analysis usage for all video uploads to track subscription limits
      console.log('About to record analysis usage for user:', userData.user.id, 'video:', videoData.id);
      const usageRecorded = await AnalysisQuotaService.recordAnalysisUsage(
        userData.user.id, 
        videoData.id
      );

      if (!usageRecorded) {
        console.error("Failed to record analysis usage - this is a critical error");
        toast({
          title: "Warning",
          description: "Video uploaded but usage tracking failed. Please contact support.",
          variant: "destructive"
        });
      } else {
        console.log('Successfully recorded analysis usage');
      }

      // Insert coach assignments if any coaches selected and mark video as ready for analysis
      if (videoData && formData.coachIds.length > 0) {
        const { error: coachError } = await supabase
          .from('video_coaches')
          .insert(
            formData.coachIds.map(coachId => ({
              video_id: videoData.id,
              coach_id: coachId
            }))
          );

        if (coachError) {
          throw new Error("Failed to assign coaches: " + coachError.message);
        }

        // Mark video as analyzed when coaches are assigned so they can see it
        const { error: updateError } = await supabase
          .from('videos')
          .update({ analyzed: true })
          .eq('id', videoData.id);

        if (updateError) {
          console.warn("Failed to mark video as analyzed, but upload was successful");
        }
      }

      toast({
        title: "Upload successful!",
        description: "Your video has been uploaded and is now ready for analysis.",
      });
      
      // Navigate to the upload complete page
      navigate("/upload-complete");

    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-tt-blue mb-2">Upload Your Game</h1>
            <p className="text-gray-600">
              Share your match video and get professional feedback from top coaches
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <VideoUploadForm
                uploading={uploading}
                setUploading={setUploading}
                videoFile={videoFile}
                setVideoFile={setVideoFile}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              By uploading your video, you agree to our <a href="/terms" className="text-tt-blue hover:underline">Terms of Service</a> and <a href="/privacy" className="text-tt-blue hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Quota Exceeded Dialog */}
      {quotaInfo && (
        <QuotaExceededDialog
          isOpen={quotaExceededDialogOpen}
          onOpenChange={setQuotaExceededDialogOpen}
          quota={quotaInfo}
        />
      )}
    </div>
  );
};

export default UploadPage;
