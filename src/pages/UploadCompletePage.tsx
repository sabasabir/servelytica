
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Search, Users, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const UploadCompletePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFindCoach = () => {
    navigate("/coaches");
  };

  const handleConnectCoach = () => {
    navigate("/connect");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-tt-blue mb-2">Upload Successful!</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your video has been successfully uploaded. You can now connect with a coach for personalized analysis and feedback.
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader className="bg-yellow-50 border-b border-yellow-100">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <CardTitle className="text-lg text-yellow-700">Analysis Pending</CardTitle>
              </div>
              <CardDescription className="text-yellow-600">
                Your video is currently being processed. A coach will analyze it soon.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-500 font-medium">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Video Processing</h3>
                    <p className="text-sm text-gray-500">Your video is being prepared for analysis</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Complete
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-yellow-500 font-medium">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Coach Assignment</h3>
                    <p className="text-sm text-gray-500">A coach will be assigned to analyze your video</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-400 font-medium">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-400">Analysis</h3>
                    <p className="text-sm text-gray-500">Your coach will provide detailed feedback</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Waiting
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Find a Coach</CardTitle>
                <CardDescription>
                  Browse our roster of professional coaches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-gray-600">
                  Select from our qualified coaches with expertise in various playing styles and skill levels.
                </p>
                <Button 
                  className="w-full bg-tt-blue hover:bg-blue-800 text-white"
                  onClick={handleFindCoach}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Browse Coaches
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Connect with Players</CardTitle>
                <CardDescription>
                  Find practice partners near your location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-gray-600">
                  Connect with players of similar skill level in your area for regular practice sessions.
                </p>
                <Button 
                  className="w-full bg-tt-orange hover:bg-orange-600 text-white"
                  onClick={handleConnectCoach}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Find Players
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadCompletePage;
