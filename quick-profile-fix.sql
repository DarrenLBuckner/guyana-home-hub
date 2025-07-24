-- QUICK FIX FOR PROFILE INFINITE RECURSION ERROR
-- Run this in your Supabase SQL Editor immediately

-- This removes the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can update own basic profile" ON profiles;

-- Replace it with a simple policy that doesn't check roles
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure the INSERT policy exists for profile creation
CREATE POLICY "Users can create own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Success message
SELECT 'Profile update policy fixed! You should now be able to save your profile.' as message;
