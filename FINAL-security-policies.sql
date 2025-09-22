-- FINAL SECURITY POLICIES FOR GUYANA HOME HUB
-- Copy and paste this entire block into your Supabase SQL Editor
-- This version works with TEXT columns (not arrays)

-- First, clean up ALL existing policies comprehensively
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own basic profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Super admin can update any profile" ON profiles;
DROP POLICY IF EXISTS "Super admin can create admin users" ON profiles;
DROP POLICY IF EXISTS "Super admin can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update user roles" ON profiles;
DROP POLICY IF EXISTS "Super admins can do everything" ON profiles;
DROP TRIGGER IF EXISTS enforce_role_protection ON profiles;
DROP FUNCTION IF EXISTS prevent_role_escalation();

-- Drop any remaining policies with dynamic cleanup
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON profiles';
    END LOOP;
END $$;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy 2: Users can update their own basic profile (but not roles)
CREATE POLICY "Users can update own basic profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Prevent users from changing their own roles/user_type
    user_type IS NOT DISTINCT FROM (SELECT user_type FROM profiles WHERE id = auth.uid()) AND
    roles IS NOT DISTINCT FROM (SELECT roles FROM profiles WHERE id = auth.uid())
  );

-- Policy 3: Super admins can update any profile
CREATE POLICY "Super admin can update any profile" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'super_admin'
    )
  );

-- Policy 4: Allow basic profile creation (agents register as 'agent', customers as 'customer')
CREATE POLICY "Allow profile creation" ON profiles
  FOR INSERT WITH CHECK (
    -- Allow regular user profiles
    user_type IN ('customer', 'agent') OR
    -- Only super admins can create admin/super_admin accounts
    (user_type IN ('admin', 'super_admin') AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'super_admin'
    ))
  );

-- Policy 5: Super admins can delete profiles
CREATE POLICY "Super admin can delete profiles" ON profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'super_admin'
    )
  );

-- Policy 6: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type IN ('admin', 'super_admin')
    )
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE profiles TO authenticated;
GRANT SELECT ON TABLE profiles TO anon;
