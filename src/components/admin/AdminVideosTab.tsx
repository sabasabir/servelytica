import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Video {
  id: string;
  title?: string;
  file_name?: string;
  file_size?: number;
  analyzed?: boolean;
  uploaded_at?: string;
  user_id?: string;
}

const AdminVideosTab = ({ onRefresh }: { onRefresh: () => void }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({ title: "Error", description: "Failed to load videos", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete the video record.")) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setVideos(videos.filter(v => v.id !== id));
      toast({ title: "Success", description: "Video deleted" });
    } catch (error) {
      console.error("Error deleting video:", error);
      toast({ title: "Error", description: "Failed to delete video", variant: "destructive" });
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const filteredVideos = videos.filter(video =>
    (video.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (video.file_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search videos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <CardHeader>
          <CardTitle>Videos Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Loading videos...</p>
          ) : filteredVideos.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No videos found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold">Title</th>
                    <th className="text-left py-2 px-4 font-semibold">File</th>
                    <th className="text-left py-2 px-4 font-semibold">Size</th>
                    <th className="text-left py-2 px-4 font-semibold">Analyzed</th>
                    <th className="text-left py-2 px-4 font-semibold">Uploaded</th>
                    <th className="text-left py-2 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVideos.map((video) => (
                    <tr key={video.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{video.title || "Untitled"}</td>
                      <td className="py-2 px-4 text-xs">{video.file_name?.substring(0, 20)}...</td>
                      <td className="py-2 px-4">{formatFileSize(video.file_size)}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          video.analyzed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {video.analyzed ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {video.uploaded_at ? new Date(video.uploaded_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(video.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVideosTab;
