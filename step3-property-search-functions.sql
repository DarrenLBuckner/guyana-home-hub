-- STEP 3: PROPERTY SEARCH FUNCTIONS
-- Run this script AFTER running step1-add-region-column.sql and step2-sample-properties-data.sql

-- Function to get properties with comprehensive filtering
CREATE OR REPLACE FUNCTION get_properties_with_filters(
  p_price_type text DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_region text DEFAULT NULL,
  p_property_type text DEFAULT NULL,
  p_min_price integer DEFAULT NULL,
  p_max_price integer DEFAULT NULL,
  p_min_bedrooms integer DEFAULT NULL,
  p_max_bedrooms integer DEFAULT NULL,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  price integer,
  price_type text,
  location text,
  region text,
  property_type text,
  bedrooms integer,
  bathrooms integer,
  lot_size text,
  home_size text,
  features text[],
  images text[],
  hero_index integer,
  status text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  agent_name text,
  views integer,
  inquiries integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.price,
    p.price_type,
    p.location,
    p.region,
    p.property_type,
    p.bedrooms,
    p.bathrooms,
    p.lot_size,
    p.home_size,
    p.features,
    p.images,
    p.hero_index,
    p.status,
    p.created_at,
    p.updated_at,
    COALESCE(prof.first_name || ' ' || prof.last_name, 'Unknown Agent') as agent_name,
    COALESCE(p.views, 0) as views,
    COALESCE(p.inquiries, 0) as inquiries
  FROM properties p
  LEFT JOIN profiles prof ON p.user_id = prof.id
  WHERE 
    p.status = 'active'
    AND (p_price_type IS NULL OR p.price_type = p_price_type)
    AND (p_location IS NULL OR p.location ILIKE '%' || p_location || '%')
    AND (p_region IS NULL OR p.region ILIKE '%' || p_region || '%')
    AND (p_property_type IS NULL OR p.property_type = p_property_type)
    AND (p_min_price IS NULL OR p.price >= p_min_price)
    AND (p_max_price IS NULL OR p.price <= p_max_price)
    AND (p_min_bedrooms IS NULL OR p.bedrooms >= p_min_bedrooms)
    AND (p_max_bedrooms IS NULL OR p.bedrooms <= p_max_bedrooms)
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to get available regions for dropdown
CREATE OR REPLACE FUNCTION get_available_regions()
RETURNS TABLE (region text, property_count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.region,
    COUNT(*) as property_count
  FROM properties p
  WHERE p.status = 'active' AND p.region IS NOT NULL
  GROUP BY p.region
  ORDER BY property_count DESC, p.region;
END;
$$ LANGUAGE plpgsql;

-- Function to get available locations for dropdown
CREATE OR REPLACE FUNCTION get_available_locations()
RETURNS TABLE (location text, property_count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.location,
    COUNT(*) as property_count
  FROM properties p
  WHERE p.status = 'active' AND p.location IS NOT NULL
  GROUP BY p.location
  ORDER BY property_count DESC, p.location;
END;
$$ LANGUAGE plpgsql;

-- Function to get property type counts
CREATE OR REPLACE FUNCTION get_property_type_counts()
RETURNS TABLE (property_type text, property_count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.property_type,
    COUNT(*) as property_count
  FROM properties p
  WHERE p.status = 'active'
  GROUP BY p.property_type
  ORDER BY property_count DESC, p.property_type;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_properties_with_filters TO authenticated;
GRANT EXECUTE ON FUNCTION get_available_regions TO authenticated;
GRANT EXECUTE ON FUNCTION get_available_locations TO authenticated;
GRANT EXECUTE ON FUNCTION get_property_type_counts TO authenticated;

-- Grant permissions to anonymous users for browsing
GRANT EXECUTE ON FUNCTION get_properties_with_filters TO anon;
GRANT EXECUTE ON FUNCTION get_available_regions TO anon;
GRANT EXECUTE ON FUNCTION get_available_locations TO anon;
GRANT EXECUTE ON FUNCTION get_property_type_counts TO anon;
