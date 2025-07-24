-- Promo Code System for Agent Registration
-- Phase 1: Simple & Secure Implementation

-- Promo Codes Table
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'free_trial')),
  discount_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  applies_to VARCHAR(20) NOT NULL CHECK (applies_to IN ('basic', 'pro', 'elite', 'all')),
  trial_duration_days INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT NULL, -- NULL means unlimited
  current_uses INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);

-- Promo Code Usage Tracking
CREATE TABLE promo_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  agent_tier VARCHAR(20) NOT NULL,
  trial_start_date DATE,
  trial_end_date DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'converted'))
);

-- Agent Subscription Tracking (Enhanced)
CREATE TABLE agent_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('basic', 'pro', 'elite')),
  status VARCHAR(20) DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'suspended', 'cancelled')),
  trial_start_date DATE,
  trial_end_date DATE,
  next_billing_date DATE,
  promo_code_used UUID REFERENCES promo_codes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(active);
CREATE INDEX idx_promo_code_usage_email ON promo_code_usage(email);
CREATE INDEX idx_promo_code_usage_user ON promo_code_usage(user_id);
CREATE INDEX idx_agent_subscriptions_user ON agent_subscriptions(user_id);
CREATE INDEX idx_agent_subscriptions_status ON agent_subscriptions(status);
CREATE INDEX idx_agent_subscriptions_trial_end ON agent_subscriptions(trial_end_date);

-- Insert Initial Promo Codes
INSERT INTO promo_codes (code, description, discount_type, discount_value, applies_to, trial_duration_days, max_uses, expires_at) VALUES
('BASICFREE60', '60 days free Basic tier for new agents', 'free_trial', 100, 'basic', 60, 1000, '2025-12-31 23:59:59'),
('NEWAGENT2025', '2025 Launch - Free Basic tier for 2 months', 'free_trial', 100, 'basic', 60, 2000, '2025-12-31 23:59:59'),
('LAUNCH50', '50% off first month for any tier', 'percentage', 50, 'all', 0, 500, '2025-06-30 23:59:59');

-- RLS Policies (Row Level Security)
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_subscriptions ENABLE ROW LEVEL SECURITY;

-- Public can read active promo codes (for validation)
CREATE POLICY "Public can read active promo codes" ON promo_codes FOR SELECT USING (active = true);

-- Users can insert their own usage records
CREATE POLICY "Users can insert own promo usage" ON promo_code_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read their own usage records
CREATE POLICY "Users can read own promo usage" ON promo_code_usage FOR SELECT USING (auth.uid() = user_id);

-- Users can read/update their own subscriptions
CREATE POLICY "Users can manage own subscriptions" ON agent_subscriptions FOR ALL USING (auth.uid() = user_id);

-- Admin policies (you'll need to create admin role)
-- Admins can manage all records
CREATE POLICY "Admins can manage all promo codes" ON promo_codes FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Functions for Promo Code Validation
CREATE OR REPLACE FUNCTION validate_promo_code(
  code_input TEXT,
  user_email TEXT,
  user_id_input UUID
) RETURNS JSONB AS $$
DECLARE
  promo_record promo_codes%ROWTYPE;
  usage_count INTEGER;
  user_usage_count INTEGER;
  result JSONB;
BEGIN
  -- Get promo code details
  SELECT * INTO promo_record
  FROM promo_codes 
  WHERE code = code_input AND active = true;
  
  -- Check if code exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invalid promo code');
  END IF;
  
  -- Check if code is expired
  IF promo_record.expires_at < NOW() THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Promo code has expired');
  END IF;
  
  -- Check max uses
  IF promo_record.max_uses IS NOT NULL AND promo_record.current_uses >= promo_record.max_uses THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Promo code has reached maximum usage limit');
  END IF;
  
  -- Check if user has already used this code (one per email/user)
  SELECT COUNT(*) INTO user_usage_count
  FROM promo_code_usage 
  WHERE promo_code_id = promo_record.id 
  AND (user_id = user_id_input OR email = user_email);
  
  IF user_usage_count > 0 THEN
    RETURN jsonb_build_object('valid', false, 'error', 'You have already used this promo code');
  END IF;
  
  -- Return valid code details
  RETURN jsonb_build_object(
    'valid', true,
    'code', promo_record.code,
    'description', promo_record.description,
    'discount_type', promo_record.discount_type,
    'discount_value', promo_record.discount_value,
    'applies_to', promo_record.applies_to,
    'trial_duration_days', promo_record.trial_duration_days
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to Apply Promo Code
CREATE OR REPLACE FUNCTION apply_promo_code(
  code_input TEXT,
  user_id_input UUID,
  user_email_input TEXT,
  selected_tier TEXT
) RETURNS JSONB AS $$
DECLARE
  promo_record promo_codes%ROWTYPE;
  validation_result JSONB;
  trial_end_date DATE;
BEGIN
  -- Validate the promo code first
  validation_result := validate_promo_code(code_input, user_email_input, user_id_input);
  
  IF NOT (validation_result->>'valid')::BOOLEAN THEN
    RETURN validation_result;
  END IF;
  
  -- Get promo code details
  SELECT * INTO promo_record FROM promo_codes WHERE code = code_input;
  
  -- Check if tier matches promo code restrictions
  IF promo_record.applies_to != 'all' AND promo_record.applies_to != selected_tier THEN
    RETURN jsonb_build_object('valid', false, 'error', 'This promo code does not apply to the selected tier');
  END IF;
  
  -- Calculate trial end date for free trials
  IF promo_record.discount_type = 'free_trial' THEN
    trial_end_date := CURRENT_DATE + INTERVAL '1 day' * promo_record.trial_duration_days;
  END IF;
  
  -- Record promo code usage
  INSERT INTO promo_code_usage (
    promo_code_id, user_id, email, agent_tier, trial_start_date, trial_end_date
  ) VALUES (
    promo_record.id, user_id_input, user_email_input, selected_tier, CURRENT_DATE, trial_end_date
  );
  
  -- Update promo code usage count
  UPDATE promo_codes 
  SET current_uses = current_uses + 1 
  WHERE id = promo_record.id;
  
  -- Create or update agent subscription
  INSERT INTO agent_subscriptions (
    user_id, email, tier, status, trial_start_date, trial_end_date, promo_code_used
  ) VALUES (
    user_id_input, user_email_input, selected_tier, 
    CASE WHEN promo_record.discount_type = 'free_trial' THEN 'trial' ELSE 'active' END,
    CURRENT_DATE, trial_end_date, promo_record.id
  )
  ON CONFLICT (user_id) DO UPDATE SET
    tier = EXCLUDED.tier,
    status = EXCLUDED.status,
    trial_start_date = EXCLUDED.trial_start_date,
    trial_end_date = EXCLUDED.trial_end_date,
    promo_code_used = EXCLUDED.promo_code_used,
    updated_at = NOW();
  
  RETURN jsonb_build_object(
    'valid', true,
    'applied', true,
    'trial_end_date', trial_end_date,
    'discount_type', promo_record.discount_type,
    'discount_value', promo_record.discount_value
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
