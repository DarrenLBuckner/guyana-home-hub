-- CLEAN AGENT VETTING TABLE - COMPLETE SETUP
-- This creates the agent verification system with all fixes applied
-- Run this after deleting the old version

-- First, clean up any existing policies and constraints that might conflict
DROP POLICY IF EXISTS "Agents can view their own vetting records" ON agent_vetting;
DROP POLICY IF EXISTS "Agents can insert their own vetting records" ON agent_vetting;
DROP POLICY IF EXISTS "Agents can update their own vetting records when pending" ON agent_vetting;
DROP POLICY IF EXISTS "Admins can view all vetting records" ON agent_vetting;
DROP POLICY IF EXISTS "Admins can update all vetting records" ON agent_vetting;
DROP POLICY IF EXISTS "Agents can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Agents can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all agent documents" ON storage.objects;

-- Create the agent_vetting table (will skip if exists)
CREATE TABLE IF NOT EXISTS agent_vetting (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Personal Information  
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  
  -- Professional Information
  company_name text NOT NULL,
  company_address text NOT NULL,
  company_phone text,
  company_email text,
  license_number text,
  license_type text,
  years_experience integer NOT NULL DEFAULT 0,
  
  -- Business Details
  specialties text[], -- Array of specialties like 'Residential', 'Commercial', etc.
  target_regions text[], -- Array of regions they serve
  business_description text,
  website text,
  linkedin_profile text,
  
  -- Document Storage (URLs pointing to Supabase Storage)
  id_document_url text,
  license_document_url text,
  business_certificate_url text,
  insurance_certificate_url text,
  
  -- Professional References
  reference1_name text,
  reference1_company text, 
  reference1_phone text,
  reference1_email text,
  reference2_name text,
  reference2_company text,
  reference2_phone text,
  reference2_email text,
  
  -- Additional Professional Info
  bio text,
  social_media jsonb DEFAULT '{}'::jsonb,
  
  -- Status and Review Information
  status text NOT NULL DEFAULT 'pending_review' CHECK (status IN ('not_submitted', 'pending_review', 'approved', 'rejected', 'needs_revision')),
  rejection_reason text,
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamp with time zone,
  
  -- Timestamps
  submitted_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agent_vetting_user_id ON agent_vetting(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_vetting_status ON agent_vetting(status);
CREATE INDEX IF NOT EXISTS idx_agent_vetting_submitted_at ON agent_vetting(submitted_at);
CREATE INDEX IF NOT EXISTS idx_agent_vetting_company_name ON agent_vetting(company_name);

-- Create updated_at trigger function (reuse if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for agent_vetting table
DROP TRIGGER IF EXISTS update_agent_vetting_updated_at ON agent_vetting;
CREATE TRIGGER update_agent_vetting_updated_at
    BEFORE UPDATE ON agent_vetting
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to sync vetting status with profiles table
CREATE OR REPLACE FUNCTION sync_vetting_status()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles 
    SET vetting_status = NEW.status 
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update profiles.vetting_status when agent_vetting status changes
DROP TRIGGER IF EXISTS sync_profiles_vetting_status ON agent_vetting;
CREATE TRIGGER sync_profiles_vetting_status
    AFTER INSERT OR UPDATE OF status ON agent_vetting
    FOR EACH ROW
    EXECUTE FUNCTION sync_vetting_status();

-- Create storage bucket for agent documents (skip if exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('agent-documents', 'agent-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE agent_vetting ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES FOR AGENT_VETTING TABLE
-- =====================================================

-- Users can view their own vetting application
CREATE POLICY "Users can view their own vetting"
ON agent_vetting FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own vetting application
CREATE POLICY "Users can create their own vetting"
ON agent_vetting FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own vetting (but not review fields)
CREATE POLICY "Users can update their own vetting"
ON agent_vetting FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
    auth.uid() = user_id AND
    -- Users cannot change review/admin fields
    status IS NOT DISTINCT FROM (SELECT status FROM agent_vetting WHERE user_id = auth.uid()) AND
    rejection_reason IS NOT DISTINCT FROM (SELECT rejection_reason FROM agent_vetting WHERE user_id = auth.uid()) AND
    admin_notes IS NOT DISTINCT FROM (SELECT admin_notes FROM agent_vetting WHERE user_id = auth.uid()) AND
    reviewed_by IS NOT DISTINCT FROM (SELECT reviewed_by FROM agent_vetting WHERE user_id = auth.uid()) AND
    reviewed_at IS NOT DISTINCT FROM (SELECT reviewed_at FROM agent_vetting WHERE user_id = auth.uid())
);

-- Admins can view all vetting applications
CREATE POLICY "Admins can view all vetting"
ON agent_vetting FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('admin', 'super_admin')
    )
);

-- Admins can update vetting status and review fields
CREATE POLICY "Admins can update vetting status"
ON agent_vetting FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('admin', 'super_admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('admin', 'super_admin')
    )
);

-- =====================================================
-- STORAGE POLICIES FOR AGENT DOCUMENTS
-- =====================================================

-- Users can view their own documents
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'agent-documents' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR
     EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('admin', 'super_admin')
     ))
);

-- Users can upload their own documents
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'agent-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own documents
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'agent-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'agent-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Grant necessary permissions
GRANT ALL ON TABLE agent_vetting TO authenticated;
GRANT SELECT ON TABLE agent_vetting TO anon;

-- Final check: Ensure vetting_status column exists in profiles
-- (This should already exist from the add-missing-columns.sql)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'vetting_status'
    ) THEN
        ALTER TABLE profiles 
        ADD COLUMN vetting_status text DEFAULT 'not_submitted' 
        CHECK (vetting_status IN ('not_submitted', 'pending_review', 'approved', 'rejected', 'needs_revision'));
    END IF;
END $$;

COMMIT;
