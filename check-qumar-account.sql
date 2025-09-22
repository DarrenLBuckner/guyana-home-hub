-- Check if Qumar already has an account in the system
SELECT 
    id,
    email, 
    user_type,
    roles,
    created_at,
    'Account Status' as status
FROM profiles 
WHERE email = 'qumartorrington@caribbeanhomehub.com';

-- If no results, he needs to be created first
-- If results show, we can proceed with admin setup
