import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
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
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SurvayModal from '@/components/SurvayModal';

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
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'coach' | 'player'>('player');
  const [selectedSport, setSelectedSport] = useState('');
  
  // Step form state for players
  const [signupStep, setSignupStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Fetch sports and plans on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch sports
      const { data: sportsData } = await supabase
        .from('sports')
        .select('id, name')
        .order('name');
      
      if (sportsData) {
        setSports(sportsData);
      }

      // Fetch plans
      const { data: plansData } = await supabase
        .from('pricing')
        .select('*')
        .order('display_order');
      
      if (plansData) {
        setPlans(plansData);
      }
    };

    fetchData();
  }, []);

  // Redirect if already logged in - but allow access from email confirmation
  if (user && !window.location.search.includes('access_token')) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await signIn(loginEmail, loginPassword);
    setLoading(false);
  };

  const handleSignupStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password strength
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

    if (!selectedSport) {
      toast({
        title: "Error",
        description: "Please select a sport",
        variant: "destructive",
      });
      return;
    }

    // If player, go to step 2 for plan selection
    if (role === 'player') {
      setSignupStep(2);
    } else {
      // If coach, sign up directly
      setLoading(true);
      await signUp(signupEmail, signupPassword, username, displayName, role, selectedSport);
      setLoading(false);
    }
  };


  const handleSignupComplete = async () => {
    if (role === 'player' && !selectedPlan) {
      toast({
        title: "Error",
        description: "Please select a plan",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, username, displayName, role, selectedSport);
    
    if (!error && role === 'player' && selectedPlan) {
      // Update subscription with the selected plan
      const selectedPlanData = plans.find(p => p.id === selectedPlan);
      if (selectedPlanData) {
        const subscriptionType = selectedPlanData.name === 'Free' ? 'free' : billingPeriod;
        const price = billingPeriod === 'yearly' ? selectedPlanData.yearly_price : selectedPlanData.monthly_price;
        
        // Calculate end_date based on billing period
        let endDate = null;
        if (selectedPlanData.name !== 'Free') {
          const currentDate = new Date();
          if (billingPeriod === 'monthly') {
            endDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
          } else if (billingPeriod === 'yearly') {
            endDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
          }
        }
        
        // Wait a moment for the trigger to create the initial subscription
        setTimeout(async () => {
          try {
            const { error: updateError } = await supabase
              .from('users_subscription')
              .update({
                pricing_plan_id: selectedPlan,
                subscription_type: subscriptionType as any,
                price_paid: price,
                status: selectedPlanData.name === 'Free' ? 'active' : 'pending',
                end_date: endDate ? endDate.toISOString() : null
              })
              .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
              
              if (updateError) {
                  console.error('Error updating subscription:', updateError);
                }
                // First, fetch the current total_analysis_limit
                // const { data: profileData, error: fetchProfileError } = await supabase
                //   .from('profiles')
                //   .select('total_analysis_limit')
                //   .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
                //   .single();

                // if (!fetchProfileError && profileData) {
                //   const newLimit = (profileData.total_analysis_limit || 0) + (selectedPlanData?.analysis_limit || 0);

                //   const { error: updateErrorProfileData } = await supabase
                //     .from('profiles')
                //     .update({
                //       total_analysis_limit: newLimit,
                //     })
                //     .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
                // }
          } catch (updateError) {
            console.error('Error updating subscription:', updateError);
          }
        }, 1000);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center section-padding">

 

        <Card className="w-full max-w-6xl">{/* Increased from max-w-md to max-w-6xl for horizontal layout */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>Create account</CardTitle>
                <CardDescription>
                  {signupStep === 1 ? 'Join Servelytica today' : 'Choose your plan'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {signupStep === 1 ? (
                  <form onSubmit={handleSignupStep1} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    {/* Username and Display Name - Side by side on large screens */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="display-name">Display Name</Label>
                        <Input
                          id="display-name"
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Password fields - Side by side on large screens */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          minLength={6}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          minLength={6}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>I am a:</Label>
                      <RadioGroup 
                        value={role} 
                        onValueChange={(value: 'coach' | 'player') => setRole(value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="player" id="player" />
                          <Label htmlFor="player">Player</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="coach" id="coach" />
                          <Label htmlFor="coach">Coach</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sport">Sport</Label>
                      <Select value={selectedSport} onValueChange={setSelectedSport}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your sport" />
                        </SelectTrigger>
                        <SelectContent>
                          {sports.map((sport) => (
                            <SelectItem key={sport.id} value={sport.id}>
                              {sport.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {role === 'player' ? 'Continue' : (loading ? 'Creating account...' : 'Create Account')}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Billing Period Toggle */}
                    <div className="flex justify-center mb-6">
                      <div className="bg-muted p-1 rounded-lg">
                        <Button
                          variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setBillingPeriod('monthly')}
                        >
                          Monthly
                        </Button>
                        <Button
                          variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setBillingPeriod('yearly')}
                        >
                          Yearly
                        </Button>
                      </div>
                    </div>

                    {/* Plans - Horizontal Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
                      {plans.map((plan) => {
                        const price = billingPeriod === 'yearly' ? plan.yearly_price : plan.monthly_price;
                        const isSelected = selectedPlan === plan.id;

                        return (
                          <Card
                            key={plan.id}
                            className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg min-h-[400px] ${
                              plan.recommended ? 'border-primary' : ''
                            } ${isSelected ? 'ring-2 ring-primary bg-primary/5 border-primary shadow-lg scale-[1.02]' : 'hover:scale-[1.01]'}`}
                            onClick={() => setSelectedPlan(plan.id)}
                          >
                            {plan.recommended && (
                              <Badge className="absolute -top-2 left-4 z-10">
                                Recommended
                              </Badge>
                            )}
                            {isSelected && (
                              <div className="absolute -top-2 right-4 z-10">
                                <Badge variant="default" className="bg-primary">
                                  Selected
                                </Badge>
                              </div>
                            )}
                            <CardHeader className="pb-4">
                              <CardTitle className={`text-xl ${isSelected ? 'text-primary' : ''}`}>
                                {plan.name}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {plan.description}
                              </CardDescription>
                              <div className="mt-4">
                                <span className={`text-3xl font-bold ${isSelected ? 'text-primary' : ''}`}>
                                  ${price === 0 ? 'Free' : price.toFixed(2)}
                                </span>
                                {price > 0 && (
                                  <span className="text-muted-foreground ml-1">
                                    /{billingPeriod === 'yearly' ? 'year' : 'month'}
                                  </span>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0 flex-1 flex flex-col">
                              <ul className="text-sm space-y-2 flex-1">
                                {plan.features.map((feature, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className={`mr-2 mt-0.5 text-base ${isSelected ? 'text-primary' : 'text-green-500'}`}>
                                      ✓
                                    </span>
                                    <span className="leading-relaxed">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setSignupStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleSignupComplete}
                        disabled={loading || !selectedPlan}
                        className="flex-1"
                      >
                        {loading ? 'Creating account...' : 'Create Account'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default AuthPage;