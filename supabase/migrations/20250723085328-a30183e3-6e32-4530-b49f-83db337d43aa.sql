
-- Create pricing table to store plan information
CREATE TABLE public.pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  yearly_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  features TEXT[] NOT NULL DEFAULT '{}',
  recommended BOOLEAN NOT NULL DEFAULT false,
  button_text TEXT NOT NULL DEFAULT 'Get Started',
  button_variant TEXT NOT NULL DEFAULT 'outline',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for the pricing table
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to view pricing plans (they are public)
CREATE POLICY "Pricing plans are viewable by everyone" 
ON public.pricing 
FOR SELECT 
USING (true);

-- Create policy to allow authenticated users to insert pricing plans (admin functionality)
CREATE POLICY "Authenticated users can insert pricing plans" 
ON public.pricing 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy to allow authenticated users to update pricing plans (admin functionality)
CREATE POLICY "Authenticated users can update pricing plans" 
ON public.pricing 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Insert the 3 existing plans into the pricing table
INSERT INTO public.pricing (name, description, monthly_price, yearly_price, features, recommended, button_text, button_variant, display_order) VALUES
(
  'Free',
  'Perfect for beginners and casual players',
  0.00,
  0.00,
  ARRAY[
    '1 game analysis per month',
    'Basic feedback',
    '24-hour turnaround time',
    'Access to community forums',
    'Connect with 5 players nearby'
  ],
  false,
  'Get Started',
  'outline',
  1
),
(
  'Advanced',
  'For dedicated players looking to improve',
  59.99,
  47.99,
  ARRAY[
    '5 game analyses per month',
    'Detailed technique breakdown',
    '12-hour turnaround time',
    'Access to community forums',
    'Connect with unlimited players',
    '1 live coaching session monthly',
    'Personalized training plan'
  ],
  true,
  'Try Advanced',
  'default',
  2
),
(
  'Pro',
  'For competitive and professional players',
  129.99,
  103.99,
  ARRAY[
    'Unlimited game analyses',
    'Priority coach selection',
    '6-hour turnaround time',
    'Access to elite coaches',
    'Connect with unlimited players',
    '3 live coaching sessions monthly',
    'Advanced match strategy',
    'Opponent analysis',
    'Custom training program'
  ],
  false,
  'Go Pro',
  'outline',
  3
);

-- Add trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_pricing_updated_at
  BEFORE UPDATE ON public.pricing
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
