import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, Activity, PlayCircle, FileVideo, Brain, Plus } from "lucide-react";
import MotionAnalysisUpload from "@/components/motion-analysis/MotionAnalysisUpload";
import MotionAnalysisViewer from "@/components/motion-analysis/MotionAnalysisViewer";
import MotionAnalysisResults from "@/components/motion-analysis/MotionAnalysisResults";
import MotionAnalysisList from "@/components/motion-analysis/MotionAnalysisList";
import MediaUploadModal from "@/components/motion-analysis/MediaUploadModal";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const MotionAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAnalysisComplete = (sessionId: string) => {
    setSelectedSession(sessionId);
    setActiveTab("viewer");
    toast({
      title: "Analysis Started",
      description: "Your video has been uploaded and analysis is in progress.",
    });
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId);
    setActiveTab("viewer");
  };

  const handleMediaComplete = (data: any) => {
    if (data?.id) {
      handleAnalysisComplete(data.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-8 w-8 text-tt-orange" />
                  <h1 className="text-3xl font-bold text-tt-blue">Motion Analysis</h1>
                </div>
                <p className="text-gray-600 max-w-3xl">
                  Upload your table tennis videos for AI-powered motion analysis. Get detailed feedback on your technique,
                  body position, timing, and areas for improvement.
                </p>
              </div>
              {user && (
                <Button
                  onClick={() => setShowMediaModal(true)}
                  className="bg-tt-orange hover:bg-orange-600 text-white"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Content
                </Button>
              )}
            </div>
          </div>

          {/* Main Content */}
          {user ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full max-w-xl grid-cols-4">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="viewer" className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Viewer
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Results
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <FileVideo className="h-4 w-4" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Content for Analysis</CardTitle>
                    <CardDescription>
                      Record video, capture photos, create notes, record audio, or upload documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button
                        onClick={() => setShowMediaModal(true)}
                        className="w-full h-32 bg-gradient-to-r from-tt-orange to-orange-600 hover:from-orange-600 hover:to-tt-orange text-white text-lg"
                      >
                        <Plus className="mr-2 h-6 w-6" />
                        Add Video, Photo, Note, Audio, or Document
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or upload from device
                          </span>
                        </div>
                      </div>

                      <MotionAnalysisUpload onUploadComplete={handleAnalysisComplete} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="viewer" className="space-y-6">
                {selectedSession ? (
                  <MotionAnalysisViewer sessionId={selectedSession} />
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FileVideo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Analysis Selected</h3>
                      <p className="text-gray-500 mb-4">
                        Upload a video or select one from your history to view the analysis
                      </p>
                      <Button
                        onClick={() => setActiveTab("upload")}
                        className="bg-tt-orange hover:bg-orange-600 text-white"
                      >
                        Upload Video
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                {selectedSession ? (
                  <MotionAnalysisResults sessionId={selectedSession} />
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Results Available</h3>
                      <p className="text-gray-500 mb-4">
                        Complete an analysis to view detailed results and feedback
                      </p>
                      <Button
                        onClick={() => setActiveTab("upload")}
                        className="bg-tt-orange hover:bg-orange-600 text-white"
                      >
                        Start Analysis
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Motion Analysis History</CardTitle>
                    <CardDescription>
                      View and manage all your previous motion analysis sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MotionAnalysisList onSessionSelect={handleSessionSelect} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Sign In Required</h2>
                <p className="text-gray-500 mb-6">
                  Please sign in to access the Motion Analysis feature
                </p>
                <Button
                  onClick={() => window.location.href = "/auth"}
                  className="bg-tt-orange hover:bg-orange-600 text-white"
                >
                  Sign In
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <MediaUploadModal 
        open={showMediaModal} 
        onOpenChange={setShowMediaModal}
        onComplete={handleMediaComplete}
      />
      
      <Footer />
    </div>
  );
};

export default MotionAnalysisPage;