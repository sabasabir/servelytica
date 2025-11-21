import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Video, 
  MessageSquare, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  PlayCircle,
  FileText,
  TrendingUp,
  Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PrivateAnalysisService } from "@/services/privateAnalysisService";
import { format } from "date-fns";

const PrivateAnalysisSpace = () => {
  const { user, loading: authLoading } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }
  
  const [loading, setLoading] = useState(true);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedRelationship, setSelectedRelationship] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, role]);

  const fetchData = async () => {
    if (!user || !role) return;
    
    setLoading(true);
    try {
      // Fetch relationships
      const relationshipsData = await PrivateAnalysisService.getCoachStudentRelationships(
        user.id,
        role as 'coach' | 'player'
      );
      setRelationships(relationshipsData.filter(r => r.status === 'active'));

      // Fetch sessions
      const sessionsData = await PrivateAnalysisService.getUserSessions(
        user.id,
        role as 'coach' | 'player'
      );
      setSessions(sessionsData);

      // Fetch requests
      const requestsData = await PrivateAnalysisService.getUserRequests(
        user.id,
        role as 'coach' | 'player'
      );
      setRequests(requestsData);

      // Fetch notifications
      const notificationsData = await PrivateAnalysisService.getUserNotifications(user.id, true);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async (studentId: string) => {
    if (!user || role !== 'coach') return;

    const title = prompt("Enter session title:");
    if (!title) return;

    const description = prompt("Enter session description (optional):");
    
    const session = await PrivateAnalysisService.createSession(
      user.id,
      studentId,
      title,
      description || undefined
    );

    if (session) {
      toast({
        title: "Session Created",
        description: "New analysis session has been created successfully."
      });
      navigate(`/analysis-session/${session.id}`);
    } else {
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const acceptRequest = async (requestId: string, studentId: string) => {
    if (!user || role !== 'coach') return;

    // Create a new session for this request
    const session = await PrivateAnalysisService.createSession(
      user.id,
      studentId,
      "Analysis Session",
      "Session created from analysis request"
    );

    if (session) {
      // Update request status
      await PrivateAnalysisService.updateRequestStatus(requestId, 'accepted', session.id);
      
      toast({
        title: "Request Accepted",
        description: "Analysis session has been created."
      });
      
      navigate(`/analysis-session/${session.id}`);
    }
  };

  const renderCoachDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relationships.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {requests.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter(s => s.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unread Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">My Students</TabsTrigger>
          <TabsTrigger value="requests">Analysis Requests</TabsTrigger>
          <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Students</CardTitle>
              <CardDescription>Students you're currently coaching</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relationships.map((rel) => (
                  <div key={rel.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={rel.student?.avatar_url} />
                        <AvatarFallback>
                          {rel.student?.display_name?.charAt(0) || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{rel.student?.display_name || 'Student'}</p>
                        <p className="text-sm text-gray-500">
                          Joined {format(new Date(rel.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => createNewSession(rel.student_id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        New Session
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/student/${rel.student_id}/videos`)}
                      >
                        View Videos
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
                {relationships.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No active students yet. Students can request analysis from your coach profile.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Requests</CardTitle>
              <CardDescription>Pending and recent analysis requests from students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.filter(r => r.status === 'pending').map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-orange-100">
                            {request.priority} priority
                          </Badge>
                          <Badge>{request.request_type}</Badge>
                        </div>
                        <p className="font-medium">{request.student?.display_name}</p>
                        <p className="text-sm text-gray-600">{request.request_message}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(request.created_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => acceptRequest(request.id, request.student_id)}
                        >
                          Accept & Start Session
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => PrivateAnalysisService.updateRequestStatus(request.id, 'declined')}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {requests.filter(r => r.status === 'pending').length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No pending analysis requests.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your recent analysis sessions with students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="space-y-1">
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-gray-500">
                        with {session.student?.display_name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {format(new Date(session.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/analysis-session/${session.id}`)}
                    >
                      Open Session
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No analysis sessions yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Recent updates and alerts</CardDescription>
                </div>
                {notifications.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await PrivateAnalysisService.markAllNotificationsAsRead(user!.id);
                      setNotifications([]);
                    }}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100"
                    onClick={() => PrivateAnalysisService.markNotificationAsRead(notif.id)}
                  >
                    <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notif.title}</p>
                      <p className="text-sm text-gray-600">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(notif.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No unread notifications.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              My Coaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relationships.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter(s => s.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {requests.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Feedback Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter(s => s.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="coaches" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="coaches">My Coaches</TabsTrigger>
          <TabsTrigger value="sessions">Analysis Sessions</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="feedback">Feedback History</TabsTrigger>
        </TabsList>

        <TabsContent value="coaches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Coaches</CardTitle>
              <CardDescription>Coaches you're working with</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relationships.map((rel) => (
                  <div key={rel.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={rel.coach?.avatar_url} />
                        <AvatarFallback>
                          {rel.coach?.display_name?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{rel.coach?.display_name || 'Coach'}</p>
                        <p className="text-sm text-gray-500">
                          Working together since {format(new Date(rel.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/coaches/${rel.coach?.username}`)}
                    >
                      View Profile
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
                {relationships.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      You haven't connected with any coaches yet.
                    </p>
                    <Button onClick={() => navigate('/coaches')}>
                      Find a Coach
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Sessions</CardTitle>
              <CardDescription>Your video analysis sessions with coaches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="space-y-1">
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-gray-500">
                        Coach: {session.coach?.display_name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {format(new Date(session.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/analysis-session/${session.id}`)}
                    >
                      Open Session
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No analysis sessions yet. Upload a video and request analysis from a coach.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>Track your improvement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Progress tracking data will appear here as you complete sessions.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback History</CardTitle>
              <CardDescription>All feedback received from coaches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.filter(s => s.status === 'completed').map((session) => (
                  <div key={session.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{session.title}</p>
                        <p className="text-sm text-gray-500">
                          by {session.coach?.display_name}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {session.description || 'Video analysis and feedback'}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/analysis-session/${session.id}`)}
                    >
                      View Feedback
                    </Button>
                  </div>
                ))}
                {sessions.filter(s => s.status === 'completed').length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No completed sessions yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tt-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analysis Space</h1>
          <p className="mt-2 text-gray-600">
            {role === 'coach' 
              ? 'Interactive workspace - Manage students, create analysis sessions, and track progress'
              : 'Interactive workspace - Collaborate with coaches, track your progress, and get personalized feedback'}
          </p>
        </div>

        {role === 'coach' ? renderCoachDashboard() : renderStudentDashboard()}
      </div>
      <Footer />
    </div>
  );
};

export default PrivateAnalysisSpace;