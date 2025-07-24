-- CREATE ADMIN USER FOR TESTING
-- Run this in your Supabase SQL Editor

-- First, let's see what users currently exist
SELECT email, id FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Create admin user manually (you'll need to create this user through Supabase Auth first)
-- Then update their profile to admin status

-- Option 1: If you want to make an existing user an admin
-- Replace 'your-email@example.com' with the email you want to make admin
UPDATE profiles 
SET 
    user_type = 'admin',
    roles = 'admin'
WHERE email = 'mrdARRENBUCKNER@GMAIL.COM'; -- Replace with your admin email

-- Option 2: If you want to create a super admin
-- UPDATE profiles 
-- SET 
--     user_type = 'super_admin',
--     roles = 'super_admin'
-- WHERE email = 'your-super-admin@example.com';

-- Verify the admin user was created/updated
SELECT 
    id,
    email, 
    first_name,
    last_name,
    user_type,
    roles,
    created_at
FROM profiles 
WHERE user_type IN ('admin', 'super_admin')
ORDER BY created_at DESC;
