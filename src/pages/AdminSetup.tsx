import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminSetup = () => {
  const { user } = useAuth();
  const { role, isAdmin } = useUserRole();
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // If already admin, redirect to admin panel
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, navigate]);

  // If setup complete, check role and redirect
  useEffect(() => {
    if (setupComplete && isAdmin) {
      toast({ 
        title: "Success", 
        description: "Admin privileges granted! Redirecting to admin panel..." 
      });
      setTimeout(() => {
        navigate('/admin', { replace: true });
      }, 1500);
    }
  }, [setupComplete, isAdmin, navigate, toast]);

  const handleSetupAdmin = async () => {
    if (!user) {
      toast({ title: "Error", description: "Please log in first", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          displayName: user.user_metadata?.display_name || user.email?.split('@')[0]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Setup failed');
      }

      const data = await response.json();
      setSetupComplete(true);
      toast({ 
        title: "Success", 
        description: "Admin setup complete! Checking privileges..." 
      });

      // Wait a moment for the database to update, then try to refresh role
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Setup error:", error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Setup failed",
        variant: "destructive" 
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Logged in as:</p>
                <p className="font-semibold">{user.email}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900">
                <p className="font-semibold mb-2">Instructions:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Click "Setup Admin" below</li>
                  <li>This will grant you admin privileges</li>
                  <li>You'll then access the admin panel at /admin</li>
                </ol>
              </div>

              <Button 
                onClick={handleSetupAdmin} 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-orange-600"
              >
                {loading ? "Setting up..." : "Setup Admin Privileges"}
              </Button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Please log in first to set up admin access.</p>
              <a href="/auth">
                <Button className="w-full">Go to Login</Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
