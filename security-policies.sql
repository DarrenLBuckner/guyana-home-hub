-- Security policies for Guyana Home Hub profiles table
-- Run these commands in your Supabase SQL Editor

-- 1. Enable Row Level Security on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 3. Allow users to update their own profile data (but not roles/user_type)
CREATE POLICY "Users can update own basic profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. Separate policy for super admins to update any profile
CREATE POLICY "Super admin can update any profile" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (roles = 'super_admin' OR user_type = 'super_admin')
    )
  );

-- 5. Only super admins can create new admin users
CREATE POLICY "Super admin can create admin users" ON profiles
  FOR INSERT WITH CHECK (
    -- Allow regular user profiles (non-admin)
    (NEW.roles IS NULL OR (NEW.roles NOT IN ('admin', 'super_admin'))) AND
    (NEW.user_type IS NULL OR (NEW.user_type NOT IN ('admin', 'super_admin')))
    OR
    -- Only if current user is a super admin
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (roles = 'super_admin' OR user_type = 'super_admin')
    )
  );

-- 6. Allow super admins to delete profiles (if needed)
CREATE POLICY "Super admin can delete profiles" ON profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (roles = 'super_admin' OR user_type = 'super_admin')
    )
  );

-- Note: These policies ensure:
-- - Regular users can only view/edit their own basic profile info
-- - Super admins can create new admin users and modify any profile
-- - For role protection, rely on application-level validation
-- - Role escalation prevention is handled by limiting Supabase dashboard access

-- Additional security: Use a trigger to prevent role changes through the app
CREATE OR REPLACE FUNCTION prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow if user is super admin
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND (roles = 'super_admin' OR user_type = 'super_admin')
  ) THEN
    RETURN NEW;
  END IF;
  
  -- For regular users, prevent role/user_type changes
  IF OLD.roles IS DISTINCT FROM NEW.roles OR OLD.user_type IS DISTINCT FROM NEW.user_type THEN
    RAISE EXCEPTION 'Permission denied: Cannot modify user roles';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_role_protection
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION prevent_role_escalation();
