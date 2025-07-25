-- STEP 1: Check if Qumar has registered yet
-- Run this AFTER he creates his account
SELECT 
    id,
    email, 
    first_name,
    last_name,
    user_type,
    roles,
    created_at
FROM profiles 
WHERE email = 'qumartorrington@caribbeanhomehub.com';

-- STEP 2: If he shows up, THEN promote him to admin
-- Only run this AFTER you see his account above
UPDATE profiles 
SET 
    user_type = 'admin',
    roles = 'admin',
    updated_at = NOW()
WHERE email = 'qumartorrington@caribbeanhomehub.com';

-- STEP 3: Verify he's now an admin
SELECT 
    email,
    first_name || ' ' || last_name as full_name,
    user_type,
    roles,
    'Now an Admin!' as status
FROM profiles 
WHERE email = 'qumartorrington@caribbeanhomehub.com';
