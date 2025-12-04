import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import VideoUploadForm from "@/components/upload/VideoUploadForm";
import { uploadFileToStorage } from "@/services/uploadService";
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

      // Quota check removed - unlimited uploads enabled

      // Upload file to storage and create database record with all form data
      const uploadResult = await uploadFileToStorage(videoFile, userData.user.id, formData);
      
      if (!uploadResult.success || !uploadResult.video) {
        throw new Error(uploadResult.error || "Failed to upload file");
      }

      // Backend now handles database insertion and coach assignment
      // No need for Supabase client operations here

      // Usage tracking removed - unlimited uploads enabled

      toast({
        title: "Upload successful!",
        description: "Your video has been uploaded and is now ready for analysis.",
      });
      
      // Navigate to the upload complete page
      navigate("/upload-complete");

    } catch (error: any) {
      console.error('Upload error:', error);
      console.error('Error details:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      
      let errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      
      // Provide helpful error messages
      if (errorMessage.includes('row-level security') || errorMessage.includes('RLS') || errorMessage.includes('policy')) {
        errorMessage = 'Security Policy Error: RLS has been disabled. Please hard refresh (Ctrl+Shift+R) and try again.';
      } else if (errorMessage.includes('bucket') || errorMessage.includes('storage')) {
        errorMessage = 'Storage Error: Please check storage bucket permissions.';
      }
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
        duration: 8000
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
