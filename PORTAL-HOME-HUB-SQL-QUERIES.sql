-- PORTAL HOME HUB - JAMAICA DATA VERIFICATION
-- Run these in Portal Home Hub Supabase SQL Editor
-- This is the backend database that serves both Guyana and Jamaica frontends

-- ================================================
-- STEP 1: VERIFY JAMAICA SETUP IN PORTAL HOME HUB
-- ================================================

-- Query 1: Check if Jamaica country exists
SELECT * FROM countries WHERE code = 'JM' OR name ILIKE '%jamaica%';

-- Query 2: Check if Jamaica regions exist  
SELECT COUNT(*) as region_count, string_agg(name, ', ') as sample_regions
FROM regions WHERE country_id = 2;

-- Query 3: Check if Jamaica pricing plans exist
SELECT COUNT(*) as plan_count, currency, AVG(price) as avg_price
FROM pricing_plans WHERE country_id = 2
GROUP BY currency;

-- ================================================
-- STEP 2: CHECK PROPERTY DATA BY SITE
-- ================================================

-- Query 4: CRITICAL - Check property distribution by site
SELECT 
  site,
  COUNT(*) as property_count,
  MIN(created_at) as earliest,
  MAX(created_at) as latest
FROM properties 
GROUP BY site
ORDER BY property_count DESC;

-- Query 5: Check recent Jamaica properties specifically
SELECT 
  id,
  title,
  address,
  price,
  site,
  created_at
FROM properties 
WHERE site = 'jamaica'
ORDER BY created_at DESC 
LIMIT 5;

-- Query 6: Check recent Guyana properties for comparison
SELECT 
  id,
  title,
  address,
  price,
  site,
  created_at
FROM properties 
WHERE site = 'guyana'
ORDER BY created_at DESC 
LIMIT 5;

-- ================================================
-- STEP 3: CHECK API ENDPOINTS (IF THEY EXIST)
-- ================================================

-- Query 7: Check if there's an API log table
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%api%' OR table_name LIKE '%log%';

-- ================================================
-- COPY THESE RESULTS AND PASTE BACK:
-- ================================================

/*
QUERY 1 - Jamaica Country:
Result: 

QUERY 2 - Jamaica Regions:
Count: _____ regions
Sample regions: 

QUERY 3 - Jamaica Pricing:
Count: _____ plans
Currency: _____
Avg price: _____

QUERY 4 - Property Sites:
jamaica: _____ properties
guyana: _____ properties
(OTHER SITES): _____

QUERY 5 - Recent Jamaica Properties:
Found: _____ properties
Sample titles:
1. 
2.
3.

QUERY 6 - Recent Guyana Properties:
Found: _____ properties
Sample titles:
1.
2. 
3.

QUERY 7 - API Tables:
Tables found: 

SUMMARY:
- Jamaica data exists: YES/NO
- Jamaica properties exist: YES/NO
- Site filtering possible: YES/NO
*/