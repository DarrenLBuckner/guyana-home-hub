-- Create agent_vetting table for agent verification process
-- This table stores comprehensive agent verification information

CREATE TABLE IF NOT EXISTS agent_vetting (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Professional Information
  company_name TEXT NOT NULL,
  license_number TEXT,
  years_experience INTEGER DEFAULT 0,
  specialties TEXT,
  
  -- Business Details
  business_address TEXT NOT NULL,
  website TEXT,
  linkedin_profile TEXT,
  target_areas TEXT NOT NULL,
  business_description TEXT NOT NULL,
  
  -- Professional References
  professional_references TEXT,
  
  -- Document URLs (stored in Supabase Storage)
  document_urls JSONB DEFAULT '{}',
  
  -- Status tracking
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'needs_revision')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Foreign key constraint is already created in the table definition above
-- No need to add it separately

-- Add vetting_status column to profiles table if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS vetting_status TEXT DEFAULT 'not_submitted' 
CHECK (vetting_status IN ('not_submitted', 'pending_review', 'approved', 'rejected', 'needs_revision'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS agent_vetting_user_id_idx ON agent_vetting(user_id);
CREATE INDEX IF NOT EXISTS agent_vetting_status_idx ON agent_vetting(status);
CREATE INDEX IF NOT EXISTS agent_vetting_submitted_at_idx ON agent_vetting(submitted_at);
CREATE INDEX IF NOT EXISTS profiles_vetting_status_idx ON profiles(vetting_status);

-- Enable Row Level Security
ALTER TABLE agent_vetting ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agent_vetting table
CREATE POLICY "Agents can view their own vetting records" ON agent_vetting
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Agents can insert their own vetting records" ON agent_vetting
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Agents can update their own vetting records when pending" ON agent_vetting
  FOR UPDATE USING (auth.uid() = user_id AND status IN ('pending_review', 'needs_revision'));

CREATE POLICY "Admins can view all vetting records" ON agent_vetting
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.user_type IN ('admin', 'super_admin') OR 
           profiles.roles IN ('admin', 'super_admin'))
    )
  );

CREATE POLICY "Admins can update all vetting records" ON agent_vetting
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.user_type IN ('admin', 'super_admin') OR 
           profiles.roles IN ('admin', 'super_admin'))
    )
  );

-- Create storage bucket for agent documents (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('agent-documents', 'agent-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for agent documents
CREATE POLICY "Agents can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'agent-documents' 
    AND auth.uid() IS NOT NULL 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Agents can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'agent-documents' 
    AND auth.uid() IS NOT NULL 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admins can view all agent documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'agent-documents' 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.user_type IN ('admin', 'super_admin') OR 
           profiles.roles IN ('admin', 'super_admin'))
    )
  );

-- Update agent login redirect logic (this will be handled in the application code)
-- Agents should be redirected to vetting page if vetting_status is 'not_submitted'
