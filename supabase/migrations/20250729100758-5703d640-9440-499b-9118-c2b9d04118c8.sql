-- Update the RLS policy to allow everyone to see player roles as well as coach roles
DROP POLICY IF EXISTS "Users can view coach roles" ON public.user_roles;

CREATE POLICY "Users can view coach and player roles" 
ON public.user_roles 
FOR SELECT 
USING (
  (role = 'coach'::app_role) OR 
  (role = 'player'::app_role) OR 
  (auth.uid() = user_id)
);