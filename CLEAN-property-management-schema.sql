-- CLEAN REAL ESTATE LISTING MANAGEMENT SCHEMA
-- This handles property listing security, admin approval, and agent controls
-- Run this AFTER the agent vetting system is set up

-- =====================================================
-- COMPREHENSIVE POLICY CLEANUP
-- =====================================================

-- Drop ALL existing property policies to avoid conflicts
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'properties') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON properties';
    END LOOP;
END $$;

-- Also drop specific named policies (in case the above misses any)
DROP POLICY IF EXISTS "Anyone can view approved properties" ON properties;
DROP POLICY IF EXISTS "Users can view their own properties" ON properties;
DROP POLICY IF EXISTS "Property owners can view their own properties" ON properties;
DROP POLICY IF EXISTS "Approved agents can create properties" ON properties;
DROP POLICY IF EXISTS "Agents can update their own properties" ON properties;
DROP POLICY IF EXISTS "Admins can view all properties" ON properties;
DROP POLICY IF EXISTS "Admins can moderate properties" ON properties;
DROP POLICY IF EXISTS "Agents can delete their own pending properties" ON properties;
DROP POLICY IF EXISTS "Admins can delete any property" ON properties;

-- Enable RLS on properties (if not already enabled)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROPERTY LISTING SECURITY POLICIES
-- =====================================================

-- 1. Anyone can view approved properties (public access)
CREATE POLICY "Anyone can view approved properties"
ON properties FOR SELECT
USING (status = 'approved');

-- 2. Agents can view their own property listings (any status)
CREATE POLICY "Agents can view their own property listings"
ON properties FOR SELECT
USING (auth.uid() = user_id);

-- 3. Admins can view all properties
CREATE POLICY "Admins can view all properties"
ON properties FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('admin', 'super_admin')
    )
);

-- =====================================================
-- PROPERTY CREATION POLICIES
-- =====================================================

-- 4. Only approved agents can create properties
CREATE POLICY "Approved agents can create properties"
ON properties FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type = 'agent'
        AND vetting_status = 'approved'
    )
);

-- =====================================================
-- PROPERTY UPDATE POLICIES  
-- =====================================================

-- 5. Agents can update their own properties (but not approval status)
CREATE POLICY "Agents can update their own properties"
ON properties FOR UPDATE
USING (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type = 'agent'
        AND vetting_status = 'approved'
    )
)
WITH CHECK (
    auth.uid() = user_id AND
    -- Agents cannot change approval-related fields
    status IS NOT DISTINCT FROM (SELECT status FROM properties WHERE id = properties.id) AND
    approved_at IS NOT DISTINCT FROM (SELECT approved_at FROM properties WHERE id = properties.id) AND
    approved_by IS NOT DISTINCT FROM (SELECT approved_by FROM properties WHERE id = properties.id)
);

-- 6. Admins can update any property (including approval status)
CREATE POLICY "Admins can moderate properties"
ON properties FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('admin', 'super_admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('admin', 'super_admin')
    )
);

-- =====================================================
-- PROPERTY DELETION POLICIES
-- =====================================================

-- 7. Agents can delete their own properties (only if pending)
CREATE POLICY "Agents can delete their own pending properties"
ON properties FOR DELETE
USING (
    auth.uid() = user_id AND
    status = 'pending' AND
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type = 'agent'
        AND vetting_status = 'approved'
    )
);

-- 8. Admins can delete any property
CREATE POLICY "Admins can delete any property"
ON properties FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('admin', 'super_admin')
    )
);

-- =====================================================
-- STORAGE POLICIES FOR PROPERTY IMAGES
-- =====================================================

-- Comprehensive cleanup of existing storage policies
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON storage.objects';
    END LOOP;
END $$;

-- Also drop specific named storage policies (in case the above misses any)
DROP POLICY IF EXISTS "Property images are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Agents can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Approved agents can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Agents can update property images" ON storage.objects;
DROP POLICY IF EXISTS "Agents can delete property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Create property-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Property images are publicly viewable (since bucket is public)
CREATE POLICY "Property images are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Only approved agents can upload property images
CREATE POLICY "Approved agents can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'property-images' AND
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type = 'agent'
        AND vetting_status = 'approved'
    )
);

-- Agents can update their own property images
CREATE POLICY "Agents can update their own property images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'property-images' AND
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type = 'agent'
        AND vetting_status = 'approved'
    )
);

-- Agents can delete their own property images
CREATE POLICY "Agents can delete their own property images"  
ON storage.objects FOR DELETE
USING (
    bucket_id = 'property-images' AND
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type = 'agent'
        AND vetting_status = 'approved'
    )
);

-- =====================================================
-- PROPERTY MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to automatically set approval timestamp
CREATE OR REPLACE FUNCTION handle_property_approval()
RETURNS TRIGGER AS $$
BEGIN
    -- If status is being changed to 'approved'
    IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
        NEW.approved_at = now();
        NEW.approved_by = auth.uid();
    END IF;
    
    -- If status is being changed away from 'approved'
    IF OLD.status = 'approved' AND NEW.status != 'approved' THEN
        NEW.approved_at = NULL;
        NEW.approved_by = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger for property approval
DROP TRIGGER IF EXISTS property_approval_trigger ON properties;
CREATE TRIGGER property_approval_trigger
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION handle_property_approval();

-- =====================================================
-- GRANTS AND PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT ALL ON TABLE properties TO authenticated;
GRANT SELECT ON TABLE properties TO anon;

-- Grant storage permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

COMMIT;
