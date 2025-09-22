-- GIVE PARTNER DUAL ADMIN + AGENT ACCESS
-- Qumar will manage agents AND work as an agent himself

-- First, check current status
SELECT 
    email, 
    user_type,
    roles,
    vetting_status,
    'Current Status' as status
FROM profiles 
WHERE email = 'qumartorrington@caribbeanhomehub.com';

-- Give him both admin and agent roles
UPDATE profiles 
SET 
    user_type = 'admin',
    roles = 'admin,agent',
    vetting_status = 'approved',
    updated_at = NOW()
WHERE email = 'qumartorrington@caribbeanhomehub.com';

-- Verify the dual role setup
SELECT 
    email, 
    user_type,
    roles,
    vetting_status,
    'Now Admin + Agent' as status
FROM profiles 
WHERE email = 'qumartorrington@caribbeanhomehub.com';

-- Show all access levels in your system
SELECT 
    email,
    first_name || ' ' || last_name as full_name,
    user_type,
    roles,
    CASE 
        WHEN user_type = 'super_admin' THEN 'Full system access + financial controls'
        WHEN user_type = 'admin' THEN 'Property & user management (no financial access)'
        WHEN user_type = 'agent' THEN 'Can list properties'
        WHEN user_type = 'customer' THEN 'Can browse and inquire'
        ELSE 'Basic user'
    END as access_description,
    created_at
FROM profiles 
WHERE user_type IN ('super_admin', 'admin')
ORDER BY 
    CASE user_type 
        WHEN 'super_admin' THEN 1 
        WHEN 'admin' THEN 2 
        ELSE 3 
    END,
    created_at;
