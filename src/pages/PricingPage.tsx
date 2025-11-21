
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Box, Container, Typography, Card, CardContent, Switch } from "@mui/material";
import { motion } from "framer-motion";

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

interface UserSubscription {
  pricing_plan_id: string;
  subscription_type: string;
  status: string;
}

const PricingPage = () => {
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: plansData, error: plansError } = await supabase
          .from('pricing')
          .select('*')
          .order('display_order');

        if (plansError) {
          console.error('Error fetching pricing plans:', plansError);
          return;
        }

        setPricingPlans(plansData || []);

        if (user) {
          const { data: subscriptionData, error: subscriptionError } = await supabase
            .from('users_subscription')
            .select('pricing_plan_id, subscription_type, status')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .maybeSingle();

          if (subscriptionError) {
            console.error('Error fetching user subscription:', subscriptionError);
          } else if (subscriptionData) {
            setUserSubscription(subscriptionData);
          } else {
            const freePlan = plansData?.find(plan => plan.name === 'Free');
            if (freePlan) {
              const { data: newSubscription, error: createError } = await supabase
                .from('users_subscription')
                .insert({
                  user_id: user.id,
                  pricing_plan_id: freePlan.id,
                  subscription_type: 'free',
                  status: 'active',
                  start_date: new Date().toISOString(),
                  price_paid: 0,
                  auto_renew: false
                })
                .select('pricing_plan_id, subscription_type, status')
                .single();

              if (!createError) {
                setUserSubscription(newSubscription);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getPlanLevel = (planName: string): number => {
    const levels = { 'Free': 1, 'Advanced': 2, 'Pro': 3 };
    return levels[planName as keyof typeof levels] || 1;
  };

  const getButtonText = (plan: PricingPlan): string => {
    if (!user) return plan.button_text;
    if (!userSubscription) return plan.button_text;
    
    const currentPlan = pricingPlans.find(p => p.id === userSubscription.pricing_plan_id);
    if (!currentPlan) return plan.button_text;
    
    const currentPlanLevel = getPlanLevel(currentPlan.name);
    const newPlanLevel = getPlanLevel(plan.name);
    
    if (currentPlanLevel === newPlanLevel) return "CURRENT PLAN";
    return plan.button_text;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />
      
      <Box component="main" sx={{ flex: 1, py: { xs: 8, md: 14 } }}>
        <Container maxWidth="lg">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: "center", mb: { xs: 8, md: 10 } }}>
              <Typography
                sx={{
                  color: "#ff7e00",
                  fontWeight: 700,
                  fontSize: "14px",
                  letterSpacing: "2px",
                  mb: 2,
                  textTransform: "uppercase",
                  fontFamily: '"Poppins", "Sora", sans-serif',
                }}
              >
                SIMPLE PRICING
              </Typography>
              
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "28px", md: "48px" },
                  fontWeight: 800,
                  mb: 3,
                  color: "#1a365d",
                  fontFamily: '"Poppins", "Sora", sans-serif',
                }}
              >
                CHOOSE YOUR PLAN
              </Typography>

              <Typography
                sx={{
                  fontSize: "18px",
                  color: "#64748b",
                  maxWidth: "600px",
                  mx: "auto",
                  mb: 6,
                }}
              >
                Start with our free plan and upgrade anytime as your needs grow
              </Typography>

              {/* Billing Toggle */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                <Typography sx={{ fontWeight: billingPeriod === "monthly" ? 700 : 500, color: billingPeriod === "monthly" ? "#1a365d" : "#64748b" }}>
                  MONTHLY
                </Typography>
                <Switch 
                  checked={billingPeriod === "yearly"}
                  onChange={(e) => setBillingPeriod(e.target.checked ? "yearly" : "monthly")}
                  sx={{ 
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#ff7e00' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { background: '#ff7e00' },
                  }}
                />
                <Typography sx={{ fontWeight: billingPeriod === "yearly" ? 700 : 500, color: billingPeriod === "yearly" ? "#1a365d" : "#64748b" }}>
                  YEARLY
                </Typography>
                {billingPeriod === "yearly" && (
                  <Badge className="bg-gradient-to-r from-[#ff7e00] to-[#ff9500] text-white">
                    SAVE 20%
                  </Badge>
                )}
              </Box>
            </Box>
          </motion.div>

          {/* Pricing Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 4,
              mb: 8,
            }}
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    border: plan.recommended ? "2px solid #ff7e00" : "1px solid #e2e8f0",
                    borderRadius: "16px",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: plan.recommended 
                        ? "0 20px 40px rgba(255, 126, 0, 0.15)"
                        : "0 10px 30px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  {plan.recommended && (
                    <Box sx={{ background: "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)", py: 1, textAlign: "center" }}>
                      <Typography sx={{ color: "white", fontWeight: 700, fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>
                        MOST POPULAR
                      </Typography>
                    </Box>
                  )}

                  <CardContent sx={{ p: 4 }}>
                    <Typography sx={{ fontSize: "20px", fontWeight: 800, mb: 1, color: "#1a365d", fontFamily: '"Poppins", "Sora", sans-serif' }}>
                      {plan.name.toUpperCase()}
                    </Typography>
                    
                    <Typography sx={{ color: "#64748b", mb: 4 }}>{plan.description}</Typography>

                    {/* Price */}
                    <Box sx={{ mb: 4 }}>
                      <Typography sx={{ fontSize: "42px", fontWeight: 800, color: plan.recommended ? "#ff7e00" : "#1a365d" }}>
                        ${billingPeriod === "monthly" ? plan.monthly_price : Math.floor(plan.yearly_price / 12)}
                      </Typography>
                      <Typography sx={{ color: "#64748b", fontSize: "14px" }}>
                        {billingPeriod === "monthly" ? "per month" : "per month (billed yearly)"}
                      </Typography>
                    </Box>

                    {/* Button */}
                    <Link to="/auth">
                      <Button className={plan.recommended ? "w-full bg-gradient-to-r from-[#ff7e00] to-[#ff9500] text-white" : "w-full"}>
                        {getButtonText(plan)}
                      </Button>
                    </Link>

                    {/* Features */}
                    <Box sx={{ mt: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                      {plan.features.map((feature, idx) => (
                        <Box key={idx} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                          <Check size={20} style={{ color: "#ff7e00", flexShrink: 0, marginTop: "2px" }} />
                          <Typography sx={{ color: "#64748b", fontSize: "14px" }}>{feature}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default PricingPage;
