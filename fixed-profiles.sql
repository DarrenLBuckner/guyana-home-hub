-- FIX PROFILES TABLE STRUCTURE
-- Run this in Supabase SQL Editor to fix the profiles table

-- First, let's see what columns actually exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Drop the profiles table and recreate it with the correct structure
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table that matches our forms
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  first_name text,
  last_name text,
  phone text,
  country text,
  budget text,
  roles text,
  user_type text DEFAULT 'client',
  vetting_status text DEFAULT 'not_submitted',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- Create policies
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

-- Now create the correct user profiles
-- Test agent
INSERT INTO profiles (
    id, 
    email, 
    first_name,
    last_name, 
    user_type, 
    roles, 
    vetting_status,
    updated_at
) 
SELECT 
    u.id,
    'test-agent@example.com', 
    'Test',
    'Agent', 
    'agent', 
    'agent', 
    'approved',
    now()
FROM auth.users u
WHERE u.email = 'test-agent@example.com';

-- Super admin
INSERT INTO profiles (
    id, 
    email, 
    first_name,
    last_name, 
    user_type, 
    roles, 
    updated_at
) 
SELECT 
    u.id,
    'mrdarrenbuckner@gmail.com', 
    'Darren',
    'Buckner', 
    'super_admin', 
    'super_admin', 
    now()
FROM auth.users u
WHERE u.email = 'mrdarrenbuckner@gmail.com';

-- Customer
INSERT INTO profiles (
    id, 
    email, 
    first_name,
    last_name, 
    user_type, 
    roles, 
    updated_at
) 
SELECT 
    u.id,
    'darren@stlpropertybrothers.com', 
    'Darren',
    'Buckner', 
    'client', 
    'client', 
    now()
FROM auth.users u
WHERE u.email = 'darren@stlpropertybrothers.com';

-- Check the results
SELECT 
  u.email,
  u.created_at as user_created,
  u.last_sign_in_at,
  p.user_type,
  p.roles,
  p.vetting_status,
  p.first_name,
  p.last_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email IN ('test-agent@example.com', 'mrdarrenbuckner@gmail.com', 'darren@stlpropertybrothers.com')
ORDER BY u.email;
