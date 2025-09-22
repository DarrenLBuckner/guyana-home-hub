-- ADD MISSING COLUMNS TO EXISTING PROPERTIES TABLE
-- Run this to add the essential fields for agent vetting system
-- (Skipping user_id since you already have it!)

-- Add other useful columns if missing
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone;

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id);

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS property_type text;

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS price_type text DEFAULT 'sale' CHECK (price_type IN ('sale', 'rent'));

-- Add vetting_status to profiles table (essential for agent system)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS vetting_status text DEFAULT 'not_submitted' 
CHECK (vetting_status IN ('not_submitted', 'pending_review', 'approved', 'rejected', 'needs_revision'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

-- Enable RLS on properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Add basic RLS policies for properties
DROP POLICY IF EXISTS "Anyone can view approved properties" ON properties;
CREATE POLICY "Anyone can view approved properties"
ON properties FOR SELECT
USING (status = 'approved');

DROP POLICY IF EXISTS "Users can view their own properties" ON properties;
CREATE POLICY "Users can view their own properties"
ON properties FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Approved agents can create properties" ON properties;
CREATE POLICY "Approved agents can create properties"
ON properties FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type = 'agent'
        AND vetting_status = 'approved'
    )
);

-- Grant permissions
GRANT ALL ON TABLE properties TO authenticated;
GRANT SELECT ON TABLE properties TO anon;
