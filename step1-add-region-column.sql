-- STEP 1: ADD REGION COLUMN FIRST
-- Run this script FIRST before running the sample properties script

-- Add the region column to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS region text;

-- Create index for region searches
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);
