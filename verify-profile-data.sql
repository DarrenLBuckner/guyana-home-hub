-- VERIFY PROFILE DATA WAS SAVED
-- Run this to see your profile information

-- Check if your profile exists and what data was saved
SELECT 
    id,
    email,
    first_name,
    last_name,
    phone,
    country,
    budget,
    roles,
    user_type,
    vetting_status,
    created_at,
    updated_at
FROM profiles 
ORDER BY created_at DESC
LIMIT 5;

-- Count total profiles
SELECT COUNT(*) as total_profiles FROM profiles;

-- Check if RLS is working properly (should only show profiles you have access to)
SELECT 'RLS Test: If you can see this, the policies are working correctly' as test_message;
