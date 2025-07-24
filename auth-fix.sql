-- AUTHENTICATION FIX SQL SCRIPT
-- Run this in Supabase SQL Editor to fix authentication issues

-- 1. Ensure profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text,
  full_name text,
  phone text,
  country text,
  budget text,
  roles text,
  user_type text DEFAULT 'client',
  vetting_status text DEFAULT 'not_submitted',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Create test agent profile if it doesn't exist
-- First, find the user ID for test-agent@example.com
DO $$
DECLARE
    test_user_id uuid;
BEGIN
    -- Get the user ID for test-agent@example.com from auth.users
    SELECT id INTO test_user_id 
    FROM auth.users 
    WHERE email = 'test-agent@example.com';
    
    -- If user exists, create/update their profile
    IF test_user_id IS NOT NULL THEN
        INSERT INTO profiles (
            id, 
            email, 
            full_name, 
            user_type, 
            roles, 
            vetting_status,
            updated_at
        ) VALUES (
            test_user_id,
            'test-agent@example.com', 
            'Test Agent', 
            'agent', 
            'agent', 
            'approved',
            now()
        )
        ON CONFLICT (id) 
        DO UPDATE SET 
            user_type = 'agent',
            roles = 'agent',
            vetting_status = 'approved',
            updated_at = now();
        
        RAISE NOTICE 'Test agent profile created/updated successfully';
    ELSE
        RAISE NOTICE 'Test agent user not found in auth.users - please create user first';
    END IF;
END $$;

-- 3. Create admin user profile (for your super admin)
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the user ID for your admin email
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'darren@stlpropertybrothers.com';
    
    -- If user exists, create/update their profile
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO profiles (
            id, 
            email, 
            full_name, 
            user_type, 
            roles, 
            updated_at
        ) VALUES (
            admin_user_id,
            'darren@stlpropertybrothers.com', 
            'Darren Buckner', 
            'super_admin', 
            'super_admin', 
            now()
        )
        ON CONFLICT (id) 
        DO UPDATE SET 
            user_type = 'super_admin',
            roles = 'super_admin',
            updated_at = now();
        
        RAISE NOTICE 'Admin profile created/updated successfully';
    ELSE
        RAISE NOTICE 'Admin user not found in auth.users';
    END IF;
END $$;

-- 4. Grant proper permissions
GRANT ALL ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- 5. Create RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create new policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type IN ('admin', 'super_admin')
    )
  );

-- 6. Check current users
SELECT 
  u.email,
  u.created_at as user_created,
  u.last_sign_in_at,
  p.user_type,
  p.roles,
  p.vetting_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email IN ('test-agent@example.com', 'darren@stlpropertybrothers.com')
ORDER BY u.created_at;
