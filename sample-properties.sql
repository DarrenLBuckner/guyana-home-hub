-- SAMPLE PROPERTIES FOR GUYANA HOME HUB WITH REGIONS
-- This script populates the properties table with realistic demo data
-- Based on existing listings.json and expanded with comprehensive details
-- Includes Guyana's 10 administrative regions for better search functionality

-- First, add the region column to properties table if it doesn't exist
ALTER TABLE properties ADD COLUMN IF NOT EXISTS region text;

-- First, create a sample agent user for the properties
-- (In production, these would be real agent users from the agent_vetting system)
INSERT INTO auth.users (id, email, created_at, updated_at, email_confirmed_at)
VALUES (
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  'demo.agent@guyanahomehub.com',
  now(),
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, user_type, first_name, last_name, email, vetting_status)
VALUES (
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  'agent',
  'Maria',
  'Ramdeen',
  'demo.agent@guyanahomehub.com',
  'approved'
) ON CONFLICT (id) DO NOTHING;

-- Clear any existing sample properties (optional - remove if you want to keep existing data)
-- DELETE FROM properties WHERE title LIKE '%Georgetown%' OR title LIKE '%Essequibo%' OR title LIKE '%Linden%';

-- Insert comprehensive sample properties
INSERT INTO properties (
  user_id, title, description, price, price_type, location, region,
  property_type, bedrooms, bathrooms, lot_size, home_size, 
  features, images, hero_index, status, created_at, updated_at
) VALUES 

-- 1. Modern Apartment in Central Georgetown
(
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  'Modern Apartment in Central Georgetown',
  'Stunning 2-bedroom apartment in the heart of Georgetown. Features modern finishes, air conditioning throughout, secure parking, and 24/7 security. Walking distance to markets, restaurants, and business district. Perfect for professionals or small families.',
  120000,
  'rent',
  'Georgetown',
  'Region 4 (Demerara-Mahaica)',
  'apartment',
  2,
  2,
  '0',
  '850 sq ft',
  ARRAY['Air Conditioning', 'Secure Parking', '24/7 Security', 'Modern Kitchen', 'Balcony', 'Internet Ready'],
  ARRAY['/images/apt-georgetown.jpg'],
  0,
  'active',
  now(),
  now()
),

-- 2. Luxury Beachfront Villa in Essequibo
(
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  'Luxury Beachfront Villa in Essequibo',
  'Magnificent 4-bedroom beachfront villa with panoramic ocean views. Private beach access, infinity pool, gourmet kitchen, and spacious outdoor entertaining areas. This is coastal living at its finest. Includes staff quarters and boat dock.',
  48000000,
  'sale',
  'Essequibo Coast',
  'Region 2 (Pomeroon-Supenaam)',
  'villa',
  4,
  3,
  '2 acres',
  '3200 sq ft',
  ARRAY['Beachfront', 'Private Pool', 'Boat Dock', 'Staff Quarters', 'Gourmet Kitchen', 'Ocean Views', 'Generator'],
  ARRAY['/images/villa-beachfront.jpg'],
  0,
  'active',
  now(),
  now()
),

-- 3. Spacious Family Home in Linden
(
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  'Spacious Family Home in Linden',
  'Beautiful 3-bedroom family home in quiet Linden neighborhood. Large yard perfect for children, covered garage, modern appliances, and fruit trees. Close to schools and shopping. Move-in ready with recent renovations.',
  25000000,
  'sale',
  'Linden',
  'Region 10 (Upper Demerara-Berbice)',
  'house',
  3,
  2,
  '0.5 acres',
  '1800 sq ft',
  ARRAY['Large Yard', 'Covered Garage', 'Fruit Trees', 'Recently Renovated', 'Near Schools', 'Quiet Neighborhood'],
  ARRAY['/images/house-linden.jpg'],
  0,
  'active',
  now(),
  now()
),

-- 4. Development Land in Berbice
(
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  'Prime Development Land in Berbice',
  'Excellent opportunity for developers! 5-acre plot in growing Berbice area. Cleared and ready for residential or commercial development. Good road access, utilities nearby. Perfect for housing development or business complex.',
  8000000,
  'sale',
  'New Amsterdam',
  'Region 6 (East Berbice-Corentyne)',
  'land',
  0,
  0,
  '5 acres',
  '0',
  ARRAY['Cleared Land', 'Road Access', 'Utilities Nearby', 'Development Potential', 'Commercial Zoning'],
  ARRAY['/images/land-berbice.jpg'],
  0,
  'active',
  now(),
  now()
),

-- 5. Fixer-Upper House Near New Amsterdam
(
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  'Fixer-Upper House Near New Amsterdam',
  'Great investment opportunity! 2-bedroom house on large lot needs TLC but has great bones. Perfect for handy buyers or investors. Large lot allows for expansion. Priced to sell quickly.',
  5000000,
  'sale',
  'New Amsterdam',
  'Region 6 (East Berbice-Corentyne)',
  'house',
  2,
  1,
  '0.75 acres',
  '1200 sq ft',
  ARRAY['Large Lot', 'Expansion Potential', 'Investment Opportunity', 'Needs Renovation'],
  ARRAY['/images/fixer-upper.jpg'],
  0,
  'active',
  now(),
  now()
),

