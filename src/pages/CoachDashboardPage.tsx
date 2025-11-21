import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Users, Clock, CheckCircle, TrendingUp, Star, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { PendingVideosList } from "@/components/coach/PendingVideosList";
import { CompletedVideosList } from "@/components/coach/CompletedVideosList";
import { useAuth } from "@/contexts/AuthContext";
import { useCoachProfile } from "@/hooks/useCoachProfile";
import { CoachProfileService } from "@/services/coachProfileService";
import { useNavigate, Navigate } from "react-router-dom";

const CoachDashboardPage = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [coachProfile, setCoachProfile] = useState(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

    // console.log({coachProfile})
  const [coachData, setCoachData] = useState({
    name: "Coach Sarah Johnson",
    profileImage: "/placeholder.svg",
    specialties: ["Table Tennis", "Advanced Techniques"],
    rating: 4.8,
    totalStudents: 24,
    bio: "Professional table tennis coach with 10+ years of experience. Specialized in advanced techniques and tournament preparation."
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(user) {
        const profile = await CoachProfileService.getCoachProfile(user.id);
        setCoachProfile(profile);  
        setCurrentUser(user);
      }
    };
    getCurrentUser();
  }, []);

//   console.log({currentUser})

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Alex Thompson",
      avatar: "/placeholder.svg",
      level: "Intermediate",
      joinDate: "2024-01-15",
      progress: 75,
      lastSession: "2024-07-10"
    },
    {
      id: 2,
      name: "Maria Garcia",
      avatar: "/placeholder.svg",
      level: "Beginner",
      joinDate: "2024-02-20",
      progress: 45,
      lastSession: "2024-07-08"
    },
    {
      id: 3,
      name: "John Smith",
      avatar: "/placeholder.svg",
      level: "Advanced",
      joinDate: "2024-01-05",
      progress: 90,
      lastSession: "2024-07-12"
    }
  ]);

  const [pendingVideos, setPendingVideos] = useState([
    {
      id: 1,
      studentName: "Alex Thompson",
      title: "Backhand Practice Session",
      uploadDate: "2024-07-12",
      duration: "8:45",
      priority: "high"
    },
    {
      id: 2,
      studentName: "Maria Garcia",
      title: "Serve Technique Analysis",
      uploadDate: "2024-07-11",
      duration: "5:30",
      priority: "medium"
    }
  ]);

  const [analyzedVideos, setAnalyzedVideos] = useState([
    {
      id: 1,
      studentName: "John Smith",
      title: "Forehand Drive Analysis",
      analyzedDate: "2024-07-10",
      score: 85,
      feedback: "Excellent timing and form. Focus on follow-through consistency.",
      improvements: ["Follow-through", "Footwork positioning"]
    },
    {
      id: 2,
      studentName: "Alex Thompson",
      title: "Match Analysis - Quarter Finals",
      analyzedDate: "2024-07-09",
      score: 78,
      feedback: "Good tactical awareness. Work on defensive transitions.",
      improvements: ["Defensive play", "Shot selection"]
    }
  ]);

  const analyzeVideo = (videoId: number) => {
    const video = pendingVideos.find(v => v.id === videoId);
    if (video) {
      setPendingVideos(prev => prev.filter(v => v.id !== videoId));
      // In a real app, this would trigger the analysis process
    //   console.log(`Analyzing video: ${video.title}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Quick Access Card for Private Analysis Space */}
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-blue-900">Private Analysis Space</h2>
                  <p className="text-gray-700 mb-4">Collaborate with your students through dedicated analysis sessions</p>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span>{students.length} active students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span>{pendingVideos.length} pending requests</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/analysis-space')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Open Analysis Space
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coach Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={coachProfile?.profile?.profile_image} alt={coachData?.profile?.display_name} />
                  {/* <AvatarFallback>{coachProfile?.profile?.display_name(' ')?.map(n => n[0])?.join('')}</AvatarFallback> */}
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">{coachProfile?.profile?.display_name}</h1>
                  <p className="text-muted-foreground mb-3">{coachProfile?.profile?.bio}</p>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{coachData.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{coachData.totalStudents} Students</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {coachData.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Students</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Pending Videos</span>
            </TabsTrigger>
            <TabsTrigger value="analyzed" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Analyzed Videos</span>
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Students</CardTitle>
                <CardDescription>Manage and track your students' progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">Level: {student.level}</p>
                          <p className="text-sm text-muted-foreground">Last session: {student.lastSession}</p>
                        </div>
                      </div>
                      <div className="text-right min-w-[120px]">
                        <div className="mb-2">
                          <span className="text-sm font-medium">Progress: {student.progress}%</span>
                        </div>
                        <Progress value={student.progress} className="w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Videos Tab */}
          <TabsContent value="pending" className="space-y-6">
            <PendingVideosList coachId={currentUser?.id} />
          </TabsContent>

          {/* Analyzed Videos Tab */}
          <TabsContent value="analyzed" className="space-y-6">
            <CompletedVideosList coachId={currentUser?.id} />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default CoachDashboardPage;