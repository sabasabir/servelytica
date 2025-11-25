import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminCoachesTab from "@/components/admin/AdminCoachesTab";
import AdminVideosTab from "@/components/admin/AdminVideosTab";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import AdminStatsTab from "@/components/admin/AdminStatsTab";
import { AlertCircle } from "lucide-react";

const AdminPanel = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading, isAdmin } = useUserRole();
  const [refreshKey, setRefreshKey] = useState(0);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect if not admin (after both auth and role are loaded)
  if (!authLoading && !roleLoading && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Show loading while checking authentication or role
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage all platform data and resources</p>
        </div>

        {/* Admin Warning */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="text-orange-600 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-orange-900">Admin-Only Access</h3>
              <p className="text-sm text-orange-800">
                You have full access to create, read, update, and delete all platform data. Use with care.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="coaches">Coaches</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <AdminStatsTab key={refreshKey} />
          </TabsContent>

          <TabsContent value="coaches">
            <AdminCoachesTab key={refreshKey} onRefresh={handleRefresh} />
          </TabsContent>

          <TabsContent value="videos">
            <AdminVideosTab key={refreshKey} onRefresh={handleRefresh} />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersTab key={refreshKey} onRefresh={handleRefresh} />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPanel;
