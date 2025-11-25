import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  user_id: string;
  display_name?: string;
  email?: string;
  created_at?: string;
  role?: string;
}

const AdminUsersTab = ({ onRefresh }: { onRefresh: () => void }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, display_name, email, created_at')
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;

      // Get roles for each user
      const usersWithRoles = await Promise.all((profiles || []).map(async (profile) => {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', profile.user_id)
          .single();

        return {
          ...profile,
          role: roleData?.role || 'player'
        };
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({ title: "Error", description: "Failed to load users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;

    try {
      // Delete profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setUsers(users.filter(u => u.user_id !== userId));
      toast({ title: "Success", description: "User deleted" });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    }
  };

  const filteredUsers = users.filter(user =>
    (user.display_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold">Name</th>
                    <th className="text-left py-2 px-4 font-semibold">Email</th>
                    <th className="text-left py-2 px-4 font-semibold">Role</th>
                    <th className="text-left py-2 px-4 font-semibold">Joined</th>
                    <th className="text-left py-2 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{user.display_name || "N/A"}</td>
                      <td className="py-2 px-4 text-xs">{user.email || "N/A"}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-1">
                          {user.role === 'admin' && <Shield size={14} className="text-orange-600" />}
                          <span className="capitalize px-2 py-1 bg-gray-100 rounded text-xs">
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-2 px-4">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(user.user_id)}
                        >
                          <Trash2 size={16} />
                        </Button>
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

export default AdminUsersTab;
