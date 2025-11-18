-- Create enum for coach specialty proficiency levels
CREATE TYPE coach_proficiency AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- Create specialty_types table for predefined specialties
CREATE TABLE public.specialty_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create focus_areas table for predefined focus areas
CREATE TABLE public.focus_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coach_profiles table for additional coach-specific information
CREATE TABLE public.coach_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  years_coaching INTEGER DEFAULT 0,
  certifications TEXT[],
  languages TEXT[],
  coaching_philosophy TEXT,
  rate_per_hour DECIMAL,
  currency TEXT DEFAULT 'USD',
  availability_schedule JSONB,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coach_specialties table for coach's specialties with proficiency
CREATE TABLE public.coach_specialties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_profile_id UUID NOT NULL,
  specialty_type_id UUID NOT NULL,
  proficiency coach_proficiency NOT NULL DEFAULT 'intermediate',
  years_experience INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(coach_profile_id, specialty_type_id)
);

-- Create coach_achievements table
CREATE TABLE public.coach_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_profile_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  year INTEGER,
  organization TEXT,
  achievement_type TEXT, -- 'playing' or 'coaching'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coach_education table
CREATE TABLE public.coach_education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_profile_id UUID NOT NULL,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  year_completed INTEGER,
  field_of_study TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coach_statistics table (read-only, calculated data)
