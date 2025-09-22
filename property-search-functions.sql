-- PROPERTY SEARCH FUNCTIONS FOR API
-- This creates database functions to support property browsing with filters

-- Function to get properties with filters
CREATE OR REPLACE FUNCTION get_properties_with_filters(
  p_price_type text DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_region text DEFAULT NULL,
  p_property_type text DEFAULT NULL,
  p_min_price numeric DEFAULT NULL,
  p_max_price numeric DEFAULT NULL,
  p_bedrooms integer DEFAULT NULL,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  price numeric,
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
  views integer,
  inquiries integer,
  created_at timestamptz,
  agent_name text,
  agent_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    props.id,
    props.title,
    props.description,
    props.price,
    props.price_type,
    props.location,
    props.region,
    props.property_type,
    props.bedrooms,
    props.bathrooms,
    props.lot_size,
    props.home_size,
    props.features,
    props.images,
    props.hero_index,
    props.status,
    props.views,
    props.inquiries,
    props.created_at,
    CONCAT(profiles.first_name, ' ', profiles.last_name) as agent_name,
    profiles.email as agent_email
  FROM properties props
  LEFT JOIN profiles ON props.user_id = profiles.id
  WHERE props.status = 'active'
    AND (p_price_type IS NULL OR props.price_type = p_price_type)
    AND (p_location IS NULL OR props.location ILIKE '%' || p_location || '%')
    AND (p_region IS NULL OR props.region = p_region)
    AND (p_property_type IS NULL OR props.property_type = p_property_type)
    AND (p_min_price IS NULL OR props.price >= p_min_price)
    AND (p_max_price IS NULL OR props.price <= p_max_price)
    AND (p_bedrooms IS NULL OR props.bedrooms = p_bedrooms)
  ORDER BY props.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Function to get distinct regions for filter dropdown
CREATE OR REPLACE FUNCTION get_available_regions()
RETURNS TABLE (region text, property_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    props.region,
    COUNT(*) as property_count
  FROM properties props
  WHERE props.status = 'active' AND props.region IS NOT NULL
  GROUP BY props.region
  ORDER BY props.region;
END;
$$;

-- Function to get distinct locations for filter dropdown
CREATE OR REPLACE FUNCTION get_available_locations()
RETURNS TABLE (location text, property_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    props.location,
    COUNT(*) as property_count
  FROM properties props
  WHERE props.status = 'active' AND props.location IS NOT NULL
  GROUP BY props.location
  ORDER BY props.location;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_properties_with_filters TO authenticated;
GRANT EXECUTE ON FUNCTION get_properties_with_filters TO anon;
GRANT EXECUTE ON FUNCTION get_available_regions TO authenticated;
GRANT EXECUTE ON FUNCTION get_available_regions TO anon;
GRANT EXECUTE ON FUNCTION get_available_locations TO authenticated;
GRANT EXECUTE ON FUNCTION get_available_locations TO anon;
