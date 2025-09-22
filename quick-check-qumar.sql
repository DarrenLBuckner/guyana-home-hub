-- Quick check to see if Qumar is now an admin
SELECT 
    email,
    first_name,
    last_name,
    user_type,
    roles,
    created_at,
    updated_at
FROM profiles 
WHERE email = 'qumartorrington@caribbeanhomehub.com';
