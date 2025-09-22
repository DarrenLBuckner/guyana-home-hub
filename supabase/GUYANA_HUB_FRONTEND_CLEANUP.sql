-- ==================================================
-- GUYANA HUB FRONTEND - SAFE DATABASE CLEANUP
-- Checks what exists before attempting to remove it
-- ==================================================

-- First, let's see what tables actually exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name NOT LIKE 'pg_%'
AND table_name NOT LIKE '%_pkey'
ORDER BY table_name;

-- Check what property-related tables exist
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE '%property%' OR table_name LIKE '%properties%')
ORDER BY table_name;

-- If properties table exists, check its structure
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'properties' AND table_schema = 'public') THEN
        RAISE NOTICE 'Properties table exists. Checking columns...';
        
        -- Show all columns in properties table
        PERFORM column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
    ELSE
        RAISE NOTICE 'Properties table does not exist.';
    END IF;
END $$;

-- Check what storage buckets exist
SELECT 
    id, 
    name, 
    public 
FROM storage.buckets 
ORDER BY name;

-- Check what property-related functions exist
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%property%'
ORDER BY routine_name;

-- ==================================================
-- SAFE CLEANUP - Only drop what actually exists
-- ==================================================

-- Drop property tables if they exist (using IF EXISTS)
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS property_media CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS property_inquiries CASCADE;
DROP TABLE IF EXISTS agent_vetting CASCADE;
DROP TABLE IF EXISTS developments CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;

-- Drop any property-related views
DROP VIEW IF EXISTS property_search_view CASCADE;
DROP VIEW IF EXISTS active_properties CASCADE;
DROP VIEW IF EXISTS agent_properties CASCADE;

-- Drop property-related functions (using IF EXISTS)
DROP FUNCTION IF EXISTS search_properties(text, text, integer, integer, integer, integer) CASCADE;
DROP FUNCTION IF EXISTS get_property_by_id(uuid) CASCADE;
DROP FUNCTION IF EXISTS get_properties_by_agent(uuid) CASCADE;
DROP FUNCTION IF EXISTS update_property_status(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS search_properties_with_filters CASCADE;

-- Remove storage policies (check if they exist first)
DO $$
BEGIN
    -- Remove property image policies if they exist
    DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
    DROP POLICY IF EXISTS "Anyone can view property images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload property images" ON storage.objects;
    DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public read access to property images" ON storage.objects;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Some storage policies may not exist, continuing...';
END $$;

-- Remove property-images bucket if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'property-images') THEN
        DELETE FROM storage.objects WHERE bucket_id = 'property-images';
        DELETE FROM storage.buckets WHERE id = 'property-images';
        RAISE NOTICE 'Property-images bucket removed.';
    ELSE
        RAISE NOTICE 'Property-images bucket does not exist.';
    END IF;
END $$;

-- Clean up profiles table - remove property-specific columns if they exist
DO $$
BEGIN
    -- Check and remove columns that might exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'agent_license') THEN
        ALTER TABLE profiles DROP COLUMN agent_license;
        RAISE NOTICE 'Removed agent_license column from profiles.';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'agency_name') THEN
        ALTER TABLE profiles DROP COLUMN agency_name;
        RAISE NOTICE 'Removed agency_name column from profiles.';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'years_experience') THEN
        ALTER TABLE profiles DROP COLUMN years_experience;
        RAISE NOTICE 'Removed years_experience column from profiles.';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'specializations') THEN
        ALTER TABLE profiles DROP COLUMN specializations;
        RAISE NOTICE 'Removed specializations column from profiles.';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'commission_rate') THEN
        ALTER TABLE profiles DROP COLUMN commission_rate;
        RAISE NOTICE 'Removed commission_rate column from profiles.';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
        ALTER TABLE profiles DROP COLUMN bio;
        RAISE NOTICE 'Removed bio column from profiles.';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'website') THEN
        ALTER TABLE profiles DROP COLUMN website;
        RAISE NOTICE 'Removed website column from profiles.';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'office_phone') THEN
        ALTER TABLE profiles DROP COLUMN office_phone;
        RAISE NOTICE 'Removed office_phone column from profiles.';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'elite_agent') THEN
        ALTER TABLE profiles DROP COLUMN elite_agent;
        RAISE NOTICE 'Removed elite_agent column from profiles.';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_status') THEN
        ALTER TABLE profiles DROP COLUMN verification_status;
        RAISE NOTICE 'Removed verification_status column from profiles.';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_date') THEN
        ALTER TABLE profiles DROP COLUMN verification_date;
        RAISE NOTICE 'Removed verification_date column from profiles.';
    END IF;
END $$;

-- Optimize remaining tables
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        -- Create indexes for profiles table
        CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
        CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
        CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
        
        -- Update table statistics
        ANALYZE profiles;
        
        RAISE NOTICE 'Profiles table optimized.';
    END IF;
END $$;

-- ==================================================
-- VERIFICATION - Check what remains
-- ==================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'CLEANUP VERIFICATION';
    RAISE NOTICE '========================================';
END $$;

-- Show remaining tables
SELECT 'Remaining tables:' as info;
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name NOT LIKE 'pg_%'
ORDER BY table_name;

-- Show remaining storage buckets
SELECT 'Remaining storage buckets:' as info;
SELECT 
    id, 
    name, 
    public 
FROM storage.buckets 
ORDER BY name;

-- Show profiles table structure (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        RAISE NOTICE 'Profiles table exists. Use this query to see structure:';
        RAISE NOTICE 'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = ''profiles'' AND table_schema = ''public'';';
    ELSE
        RAISE NOTICE 'Profiles table does not exist.';
    END IF;
END $$;

-- Final status
SELECT 
    'Frontend database cleanup completed' AS status,
    'All property data now flows from Portal Hub' AS architecture,
    'Frontend handles only user authentication' AS responsibility;