import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Edit2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminCoachForm from "./AdminCoachForm";

interface Coach {
  id: string;
  name?: string;
  display_name?: string;
  years_coaching?: number;
  created_at?: string;
}

const AdminCoachesTab = ({ onRefresh }: { onRefresh: () => void }) => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const { toast } = useToast();

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coach_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoaches(data || []);
    } catch (error) {
      console.error("Error fetching coaches:", error);
      toast({ title: "Error", description: "Failed to load coaches", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coach?")) return;

    try {
      const { error } = await supabase
        .from('coach_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCoaches(coaches.filter(c => c.id !== id));
      toast({ title: "Success", description: "Coach deleted successfully" });
    } catch (error) {
      console.error("Error deleting coach:", error);
      toast({ title: "Error", description: "Failed to delete coach", variant: "destructive" });
    }
  };

  const handleSaveCoach = async () => {
    await fetchCoaches();
    setShowForm(false);
    setEditingCoach(null);
    onRefresh();
  };

  const filteredCoaches = coaches.filter(coach =>
    (coach.display_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search coaches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => { setEditingCoach(null); setShowForm(true); }} className="gap-2">
          <Plus size={18} /> Add Coach
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <AdminCoachForm
          coach={editingCoach}
          onClose={() => setShowForm(false)}
          onSave={handleSaveCoach}
        />
      )}

      {/* Coaches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Coaches Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Loading coaches...</p>
          ) : filteredCoaches.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No coaches found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold">Name</th>
                    <th className="text-left py-2 px-4 font-semibold">Years Coaching</th>
                    <th className="text-left py-2 px-4 font-semibold">Created</th>
                    <th className="text-left py-2 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoaches.map((coach) => (
                    <tr key={coach.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{coach.display_name || "N/A"}</td>
                      <td className="py-2 px-4">{coach.years_coaching || "N/A"}</td>
                      <td className="py-2 px-4">
                        {coach.created_at ? new Date(coach.created_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setEditingCoach(coach); setShowForm(true); }}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(coach.id)}
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

export default AdminCoachesTab;
