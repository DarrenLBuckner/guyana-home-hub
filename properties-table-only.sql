-- =====================================================
-- PROPERTIES TABLE ONLY - Run this first
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update profiles table to include vetting status (if not already added)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS vetting_status text DEFAULT 'not_submitted' 
CHECK (vetting_status IN ('not_submitted', 'pending_review', 'approved', 'rejected', 'needs_revision'));

-- Create properties table
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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for properties
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies for properties
DROP POLICY IF EXISTS "Anyone can view approved properties" ON properties;
CREATE POLICY "Anyone can view approved properties"
ON properties FOR SELECT
USING (status = 'approved');

DROP POLICY IF EXISTS "Users can view their own properties" ON properties;
CREATE POLICY "Users can view their own properties"
ON properties FOR SELECT
USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON TABLE properties TO authenticated;
GRANT SELECT ON TABLE properties TO anon;

COMMIT;
