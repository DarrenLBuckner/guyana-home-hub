-- JAMAICA MULTI-SITE DEBUGGING QUERIES
-- Run these in Supabase SQL Editor in EXACT ORDER
-- Copy results and report back to development team

-- ================================================
-- PHASE 1: VERIFY JAMAICA DATABASE SETUP
-- ================================================

-- Query 1: Check if Jamaica country exists
-- Expected: Should return 1 row with country_id = 2, code = 'JM'
SELECT 
  id as country_id,
  code,
  name,
  created_at
FROM countries 
WHERE code = 'JM' OR name ILIKE '%jamaica%'
ORDER BY id;

-- Query 2: Check if Jamaica regions exist  
-- Expected: Should return 21 rows (Kingston, Montego Bay, etc.)
SELECT 
  id,
  name,
  country_id,
  created_at
FROM regions 
WHERE country_id = 2 
ORDER BY name;

-- Query 3: Check if Jamaica pricing plans exist
-- Expected: Should return 7 rows with prices in JMD
SELECT 
  id,
  name,
  price,
  currency,
  country_id,
  created_at
FROM pricing_plans 
WHERE country_id = 2
ORDER BY price;

-- ================================================
-- PHASE 2: CHECK PROPERTY DISTRIBUTION
-- ================================================

-- Query 4: Check property distribution by country/site
-- Expected: Should show properties for both 'jamaica' and 'guyana'
SELECT 
  CASE 
    WHEN site = 'jamaica' THEN 'Jamaica'
    WHEN site = 'guyana' THEN 'Guyana' 
    ELSE CONCAT('Other: ', site)
  END as country,
  COUNT(*) as property_count,
  MIN(created_at) as earliest_property,
  MAX(created_at) as latest_property
FROM properties 
GROUP BY site
ORDER BY property_count DESC;

-- Query 5: Check recent properties for each site
-- Expected: Should show different properties for jamaica vs guyana
SELECT 
  site,
  id,
  title,
  address,
  price,
  listing_type,
  created_at
FROM properties 
WHERE site IN ('jamaica', 'guyana')
ORDER BY site, created_at DESC 
LIMIT 20;

-- ================================================
-- PHASE 3: VERIFY DATA QUALITY
-- ================================================

-- Query 6: Check for any NULL or invalid site values
-- Expected: Should return 0 rows (no invalid data)
SELECT 
  COUNT(*) as invalid_properties,
  site
FROM properties 
WHERE site IS NULL 
   OR site NOT IN ('jamaica', 'guyana')
GROUP BY site;

-- Query 7: Check Jamaica property details
-- Expected: Should show Jamaica-specific properties if they exist
SELECT 
  COUNT(*) as jamaica_property_count,
  AVG(price) as avg_price,
  COUNT(DISTINCT listing_type) as listing_types,
  COUNT(DISTINCT region_id) as regions_used
FROM properties 
WHERE site = 'jamaica';

-- ================================================
-- PHASE 4: CHECK RELATED TABLES
-- ================================================

-- Query 8: Check if region mapping is correct for Jamaica properties
-- Expected: Jamaica properties should use Jamaica region IDs
SELECT 
  p.site,
  r.name as region_name,
  r.country_id,
  COUNT(*) as property_count
FROM properties p
LEFT JOIN regions r ON p.region_id = r.id
WHERE p.site = 'jamaica'
GROUP BY p.site, r.name, r.country_id
ORDER BY property_count DESC
LIMIT 10;

-- ================================================
-- RESULTS TEMPLATE - COPY AND FILL THIS OUT:
-- ================================================

/*
QUERY 1 RESULTS (Jamaica Country):
Rows returned: ___
Country ID: ___
Code: ___
Name: ___

QUERY 2 RESULTS (Jamaica Regions):  
Rows returned: ___
Sample regions: ___

QUERY 3 RESULTS (Jamaica Pricing):
Rows returned: ___
Currency shown: ___

QUERY 4 RESULTS (Property Distribution):
Jamaica properties: ___
Guyana properties: ___

QUERY 5 RESULTS (Recent Properties):
Jamaica properties exist: YES/NO
Sample Jamaica titles: ___

QUERY 6 RESULTS (Invalid Data):
Invalid properties found: ___

QUERY 7 RESULTS (Jamaica Stats):
Total Jamaica properties: ___
Average price: ___

QUERY 8 RESULTS (Region Mapping):
Regions used by Jamaica properties: ___

SUMMARY:
- Database setup complete: YES/NO
- Jamaica data exists: YES/NO  
- Data quality good: YES/NO
- Ready for debugging: YES/NO
*/