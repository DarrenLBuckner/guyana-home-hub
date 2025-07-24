-- COMPREHENSIVE DATABASE FIX SCRIPT - TAILORED FOR YOUR EXISTING SCHEMA
-- Run this in your Supabase SQL Editor to fix all database issues

-- ========================================
-- 1. ADD ONLY MISSING COLUMNS
-- ========================================

-- Based on your table editor screenshot, you need these columns:
DO $$ 
BEGIN
    -- Add contact_email column (for property contact info)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'properties' AND column_name = 'contact_email') THEN
        ALTER TABLE properties ADD COLUMN contact_email TEXT;
    END IF;

    -- Add address column (for street address)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'properties' AND column_name = 'address') THEN
        ALTER TABLE properties ADD COLUMN address TEXT;
    END IF;

    -- Add city column (for city name)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'properties' AND column_name = 'city') THEN
        ALTER TABLE properties ADD COLUMN city TEXT;
    END IF;

    -- Add region column (for Guyana regions)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'properties' AND column_name = 'region') THEN
        ALTER TABLE properties ADD COLUMN region TEXT;
    END IF;
END $$;

-- ========================================
-- 2. FIX RLS POLICIES - MAIN ISSUE TO FIX
-- ========================================

-- Disable RLS temporarily to clear all policies
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies that cause infinite recursion
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Drop all properties policies
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'properties') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON properties';
    END LOOP;
    
    -- Drop all profiles policies  
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON profiles';
    END LOOP;
END $$;

-- Create simple, non-recursive policies for PROPERTIES
CREATE POLICY "Anyone can view approved properties" ON properties 
FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own properties" ON properties 
FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Authenticated users can insert properties" ON properties 
FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own properties" ON properties 
FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own properties" ON properties 
FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Create simple policies for PROFILES
CREATE POLICY "Anyone can view profiles" ON profiles 
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles 
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles 
FOR UPDATE USING (auth.uid() = id);

-- Re-enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 3. INSERT SAMPLE DATA FOR TESTING
-- ========================================

-- First, let's make user_id nullable temporarily for sample data
ALTER TABLE properties ALTER COLUMN user_id DROP NOT NULL;

-- Insert sample properties using your existing column structure
-- Using NULL for user_id since we don't have real users yet
INSERT INTO properties (
    title, 
    description, 
    price, 
    location, 
    bedrooms, 
    bathrooms, 
    home_size, 
    property_type, 
    listing_type,
    contact_email,
    address,
    city,
    region,
    image_urls,
    features,
    status,
    user_id
) VALUES 
(
    'Modern Family Home in Georgetown',
    'Beautiful 4-bedroom house with modern amenities in the heart of Georgetown.',
    45000000,
    'Georgetown',
    4,
    3,
    '2500 sq ft',
    'house',
    'sale',
    'contact@guyanaproperties.com',
    '123 Main Street',
    'Georgetown',
    'Region 4',
    '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"]'::jsonb,
    '["parking", "garden", "security"]'::jsonb,
    'approved',
    NULL
),
(
    'Luxury Apartment with Ocean View',
    'Stunning 3-bedroom apartment with breathtaking ocean views in New Amsterdam.',
    35000000,
    'New Amsterdam',
    3,
    2,
    '1800 sq ft',
    'apartment',
    'sale',
    'ocean@guyanacoast.com',
    '456 Ocean Drive',
    'New Amsterdam',
    'Region 6',
    '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"]'::jsonb,
    '["ocean_view", "balcony", "pool"]'::jsonb,
    'approved',
    NULL
),
(
    'Commercial Land for Development',    
    'Prime commercial land perfect for development projects in Linden.',
    25000000,
    'Linden',
    0,
    0,
    '5000 sq ft',
    'land',
    'sale',
    'development@guyanaland.com',
    '789 Development Road',
    'Linden',
    'Region 10',
    '["https://images.unsplash.com/photo-1500382017468-9049fed747ef"]'::jsonb,
    '["commercial", "corner_lot", "utilities_ready"]'::jsonb,
    'approved',
    NULL
),
(
    'Beachfront Rental Property',
    'Charming 2-bedroom beach house perfect for vacation rentals in Anna Regina.',
    3500000,
    'Anna Regina',
    2,
    2,
    '1200 sq ft',
    'house',
    'rent',
    'rentals@guyanabeach.com',
    '321 Beach Road',
    'Anna Regina',
    'Region 2',
    '["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"]'::jsonb,
    '["beachfront", "furnished", "parking", "wifi"]'::jsonb,
    'approved',
    NULL
);

-- ========================================
-- 4. VERIFY THE DATABASE FIX
-- ========================================

-- Show all columns in properties table
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'properties' 
ORDER BY ordinal_position;

-- Count total properties
SELECT COUNT(*) as total_properties FROM properties;

-- Show sample of new data
SELECT 
    id, 
    title, 
    contact_email, 
    address, 
    city, 
    region,
    property_type,
    listing_type,
    status
FROM properties 
WHERE contact_email IS NOT NULL
LIMIT 5;

-- Show current RLS policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd,
    permissive
FROM pg_policies 
WHERE tablename IN ('properties', 'profiles')
ORDER BY tablename, policyname;

-- Test query to make sure RLS works without infinite recursion
SELECT COUNT(*) as approved_properties 
FROM properties 
WHERE status = 'approved';

COMMIT;