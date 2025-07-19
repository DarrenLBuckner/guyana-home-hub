-- AGENT VETTING SYSTEM - FINAL CLEAN VERSION
-- Creates agent verification system with comprehensive error handling

-- Create the agent_vetting table first
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
  specialties text[], 
  target_regions text[], 
  business_description text,
  website text,
  linkedin_profile text,
  
  -- Document Storage
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_vetting_user_id ON agent_vetting(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_vetting_status ON agent_vetting(status);
CREATE INDEX IF NOT EXISTS idx_agent_vetting_submitted_at ON agent_vetting(submitted_at);

-- Create storage bucket for agent documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('agent-documents', 'agent-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE agent_vetting ENABLE ROW LEVEL SECURITY;

-- Clean up any existing policies that might conflict
DROP POLICY IF EXISTS "Agents can view their own vetting records" ON agent_vetting;
DROP POLICY IF EXISTS "Agents can insert their own vetting records" ON agent_vetting;
DROP POLICY IF EXISTS "Agents can update their own vetting records when pending" ON agent_vetting;
DROP POLICY IF EXISTS "Admins can view all vetting records" ON agent_vetting;
DROP POLICY IF EXISTS "Admins can update all vetting records" ON agent_vetting;
DROP POLICY IF EXISTS "Users can view their own vetting" ON agent_vetting;
DROP POLICY IF EXISTS "Users can create their own vetting" ON agent_vetting;
DROP POLICY IF EXISTS "Users can update their own vetting" ON agent_vetting;
DROP POLICY IF EXISTS "Admins can view all vetting" ON agent_vetting;
DROP POLICY IF EXISTS "Admins can update vetting status" ON agent_vetting;

-- RLS Policies for agent_vetting table
CREATE POLICY "Users can view their own vetting"
ON agent_vetting FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vetting"
ON agent_vetting FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vetting"
ON agent_vetting FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
    auth.uid() = user_id AND
    status IS NOT DISTINCT FROM (SELECT status FROM agent_vetting WHERE user_id = auth.uid()) AND
    rejection_reason IS NOT DISTINCT FROM (SELECT rejection_reason FROM agent_vetting WHERE user_id = auth.uid()) AND
    admin_notes IS NOT DISTINCT FROM (SELECT admin_notes FROM agent_vetting WHERE user_id = auth.uid()) AND
    reviewed_by IS NOT DISTINCT FROM (SELECT reviewed_by FROM agent_vetting WHERE user_id = auth.uid()) AND
    reviewed_at IS NOT DISTINCT FROM (SELECT reviewed_at FROM agent_vetting WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can view all vetting"
ON agent_vetting FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type IN ('admin', 'super_admin')
    )
);

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

-- Grant permissions
GRANT ALL ON TABLE agent_vetting TO authenticated;
GRANT SELECT ON TABLE agent_vetting TO anon;
