
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { VideoProcessingResult, ProcessedVideoSegment } from "@/services/videoProcessing";
import { CheckCircle, Clock, Edit, Play } from "lucide-react";

interface VideoProcessingPreviewProps {
  processingResult: VideoProcessingResult | null;
  originalVideo: File | null;
  onEdit: () => void;
  onContinue: () => void;
}

const VideoProcessingPreview = ({ 
  processingResult, 
  originalVideo,
  onEdit,
  onContinue 
}: VideoProcessingPreviewProps) => {
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);

  if (!processingResult || !originalVideo) {
    return null;
  }

  const totalSavedTime = processingResult.originalDuration - processingResult.processedDuration;
  const percentSaved = Math.round((totalSavedTime / processingResult.originalDuration) * 100);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Video Processing Complete</CardTitle>
          <CardDescription>
            We've automatically detected and trimmed the rally segments from your video
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Processing Summary</h3>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Original video: {Math.round(processingResult.originalDuration / 60)} minutes ({formatTime(processingResult.originalDuration)})</p>
                <p>Trimmed video: {Math.round(processingResult.processedDuration / 60)} minutes ({formatTime(processingResult.processedDuration)})</p>
                <p>Saved time for your coach: {percentSaved}% ({formatTime(totalSavedTime)})</p>
                <p>Rally segments detected: {processingResult.segments.length}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detected Rally Segments</h3>
            <div className="space-y-3">
              {processingResult.segments.map((segment, index) => (
                <div 
                  key={index}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedSegment === index ? 'border-tt-blue bg-blue-50' : 'hover:border-gray-400'}`}
                  onClick={() => setSelectedSegment(index)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Rally #{index + 1}</div>
                    <div className="text-sm text-gray-500">
                      {formatTime(segment.start)} - {formatTime(segment.end)} ({formatTime(segment.end - segment.start)})
                    </div>
                  </div>
                  <Progress value={segment.confidence * 100} className="h-2" />
                  <div className="flex justify-between text-xs mt-1">
                    <span>Confidence: {Math.round(segment.confidence * 100)}%</span>
                    <span className="text-tt-blue">
                      {segment.confidence > 0.9 ? 'High quality rally' : 
                       segment.confidence > 0.7 ? 'Good quality rally' : 'Possible rally'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onEdit} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Segments
            </Button>
            <Button 
              onClick={onContinue}
              className="bg-tt-orange hover:bg-orange-600 text-white"
            >
              Continue with Trimmed Video
              <Play className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoProcessingPreview;
