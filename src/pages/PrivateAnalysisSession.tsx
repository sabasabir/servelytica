import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Maximize2,
  Circle,
  Square,
  ArrowRight,
  Type,
  MessageSquare,
  Send,
  Clock,
  Calendar,
  FileText,
  Share2,
  Download,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  PenTool,
  Video
} from "lucide-react";
import ReactPlayer from 'react-player';
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PrivateAnalysisService } from "@/services/privateAnalysisService";
import { supabase } from "@/integrations/supabase/client";

interface DrawingTool {
  type: 'line' | 'arrow' | 'circle' | 'rectangle' | 'text' | 'freehand';
  icon: any;
  label: string;
}

const PrivateAnalysisSession = () => {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const playerRef = useRef<ReactPlayer>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Session data
  const [session, setSession] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Video player state
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Annotation state
  const [selectedTool, setSelectedTool] = useState<string>('arrow');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<any>(null);

  // Comment state
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [timestampComment, setTimestampComment] = useState(false);

  // Note state
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('general');
  const [shareNote, setShareNote] = useState(false);

  const drawingTools: DrawingTool[] = [
    { type: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { type: 'circle', icon: Circle, label: 'Circle' },
    { type: 'rectangle', icon: Square, label: 'Rectangle' },
    { type: 'line', icon: PenTool, label: 'Line' },
    { type: 'text', icon: Type, label: 'Text' },
    { type: 'freehand', icon: Edit, label: 'Freehand' }
  ];

  useEffect(() => {
    if (sessionId && user) {
      fetchSessionData();
    }
  }, [sessionId, user]);

  const fetchSessionData = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    try {
      // Fetch session details
      const sessionData = await PrivateAnalysisService.getSessionById(sessionId);
      if (!sessionData) {
        toast({
          title: "Error",
          description: "Session not found.",
          variant: "destructive"
        });
        navigate('/analysis-space');
        return;
      }
      
      // Check access permissions
      if (sessionData.coach_id !== user?.id && sessionData.student_id !== user?.id) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this session.",
          variant: "destructive"
        });
        navigate('/analysis-space');
        return;
      }
      
      setSession(sessionData);

      // Fetch related data in parallel
      const [videosData, commentsData, annotationsData, notesData, progressData] = await Promise.all([
        PrivateAnalysisService.getSessionVideos(sessionId),
        PrivateAnalysisService.getSessionComments(sessionId),
        PrivateAnalysisService.getSessionAnnotations(sessionId),
        PrivateAnalysisService.getSessionNotes(sessionId, user!.id),
        PrivateAnalysisService.getSessionProgress(sessionId)
      ]);

      setVideos(videosData);
      setComments(commentsData);
      setAnnotations(annotationsData);
      setNotes(notesData);
      setProgress(progressData);

      // Select first video if available
      if (videosData.length > 0) {
        selectVideo(videosData[0]);
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
      toast({
        title: "Error",
        description: "Failed to load session data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectVideo = async (video: any) => {
    setSelectedVideo(video);
    
    // Get signed URL for video
    if (video.video_file_path) {
      try {
        const { data, error } = await supabase.storage
          .from('videos')
          .createSignedUrl(video.video_file_path, 3600);
        
        if (error) throw error;
        setVideoUrl(data.signedUrl);
      } catch (error) {
        console.error('Error getting video URL:', error);
        setVideoUrl(video.video_url || null);
      }
    } else {
      setVideoUrl(video.video_url || null);
    }
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleSeek = (seconds: number) => {
    const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
    setCurrentTime(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    const comment = await PrivateAnalysisService.addComment(
      sessionId!,
      user.id,
      newComment,
      timestampComment ? currentTime : undefined,
      replyTo || undefined
    );

    if (comment) {
      setComments([...comments, comment]);
      setNewComment('');
      setReplyTo(null);
      setTimestampComment(false);
      
      toast({
        title: "Comment Added",
        description: "Your comment has been posted."
      });
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !user) return;

    const note = await PrivateAnalysisService.addNote(
      sessionId!,
      user.id,
      newNote,
      noteType,
      shareNote
    );

    if (note) {
      setNotes([...notes, note]);
      setNewNote('');
      setShareNote(false);
      
      toast({
        title: "Note Added",
        description: shareNote ? "Note has been shared with session participant." : "Private note has been saved."
      });
    }
  };

  const handleAddAnnotation = async (annotationData: any) => {
    if (!user || !selectedVideo) return;

    const annotation = await PrivateAnalysisService.addAnnotation({
      session_id: sessionId!,
      video_id: selectedVideo.id,
      user_id: user.id,
      annotation_type: annotationData.type,
      coordinates: annotationData.coordinates,
      color: annotationData.color || '#FF0000',
      label: annotationData.label,
      video_timestamp_seconds: currentTime,
      frame_number: Math.floor(currentTime * 30) // Assuming 30fps
    });

    if (annotation) {
      setAnnotations([...annotations, annotation]);
      toast({
        title: "Annotation Added",
        description: "Your annotation has been saved."
      });
    }
  };

  const handleUpdateSessionStatus = async (newStatus: string) => {
    if (!session || !user || role !== 'coach') return;

    const success = await PrivateAnalysisService.updateSessionStatus(sessionId!, newStatus);
    
    if (success) {
      setSession({ ...session, status: newStatus });
      toast({
        title: "Session Updated",
        description: `Session status changed to ${newStatus}.`
      });
    }
  };

  const renderVideoPlayer = () => (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative bg-black">
          <div className="aspect-video">
            {videoUrl ? (
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={playing}
                controls={false}
                playbackRate={playbackSpeed}
                width="100%"
                height="100%"
                onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
                onDuration={(d) => setDuration(d)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                  <Video className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400">No video selected</p>
                </div>
              </div>
            )}

            {/* Overlay annotations */}
            {showAnnotations && videoUrl && (
              <div className="absolute inset-0 pointer-events-none">
                {annotations
                  .filter(a => Math.abs(a.video_timestamp_seconds - currentTime) < 0.5)
                  .map((annotation, idx) => (
                    <div
                      key={idx}
                      className="absolute"
                      style={{
                        left: `${annotation.coordinates?.x || 0}%`,
                        top: `${annotation.coordinates?.y || 0}%`,
                        width: `${annotation.coordinates?.width || 10}%`,
                        height: `${annotation.coordinates?.height || 10}%`,
                        borderColor: annotation.color,
                        borderWidth: '2px',
                        borderStyle: 'solid'
                      }}
                    >
                      {annotation.label && (
                        <span 
                          className="absolute -top-6 left-0 text-white text-xs px-2 py-1 rounded"
                          style={{ backgroundColor: annotation.color }}
                        >
                          {annotation.label}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Video controls */}
          {videoUrl && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => handleSeek(-10)}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={handlePlayPause}
                  >
                    {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => handleSeek(10)}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    className="bg-transparent text-white text-sm border border-white/20 rounded px-2 py-1"
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  >
                    <option value="0.5">0.5x</option>
                    <option value="1">1x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => setShowAnnotations(!showAnnotations)}
                  >
                    {showAnnotations ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderAnnotationTools = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Annotation Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-3">
          {drawingTools.map((tool) => (
            <Button
              key={tool.type}
              size="sm"
              variant={selectedTool === tool.type ? "default" : "outline"}
              onClick={() => setSelectedTool(tool.type)}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Click and drag on the video to add annotations
        </p>
      </CardContent>
    </Card>
  );

  const renderComments = () => (
    <Card className="flex-1 flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Discussion ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 mb-4 pr-4" style={{ maxHeight: '400px' }}>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-start gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user?.avatar_url} />
                    <AvatarFallback>
                      {comment.user?.display_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {comment.user?.display_name || 'User'}
                      </span>
                      {comment.video_timestamp_seconds !== null && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(comment.video_timestamp_seconds)}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm">{comment.comment_text}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs mt-1"
                      onClick={() => setReplyTo(comment.id)}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No comments yet. Start the discussion!
              </p>
            )}
          </div>
        </ScrollArea>

        <div className="space-y-2">
          {replyTo && (
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-xs text-gray-600">
                Replying to comment...
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyTo(null)}
              >
                Cancel
              </Button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button
              variant={timestampComment ? "default" : "outline"}
              size="sm"
              onClick={() => setTimestampComment(!timestampComment)}
            >
              <Clock className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              className="flex-1"
            />
            <Button onClick={handleAddComment} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderNotes = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Notes ({notes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 mb-4 pr-4">
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{note.note_type}</Badge>
                  {note.is_shared && (
                    <Badge className="bg-blue-100 text-blue-800">Shared</Badge>
                  )}
                </div>
                <p className="text-sm mb-2">{note.note_text}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(note.created_at), 'MMM d, h:mm a')}
                </p>
              </div>
            ))}
            {notes.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No notes yet.
              </p>
            )}
          </div>
        </ScrollArea>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="technique">Technique</SelectItem>
                <SelectItem value="tactical">Tactical</SelectItem>
                <SelectItem value="physical">Physical</SelectItem>
                <SelectItem value="mental">Mental</SelectItem>
                <SelectItem value="goals">Goals</SelectItem>
              </SelectContent>
            </Select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={shareNote}
                onChange={(e) => setShareNote(e.target.checked)}
              />
              <span className="text-sm">Share with {role === 'coach' ? 'student' : 'coach'}</span>
            </label>
          </div>
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1"
              rows={2}
            />
            <Button onClick={handleAddNote} size="sm">
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-tt-blue" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-gray-500">Session not found.</p>
          <Button onClick={() => navigate('/analysis-space')} className="mt-4">
            Back to Analysis Space
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/analysis-space')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{session.title}</h1>
                <p className="text-gray-600">
                  {role === 'coach' 
                    ? `with ${session.student?.display_name}`
                    : `Coach: ${session.coach?.display_name}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                {session.status}
              </Badge>
              {role === 'coach' && (
                <Select
                  value={session.status}
                  onValueChange={handleUpdateSessionStatus}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Video Player and Tools */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player */}
            {renderVideoPlayer()}
            
            {/* Annotation Tools */}
            {renderAnnotationTools()}

            {/* Video List */}
            {videos.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Session Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                          selectedVideo?.id === video.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => selectVideo(video)}
                      >
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          <span className="text-sm">{video.title || 'Untitled Video'}</span>
                        </div>
                        {selectedVideo?.id === video.id && (
                          <Badge variant="default">Playing</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Comments and Notes */}
          <div className="space-y-4">
            <Tabs defaultValue="comments">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="comments" className="mt-4">
                {renderComments()}
              </TabsContent>
              <TabsContent value="notes" className="mt-4">
                {renderNotes()}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivateAnalysisSession;