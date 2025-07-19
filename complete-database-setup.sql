-- =====================================================
-- GUYANA HOME HUB - COMPLETE DATABASE SETUP
-- =====================================================
-- This file creates all necessary tables, RLS policies, 
-- storage buckets, and triggers for the application
-- =====================================================

-- First, enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE (Enhanced with vetting status)
-- =====================================================

-- Update profiles table to include vetting status
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS vetting_status text DEFAULT 'not_submitted' 
CHECK (vetting_status IN ('not_submitted', 'pending_review', 'approved', 'rejected', 'needs_revision'));

-- =====================================================
-- 2. PROPERTIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS properties (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Basic Information
    title text NOT NULL,
    description text,
    price numeric NOT NULL,
    price_type text NOT NULL DEFAULT 'sale' CHECK (price_type IN ('sale', 'rent')),
    property_type text NOT NULL CHECK (property_type IN ('house', 'apartment', 'condo', 'land', 'commercial', 'other')),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'sold', 'rented')),
    
    -- Location
    address text NOT NULL,
    city text NOT NULL,
    region text NOT NULL,
    country text DEFAULT 'Guyana',
    latitude numeric,
    longitude numeric,
    
    -- Property Details
    bedrooms integer,
    bathrooms numeric,
    home_size numeric, -- square feet
    lot_size numeric,  -- square feet
    year_built integer,
    
    -- Features (JSON array of strings)
    features jsonb DEFAULT '[]'::jsonb,
    
    -- Media
    images jsonb DEFAULT '[]'::jsonb, -- Array of image URLs
    hero_index integer DEFAULT 0, -- Index of hero image in images array
    virtual_tour_url text,
    
    -- Contact Information
    contact_name text,
    contact_phone text,
    contact_email text,
    
    -- Metadata
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    approved_at timestamp with time zone,
    approved_by uuid REFERENCES auth.users(id),
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', 
            coalesce(title, '') || ' ' || 
            coalesce(description, '') || ' ' || 
            coalesce(address, '') || ' ' || 
            coalesce(city, '') || ' ' || 
            coalesce(region, '')
        )
    ) STORED
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price_type ON properties(price_type);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_bathrooms ON properties(bathrooms);
CREATE INDEX IF NOT EXISTS idx_properties_search_vector ON properties USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. AGENT VETTING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS agent_vetting (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Personal Information
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    
    -- Business Information
    company_name text NOT NULL,
    company_address text NOT NULL,
    company_phone text,
    company_email text,
    years_experience integer NOT NULL,
    license_number text,
    license_type text,
    
    -- Specialties and Areas
    specialties text[], -- Array of specialties
    target_regions text[], -- Array of regions they serve
    
    -- Documents (stored in Supabase Storage)
    id_document_url text,
    license_document_url text,
    business_certificate_url text,
    insurance_certificate_url text,
    
    -- References
    reference1_name text,
    reference1_company text,
    reference1_phone text,
    reference1_email text,
    reference2_name text,
    reference2_company text,
    reference2_phone text,
    reference2_email text,
    
    -- Additional Information
    bio text,
    website text,
    social_media jsonb DEFAULT '{}'::jsonb,
    
    -- Review Information
    status text NOT NULL DEFAULT 'pending_review' CHECK (status IN ('not_submitted', 'pending_review', 'approved', 'rejected', 'needs_revision')),
    rejection_reason text,
    admin_notes text,
    reviewed_by uuid REFERENCES auth.users(id),
    reviewed_at timestamp with time zone,
    
    -- Timestamps
    submitted_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_vetting_user_id ON agent_vetting(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_vetting_status ON agent_vetting(status);
CREATE INDEX IF NOT EXISTS idx_agent_vetting_submitted_at ON agent_vetting(submitted_at);

-- Create updated_at trigger for agent_vetting
DROP TRIGGER IF EXISTS update_agent_vetting_updated_at ON agent_vetting;
CREATE TRIGGER update_agent_vetting_updated_at
    BEFORE UPDATE ON agent_vetting
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to sync vetting status with profiles table
CREATE OR REPLACE FUNCTION sync_vetting_status()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles 
    SET vetting_status = NEW.status 
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update profiles.vetting_status
DROP TRIGGER IF EXISTS sync_profiles_vetting_status ON agent_vetting;
CREATE TRIGGER sync_profiles_vetting_status
    AFTER INSERT OR UPDATE OF status ON agent_vetting
    FOR EACH ROW
    EXECUTE FUNCTION sync_vetting_status();

-- =====================================================
-- 4. STORAGE BUCKETS
-- =====================================================

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('property-images', 'property-images', true),
    ('agent-documents', 'agent-documents', false)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_vetting ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES TABLE POLICIES
-- =====================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update user roles" ON profiles;
DROP POLICY IF EXISTS "Super admins can do everything" ON profiles;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile (but not their role/user_type unless they're admin)
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id AND
    (
        -- Regular users cannot change their role/user_type
        (user_type IS NOT DISTINCT FROM (SELECT user_type FROM profiles WHERE id = auth.uid()) AND
         roles IS NOT DISTINCT FROM (SELECT roles FROM profiles WHERE id = auth.uid()))
        OR
        -- Admins can change roles (but not to super_admin)
        (EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND (user_type = 'admin' OR user_type = 'super_admin')
        ) AND user_type != 'super_admin')
        OR
        -- Super admins can change anything
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND user_type = 'super_admin'
        )
    )
);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('admin', 'super_admin')
    )
);

-- =====================================================
-- PROPERTIES TABLE POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view approved properties" ON properties;
DROP POLICY IF EXISTS "Users can view their own properties" ON properties;
DROP POLICY IF EXISTS "Agents can create properties" ON properties;
DROP POLICY IF EXISTS "Users can update their own properties" ON properties;
DROP POLICY IF EXISTS "Admins can view all properties" ON properties;
DROP POLICY IF EXISTS "Admins can approve properties" ON properties;

-- Anyone can view approved properties
CREATE POLICY "Anyone can view approved properties"
ON properties FOR SELECT
USING (status = 'approved');

-- Users can view their own properties (any status)
CREATE POLICY "Users can view their own properties"
ON properties FOR SELECT
USING (auth.uid() = user_id);

-- Approved agents can create properties
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

-- Users can update their own properties (agents only, and not the approval status)
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
    -- Agents cannot change approval status or admin fields
    status IS NOT DISTINCT FROM (SELECT status FROM properties WHERE id = properties.id) AND
    approved_at IS NOT DISTINCT FROM (SELECT approved_at FROM properties WHERE id = properties.id) AND
    approved_by IS NOT DISTINCT FROM (SELECT approved_by FROM properties WHERE id = properties.id)
);

-- Admins can view all properties
CREATE POLICY "Admins can view all properties"
ON properties FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('admin', 'super_admin')
    )
);

-- Admins can approve/reject properties
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
-- AGENT VETTING TABLE POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own vetting" ON agent_vetting;
DROP POLICY IF EXISTS "Users can create their own vetting" ON agent_vetting;
DROP POLICY IF EXISTS "Users can update their own vetting" ON agent_vetting;
DROP POLICY IF EXISTS "Admins can view all vetting" ON agent_vetting;
DROP POLICY IF EXISTS "Admins can update vetting status" ON agent_vetting;

-- Users can view their own vetting application
CREATE POLICY "Users can view their own vetting"
ON agent_vetting FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own vetting application
CREATE POLICY "Users can create their own vetting"
ON agent_vetting FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own vetting (but not review fields)
CREATE POLICY "Users can update their own vetting"
ON agent_vetting FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
    auth.uid() = user_id AND
    -- Users cannot change review/admin fields
    status IS NOT DISTINCT FROM (SELECT status FROM agent_vetting WHERE user_id = auth.uid()) AND
    rejection_reason IS NOT DISTINCT FROM (SELECT rejection_reason FROM agent_vetting WHERE user_id = auth.uid()) AND
    admin_notes IS NOT DISTINCT FROM (SELECT admin_notes FROM agent_vetting WHERE user_id = auth.uid()) AND
    reviewed_by IS NOT DISTINCT FROM (SELECT reviewed_by FROM agent_vetting WHERE user_id = auth.uid()) AND
    reviewed_at IS NOT DISTINCT FROM (SELECT reviewed_at FROM agent_vetting WHERE user_id = auth.uid())
);

-- Admins can view all vetting applications
CREATE POLICY "Admins can view all vetting"
ON agent_vetting FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('admin', 'super_admin')
    )
);

-- Admins can update vetting status and review fields
CREATE POLICY "Admins can update vetting status"
ON agent_vetting FOR UPDATE
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
-- 6. STORAGE POLICIES
-- =====================================================

-- Property images storage policies (public bucket)
DROP POLICY IF EXISTS "Property images are publicly viewable" ON storage.objects;
CREATE POLICY "Property images are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

DROP POLICY IF EXISTS "Agents can upload property images" ON storage.objects;
CREATE POLICY "Agents can upload property images"
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

-- Agent documents storage policies (private bucket)
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'agent-documents' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR
     EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('admin', 'super_admin')
     ))
);

DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'agent-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- 7. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, user_type, roles)
    VALUES (NEW.id, NEW.email, 'customer', 'customer');
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 8. SAMPLE DATA (Optional)
-- =====================================================

-- Create a super admin user (replace with your actual user ID)
-- INSERT INTO profiles (id, email, user_type, roles, full_name, vetting_status)
-- VALUES (
--     'your-user-id-here',
--     'admin@guyanahomehub.com',
--     'super_admin',
--     'super_admin,admin,customer',
--     'System Administrator',
--     'approved'
-- ) ON CONFLICT (id) DO UPDATE SET
--     user_type = 'super_admin',
--     roles = 'super_admin,admin,customer',
--     vetting_status = 'approved';

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE profiles TO authenticated;
GRANT ALL ON TABLE properties TO authenticated;
GRANT ALL ON TABLE agent_vetting TO authenticated;
GRANT SELECT ON TABLE profiles TO anon;
GRANT SELECT ON TABLE properties TO anon;

-- Enable realtime for properties (optional, for live updates)
-- ALTER PUBLICATION supabase_realtime ADD TABLE properties;

COMMIT;
