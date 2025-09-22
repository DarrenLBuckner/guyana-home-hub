-- DEBUG: Check your profile data
-- Run this to see what's in your profile

SELECT 
    id,
    email,
    first_name,
    last_name,
    phone,
    country,
    user_type,
    created_at
FROM profiles 
ORDER BY created_at DESC;

-- Also check if there are any issues with the profile data
SELECT 
    'Profile Check Results:' as debug_info,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN first_name IS NOT NULL AND first_name != '' THEN 1 END) as profiles_with_first_name,
    COUNT(CASE WHEN last_name IS NOT NULL AND last_name != '' THEN 1 END) as profiles_with_last_name,
    COUNT(CASE WHEN first_name IS NOT NULL AND first_name != '' AND last_name IS NOT NULL AND last_name != '' THEN 1 END) as complete_profiles
FROM profiles;
