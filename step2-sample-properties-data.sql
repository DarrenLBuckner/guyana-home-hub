-- STEP 2: SAMPLE PROPERTIES DATA
-- Run this script AFTER running step1-add-region-column.sql

-- Create a sample agent user for the properties
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

-- Insert comprehensive sample properties
INSERT INTO properties (
  user_id, title, description, price, price_type, location, region,
  property_type, bedrooms, bathrooms, lot_size, home_size, 
  features, image_urls, hero_index, status, created_at, updated_at
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
  '["Air Conditioning", "Secure Parking", "24/7 Security", "Modern Kitchen", "Balcony", "Internet Ready"]'::jsonb,
  '["/images/apt-georgetown.jpg"]'::jsonb,
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
  '["Beachfront", "Private Pool", "Boat Dock", "Staff Quarters", "Gourmet Kitchen", "Ocean Views", "Generator"]'::jsonb,
  '["/images/villa-beachfront.jpg"]'::jsonb,
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
  '["Large Yard", "Covered Garage", "Fruit Trees", "Recently Renovated", "Near Schools", "Quiet Neighborhood"]'::jsonb,
  '["/images/house-linden.jpg"]'::jsonb,
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
  '["Cleared Land", "Road Access", "Utilities Nearby", "Development Potential", "Commercial Zoning"]'::jsonb,
  '["/images/land-berbice.jpg"]'::jsonb,
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
  '["Large Lot", "Expansion Potential", "Investment Opportunity", "Needs Renovation"]'::jsonb,
  '["/images/fixer-upper.jpg"]'::jsonb,
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
  '["Beachfront", "Fully Furnished", "Vacation Rental", "Outdoor Shower", "Tropical Gardens", "High Income Potential"]'::jsonb,
  '["/images/resort-anna.jpg"]'::jsonb,
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
  '["Family Friendly", "Modern Kitchen", "Covered Parking", "Near Schools", "Public Transport", "Well Maintained"]'::jsonb,
  '["/images/home-newamsterdam.jpg"]'::jsonb,
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
  '["City Views", "Concierge Service", "Gym Access", "Pool", "Executive Parking", "Top Floor"]'::jsonb,
  '["/images/apt-georgetown.jpg"]'::jsonb,
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
  '["Agricultural Use", "Water Access", "Rich Soil", "Good Drainage", "Rural Setting", "Livestock Suitable"]'::jsonb,
  '["/images/land-berbice.jpg"]'::jsonb,
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
  '["Gated Community", "Brand New", "Granite Countertops", "Stainless Appliances", "Community Pool", "Playground"]'::jsonb,
  '["/images/hero-house-desktop.jpg"]'::jsonb,
  0,
  'active',
  now(),
  now()
);

-- Properties inserted successfully with sample data
