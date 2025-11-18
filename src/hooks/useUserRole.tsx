
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<'player' | 'coach' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
          setRole('player'); // Default to player if error
        } else {
          setRole(data.role);
        }
      } catch (error) {
        console.error("Error in fetchUserRole:", error);
        setRole('player'); // Default to player
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { 
    role, 
    loading,
    isCoach: role === 'coach',
    isPlayer: role === 'player',
    isAdmin: role === 'admin'
  };
};
