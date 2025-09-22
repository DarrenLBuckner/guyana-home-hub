-- SIMPLE AUTHENTICATION FIX
-- Run this step by step in Supabase SQL Editor

-- Step 1: Check if profiles table exists and see its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- If the above shows no results, the table doesn't exist. 
-- Run the following to create it:

CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
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

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- Create basic policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Check what users exist in auth.users
SELECT email, created_at, last_sign_in_at 
FROM auth.users 
WHERE email IN ('test-agent@example.com', 'darren@stlpropertybrothers.com')
ORDER BY created_at;
