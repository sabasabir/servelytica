
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
        // Fetch pricing plans
        const { data: plansData, error: plansError } = await supabase
          .from('pricing')
          .select('*')
          .order('display_order');

        if (plansError) {
          console.error('Error fetching pricing plans:', plansError);
          return;
        }

        // console.log('Pricing plans fetched:', plansData);
        setPricingPlans(plansData || []);

        // Fetch user's current subscription if logged in
        if (user) {
        //   console.log('Fetching subscription for user:', user.id);
          
          // First try to get active subscription
          const { data: subscriptionData, error: subscriptionError } = await supabase
            .from('users_subscription')
            .select('pricing_plan_id, subscription_type, status')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .maybeSingle();

          if (subscriptionError) {
            console.error('Error fetching user subscription:', subscriptionError);
          } else if (subscriptionData) {
            // console.log('User subscription found:', subscriptionData);
            setUserSubscription(subscriptionData);
          } else {
            console.log('No active subscription found, checking for free plan');
            
            // If no active subscription, create a default free one
            const freePlan = plansData?.find(plan => plan.name === 'Free');
            if (freePlan) {
              console.log('Creating free subscription for user');
              
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

              if (createError) {
                console.error('Error creating free subscription:', createError);
              } else {
                // console.log('Free subscription created:', newSubscription);
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
    const thisPlanLevel = getPlanLevel(plan.name);
    
    console.log('Button text logic:', {
      currentPlan: currentPlan.name,
      currentPlanLevel,
      thisPlan: plan.name,
      thisPlanLevel,
      isCurrentPlan: plan.id === userSubscription.pricing_plan_id
    });
    
    if (plan.id === userSubscription.pricing_plan_id) {
      return "Current Plan";
    } else if (thisPlanLevel > currentPlanLevel) {
      return "Upgrade";
    } else if (thisPlanLevel < currentPlanLevel) {
      return "Downgrade";
    } else {
      return plan.button_text;
    }
  };

  const isCurrentPlan = (planId: string): boolean => {
    return user && userSubscription && planId === userSubscription.pricing_plan_id;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Pricing Header */}
      <section className="bg-gradient-to-r from-tt-blue to-tt-lightBlue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Membership Plan</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Select the perfect plan to elevate your table tennis skills with professional analysis and coaching
          </p>
          
          {/* Billing Toggle */}
          <div className="mt-10 inline-flex items-center bg-white/10 p-1 rounded-full">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billingPeriod === "monthly" ? "bg-white text-tt-blue" : "text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billingPeriod === "yearly" ? "bg-white text-tt-blue" : "text-white"
              }`}
            >
              Yearly (20% off)
            </button>
          </div>
        </div>
      </section>
      
      {/* Pricing Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tt-orange"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => {
                const currentPrice = billingPeriod === "monthly" ? plan.monthly_price : plan.yearly_price;
                const isUserCurrentPlan = isCurrentPlan(plan.id);
                const buttonText = getButtonText(plan);
                const isUpgrade = buttonText === "Upgrade";
                const isDowngrade = buttonText === "Downgrade";
                
                console.log('Rendering plan:', {
                  planName: plan.name,
                  planId: plan.id,
                  isUserCurrentPlan,
                  buttonText,
                  userSubscription
                });
                
                return (
                  <div 
                    key={plan.id} 
                    className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl border ${
                      isUserCurrentPlan ? "border-green-500 ring-2 ring-green-200" : 
                      plan.recommended ? "border-tt-orange" : "border-gray-200"
                    }`}
                  >
                    {isUserCurrentPlan && (
                      <Badge className="absolute top-4 left-4 bg-green-500 text-white z-10">Your Plan</Badge>
                    )}
                    {plan.recommended && !isUserCurrentPlan && (
                      <Badge className="absolute top-4 right-4 bg-tt-orange">Recommended</Badge>
                    )}
                    <div className="p-8">
                      <h3 className={`text-2xl font-bold ${isUserCurrentPlan ? 'text-green-600' : 'text-tt-blue'}`}>
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 mt-2">{plan.description}</p>
                      
                      <div className="mt-6">
                        <span className={`text-4xl font-bold ${isUserCurrentPlan ? 'text-green-600' : 'text-tt-blue'}`}>
                          ${currentPrice}
                        </span>
                        <span className="text-gray-500 ml-2">
                          {currentPrice > 0 ? `/ ${billingPeriod === "monthly" ? "month" : "month, billed yearly"}` : "forever"}
                        </span>
                      </div>
                      
                      <ul className="mt-8 space-y-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className={`h-5 w-5 flex-shrink-0 mr-2 ${isUserCurrentPlan ? 'text-green-500' : 'text-tt-orange'}`} />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-8">
                        {isUserCurrentPlan ? (
                          <Button 
                            disabled
                            className="w-full bg-green-500 text-white opacity-70 cursor-not-allowed"
                          >
                            {buttonText}
                          </Button>
                        ) : (
                          <Link to={user ? "/dashboard" : "/auth"}>
                            <Button 
                              variant={plan.button_variant as "default" | "outline"}
                              className={`w-full ${
                                isUpgrade 
                                  ? "bg-green-600 hover:bg-green-700 text-white" 
                                  : isDowngrade
                                  ? "bg-gray-500 hover:bg-gray-600 text-white"
                                  : plan.button_variant === "default" 
                                  ? "bg-tt-orange hover:bg-orange-600 text-white" 
                                  : "border-tt-orange text-tt-orange hover:bg-tt-orange hover:text-white"
                              }`}
                            >
                              {buttonText}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-tt-blue text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-tt-blue mb-2">What's included in the game analysis?</h3>
              <p className="text-gray-700">
                Our coaches provide detailed feedback on your technique, strategy, and overall gameplay. They identify strengths and weaknesses, and provide specific drills and exercises to improve your skills.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-tt-blue mb-2">Can I change my subscription plan?</h3>
              <p className="text-gray-700">
                Yes, you can upgrade or downgrade your subscription at any time. Changes will take effect at the start of your next billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-tt-blue mb-2">How quickly will I receive my analysis?</h3>
              <p className="text-gray-700">
                Turnaround times vary by plan - Free (24 hours), Advanced (12 hours), and Pro (6 hours). Our coaches work diligently to provide thorough analysis within these timeframes.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-tt-blue mb-2">What if I don't use all my monthly analyses?</h3>
              <p className="text-gray-700">
                Unfortunately, unused analyses don't roll over to the next month. We encourage you to make the most of your subscription by regularly uploading your games.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-tt-blue text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to improve your table tennis game?</h2>
          <p className="text-xl mb-8">
            Join players worldwide who are taking their skills to the next level with professional analysis and coaching.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/upload">
              <Button className="bg-tt-orange hover:bg-orange-600 text-white">
                Upload Your Game
              </Button>
            </Link>
            <Link to="/connect">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-tt-blue">
                Connect With Players
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
