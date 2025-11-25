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
  const { user, loading } = useAuth();
  const { role } = useUserRole();
  const [refreshKey, setRefreshKey] = useState(0);

  // Redirect if not admin
  if (!loading && (!user || role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
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