-- 6. Beach Resort Getaway in Anna Regina
(
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  'Beach Resort Getaway in Anna Regina',
  'Stunning vacation rental property right on the beach. 3-bedroom villa perfect for holiday rentals or personal getaways. Fully furnished, private beach access, outdoor shower, and tropical gardens. High rental income potential.',
  220000,
  'rent',
  'Anna Regina',
  'Region 2 (Pomeroon-Supenaam)',
  'villa',
  3,
  2,
  '0.25 acres',
  '1600 sq ft',
  ARRAY['Beachfront', 'Fully Furnished', 'Vacation Rental', 'Outdoor Shower', 'Tropical Gardens', 'High Income Potential'],
  ARRAY['/images/resort-anna.jpg'],
  0,
  'active',
  now(),
  now()
),

-- 7. Cozy 3BR Home in New Amsterdam
(
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  'Cozy 3-Bedroom Home in New Amsterdam',
  'Charming family home in established New Amsterdam neighborhood. 3 bedrooms, modern kitchen, covered parking, and nice backyard. Walking distance to schools, markets, and public transport. Well-maintained and move-in ready.',
  150000,
  'rent',
  'New Amsterdam',
  'Region 6 (East Berbice-Corentyne)',
  'house',
  3,
  2,
  '0.3 acres',
  '1400 sq ft',
  ARRAY['Family Friendly', 'Modern Kitchen', 'Covered Parking', 'Near Schools', 'Public Transport', 'Well Maintained'],
  ARRAY['/images/home-newamsterdam.jpg'],
  0,
  'active',
  now(),
  now()
),

-- 8. Additional Georgetown Luxury Condo
(
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  'Executive Condo in Georgetown Business District',
  'Premium 3-bedroom condominium in Georgetown''s most prestigious building. Top-floor unit with city views, concierge service, gym, pool, and executive parking. Perfect for business professionals.',
  35000000,
  'sale',
  'Georgetown',
  'Region 4 (Demerara-Mahaica)',
  'condo',
  3,
  2,
  '0',
  '1200 sq ft',
  ARRAY['City Views', 'Concierge Service', 'Gym Access', 'Pool', 'Executive Parking', 'Top Floor'],
  ARRAY['/images/apt-georgetown.jpg'],
  0,
  'active',
  now(),
  now()
),

-- 9. Agricultural Land in Rural Berbice
(
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  'Prime Agricultural Land in Rural Berbice',
  '10-acre agricultural plot perfect for farming or livestock. Rich soil, water access, and good drainage. Ideal for rice cultivation, cash crops, or cattle ranching. Peaceful rural setting with development potential.',
  12000000,
  'sale',
  'Rose Hall',
  'Region 6 (East Berbice-Corentyne)',
  'land',
  0,
  0,
  '10 acres',
  '0',
  ARRAY['Agricultural Use', 'Water Access', 'Rich Soil', 'Good Drainage', 'Rural Setting', 'Livestock Suitable'],
  ARRAY['/images/land-berbice.jpg'],
  0,
  'active',
  now(),
  now()
),

-- 10. Modern Georgetown Townhouse
(
  'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  'Modern Townhouse in Georgetown Suburbs',
  'Brand new 3-bedroom townhouse in gated community. Modern design, granite countertops, stainless appliances, and private patio. Community features pool, playground, and 24/7 security.',
  180000,
  'rent',
  'Georgetown',
  'Region 4 (Demerara-Mahaica)',
  'townhouse',
  3,
  2,
  '0.1 acres',
  '1600 sq ft',
  ARRAY['Gated Community', 'Brand New', 'Granite Countertops', 'Stainless Appliances', 'Community Pool', 'Playground'],
  ARRAY['/images/hero-house-desktop.jpg'],
  0,
  'active',
  now(),
  now()
);

-- Update property counts and add some analytics data
UPDATE properties SET 
  views = FLOOR(RANDOM() * 50 + 10),
  inquiries = FLOOR(RANDOM() * 5 + 1)
WHERE user_id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

-- Create index for region-based searches
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);

-- Reference: Guyana's 10 Administrative Regions for future use
/*
GUYANA REGIONS REFERENCE:
- Region 1 (Barima-Waini): Mabaruma, Port Kaituma
- Region 2 (Pomeroon-Supenaam): Anna Regina, Charity
- Region 3 (Essequibo Islands-West Demerara): Parika, Vreed en Hoop
- Region 4 (Demerara-Mahaica): Georgetown, Diamond, Timehri
- Region 5 (Mahaica-Berbice): Mahaicony, Rosignol
- Region 6 (East Berbice-Corentyne): New Amsterdam, Rose Hall, Skeldon
- Region 7 (Cuyuni-Mazaruni): Bartica, Mahdia
- Region 8 (Potaro-Siparuni): Mahdia, Paramakatoi
- Region 9 (Upper Takutu-Upper Essequibo): Lethem, Aishalton
- Region 10 (Upper Demerara-Berbice): Linden, Kwakwani
*/
