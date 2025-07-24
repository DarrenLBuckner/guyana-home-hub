-- CREATE USER PROFILES
-- Run this in Supabase SQL Editor to set up your user profiles

-- Create profile for test agent
INSERT INTO profiles (
    id, 
    email, 
    full_name, 
    user_type, 
    roles, 
    vetting_status,
    updated_at
) 
SELECT 
    u.id,
    'test-agent@example.com', 
    'Test Agent', 
    'agent', 
    'agent', 
    'approved',
    now()
FROM auth.users u
WHERE u.email = 'test-agent@example.com'
ON CONFLICT (id) 
DO UPDATE SET 
    user_type = 'agent',
    roles = 'agent',
    vetting_status = 'approved',
    updated_at = now();

-- Create profile for admin user
INSERT INTO profiles (
    id, 
    email, 
    full_name, 
    user_type, 
    roles, 
    updated_at
) 
SELECT 
    u.id,
    'darren@stlpropertybrothers.com', 
    'Darren Buckner', 
    'super_admin', 
    'super_admin', 
    now()
FROM auth.users u
WHERE u.email = 'darren@stlpropertybrothers.com'
ON CONFLICT (id) 
DO UPDATE SET 
    user_type = 'super_admin',
    roles = 'super_admin',
    updated_at = now();

-- Check the results
SELECT 
  u.email,
  u.created_at as user_created,
  u.last_sign_in_at,
  p.user_type,
  p.roles,
  p.vetting_status,
  p.full_name
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email IN ('test-agent@example.com', 'darren@stlpropertybrothers.com')
ORDER BY u.created_at;
