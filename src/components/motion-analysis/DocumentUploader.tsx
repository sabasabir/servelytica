import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FileUp, FileText, Check, ArrowLeft, Upload, Loader2 } from "lucide-react";

interface DocumentUploaderProps {
  onBack: () => void;
  onComplete: (data: any) => void;
}

const DocumentUploader = ({ onBack, onComplete }: DocumentUploaderProps) => {
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type (PDF, DOC, DOCX, TXT)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, DOCX, or TXT file.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please upload a document smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      setDocumentFile(file);
      // Auto-fill title from filename if empty
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUpload = async () => {
    if (!documentFile || !user) {
      toast({
        title: "Missing Information",
        description: "Please select a document file.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Upload to Supabase Storage
      const fileExt = documentFile.name.split('.').pop();
      const filePath = `documents/${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, documentFile);

      if (uploadError) throw uploadError;

      // Create session entry for the document with media_type
      const { data: session, error: sessionError } = await supabase
        .from('motion_analysis_sessions')
        .insert({
          user_id: user.id,
          title: title || documentFile.name,
          description: description,
          video_file_path: filePath,
          sport_type: 'table-tennis',
          media_type: 'document',
          analysis_status: 'completed'
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      toast({
        title: "Upload Successful",
        description: "Your document has been uploaded.",
      });

      onComplete(session);

    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = () => {
    if (!documentFile) return <FileUp className="h-12 w-12 text-gray-500" />;
    
    if (documentFile.type === 'application/pdf') {
      return <FileText className="h-12 w-12 text-red-500" />;
    }
    return <FileText className="h-12 w-12 text-blue-500" />;
  };

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        uploading ? 'border-blue-500 bg-blue-50' : 
        documentFile ? 'border-green-500 bg-green-50' : 
        'border-gray-300 hover:border-tt-blue'
      }`}>
        {!documentFile ? (
          <div className="space-y-4">
            <FileUp className="h-12 w-12 text-gray-500 mx-auto" />
            <div>
              <p className="text-gray-600">
                Upload training plans, technique guides, or other documents
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Supports PDF, DOC, DOCX, TXT up to 10MB
              </p>
            </div>
            <Button type="button" variant="outline" className="relative">
              Select Document
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={handleFileChange}
              />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {getFileIcon()}
            <div>
              <p className="font-medium">{documentFile.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {(documentFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => setDocumentFile(null)}
            >
              Remove
            </Button>
          </div>
        )}
      </div>

      {documentFile && (
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="doc-title">Title</Label>
            <Input
              id="doc-title"
              placeholder="Document title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-description">Description (Optional)</Label>
            <Textarea
              id="doc-description"
              placeholder="Add notes about this document"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button
            onClick={handleUpload}
            className="w-full bg-tt-orange hover:bg-orange-600 text-white"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
