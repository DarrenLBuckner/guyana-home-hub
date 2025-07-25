-- Add agent_tier and promo_code_used fields to profiles table
ALTER TABLE profiles
ADD COLUMN agent_tier text DEFAULT 'basic',
ADD COLUMN promo_code_used text;

-- Example: Set Qumar as elite via promo code
UPDATE profiles
SET agent_tier = 'elite',
    promo_code_used = 'ELITE-ADMIN-2025-XYZ!@#'
WHERE email = 'qumartorrington@caribbeanhomehub.com';

-- To set a paid elite agent (no promo code)
-- UPDATE profiles SET agent_tier = 'elite', promo_code_used = NULL WHERE email = 'paidelite@example.com';

-- To check all elite agents and how they got access
SELECT email, agent_tier, promo_code_used FROM profiles WHERE agent_tier = 'elite';
