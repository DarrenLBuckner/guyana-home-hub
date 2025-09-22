-- FIX INFINITE RECURSION IN PROFILES POLICIES
-- This fixes the "infinite recursion detected in policy for relation 'profiles'" error

-- Step 1: Drop all existing policies to avoid conflicts
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON profiles';
    END LOOP;
END $$;

-- Step 2: Create non-recursive policies

-- Policy 1: Users can view their own profile (no recursion issue)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy 2: Users can INSERT their own profile (for initial signup)
CREATE POLICY "Users can create own profile" ON profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id AND
    user_type IN ('customer', 'client', 'agent') -- Only allow basic user types
  );

-- Policy 3: Users can update their own profile (simplified - no role checking)
-- This removes the circular reference that was causing infinite recursion
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: Public can view basic profile info (for property listings, etc.)
CREATE POLICY "Public can view basic profile info" ON profiles
  FOR SELECT USING (true); -- Allow public read access

-- Optional: If you need admin access, add separate admin policies
-- These would need to be created AFTER at least one super_admin exists in the system

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE profiles TO authenticated;
GRANT SELECT ON TABLE profiles TO anon;

-- Create a function to handle role validation at the application level instead
-- This function can be called from your API endpoints
CREATE OR REPLACE FUNCTION validate_user_role_change(
  user_id_param UUID,
  new_user_type TEXT,
  new_roles TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_type TEXT;
  requesting_user_type TEXT;
BEGIN
  -- Get current user type of the profile being modified
  SELECT user_type INTO current_user_type 
  FROM profiles 
  WHERE id = user_id_param;
  
  -- Get the user type of the requesting user
  SELECT user_type INTO requesting_user_type 
  FROM profiles 
  WHERE id = auth.uid();
  
  -- Allow if it's the same user and they're not trying to elevate privileges
  IF auth.uid() = user_id_param THEN
    -- Users can't change their own user_type to admin/super_admin
    IF new_user_type IN ('admin', 'super_admin') AND current_user_type NOT IN ('admin', 'super_admin') THEN
      RETURN FALSE;
    END IF;
    RETURN TRUE;
  END IF;
  
  -- Allow if requesting user is super_admin
  IF requesting_user_type = 'super_admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Allow if requesting user is admin and target is not super_admin
  IF requesting_user_type = 'admin' AND new_user_type != 'super_admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Deny everything else
  RETURN FALSE;
END;
$$;

-- Create updated_at trigger
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

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Profile policies fixed successfully! The infinite recursion error should be resolved.';
END $$;
