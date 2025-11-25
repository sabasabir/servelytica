import { useState, useRef, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CameraVideoRecorder from "@/components/motion-analysis/CameraVideoRecorder";
import { Video, Mic, MicOff, Video as VideoIcon, Send, Users } from "lucide-react";

const LiveStreamingPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [streamTitle, setStreamTitle] = useState("");
  const [liveChat, setLiveChat] = useState<Array<{ user: string; message: string }>>([]);
  const [chatMessage, setChatMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  // Simulate streaming
  useEffect(() => {
    if (isStreaming) {
      // Simulate viewers joining
      const interval = setInterval(() => {
        setViewers(prev => Math.min(prev + Math.random() * 2, 50));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  const handleStartStream = async () => {
    if (!streamTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a stream title",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsStreaming(true);
      toast({
        title: "Stream started",
        description: `Now broadcasting: ${streamTitle}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start stream",
        variant: "destructive",
      });
      setIsStreaming(false);
    }
  };

  const handleStopStream = () => {
    setIsStreaming(false);
    setStreamTitle("");
    setViewers(0);
    setLiveChat([]);
    toast({
      title: "Stream ended",
      description: "Your live stream has been saved",
    });
  };

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;

    setLiveChat(prev => [...prev, {
      user: user?.user_metadata?.display_name || "You",
      message: chatMessage,
    }]);
    setChatMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <VideoIcon className="h-8 w-8 text-tt-orange" />
              <h1 className="text-3xl font-bold text-tt-blue">Live Coaching</h1>
            </div>
            <p className="text-gray-600">
              {role === 'coach'
                ? 'Stream live coaching sessions to your students'
                : 'Join live coaching sessions with your coach'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Video Stream */}
            <div className="col-span-2">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gray-900 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">
                      {isStreaming ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                          LIVE
                        </div>
                      ) : (
                        'Stream Preview'
                      )}
                    </CardTitle>
                    {isStreaming && (
                      <Badge className="bg-red-600 text-white">
                        {Math.round(viewers)} watching
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-0 bg-black aspect-video flex items-center justify-center">
                  {isStreaming ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <div className="text-center">
                      <Video className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Stream preview will appear here</p>
                    </div>
                  )}
                </CardContent>

                {/* Controls */}
                <CardContent className="pt-6 bg-gray-50">
                  {role === 'coach' && !isStreaming ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Stream title (e.g., 'Backhand Technique Session')"
                        value={streamTitle}
                        onChange={(e) => setStreamTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tt-orange"
                      />
                      <Button
                        onClick={handleStartStream}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        size="lg"
                      >
                        <VideoIcon className="mr-2 h-5 w-5" />
                        Start Broadcasting
                      </Button>
                    </div>
                  ) : isStreaming ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsMuted(!isMuted)}
                        variant={isMuted ? "destructive" : "outline"}
                        className="flex-1"
                      >
                        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </Button>
                      <Button
                        onClick={handleStopStream}
                        variant="destructive"
                        className="flex-1"
                      >
                        End Stream
                      </Button>
                    </div>
                  ) : (
                    <Button disabled className="w-full">
                      Waiting for coach to start...
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chat Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Viewers Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-tt-orange" />
                    {Math.round(viewers)} Viewers
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Live Chat */}
              <Card className="flex flex-col h-96">
                <CardHeader>
                  <CardTitle className="text-lg">Live Chat</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                    {liveChat.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No messages yet
                      </p>
                    ) : (
                      liveChat.map((msg, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="font-semibold text-gray-900">{msg.user}</p>
                          <p className="text-gray-600">{msg.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {isStreaming && (
                    <div className="flex gap-2 mt-auto">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                        className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-tt-orange"
                      />
                      <Button
                        onClick={handleSendChat}
                        size="sm"
                        className="bg-tt-orange hover:bg-orange-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LiveStreamingPage;
