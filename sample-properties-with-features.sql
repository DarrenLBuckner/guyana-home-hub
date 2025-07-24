-- Add sample properties with features for testing the advanced filters

INSERT INTO properties (
  id, title, description, price, location, region, property_type, price_type,
  bedrooms, bathrooms, home_size, lot_size, features, image_urls, hero_index,
  status, user_id, contact_name, contact_phone, contact_email, created_at, updated_at
) VALUES 

-- Property with pool and security features
(
  gen_random_uuid(),
  'Luxury Villa with Pool in Georgetown',
  'Stunning 4-bedroom luxury villa featuring a private swimming pool, beautiful garden, and comprehensive security system. Located in a prestigious gated community with 24/7 security, backup generator, and paved roads throughout.',
  150000000,
  'Bel Air Park, Georgetown',
  'Region 4 (Demerara-Mahaica)',
  'Villa',
  'sale',
  4,
  3,
  '3500 sq ft',
  '8000 sq ft',
  ARRAY['Pool', 'Garden', 'Security Estate', 'AC', 'Security System', 'Fenced', 'Backup Generator', 'Paved Roads', 'Garage', 'Furnished'],
  ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
  0,
  'approved',
  gen_random_uuid(),
  'Sarah Williams',
  '+592-555-0123',
  'sarah@realty.gy',
  NOW(),
  NOW()
),

-- Pet-friendly property with fruit trees
(
  gen_random_uuid(),
  'Pet-Friendly Family Home with Fruit Trees',
  'Charming 3-bedroom family home on large lot with mature fruit trees including mango, coconut, and lime. Pet-friendly property with secure fencing and plenty of space for pets to roam. Features air conditioning, backup generator, and beautiful garden.',
  85000000,
  'Diamond, East Bank Demerara',
  'Region 4 (Demerara-Mahaica)',
  'House',
  'sale',
  3,
  2,
  '2200 sq ft',
  '12000 sq ft',
  ARRAY['Pet Friendly', 'Garden', 'Fruit Trees', 'AC', 'Fenced', 'Backup Generator', 'Paved Roads', 'Parking'],
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
  0,
  'approved',
  gen_random_uuid(),
  'Michael Chen',
  '+592-555-0456',
  'michael@properties.gy',
  NOW(),
  NOW()
),

-- Modern townhouse in security estate
(
  gen_random_uuid(),
  'Modern Townhouse in Gated Community',
  'Brand new 3-bedroom townhouse in exclusive gated community. Features modern amenities including central air conditioning, fully equipped kitchen, and private garage. Community amenities include swimming pool, gym, and 24/7 security.',
  95000000,
  'Turkeyen, Greater Georgetown',
  'Region 4 (Demerara-Mahaica)',
  'Townhouse',
  'sale',
  3,
  2,
  '1800 sq ft',
  '2500 sq ft',
  ARRAY['Security Estate', 'AC', 'Pool', 'Gym', 'Garage', 'Kitchen Appliances', 'Paved Roads', 'Security System'],
  ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
  0,
  'approved',
  gen_random_uuid(),
  'Priya Sharma',
  '+592-555-0789',
  'priya@newhomes.gy',
  NOW(),
  NOW()
),

-- Eco-friendly house with solar panels
(
  gen_random_uuid(),
  'Eco-Friendly Home with Solar Power',
  'Environmentally conscious 2-bedroom home featuring solar panels, rainwater harvesting, and organic garden. Perfect for sustainable living with modern conveniences including WiFi, cable TV, and washing machine. Beautiful terrace with garden views.',
  70000000,
  'Kitty, Georgetown',
  'Region 4 (Demerara-Mahaica)',
  'House',
  'sale',
  2,
  2,
  '1600 sq ft',
  '4000 sq ft',
  ARRAY['Garden', 'Solar Panels', 'WiFi', 'Cable TV', 'Washing Machine', 'Terrace', 'Fenced', 'Paved Roads'],
  ARRAY['https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
  0,
  'approved',
  gen_random_uuid(),
  'David Thompson',
  '+592-555-0234',
  'david@greenliving.gy',
  NOW(),
  NOW()
),

-- Furnished apartment with balcony
(
  gen_random_uuid(),
  'Fully Furnished Apartment with Balcony',
  'Modern 1-bedroom furnished apartment featuring spacious balcony with city views. Includes all kitchen appliances, washing machine, WiFi, and cable TV. Located in secure building with backup generator and covered parking.',
  45000000,
  'Camp Street, Georgetown',
  'Region 4 (Demerara-Mahaica)',
  'Apartment',
  'sale',
  1,
  1,
  '800 sq ft',
  NULL,
  ARRAY['Furnished', 'Balcony', 'Kitchen Appliances', 'Washing Machine', 'WiFi', 'Cable TV', 'AC', 'Backup Generator', 'Parking'],
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
  0,
  'approved',
  gen_random_uuid(),
  'Lisa Rodriguez',
  '+592-555-0567',
  'lisa@urbanprojects.gy',
  NOW(),
  NOW()
)

ON CONFLICT (id) DO NOTHING;
