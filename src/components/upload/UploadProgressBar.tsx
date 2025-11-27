import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, Upload, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadProgressBarProps {
  progress: number;
  status?: "idle" | "uploading" | "processing" | "complete" | "error";
  statusText?: string;
  showPercentage?: boolean;
  className?: string;
}

const UploadProgressBar = ({
  progress,
  status = "uploading",
  statusText,
  showPercentage = true,
  className
}: UploadProgressBarProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "processing":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case "uploading":
        return <Upload className="w-5 h-5 text-primary animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    if (statusText) return statusText;
    switch (status) {
      case "complete":
        return "Upload complete!";
      case "error":
        return "Upload failed";
      case "processing":
        return "Processing video...";
      case "uploading":
        return "Uploading...";
      default:
        return "Ready to upload";
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case "complete":
        return "bg-green-600";
      case "error":
        return "bg-destructive";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={cn(
            "text-sm font-medium",
            status === "error" && "text-destructive",
            status === "complete" && "text-green-600"
          )}>
            {getStatusText()}
          </span>
        </div>
        
        {showPercentage && status !== "idle" && (
          <span className={cn(
            "text-sm font-bold tabular-nums",
            status === "complete" && "text-green-600",
            status === "error" && "text-destructive"
          )}>
            {Math.round(progress)}%
          </span>
        )}
      </div>
      
      <div className="relative">
        <Progress 
          value={progress} 
          className={cn(
            "h-3 transition-all duration-300",
            status === "complete" && "[&>div]:bg-green-600",
            status === "error" && "[&>div]:bg-destructive"
          )}
        />
        
        {status === "uploading" && progress > 0 && progress < 100 && (
          <div 
            className="absolute top-0 h-3 bg-white/30 animate-pulse rounded-full"
            style={{ 
              left: `${Math.max(0, progress - 10)}%`, 
              width: "10%",
              transition: "left 0.3s ease-out"
            }}
          />
        )}
      </div>
      
      {status === "uploading" && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Uploading video file...</span>
          <span>{progress < 50 ? "Please wait" : "Almost there"}</span>
        </div>
      )}
    </div>
  );
};

export default UploadProgressBar;
