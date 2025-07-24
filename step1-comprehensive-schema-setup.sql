-- COMPREHENSIVE PROPERTIES TABLE SETUP
-- Run this script FIRST to add ALL needed columns at once
-- This replaces step1-add-region-column.sql and includes everything needed

-- Add all missing columns for the property browsing system
ALTER TABLE properties ADD COLUMN IF NOT EXISTS region text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_type text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_type text DEFAULT 'sale' CHECK (price_type IN ('sale', 'rent'));
ALTER TABLE properties ADD COLUMN IF NOT EXISTS bedrooms integer DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS bathrooms integer DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lot_size text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS home_size text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS features text[];
ALTER TABLE properties ADD COLUMN IF NOT EXISTS images text[];
ALTER TABLE properties ADD COLUMN IF NOT EXISTS hero_index integer DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS inquiries integer DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Add vetting_status to profiles table (essential for agent system)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vetting_status text DEFAULT 'not_submitted' 
CHECK (vetting_status IN ('not_submitted', 'pending_review', 'approved', 'rejected', 'needs_revision'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price_type ON properties(price_type);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);

-- Enable RLS on properties (if not already enabled)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Add comprehensive RLS policies for properties
DROP POLICY IF EXISTS "Anyone can view active properties" ON properties;
CREATE POLICY "Anyone can view active properties"
ON properties FOR SELECT
USING (status = 'active');

DROP POLICY IF EXISTS "Users can view their own properties" ON properties;
CREATE POLICY "Users can view their own properties"
ON properties FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Approved agents can create properties" ON properties;
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

DROP POLICY IF EXISTS "Users can update their own properties" ON properties;
CREATE POLICY "Users can update their own properties"
ON properties FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON TABLE properties TO authenticated;
GRANT SELECT ON TABLE properties TO anon;
