-- Create sports table
CREATE TABLE public.sports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can view sports)
CREATE POLICY "Sports are viewable by everyone" 
ON public.sports 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert sports
CREATE POLICY "Authenticated users can insert sports" 
ON public.sports 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy for authenticated users to update sports
CREATE POLICY "Authenticated users can update sports" 
ON public.sports 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sports_updated_at
BEFORE UPDATE ON public.sports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial sports data
INSERT INTO public.sports (name) VALUES
  ('Table Tennis'),
  ('Tennis'),
  ('Badminton'),
  ('Squash'),
  ('Racquetball'),
  ('Pickleball');