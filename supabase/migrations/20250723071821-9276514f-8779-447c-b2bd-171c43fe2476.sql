
-- Add a new RLS policy to allow coaches to view videos assigned to them
CREATE POLICY "Coaches can view videos assigned to them" 
ON public.videos 
FOR SELECT 
USING (auth.uid() = coach_id);
