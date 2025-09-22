-- ==================================================
-- GUYANA HUB FRONTEND - DATABASE CLEANUP
-- Remove property tables since all data flows from Portal Hub
-- Keep only user authentication and frontend-specific features
-- ==================================================

-- ⚠️  WARNING: This script removes property-related tables and data
-- ⚠️  BACKUP your database before running this script
-- ⚠️  Only run this after confirming Portal Hub is working correctly

-- ==================================================
-- 1. REMOVE PROPERTY-RELATED TABLES
-- ==================================================

-- Drop property tables (all data now in Portal Hub)
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS property_media CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS property_inquiries CASCADE;
DROP TABLE IF EXISTS agent_vetting CASCADE;
DROP TABLE IF EXISTS developments CASCADE;

-- ==================================================
-- 2. REMOVE PROPERTY-RELATED STORAGE POLICIES
-- ==================================================

-- Remove storage policies for property images
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;

-- ==================================================
-- 3. REMOVE PROPERTY-IMAGES STORAGE BUCKET
-- ==================================================

-- Remove property-images bucket (all images now in Portal Hub)
DELETE FROM storage.objects WHERE bucket_id = 'property-images';
DELETE FROM storage.buckets WHERE id = 'property-images';

-- ==================================================
-- 4. REMOVE PROPERTY-RELATED FUNCTIONS
-- ==================================================

-- Drop any property search functions
DROP FUNCTION IF EXISTS search_properties(text, text, integer, integer, integer, integer);
DROP FUNCTION IF EXISTS get_property_by_id(uuid);
DROP FUNCTION IF EXISTS get_properties_by_agent(uuid);
DROP FUNCTION IF EXISTS update_property_status(uuid, text);

-- ==================================================
-- 5. CLEAN UP PROFILES TABLE
-- ==================================================

-- Keep profiles table but remove property-specific columns if they exist
-- These columns are no longer needed since agents manage properties in Portal Hub

-- Remove agent-specific columns that might exist
ALTER TABLE profiles DROP COLUMN IF EXISTS agent_license;
ALTER TABLE profiles DROP COLUMN IF EXISTS agency_name;
ALTER TABLE profiles DROP COLUMN IF EXISTS years_experience;
ALTER TABLE profiles DROP COLUMN IF EXISTS specializations;
ALTER TABLE profiles DROP COLUMN IF EXISTS commission_rate;
ALTER TABLE profiles DROP COLUMN IF EXISTS bio;
ALTER TABLE profiles DROP COLUMN IF EXISTS website;
ALTER TABLE profiles DROP COLUMN IF EXISTS office_phone;
ALTER TABLE profiles DROP COLUMN IF EXISTS elite_agent;
ALTER TABLE profiles DROP COLUMN IF EXISTS verification_status;
ALTER TABLE profiles DROP COLUMN IF EXISTS verification_date;

-- ==================================================
-- 6. KEEP ESSENTIAL AUTHENTICATION TABLES
-- ==================================================

-- KEEP these tables for frontend user management:
-- ✅ profiles (for user authentication and basic info)
-- ✅ Any notification/email tables
-- ✅ User preferences/settings tables
-- ✅ Contact form submissions

-- ==================================================
-- 7. OPTIMIZE REMAINING TABLES
-- ==================================================

-- Ensure profiles table is optimized for authentication only
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- Update table statistics
ANALYZE profiles;

-- ==================================================
-- 8. VERIFY CLEANUP
-- ==================================================

-- Check remaining tables (should only be auth-related)
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name NOT LIKE 'pg_%'
AND table_name NOT LIKE 'auth%'
ORDER BY table_name;

-- Check remaining storage buckets (should not include property-images)
SELECT id, name, public 
FROM storage.buckets 
ORDER BY name;

-- Check remaining functions (should not include property functions)
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%property%'
ORDER BY routine_name;

-- ==================================================
-- 9. DOCUMENTATION UPDATE
-- ==================================================

-- Add comments to document the new architecture
COMMENT ON TABLE profiles IS 'Frontend user authentication and basic profile data. Property management is handled in Portal Hub.';

-- ==================================================
-- 10. PRODUCTION READINESS VERIFICATION
-- ==================================================

-- Verify RLS is still enabled on remaining tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

-- Check for any remaining property references that need cleanup
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND (column_name LIKE '%property%' OR column_name LIKE '%listing%')
ORDER BY table_name, column_name;

-- ==================================================
-- FINAL STATUS
-- ==================================================

SELECT 'Frontend database cleanup completed' AS status,
       'All property data now flows from Portal Hub' AS architecture,
       'Frontend handles only user authentication' AS responsibility;