-- CREATE CORRECT USER PROFILES
-- Run this in Supabase SQL Editor to set up your user profiles correctly

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

-- Create profile for super admin (mrdarrenbuckner@gmail.com)
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
    'mrdarrenbuckner@gmail.com', 
    'Darren Buckner', 
    'super_admin', 
    'super_admin', 
    now()
FROM auth.users u
WHERE u.email = 'mrdarrenbuckner@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
    user_type = 'super_admin',
    roles = 'super_admin',
    updated_at = now();

-- Create profile for customer (darren@stlpropertybrothers.com)
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
    'client', 
    'client', 
    now()
FROM auth.users u
WHERE u.email = 'darren@stlpropertybrothers.com'
ON CONFLICT (id) 
DO UPDATE SET 
    user_type = 'client',
    roles = 'client',
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
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email IN ('test-agent@example.com', 'mrdarrenbuckner@gmail.com', 'darren@stlpropertybrothers.com')
ORDER BY u.email;
