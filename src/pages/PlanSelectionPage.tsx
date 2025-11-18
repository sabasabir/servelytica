import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

const PlanSelectionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('pricing')
          .select('*')
          .order('display_order');

        if (error) throw error;
        setPlans(data || []);
      } catch (error) {
        console.error('Error fetching plans:', error);
        toast({
          title: "Error",
          description: "Failed to load pricing plans",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [user, navigate, toast]);

  const handlePlanSelection = async (planId: string) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const selectedPlanData = plans.find(p => p.id === planId);
      if (!selectedPlanData) throw new Error('Plan not found');

      const subscriptionType = selectedPlanData.name === 'Free' ? 'free' : billingPeriod;
      const price = billingPeriod === 'yearly' ? selectedPlanData.yearly_price : selectedPlanData.monthly_price;

      // Check if user already has a subscription
      const { data: existingSubscription } = await supabase
        .from('users_subscription')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingSubscription) {
        // Update existing subscription
        const { error } = await supabase
          .from('users_subscription')
          .update({
            pricing_plan_id: planId,
            subscription_type: subscriptionType,
            status: selectedPlanData.name === 'Free' ? 'active' : 'pending',
            price_paid: price,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new subscription
        const { error } = await supabase
          .from('users_subscription')
          .insert({
            user_id: user.id,
            pricing_plan_id: planId,
            subscription_type: subscriptionType,
            status: selectedPlanData.name === 'Free' ? 'active' : 'pending',
            price_paid: price,
            start_date: new Date().toISOString(),
            end_date: selectedPlanData.name === 'Free' ? null : undefined
          });

        if (error) throw error;
      }

      toast({
        title: "Plan Selected",
        description: `You have selected the ${selectedPlanData.name} plan.`,
      });

      // Navigate to profile page
      navigate('/profile');
    } catch (error: any) {
      console.error('Error selecting plan:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to select plan",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div>Loading plans...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
            <p className="text-muted-foreground">
              Select the plan that best fits your needs to get started
            </p>
          </div>

          {/* Billing Period Toggle */}
          <div className="flex justify-center mb-8">
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

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const price = billingPeriod === 'yearly' ? plan.yearly_price : plan.monthly_price;
              const isSelected = selectedPlan === plan.id;

              return (
                <Card
                  key={plan.id}
                  className={`relative cursor-pointer transition-all hover:scale-105 ${
                    plan.recommended ? 'border-primary' : ''
                  } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.recommended && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      Recommended
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        ${price === 0 ? 'Free' : price.toFixed(2)}
                      </span>
                      {price > 0 && (
                        <span className="text-muted-foreground">
                          /{billingPeriod === 'yearly' ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <span className="mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.button_variant as any}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlanSelection(plan.id);
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Selecting...' : plan.button_text}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PlanSelectionPage;