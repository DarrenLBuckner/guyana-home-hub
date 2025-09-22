-- MAKE PARTNER SUPER ADMIN
-- Run this AFTER your partner creates an account or you invite them

-- Option 1: If they already have an account, promote them to super admin
UPDATE profiles 
SET 
    user_type = 'super_admin',
    roles = 'super_admin',
    updated_at = NOW()
WHERE email = 'qumartorrington@caribbeanhomehub.com';

-- Verify the update worked
SELECT 
    email, 
    first_name,
    last_name,
    user_type,
    roles,
    created_at,
    updated_at,
    'Super Admin Access Granted' as status
FROM profiles 
WHERE email = 'qumartorrington@caribbeanhomehub.com';

-- Check all super admins
SELECT 
    email,
    first_name || ' ' || last_name as full_name,
    user_type,
    roles,
    created_at
FROM profiles 
WHERE user_type = 'super_admin' OR roles = 'super_admin'
ORDER BY created_at;
