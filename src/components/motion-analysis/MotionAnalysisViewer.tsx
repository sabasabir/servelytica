import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, SkipForward, SkipBack, Maximize2, Circle, Square, ArrowRight, Type, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactPlayer from 'react-player';

interface MotionAnalysisViewerProps {
  sessionId: string;
}

interface AnalysisSession {
  id: string;
  title: string;
  description: string;
  video_file_path: string;
  analysis_status: string;
  created_at: string;
}

interface AnnotationTool {
  type: 'line' | 'arrow' | 'circle' | 'rectangle' | 'text';
  icon: any;
  label: string;
}

const MotionAnalysisViewer = ({ sessionId }: MotionAnalysisViewerProps) => {
  const [session, setSession] = useState<AnalysisSession | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedTool, setSelectedTool] = useState<string>('line');
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [showOverlay, setShowOverlay] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);
  const { toast } = useToast();

  const annotationTools: AnnotationTool[] = [
    { type: 'line', icon: ArrowRight, label: 'Line' },
    { type: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { type: 'circle', icon: Circle, label: 'Circle' },
    { type: 'rectangle', icon: Square, label: 'Rectangle' },
    { type: 'text', icon: Type, label: 'Text' }
  ];

  useEffect(() => {
    fetchSessionData();
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      // Fetch session data
      const { data: sessionData, error: sessionError } = await supabase
        .from('motion_analysis_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;
      setSession(sessionData);

      // Get signed URL for video
      if (sessionData.video_file_path) {
        const { data: urlData, error: urlError } = await supabase.storage
          .from('videos')
          .createSignedUrl(sessionData.video_file_path, 3600);

        if (urlError) throw urlError;
        setVideoUrl(urlData.signedUrl);
      }

      // Fetch annotations
      const { data: annotationsData, error: annotationsError } = await supabase
        .from('motion_analysis_annotations')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at');

      if (annotationsError) throw annotationsError;
      setAnnotations(annotationsData || []);

    } catch (error) {
      console.error('Error fetching session data:', error);
      toast({
        title: "Error",
        description: "Failed to load video analysis session.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleSeek = (value: number[]) => {
    const seekTime = (value[0] / 100) * duration;
    setCurrentTime(seekTime);
    if (playerRef.current) {
      playerRef.current.seekTo(seekTime);
    }
  };

  const handleSkipForward = () => {
    const newTime = Math.min(currentTime + 5, duration);
    setCurrentTime(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime);
    }
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(currentTime - 5, 0);
    setCurrentTime(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading video analysis...</p>
        </CardContent>
      </Card>
    );
  }

  if (!session || !videoUrl) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">Video not found or still processing.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{session.title}</CardTitle>
              <CardDescription>{session.description}</CardDescription>
            </div>
            <Badge className={session.analysis_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {session.analysis_status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="analysis" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analysis">Analysis View</TabsTrigger>
              <TabsTrigger value="frameby-frame">Frame-by-Frame</TabsTrigger>
              <TabsTrigger value="annotations">Annotations</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-4">
              {/* Video Player */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <div className="aspect-video">
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
                  
                  {/* Overlay Annotations */}
                  {showOverlay && (
                    <div className="absolute inset-0 pointer-events-none">
                      {annotations.map((annotation, idx) => (
                        <div
                          key={idx}
                          className="absolute border-2 border-red-500"
                          style={{
                            left: `${annotation.coordinates?.x || 0}%`,
                            top: `${annotation.coordinates?.y || 0}%`,
                            width: `${annotation.coordinates?.width || 10}%`,
                            height: `${annotation.coordinates?.height || 10}%`,
                          }}
                        >
                          {annotation.label && (
                            <span className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
                              {annotation.label}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <Slider
                      value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                      onValueChange={handleSeek}
                      className="w-full"
                    />
                    <div className="flex justify-between text-white text-xs mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={handleSkipBackward}
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
                        onClick={handleSkipForward}
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Speed Control */}
                      <select
                        className="bg-transparent text-white text-sm border border-white/20 rounded px-2 py-1"
                        value={playbackSpeed}
                        onChange={(e) => handleSpeedChange(Number(e.target.value))}
                      >
                        <option value="0.25">0.25x</option>
                        <option value="0.5">0.5x</option>
                        <option value="1">1x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                      </select>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={() => setShowOverlay(!showOverlay)}
                      >
                        {showOverlay ? 'Hide' : 'Show'} Overlay
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
              </div>

              {/* Annotation Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Annotation Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {annotationTools.map((tool) => (
                      <Button
                        key={tool.type}
                        size="sm"
                        variant={selectedTool === tool.type ? "default" : "outline"}
                        onClick={() => setSelectedTool(tool.type)}
                      >
                        <tool.icon className="h-4 w-4 mr-1" />
                        {tool.label}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Click and drag on the video to add annotations (Demo Mode - Not functional)
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="frame-by-frame" className="space-y-4">
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">
                    Frame-by-frame analysis allows you to examine specific moments in detail.
                    This feature is currently in development and will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="annotations" className="space-y-4">
              <Card>
                <CardContent className="py-4">
                  {annotations.length > 0 ? (
                    <div className="space-y-2">
                      {annotations.map((annotation, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <span className="font-medium">{annotation.label || `Annotation ${idx + 1}`}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              Type: {annotation.annotation_type}
                            </span>
                          </div>
                          <Button size="sm" variant="ghost" className="text-red-500">
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">
                      No annotations added yet. Add annotations using the tools above.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotionAnalysisViewer;