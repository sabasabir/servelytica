import { useState, useRef, useCallback } from "react";
import { Upload, Video, X, FileVideo } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragDropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  selectedFile?: File | null;
  onClear?: () => void;
  className?: string;
  previewUrl?: string | null;
}

const DragDropZone = ({
  onFileSelect,
  accept = "video/*",
  maxSize = 500 * 1024 * 1024,
  disabled = false,
  selectedFile,
  onClear,
  className,
  previewUrl
}: DragDropZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    setError(null);
    
    if (accept === "video/*" && !file.type.startsWith("video/")) {
      setError("Please select a video file (MP4, WebM, MOV, AVI)");
      return false;
    }
    
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      setError(`File size must be less than ${maxMB}MB`);
      return false;
    }
    
    return true;
  }, [accept, maxSize]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [disabled, validateFile, onFileSelect]);

  const handleClick = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  }, [disabled]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [validateFile, onFileSelect]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    onClear?.();
  }, [onClear]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          isDragOver && !disabled && "border-primary bg-primary/5 scale-[1.02]",
          !isDragOver && !disabled && "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
          disabled && "opacity-50 cursor-not-allowed bg-muted/30",
          selectedFile && "border-green-500/50 bg-green-50/50 dark:bg-green-950/20"
        )}
      >
        {selectedFile ? (
          <div className="space-y-4">
            {previewUrl ? (
              <div className="relative mx-auto max-w-xs">
                <video
                  src={previewUrl}
                  className="w-full h-40 object-cover rounded-lg"
                  controls={false}
                />
              </div>
            ) : (
              <FileVideo className="w-16 h-16 mx-auto text-green-600" />
            )}
            
            <div className="space-y-1">
              <p className="font-medium text-foreground truncate max-w-xs mx-auto">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            
            {onClear && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className={cn(
              "w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors",
              isDragOver ? "bg-primary/20" : "bg-muted"
            )}>
              {isDragOver ? (
                <Video className="w-8 h-8 text-primary animate-pulse" />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                {isDragOver ? "Drop your video here" : "Drag & drop your video"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse from your device
              </p>
              <p className="text-xs text-muted-foreground">
                Supports MP4, WebM, MOV, AVI (max {Math.round(maxSize / (1024 * 1024))}MB)
              </p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default DragDropZone;
