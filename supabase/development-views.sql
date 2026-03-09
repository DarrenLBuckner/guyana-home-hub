-- Development Views Tracking
-- Adds a views column to developments and an RPC to atomically increment it

-- 1. Add views column with default 0
ALTER TABLE developments ADD COLUMN IF NOT EXISTS views integer DEFAULT 0 NOT NULL;

-- 2. Set initial view counts for existing developments
UPDATE developments SET views = 51 WHERE slug = 'taj-dream-ogle';
UPDATE developments SET views = 15 WHERE slug = 'la-selva-estates';

-- 3. RPC function to record a development view (atomic increment)
--    Mirrors the pattern used by record_property_view
CREATE OR REPLACE FUNCTION record_development_view(
  p_development_id uuid,
  p_referrer text DEFAULT '',
  p_session_id text DEFAULT ''
)
RETURNS void AS $$
BEGIN
  UPDATE developments
  SET views = views + 1
  WHERE id = p_development_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Allow anonymous and authenticated users to call the RPC
GRANT EXECUTE ON FUNCTION record_development_view TO anon;
GRANT EXECUTE ON FUNCTION record_development_view TO authenticated;
