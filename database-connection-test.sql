-- Quick database connection and table verification test
-- Run this in Supabase SQL editor to verify everything is working

-- Test 1: Check if agent_vetting table exists and has data
SELECT 
  COUNT(*) as total_agents,
  COUNT(CASE WHEN status = 'pending_review' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
FROM agent_vetting;

-- Test 2: Check if profiles table exists  
SELECT COUNT(*) as total_profiles FROM profiles;

-- Test 3: Check if properties table exists
SELECT COUNT(*) as total_properties FROM properties;

-- Test 4: Check if tables are properly linked
SELECT 
  av.id,
  av.status,
  p.email as agent_email,
  av.company_name,
  av.created_at
FROM agent_vetting av
LEFT JOIN profiles p ON av.user_id = p.id
LIMIT 5;
