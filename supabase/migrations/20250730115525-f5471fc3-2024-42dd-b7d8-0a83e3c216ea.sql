-- First, let's check if RLS is enabled on analysis_usage and ensure proper policies
ALTER TABLE analysis_usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them properly
DROP POLICY IF EXISTS "Users can insert their own analysis usage" ON analysis_usage;
DROP POLICY IF EXISTS "Users can view their own analysis usage" ON analysis_usage;

-- Create proper RLS policies for analysis_usage
CREATE POLICY "Users can insert their own analysis usage" 
ON analysis_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own analysis usage" 
ON analysis_usage 
FOR SELECT 
USING (auth.uid() = user_id);

-- Also add policy for admins to view all usage (optional)
CREATE POLICY "Admins can view all analysis usage" 
ON analysis_usage 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Test the can_create_analysis function works correctly
SELECT can_create_analysis('ac49f6d5-8d4a-44fe-93b0-346ac2a4e239'::uuid);