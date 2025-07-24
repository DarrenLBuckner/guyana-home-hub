-- Inquiries/Contact System Database Setup
-- This creates the infrastructure for property inquiries and lead tracking

-- Create inquiries table for tracking customer interest
CREATE TABLE IF NOT EXISTS inquiries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
    agent_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Customer Information
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text,
    
    -- Inquiry Details
    message text NOT NULL,
    inquiry_type text DEFAULT 'general' CHECK (inquiry_type IN ('general', 'viewing', 'offer', 'information')),
    preferred_contact text DEFAULT 'email' CHECK (preferred_contact IN ('email', 'phone', 'both')),
    
    -- Status and Tracking
    status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'not_interested', 'converted')),
    priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    
    -- Agent Response
    agent_notes text,
    agent_response text,
    responded_at timestamp with time zone,
    
    -- Timestamps
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_agent_id ON inquiries(agent_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_customer_email ON inquiries(customer_email);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_inquiries_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_inquiries_updated_at
    BEFORE UPDATE ON inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_inquiries_updated_at();

-- Create function to increment property inquiry count
CREATE OR REPLACE FUNCTION increment_property_inquiries()
RETURNS trigger AS $$
BEGIN
    UPDATE properties 
    SET inquiries = COALESCE(inquiries, 0) + 1
    WHERE id = NEW.property_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_property_inquiries
    AFTER INSERT ON inquiries
    FOR EACH ROW
    EXECUTE FUNCTION increment_property_inquiries();

-- Row Level Security (RLS) policies
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view inquiries for their own properties
CREATE POLICY "Users can view inquiries for their properties" ON inquiries
    FOR SELECT USING (
        agent_id = auth.uid() OR 
        property_id IN (
            SELECT id FROM properties WHERE user_id = auth.uid()
        )
    );

-- Policy: Anyone can create inquiries (public can inquire about properties)
CREATE POLICY "Anyone can create inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);

-- Policy: Agents can update inquiries for their properties
CREATE POLICY "Agents can update their inquiries" ON inquiries
    FOR UPDATE USING (
        agent_id = auth.uid() OR 
        property_id IN (
            SELECT id FROM properties WHERE user_id = auth.uid()
        )
    );

-- Create a view for inquiry analytics
CREATE OR REPLACE VIEW inquiry_analytics AS
SELECT 
    p.user_id as agent_id,
    COUNT(*) as total_inquiries,
    COUNT(CASE WHEN i.status = 'new' THEN 1 END) as new_inquiries,
    COUNT(CASE WHEN i.status = 'contacted' THEN 1 END) as contacted_inquiries,
    COUNT(CASE WHEN i.status = 'qualified' THEN 1 END) as qualified_inquiries,
    COUNT(CASE WHEN i.status = 'converted' THEN 1 END) as converted_inquiries,
    COUNT(CASE WHEN i.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as inquiries_this_week,
    COUNT(CASE WHEN i.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as inquiries_this_month
FROM inquiries i
JOIN properties p ON i.property_id = p.id
GROUP BY p.user_id;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON inquiries TO authenticated;
GRANT SELECT ON inquiry_analytics TO authenticated;
