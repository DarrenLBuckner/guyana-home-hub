const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://qwlmlfhunlxzxdnqnygw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3bG1sZmh1bmx4enhkbnFueWd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDQ3NDY0MCwiZXhwIjoyMDUwMDUwNjQwfQ.DhkJPDrMXhWOm-VfYRJOTFIRGHMnw8w5o8XksEUjQyc'
)

async function setupInquiriesTable() {
  try {
    console.log('Creating inquiries table manually...')

    // Test if we can access the database first
    const { data: existingTables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'inquiries')

    if (checkError) {
      console.log('Cannot access information_schema, will try direct insert approach...')
    } else {
      console.log('Database is accessible, inquiries table exists:', existingTables.length > 0)
    }

    // Try to insert a test record to see if table exists
    const { data: testData, error: testError } = await supabase
      .from('inquiries')
      .select('count')
      .limit(1)

    if (testError) {
      console.log('Inquiries table does not exist yet, need to create it manually in Supabase dashboard')
      console.log('Please run this SQL in your Supabase SQL editor:')
      console.log(`
CREATE TABLE inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  
  message text NOT NULL,
  inquiry_type text DEFAULT 'general' CHECK (inquiry_type IN ('general', 'viewing', 'offer', 'information')),
  preferred_contact text DEFAULT 'email' CHECK (preferred_contact IN ('email', 'phone', 'both')),
  
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'not_interested', 'converted')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  
  agent_notes text,
  agent_response text,
  responded_at timestamp with time zone,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX idx_inquiries_agent_id ON inquiries(agent_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);

-- Enable RLS
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view inquiries for their properties" ON inquiries
  FOR SELECT USING (
    agent_id = auth.uid() OR 
    property_id IN (
      SELECT id FROM properties WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Agents can update their inquiries" ON inquiries
  FOR UPDATE USING (
    agent_id = auth.uid() OR 
    property_id IN (
      SELECT id FROM properties WHERE user_id = auth.uid()
    )
  );
      `)
    } else {
      console.log('✓ Inquiries table already exists and is accessible!')
    }

  } catch (error) {
    console.error('Setup error:', error.message)
  }
}

setupInquiriesTable()
