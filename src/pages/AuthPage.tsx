import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validatePassword } from '@/utils/passwordValidation';
import { PasswordInput } from '@/components/PasswordInput';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SurvayModal from '@/components/SurvayModal';
import { Box, Container, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { Chrome } from 'lucide-react';

interface Sport {
  id: string;
  name: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthly_price: number;
  yearly_price: number;
  features: string[];
  recommended: boolean;
  button_text: string;
  button_variant: string;
  display_order: number;
}

const AuthPage = () => {
  const { user, signIn, signUp, signInWithGoogle, userRoles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'coach' | 'player'>('player');
  const [selectedSport, setSelectedSport] = useState('');
  const [signupStep, setSignupStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const fetchData = async () => {
      const { data: sportsData } = await supabase.from('sports').select('id, name').order('name');
      if (sportsData) setSports(sportsData);

      const { data: plansData } = await supabase.from('pricing').select('*').order('display_order');
      if (plansData) setPlans(plansData);
    };
    fetchData();
  }, []);

  // Redirect to dashboard when user is authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error, user: loggedInUser } = await signIn(loginEmail, loginPassword);
    if (error) {
      // If there's an error, reset loading state
      setLoading(false);
    } else if (loggedInUser) {
      // Redirect to dashboard on successful login
      navigate('/dashboard', { replace: true });
    }
  };

  const handleSignupStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    const passwordValidation = validatePassword(signupPassword);
    if (!passwordValidation.isValid) {
      toast({
        title: "Password Requirements Not Met",
        description: passwordValidation.errors.join(". "),
        variant: "destructive",
      });
      return;
    }

    if (signupPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setSignupStep(2);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />
      
      <Box component="main" sx={{ flex: 1, py: { xs: 6, md: 10 } }}>
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              sx={{
                background: "white",
                borderRadius: { xs: "16px", md: "24px" },
                border: "2px solid rgba(255, 126, 0, 0.2)",
                p: { xs: 3, sm: 4, md: 6 },
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
              }}
            >
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: { xs: "20px", sm: "24px", md: "28px" },
                    fontWeight: 800,
                    color: "#1a365d",
                    mb: 1,
                    fontFamily: '"Poppins", "Sora", sans-serif',
                  }}
                >
                  WELCOME TO SERVELYTICA
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: { xs: "12px", md: "14px" } }}>
                  Professional sports coaching platform
                </Typography>
              </Box>

              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger value="login">LOGIN</TabsTrigger>
                  <TabsTrigger value="signup">SIGN UP</TabsTrigger>
                </TabsList>
                
                {/* Login Form */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-semibold text-sm">Email</Label>
                      <Input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold text-sm">Password</Label>
                      <PasswordInput
                        value={loginPassword}
                        onChange={setLoginPassword}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-[#ff7e00] to-[#ff9500] text-white font-semibold h-10" disabled={loading}>
                      {loading ? 'SIGNING IN...' : 'SIGN IN'}
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300"></span>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                      </div>
                    </div>
                    <Button 
                      type="button"
                      onClick={async () => {
                        setLoading(true);
                        await signInWithGoogle();
                        setLoading(false);
                      }}
                      className="w-full bg-white text-gray-900 border-2 border-gray-300 font-semibold h-10 hover:bg-gray-50 flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      <Chrome size={18} />
                      SIGN IN WITH GOOGLE
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Signup Form */}
                <TabsContent value="signup">
                  {signupStep === 1 ? (
                    <form onSubmit={handleSignupStep1} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="font-semibold text-sm">Email</Label>
                        <Input
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="font-semibold text-sm">Username</Label>
                          <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username"
                            required
                            className="h-11 md:h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-semibold text-sm">Display Name</Label>
                          <Input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your Name"
                            required
                            className="h-11 md:h-10"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="font-semibold text-sm">Password</Label>
                          <PasswordInput
                            value={signupPassword}
                            onChange={setSignupPassword}
                            placeholder="••••••••"
                            required
                            className="h-11 md:h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-semibold text-sm">Confirm Password</Label>
                          <PasswordInput
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            placeholder="••••••••"
                            required
                            className="h-11 md:h-10"
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-[#ff7e00] to-[#ff9500] text-white font-semibold h-10">
                        NEXT STEP
                      </Button>
                      <div className="relative mt-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-300"></span>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">OR</span>
                        </div>
                      </div>
                      <Button 
                        type="button"
                        onClick={async () => {
                          setLoading(true);
                          await signInWithGoogle();
                          setLoading(false);
                        }}
                        className="w-full bg-white text-gray-900 border-2 border-gray-300 font-semibold h-10 hover:bg-gray-50 flex items-center justify-center gap-2 mt-4"
                        disabled={loading}
                      >
                        <Chrome size={18} />
                        SIGN UP WITH GOOGLE
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#1a365d" }}>SELECT YOUR ROLE</Typography>
                      <RadioGroup value={role} onValueChange={(val) => setRole(val as 'coach' | 'player')}>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="player" id="player" />
                          <Label htmlFor="player" className="cursor-pointer flex-1">PLAYER</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="coach" id="coach" />
                          <Label htmlFor="coach" className="cursor-pointer flex-1">COACH</Label>
                        </div>
                      </RadioGroup>

                      {role === 'player' && (
                        <div className="space-y-2">
                          <Label className="font-semibold text-sm">SELECT SPORT</Label>
                          <Select value={selectedSport} onValueChange={setSelectedSport}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a sport..." />
                            </SelectTrigger>
                            <SelectContent>
                              {sports.map(sport => (
                                <SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <Button onClick={() => setSignupStep(1)} className="w-full mb-2 bg-gray-200 hover:bg-gray-300 text-gray-900 border-0">
                        BACK
                      </Button>
                      <Button 
                        onClick={async () => {
                          setLoading(true);
                          const { error } = await signUp(signupEmail, signupPassword, username, displayName, role, selectedSport);
                          if (!error) {
                            navigate('/dashboard', { replace: true });
                          }
                          setLoading(false);
                        }}
                        className="w-full bg-gradient-to-r from-[#ff7e00] to-[#ff9500] text-white font-semibold h-10"
                        disabled={loading || !selectedSport}
                      >
                        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default AuthPage;
