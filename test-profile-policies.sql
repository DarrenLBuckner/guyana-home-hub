-- TEST PROFILE POLICIES - Run this to verify everything is working
-- This will show you what policies are currently active

-- Check what policies exist now
SELECT 
    policyname as "Policy Name",
    cmd as "Command Type",
    qual as "USING Clause",
    with_check as "WITH CHECK Clause"
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- Test if you can query profiles (this should work)
SELECT 'Profile query test - if you see this, SELECT policies work' as test_result;

-- Show table structure to confirm it exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
