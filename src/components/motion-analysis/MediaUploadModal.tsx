import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Camera, 
  FileText, 
  Mic, 
  FileUp, 
  Upload 
} from "lucide-react";
import CameraVideoRecorder from "./CameraVideoRecorder";
import CameraPhotoCapture from "./CameraPhotoCapture";
import NoteCreator from "./NoteCreator";
import AudioRecorder from "./AudioRecorder";
import DocumentUploader from "./DocumentUploader";
import LibraryUploader from "./LibraryUploader";

interface MediaUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (data: any) => void;
}

type UploadMode = 'selection' | 'video' | 'photo' | 'note' | 'audio' | 'document' | 'library';

const MediaUploadModal = ({ open, onOpenChange, onComplete }: MediaUploadModalProps) => {
  const [mode, setMode] = useState<UploadMode>('selection');

  const handleModeSelect = (selectedMode: UploadMode) => {
    setMode(selectedMode);
  };

  const handleBack = () => {
    setMode('selection');
  };

  const handleComplete = (data: any) => {
    onComplete?.(data);
    onOpenChange(false);
    setMode('selection');
  };

  const uploadOptions = [
    {
      id: 'video',
      label: 'Take Video',
      icon: Video,
      description: 'Record video with your camera',
      color: 'text-blue-600'
    },
    {
      id: 'photo',
      label: 'Take Photo',
      icon: Camera,
      description: 'Capture a photo with your camera',
      color: 'text-purple-600'
    },
    {
      id: 'library',
      label: 'Library',
      icon: Upload,
      description: 'Upload from your device',
      color: 'text-green-600'
    },
    {
      id: 'note',
      label: 'Note',
      icon: FileText,
      description: 'Create a text note',
      color: 'text-yellow-600'
    },
    {
      id: 'audio',
      label: 'Audio',
      icon: Mic,
      description: 'Record or upload audio',
      color: 'text-red-600'
    },
    {
      id: 'document',
      label: 'Document',
      icon: FileUp,
      description: 'Upload PDF or documents',
      color: 'text-indigo-600'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'selection' ? 'Upload Media' : 'Create Content'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'selection' 
              ? 'Choose how you want to add content for analysis'
              : 'Follow the steps to create your content'
            }
          </DialogDescription>
        </DialogHeader>

        {mode === 'selection' && (
          <div className="grid grid-cols-2 gap-4 py-4">
            {uploadOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.id}
                  variant="outline"
                  className="h-auto flex-col items-center justify-center p-6 hover:border-tt-orange hover:bg-orange-50 transition-all"
                  onClick={() => handleModeSelect(option.id as UploadMode)}
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Icon className={`h-8 w-8 ${option.color}`} />
                  </div>
                  <span className="font-medium text-base mb-1">{option.label}</span>
                  <span className="text-xs text-gray-500 text-center">
                    {option.description}
                  </span>
                </Button>
              );
            })}
          </div>
        )}

        {mode === 'video' && (
          <CameraVideoRecorder onBack={handleBack} onComplete={handleComplete} />
        )}

        {mode === 'photo' && (
          <CameraPhotoCapture onBack={handleBack} onComplete={handleComplete} />
        )}

        {mode === 'note' && (
          <NoteCreator onBack={handleBack} onComplete={handleComplete} />
        )}

        {mode === 'audio' && (
          <AudioRecorder onBack={handleBack} onComplete={handleComplete} />
        )}

        {mode === 'document' && (
          <DocumentUploader onBack={handleBack} onComplete={handleComplete} />
        )}

        {mode === 'library' && (
          <LibraryUploader onBack={handleBack} onComplete={handleComplete} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadModal;
