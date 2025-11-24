import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Tables']['user_roles']['Row'];

interface AuthContextType {
  user: User | null;
  userProfile: Profile | null;
  userRoles: UserRole | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, displayName: string, role: 'coach' | 'player', sportId: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; user?: User | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Only set up auth listener if Supabase is properly configured
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        // console.log(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if(user?.id) {
        const fetchProfiles = async () => {
            const {data, error} = await supabase.from('profiles').select("*").eq('user_id', user.id).single();
            if (error) {
                console.error('Error fetching profile:', error);
            } else {
                setUserProfile(data);
            }
        }
        const fetchUserRoles = async () => {
            const {data: userRolesData, error} = await supabase.from('user_roles').select("*").eq('user_id', user.id).single();
            if (error) {
                console.error('Error fetching profile:', error);
            } else {
                setUserRoles(userRolesData);
            }
        }
        fetchProfiles();
        fetchUserRoles();
    }
  }, [user?.id])

  const signUp = async (email: string, password: string, username: string, displayName: string, role: 'coach' | 'player', sportId: string) => {
    try {
      // Redirect to dashboard after signup
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      // Ensure username is always provided
      const finalUsername = username || `user_${Date.now()}`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: finalUsername,
            display_name: displayName || finalUsername,
            role: role || 'player',
            sport_id: sportId || null
          }
        }
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message || "Please check your input and try again.",
          variant: "destructive",
        });
        return { error };
      }

      // Manually create profile after successful signup
      if (data?.user?.id) {
        try {
          // Create profile record
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: data.user.id,
              username: finalUsername,
              display_name: displayName || finalUsername,
              sport_id: sportId || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError && !profileError.message.includes('duplicate')) {
            console.error('Profile creation error:', profileError);
          }

          // Create user role record
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: role || 'player',
              created_at: new Date().toISOString()
            });

          if (roleError && !roleError.message.includes('duplicate')) {
            console.error('Role creation error:', roleError);
          }

          // Try to create free subscription if it exists
          const { data: freePlan } = await supabase
            .from('pricing')
            .select('id')
            .eq('name', 'Free')
            .single();

          if (freePlan) {
            await supabase
              .from('users_subscription')
              .insert({
                user_id: data.user.id,
                pricing_plan_id: freePlan.id,
                subscription_type: 'free',
                status: 'active',
                start_date: new Date().toISOString(),
                price_paid: 0,
                auto_renew: false
              });
          }
        } catch (err) {
          console.error('Error creating user profile/role:', err);
        }
      }

      // Check if email confirmation is required
      const requiresConfirmation = data?.user?.user_metadata?.email_verified === false || 
                                  data?.user?.identities?.[0]?.identity_data?.email_verified === false;
      
      toast({
        title: "Account created successfully!",
        description: requiresConfirmation 
          ? "Check your email to confirm your account. Then login with your credentials."
          : "You can now login with your email and password!",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Check if it's an email confirmation issue
        if (error.message.toLowerCase().includes('email not confirmed')) {
          toast({
            title: "Email not confirmed",
            description: "Please check your email and click the confirmation link first, then try logging in again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login failed",
            description: error.message || "Invalid email or password.",
            variant: "destructive",
          });
        }
        return { error };
      } else {
        // Update state immediately on successful login
        setUser(data.user);
        setSession(data.session);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        return { error: null, user: data.user };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Clear user state immediately
        setUser(null);
        setSession(null);
        setUserProfile(null);
        setUserRoles(null);
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    userRoles,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    userProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};