CREATE TABLE public.coach_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_profile_id UUID NOT NULL UNIQUE,
  total_sessions INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  response_time_hours INTEGER DEFAULT 24,
  success_rate DECIMAL(5,2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.coach_profiles 
ADD CONSTRAINT fk_coach_profiles_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.coach_specialties 
ADD CONSTRAINT fk_coach_specialties_coach_profile 
FOREIGN KEY (coach_profile_id) REFERENCES public.coach_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.coach_specialties 
ADD CONSTRAINT fk_coach_specialties_specialty_type 
FOREIGN KEY (specialty_type_id) REFERENCES public.specialty_types(id) ON DELETE CASCADE;

ALTER TABLE public.coach_achievements 
ADD CONSTRAINT fk_coach_achievements_coach_profile 
FOREIGN KEY (coach_profile_id) REFERENCES public.coach_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.coach_education 
ADD CONSTRAINT fk_coach_education_coach_profile 
FOREIGN KEY (coach_profile_id) REFERENCES public.coach_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.coach_statistics 
ADD CONSTRAINT fk_coach_statistics_coach_profile 
FOREIGN KEY (coach_profile_id) REFERENCES public.coach_profiles(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.specialty_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_statistics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for specialty_types and focus_areas (readable by everyone)
CREATE POLICY "Specialty types are viewable by everyone" 
ON public.specialty_types FOR SELECT USING (true);

CREATE POLICY "Focus areas are viewable by everyone" 
ON public.focus_areas FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert specialty types" 
ON public.specialty_types FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert focus areas" 
ON public.focus_areas FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for coach_profiles
CREATE POLICY "Coach profiles are viewable by everyone" 
ON public.coach_profiles FOR SELECT USING (true);

CREATE POLICY "Coaches can insert their own profile" 
ON public.coach_profiles FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Coaches can update their own profile" 
ON public.coach_profiles FOR UPDATE 
USING (
  user_id IN (
    SELECT user_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- RLS Policies for coach_specialties
CREATE POLICY "Coach specialties are viewable by everyone" 
ON public.coach_specialties FOR SELECT USING (true);

CREATE POLICY "Coaches can manage their own specialties" 
ON public.coach_specialties FOR INSERT 
WITH CHECK (
  coach_profile_id IN (
    SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Coaches can update their own specialties" 
ON public.coach_specialties FOR UPDATE 
USING (
  coach_profile_id IN (
    SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Coaches can delete their own specialties" 
ON public.coach_specialties FOR DELETE 
USING (
  coach_profile_id IN (
    SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
  )
);

-- RLS Policies for coach_achievements
CREATE POLICY "Coach achievements are viewable by everyone" 
ON public.coach_achievements FOR SELECT USING (true);

CREATE POLICY "Coaches can manage their own achievements" 
ON public.coach_achievements FOR INSERT 
WITH CHECK (
  coach_profile_id IN (
    SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Coaches can update their own achievements" 
ON public.coach_achievements FOR UPDATE 
USING (
  coach_profile_id IN (
    SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Coaches can delete their own achievements" 
ON public.coach_achievements FOR DELETE 
USING (
  coach_profile_id IN (
    SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
  )
);

-- RLS Policies for coach_education
CREATE POLICY "Coach education is viewable by everyone" 
ON public.coach_education FOR SELECT USING (true);

CREATE POLICY "Coaches can manage their own education" 
ON public.coach_education FOR INSERT 
WITH CHECK (
  coach_profile_id IN (
    SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Coaches can update their own education" 
ON public.coach_education FOR UPDATE 
USING (
  coach_profile_id IN (
    SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Coaches can delete their own education" 
ON public.coach_education FOR DELETE 
USING (
  coach_profile_id IN (
    SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
  )
);

-- RLS Policies for coach_statistics (read-only for coaches, system managed)
CREATE POLICY "Coach statistics are viewable by everyone" 
ON public.coach_statistics FOR SELECT USING (true);

CREATE POLICY "Only system can update coach statistics" 
ON public.coach_statistics FOR UPDATE 
USING (false); -- Will be updated via admin functions only

-- Create trigger for updating coach_profiles timestamps
CREATE TRIGGER update_coach_profiles_updated_at
BEFORE UPDATE ON public.coach_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updating coach_statistics timestamps
CREATE TRIGGER update_coach_statistics_updated_at
BEFORE UPDATE ON public.coach_statistics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default specialty types
INSERT INTO public.specialty_types (name, description) VALUES
('Forehand Technique', 'Improving forehand stroke mechanics and power'),
('Backhand Technique', 'Developing effective backhand shots'),
('Serve Technique', 'Mastering various serving techniques'),
('Return of Serve', 'Improving serve return strategies'),
('Footwork', 'Developing proper movement and positioning'),
('Spin Techniques', 'Mastering topspin, backspin, and sidespin'),
('Mental Game', 'Building mental toughness and focus'),
('Match Strategy', 'Developing tactical game plans'),
('Physical Conditioning', 'Improving fitness for table tennis'),
('Equipment Selection', 'Choosing the right paddle and rubbers'),
('Defensive Play', 'Mastering defensive techniques'),
('Attacking Play', 'Developing aggressive playing style'),
('Counter-Attack', 'Converting defense to offense'),
('Doubles Strategy', 'Tactics for doubles play'),
('Junior Development', 'Specialized coaching for young players'),
('Beginner Fundamentals', 'Teaching basic skills to new players'),
('Advanced Techniques', 'Complex shots and strategies'),
('Competition Preparation', 'Preparing for tournaments'),
('Injury Prevention', 'Techniques to avoid common injuries'),
('Game Analysis', 'Video analysis and feedback');

-- Insert default focus areas
INSERT INTO public.focus_areas (name, description) VALUES
('Technical Skills', 'Improving stroke technique and mechanics'),
('Tactical Development', 'Strategic game planning and execution'),
('Physical Fitness', 'Conditioning and athletic development'),
('Mental Training', 'Psychological aspects of performance'),
('Match Play', 'Competitive game situations'),
('Serve & Receive', 'Specialized serving and receiving practice'),
('Footwork & Movement', 'Positioning and court coverage'),
('Spin Control', 'Mastering and reading spin'),
('Equipment Optimization', 'Paddle and rubber selection'),
('Injury Rehabilitation', 'Recovery and prevention training'),
('Youth Development', 'Age-appropriate skill building'),
('Advanced Competition', 'Elite level tournament preparation'),
('Recreational Play', 'Fun and social aspects of the game'),
('Video Analysis', 'Technical breakdown using recordings'),
('Group Training', 'Team and group coaching sessions');