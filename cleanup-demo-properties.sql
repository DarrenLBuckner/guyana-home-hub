-- CLEANUP DEMO PROPERTIES FROM GUYANA HOME HUB DATABASE
-- Remove all demo/test properties and the demo agent user

-- 1. Delete all properties created by the demo agent
DELETE FROM properties 
WHERE user_id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

-- 2. Delete specific demo properties by title (in case user_id differs)
DELETE FROM properties 
WHERE title IN (
  'Modern Apartment in Central Georgetown',
  'Luxury Villa in Georgetown',
  'Beachfront Property in Essequibo',
  'Commercial Building in Linden',
  'Family Home in New Amsterdam',
  'Cozy Cottage in Anna Regina',
  'Investment Property in Berbice',
  'Modern Townhouse in Kitty',
  'Waterfront Land in Bartica',
  'Apartment Complex in Diamond'
);

-- 3. Delete any other demo/test properties by pattern matching
DELETE FROM properties 
WHERE title ILIKE '%demo%' 
   OR title ILIKE '%test%' 
   OR title ILIKE '%sample%'
   OR description ILIKE '%demo%'
   OR description ILIKE '%test%'
   OR description ILIKE '%sample%';

-- 4. Remove the demo agent profile
DELETE FROM profiles 
WHERE id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   OR email = 'demo.agent@guyanahomehub.com';

-- 5. Remove the demo agent auth user (be careful with this)
DELETE FROM auth.users 
WHERE id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   OR email = 'demo.agent@guyanahomehub.com';

-- 6. Verify cleanup - Check remaining properties count
SELECT COUNT(*) as remaining_properties FROM properties;
SELECT COUNT(*) as remaining_users FROM profiles;

-- 7. List remaining properties to verify they are real
SELECT id, title, location, created_at, user_id 
FROM properties 
ORDER BY created_at DESC 
LIMIT 10;