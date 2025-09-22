-- Fix missing price_type column in properties table
-- This adds the price_type column that seems to be missing

-- Add the price_type column if it doesn't exist
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS price_type text DEFAULT 'sale';

-- Add the constraint for price_type values (drop first if exists)
ALTER TABLE properties 
DROP CONSTRAINT IF EXISTS check_price_type;

ALTER TABLE properties 
ADD CONSTRAINT check_price_type 
CHECK (price_type IN ('sale', 'rent'));

-- Create index for price_type
CREATE INDEX IF NOT EXISTS idx_properties_price_type ON properties(price_type);

-- Update any existing records to have a default price_type if NULL
UPDATE properties 
SET price_type = 'sale' 
WHERE price_type IS NULL;
