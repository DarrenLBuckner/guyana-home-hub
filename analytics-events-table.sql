-- ⚠️  ANALYTICS TABLE FOR PORTAL HOME HUB ONLY - DO NOT EXECUTE IN GUYANA HOME HUB ⚠️
-- This SQL should ONLY be executed in the Portal Home Hub Supabase dashboard
-- Current .env points to Portal Home Hub: opjnizbtppkynxzssijy.supabase.co

/*
-- Create analytics_events table for A/B testing and conversion tracking
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  referer TEXT,
  ip_address TEXT,
  session_id TEXT,
  ab_variant TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_variant ON analytics_events(ab_variant);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);

-- Enable RLS (Row Level Security)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for tracking)
-- and reads only for authenticated admin users
CREATE POLICY "Allow anonymous inserts for analytics" ON analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated reads for analytics" ON analytics_events
  FOR SELECT TO authenticated
  USING (true);
*/

-- Optional: Create a function to clean up old analytics data (keep last 6 months)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  DELETE FROM analytics_events 
  WHERE created_at < NOW() - INTERVAL '6 months';
END;
$$ LANGUAGE plpgsql;

-- Optional: Set up a scheduled job to run cleanup weekly (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-analytics', '0 2 * * 0', 'SELECT cleanup_old_analytics();');