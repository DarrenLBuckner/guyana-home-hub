-- Fix RLS Policy Infinite Recursion
-- Run this in your Supabase SQL Editor

-- 1. Drop all existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;

-- 2. Drop problematic properties policies
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON properties;
DROP POLICY IF EXISTS "Users can insert their own properties" ON properties;
DROP POLICY IF EXISTS "Users can update their own properties" ON properties;

-- 3. Create simple, non-recursive policies

-- Profiles policies (simple and direct)
CREATE POLICY "Allow public read access to profiles" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Allow users to insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Properties policies (simple and direct)
CREATE POLICY "Allow public read access to approved properties" 
ON properties FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Allow authenticated users to insert properties" 
ON properties FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own properties" 
ON properties FOR UPDATE 
USING (auth.uid() = user_id);

-- 4. Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
