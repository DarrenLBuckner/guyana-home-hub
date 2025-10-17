-- CORRECTED PORTAL HOME HUB QUERIES
-- Based on actual schema discovered

-- ================================================
-- STEP 1: VERIFY JAMAICA SETUP (CORRECTED)
-- ================================================

-- Query 1: ✅ Jamaica country exists (CONFIRMED)
-- Result: Jamaica found with code 'JM', currency 'JMD', symbol 'J$'

-- Query 2: Check Jamaica regions (CORRECTED - using country_code instead of country_id)
SELECT COUNT(*) as region_count, string_agg(name, ', ') as sample_regions
FROM regions WHERE country_code = 'JM';

-- Query 3: Check table structure for pricing plans
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pricing_plans' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Query 4: Check what pricing/plan tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE '%plan%' OR table_name LIKE '%pricing%' OR table_name LIKE '%subscription%');

-- ================================================
-- STEP 2: CHECK PROPERTY DATA (MOST CRITICAL)
-- ================================================

-- Query 5: Check properties table structure first
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Query 6: Check property distribution by site/country
SELECT 
  site,
  COUNT(*) as property_count,
  MIN(created_at) as earliest,
  MAX(created_at) as latest
FROM properties 
GROUP BY site
ORDER BY property_count DESC;

-- Query 7: Check if site column has Jamaica values
SELECT DISTINCT site, COUNT(*) as count
FROM properties 
GROUP BY site
ORDER BY count DESC;

-- Query 8: Look for Jamaica properties specifically
SELECT 
  id,
  title,
  address,
  price,
  site,
  created_at
FROM properties 
WHERE site = 'jamaica' OR site = 'JM' OR site ILIKE '%jamaica%'
ORDER BY created_at DESC 
LIMIT 10;

-- ================================================
-- STEP 3: UNDERSTAND THE SCHEMA
-- ================================================

-- Query 9: List all tables to understand structure
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Query 10: Check if there are any country-related columns in properties
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND table_schema = 'public'
AND (column_name ILIKE '%country%' OR column_name ILIKE '%region%' OR column_name ILIKE '%site%')
ORDER BY column_name;