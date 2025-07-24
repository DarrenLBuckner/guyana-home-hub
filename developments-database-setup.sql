-- DEVELOPMENTS DATABASE SETUP
-- This extends the existing properties table to handle developments

-- Add development-specific columns to the properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_development boolean DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS development_name text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS development_type text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS developer_name text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS developer_contact text;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS completion_status text DEFAULT 'planning' 
  CHECK (completion_status IN ('planning', 'pre-launch', 'under-construction', 'ready-to-move', 'completed'));
ALTER TABLE properties ADD COLUMN IF NOT EXISTS total_units integer;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS available_units integer;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS expected_completion_date date;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS development_amenities text[];
ALTER TABLE properties ADD COLUMN IF NOT EXISTS floor_plans jsonb;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_range_min numeric;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_range_max numeric;

-- Create indexes for development queries
CREATE INDEX IF NOT EXISTS idx_properties_is_development ON properties(is_development);
CREATE INDEX IF NOT EXISTS idx_properties_development_type ON properties(development_type);
CREATE INDEX IF NOT EXISTS idx_properties_completion_status ON properties(completion_status);
CREATE INDEX IF NOT EXISTS idx_properties_price_range ON properties(price_range_min, price_range_max);

-- Create a view for developments only
CREATE OR REPLACE VIEW developments AS
SELECT 
  id,
  title,
  description,
  address,
  city,
  region,
  development_name,
  development_type,
  developer_name,
  developer_contact,
  completion_status,
  total_units,
  available_units,
  expected_completion_date,
  development_amenities,
  floor_plans,
  price_range_min,
  price_range_max,
  image_urls,
  bedrooms,
  bathrooms,
  features,
  created_at,
  updated_at,
  user_id,
  status
FROM properties 
WHERE is_development = true;

-- Grant permissions on the view
GRANT SELECT ON developments TO authenticated;
GRANT SELECT ON developments TO anon;

-- Create RLS policies for developments
DROP POLICY IF EXISTS "Anyone can view active developments" ON properties;
CREATE POLICY "Anyone can view active developments"
ON properties FOR SELECT
USING (status = 'active' AND is_development = true);

-- Function to search developments with filters
CREATE OR REPLACE FUNCTION search_developments(
  p_region text DEFAULT NULL,
  p_development_type text DEFAULT NULL,
  p_min_price numeric DEFAULT NULL,
  p_max_price numeric DEFAULT NULL,
  p_bedrooms integer DEFAULT NULL,
  p_bathrooms integer DEFAULT NULL,
  p_completion_status text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  address text,
  city text,
  region text,
  development_name text,
  development_type text,
  developer_name text,
  completion_status text,
  total_units integer,
  available_units integer,
  expected_completion_date date,
  development_amenities text[],
  price_range_min numeric,
  price_range_max numeric,
  image_urls text[],
  bedrooms integer,
  bathrooms integer,
  features jsonb,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.address,
    p.city,
    p.region,
    p.development_name,
    p.development_type,
    p.developer_name,
    p.completion_status,
    p.total_units,
    p.available_units,
    p.expected_completion_date,
    p.development_amenities,
    p.price_range_min,
    p.price_range_max,
    p.image_urls,
    p.bedrooms,
    p.bathrooms,
    p.features,
    p.created_at
  FROM properties p
  WHERE p.is_development = true
    AND p.status = 'active'
    AND (p_region IS NULL OR p.region = p_region)
    AND (p_development_type IS NULL OR p.development_type = p_development_type)
    AND (p_min_price IS NULL OR p.price_range_min >= p_min_price OR p.price_range_max >= p_min_price)
    AND (p_max_price IS NULL OR p.price_range_max <= p_max_price OR p.price_range_min <= p_max_price)
    AND (p_bedrooms IS NULL OR p.bedrooms >= p_bedrooms)
    AND (p_bathrooms IS NULL OR p.bathrooms >= p_bathrooms)
    AND (p_completion_status IS NULL OR p.completion_status = p_completion_status)
  ORDER BY p.created_at DESC;
END;
$$;

-- Grant execute permissions on the function
GRANT EXECUTE ON FUNCTION search_developments TO authenticated;
GRANT EXECUTE ON FUNCTION search_developments TO anon;

-- Insert sample development data
INSERT INTO properties (
  title,
  description,
  address,
  city,
  region,
  price,
  is_development,
  development_name,
  development_type,
  developer_name,
  developer_contact,
  completion_status,
  total_units,
  available_units,
  expected_completion_date,
  development_amenities,
  price_range_min,
  price_range_max,
  bedrooms,
  bathrooms,
  features,
  image_urls,
  status,
  user_id
) VALUES 
(
  'Luxury Waterfront Villas - Phase 1',
  'Exclusive waterfront development featuring 50 luxury villas with private docks and ocean views. Each villa includes high-end finishes, smart home technology, and access to premium amenities.',
  'Diamond',
  'East Bank Demerara',
  'Region 4 (Demerara-Mahaica)',
  75000000,
  true,
  'Diamond Waterfront Estates',
  'Luxury Villas',
  'Atlantic Development Group',
  'info@atlanticdev.gy',
  'under-construction',
  50,
  32,
  '2025-12-01',
  ARRAY['Private Marina', 'Golf Course', 'Spa & Wellness Center', 'Private Beach', 'Concierge Service', '24/7 Security'],
  65000000,
  95000000,
  4,
  3,
  '["Pool", "Garden", "Security Estate", "AC", "Garage", "Furnished", "WiFi"]'::jsonb,
  ARRAY['https://example.com/villa1.jpg', 'https://example.com/villa2.jpg'],
  'active',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Georgetown Garden Townhouses',
  'Modern townhouse community in the heart of Georgetown. 80 units featuring contemporary design, private gardens, and easy access to city amenities.',
  'Bel Air Park',
  'Georgetown',
  'Region 4 (Demerara-Mahaica)',
  35000000,
  true,
  'Georgetown Gardens',
  'Townhouses',
  'Urban Living Developments',
  'sales@urbanliving.gy',
  'ready-to-move',
  80,
  15,
  '2024-06-01',
  ARRAY['Community Garden', 'Playground', 'Gym', 'Parking Garage', 'Security Gates'],
  30000000,
  45000000,
  3,
  2,
  '["Garden", "Security Estate", "AC", "Garage", "WiFi", "Cable TV"]'::jsonb,
  ARRAY['https://example.com/townhouse1.jpg', 'https://example.com/townhouse2.jpg'],
  'active',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Eco-Friendly Mixed Development',
  'Sustainable mixed-use development combining residential units, retail spaces, and offices. Features solar power, rainwater harvesting, and green building materials.',
  'Turkeyen',
  'Greater Georgetown',
  'Region 4 (Demerara-Mahaica)',
  25000000,
  true,
  'GreenSpace Commons',
  'Mixed-Use Development',
  'EcoLiving Guyana',
  'hello@ecoliving.gy',
  'pre-launch',
  120,
  120,
  '2026-03-01',
  ARRAY['Solar Power', 'Rainwater Harvesting', 'Community Center', 'Retail Spaces', 'Office Spaces', 'Bike Paths'],
  20000000,
  40000000,
  2,
  1,
  '["Pet Friendly", "Garden", "AC", "Security System", "WiFi", "Kitchen Appliances"]'::jsonb,
  ARRAY['https://example.com/eco1.jpg', 'https://example.com/eco2.jpg'],
  'active',
  (SELECT id FROM auth.users LIMIT 1)
);

-- Update statistics
ANALYZE properties;
