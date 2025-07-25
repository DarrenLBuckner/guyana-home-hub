-- Give Qumar both Admin and Agent access
-- This allows him to use both admin dashboard and agent features

-- First check his current status
SELECT 
    email,
    user_type,
    roles,
    vetting_status,
    'Current Status' as status
FROM profiles 
WHERE email = 'qumartorrington@caribbeanhomehub.com';

-- Update him to have both admin and agent roles
UPDATE profiles 
SET 
    user_type = 'admin',
    roles = 'admin,agent',  -- Both roles separated by comma
    vetting_status = 'approved',  -- Skip agent vetting process
    updated_at = NOW()
WHERE email = 'qumartorrington@caribbeanhomehub.com';

-- Verify the dual role setup
SELECT 
    email,
    first_name || ' ' || last_name as full_name,
    user_type,
    roles,
    vetting_status,
    'Now Admin + Agent' as status
FROM profiles 
WHERE email = 'qumartorrington@caribbeanhomehub.com';
