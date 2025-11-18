-- Drop the restrictive policy that only allows users to see their own roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create a new policy that allows users to view coach roles specifically
CREATE POLICY "Users can view coach roles" 
ON public.user_roles 
FOR SELECT 
USING (role = 'coach' OR auth.uid() = user_id);

-- This allows users to:
-- 1. See all coach roles (needed for the coach dropdown)
-- 2. See their own role (needed for role-based access control)