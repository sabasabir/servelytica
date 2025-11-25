import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const AdminSetup = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
      toast({ 
        title: "Success", 
        description: "Admin user setup complete! You can now access the admin panel at /admin" 
      });
    } catch (error) {
      console.error("Setup error:", error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Setup failed",
        variant: "destructive" 
      });
    } finally {
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
