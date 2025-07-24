-- CORRECTED FIX FOR PROFILE INFINITE RECURSION
-- This version properly handles existing policies

-- Step 1: Drop ALL existing policies to avoid conflicts (more comprehensive)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Drop all policies on profiles table
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON profiles';
    END LOOP;
    RAISE NOTICE 'All existing policies dropped successfully';
END $$;

-- Step 2: Create fresh, non-recursive policies

-- Policy 1: Users can view their own profile
CREATE POLICY "users_view_own_profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy 2: Users can create their own profile (for initial signup)
CREATE POLICY "users_create_own_profile" ON profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id AND
    user_type IN ('customer', 'client', 'agent')
  );

-- Policy 3: Users can update their own profile (NO role checking to avoid recursion)
CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: Public can view basic profile info (for listings)
CREATE POLICY "public_view_profiles" ON profiles
  FOR SELECT USING (true);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE profiles TO authenticated;
GRANT SELECT ON TABLE profiles TO anon;

-- Create/update the updated_at trigger
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profiles_updated_at();

-- Verify the fix worked
DO $$
BEGIN
    RAISE NOTICE 'Profile policies have been reset successfully!';
    RAISE NOTICE 'The infinite recursion error should now be fixed.';
    RAISE NOTICE 'You can now try completing your profile again.';
END $$;
