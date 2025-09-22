-- User Favorites System for Guyana Home Hub Frontend
-- This implements Zillow-style property saving functionality

-- User Favorites Table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id uuid NOT NULL, -- References properties from portal API
  
  -- Property snapshot (in case property gets deleted from portal)
  property_title text,
  property_price bigint,
  property_location text,
  property_type text,
  listing_type text, -- 'sale' or 'rent'
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_property_id ON user_favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_property ON user_favorites(user_id, property_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at DESC);

-- Ensure one favorite per user per property
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_favorites_unique ON user_favorites(user_id, property_id);

-- Row Level Security
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Users can only see their own favorites
CREATE POLICY "Users can view their own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can add their own favorites
CREATE POLICY "Users can add their own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "Users can delete their own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Notification Preferences Table (for future email alerts)
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Email preferences
  email_price_alerts boolean DEFAULT true,
  email_new_listings boolean DEFAULT true,
  email_property_updates boolean DEFAULT true,
  email_weekly_digest boolean DEFAULT true,
  
  -- Contact preferences
  contact_email text,
  contact_whatsapp text,
  preferred_contact_method text DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'whatsapp', 'both')),
  
  -- Search preferences
  preferred_regions text[] DEFAULT '{}',
  preferred_property_types text[] DEFAULT '{}',
  max_price bigint,
  min_price bigint,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS for notification preferences
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notification preferences" ON notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Saved Searches Table (for future advanced search alerts)
CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Search criteria
  search_name text NOT NULL,
  search_filters jsonb NOT NULL, -- Store search parameters as JSON
  listing_type text CHECK (listing_type IN ('sale', 'rent', 'all')),
  
  -- Alert settings
  email_alerts boolean DEFAULT true,
  alert_frequency text DEFAULT 'daily' CHECK (alert_frequency IN ('immediate', 'daily', 'weekly')),
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS for saved searches
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved searches" ON saved_searches
  FOR ALL USING (auth.uid() = user_id);

-- Functions for maintaining data
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update timestamps
CREATE TRIGGER update_user_favorites_updated_at 
    BEFORE UPDATE ON user_favorites 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at 
    BEFORE UPDATE ON notification_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_searches_updated_at 
    BEFORE UPDATE ON saved_searches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper function to get user's favorite count
CREATE OR REPLACE FUNCTION get_user_favorites_count(user_uuid uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM user_favorites
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if property is favorited
CREATE OR REPLACE FUNCTION is_property_favorited(user_uuid uuid, prop_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_favorites
    WHERE user_id = user_uuid AND property_id = prop_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial notification preferences for existing users
INSERT INTO notification_preferences (user_id, contact_email)
SELECT id, email
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM notification_preferences)
ON CONFLICT (user_id) DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON user_favorites TO authenticated;
GRANT ALL ON notification_preferences TO authenticated;
GRANT ALL ON saved_searches TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_favorites_count TO authenticated;
GRANT EXECUTE ON FUNCTION is_property_favorited TO authenticated;