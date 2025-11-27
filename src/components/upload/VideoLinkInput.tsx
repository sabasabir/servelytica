import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, CheckCircle2, AlertCircle, Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoLinkInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (isValid: boolean, metadata?: VideoMetadata) => void;
  disabled?: boolean;
  className?: string;
}

interface VideoMetadata {
  platform: string;
  videoId?: string;
  thumbnailUrl?: string;
  embedUrl?: string;
}

const VideoLinkInput = ({
  value,
  onChange,
  onValidate,
  disabled = false,
  className
}: VideoLinkInputProps) => {
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState<{
    isValid: boolean;
    message: string;
    metadata?: VideoMetadata;
  } | null>(null);

  const supportedPlatforms = [
    { name: "YouTube", patterns: [/youtube\.com\/watch\?v=([^&]+)/, /youtu\.be\/([^?]+)/, /youtube\.com\/embed\/([^?]+)/] },
    { name: "Vimeo", patterns: [/vimeo\.com\/(\d+)/, /player\.vimeo\.com\/video\/(\d+)/] },
    { name: "Dailymotion", patterns: [/dailymotion\.com\/video\/([^_]+)/] },
    { name: "Direct Link", patterns: [/\.(mp4|webm|mov|avi|mkv)(\?|$)/i] }
  ];

  const detectPlatform = useCallback((url: string): VideoMetadata | null => {
    for (const platform of supportedPlatforms) {
      for (const pattern of platform.patterns) {
        const match = url.match(pattern);
        if (match) {
          const videoId = match[1];
          let metadata: VideoMetadata = { platform: platform.name, videoId };
          
          if (platform.name === "YouTube" && videoId) {
            metadata.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            metadata.embedUrl = `https://www.youtube.com/embed/${videoId}`;
          } else if (platform.name === "Vimeo" && videoId) {
            metadata.embedUrl = `https://player.vimeo.com/video/${videoId}`;
          } else if (platform.name === "Direct Link") {
            metadata.embedUrl = url;
          }
          
          return metadata;
        }
      }
    }
    return null;
  }, []);

  const validateUrl = useCallback(async (url: string) => {
    if (!url.trim()) {
      setValidation(null);
      onValidate?.(false);
      return;
    }

    setValidating(true);
    
    try {
      const urlObj = new URL(url);
      
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        setValidation({
          isValid: false,
          message: "Please enter a valid HTTP/HTTPS URL"
        });
        onValidate?.(false);
        return;
      }
      
      const metadata = detectPlatform(url);
      
      if (metadata) {
        setValidation({
          isValid: true,
          message: `${metadata.platform} video detected`,
          metadata
        });
        onValidate?.(true, metadata);
      } else {
        setValidation({
          isValid: true,
          message: "Video link accepted (unrecognized platform)",
          metadata: { platform: "Unknown" }
        });
        onValidate?.(true, { platform: "Unknown" });
      }
    } catch {
      setValidation({
        isValid: false,
        message: "Please enter a valid URL"
      });
      onValidate?.(false);
    } finally {
      setValidating(false);
    }
  }, [detectPlatform, onValidate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    const timeoutId = setTimeout(() => {
      validateUrl(newValue);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
      validateUrl(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label htmlFor="videoLink" className="flex items-center gap-2">
        <Link className="w-4 h-4" />
        Video URL
      </Label>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="videoLink"
            type="url"
            placeholder="https://youtube.com/watch?v=... or direct video link"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              "pr-10",
              validation?.isValid === true && "border-green-500 focus-visible:ring-green-500",
              validation?.isValid === false && "border-destructive focus-visible:ring-destructive"
            )}
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {validating ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : validation?.isValid === true ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : validation?.isValid === false ? (
              <AlertCircle className="w-4 h-4 text-destructive" />
            ) : null}
          </div>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePaste}
          disabled={disabled}
        >
          Paste
        </Button>
      </div>
      
      {validation && (
        <p className={cn(
          "text-sm flex items-center gap-1",
          validation.isValid ? "text-green-600" : "text-destructive"
        )}>
          {validation.isValid ? (
            <CheckCircle2 className="w-3 h-3" />
          ) : (
            <AlertCircle className="w-3 h-3" />
          )}
          {validation.message}
        </p>
      )}
      
      {validation?.isValid && validation.metadata?.thumbnailUrl && (
        <div className="relative w-full max-w-xs rounded-lg overflow-hidden border">
          <img
            src={validation.metadata.thumbnailUrl}
            alt="Video thumbnail"
            className="w-full h-auto"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Play className="w-12 h-12 text-white" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1">
            {validation.metadata.platform}
          </div>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Supported: YouTube, Vimeo, Dailymotion, or direct video links (.mp4, .webm, .mov)
      </p>
    </div>
  );
};

export default VideoLinkInput;
