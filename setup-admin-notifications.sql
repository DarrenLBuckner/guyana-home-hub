-- ADMIN NOTIFICATION SYSTEM SETUP
-- This creates triggers and functions to notify admins of important events

-- Create admin notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'property_pending', 'agent_registration', 'inquiry_received', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Store relevant data like property_id, user_id, etc.
  admin_email TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(type);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_admin_email ON admin_notifications(admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at DESC);

-- Function to notify all super admins
CREATE OR REPLACE FUNCTION notify_super_admins(
  notification_type TEXT,
  notification_title TEXT,
  notification_message TEXT,
  notification_data JSONB DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
  admin_email TEXT;
BEGIN
  -- Get all super admin emails
  FOR admin_email IN 
    SELECT email FROM profiles 
    WHERE user_type IN ('super_admin', 'admin') 
    AND email IS NOT NULL
  LOOP
    INSERT INTO admin_notifications (
      type, 
      title, 
      message, 
      data, 
      admin_email
    ) VALUES (
      notification_type,
      notification_title,
      notification_message,
      notification_data,
      admin_email
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for new property submissions
CREATE OR REPLACE FUNCTION notify_property_submission() 
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify for pending properties
  IF NEW.status = 'pending' AND (OLD IS NULL OR OLD.status != 'pending') THEN
    PERFORM notify_super_admins(
      'property_pending',
      'New Property Awaiting Approval',
      'Property "' || NEW.title || '" submitted by agent and needs review.',
      jsonb_build_object(
        'property_id', NEW.id,
        'property_title', NEW.title,
        'property_price', NEW.price,
        'agent_id', NEW.user_id
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for property submissions
DROP TRIGGER IF EXISTS trigger_property_submission ON properties;
CREATE TRIGGER trigger_property_submission
  AFTER INSERT OR UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION notify_property_submission();

-- Trigger function for new agent registrations (if you have agent vetting)
CREATE OR REPLACE FUNCTION notify_agent_registration() 
RETURNS TRIGGER AS $$
BEGIN
  -- Notify when someone sets user_type to 'agent' or when vetting status changes
  IF NEW.user_type = 'agent' AND (OLD IS NULL OR OLD.user_type != 'agent') THEN
    PERFORM notify_super_admins(
      'agent_registration',
      'New Agent Registration',
      'User "' || COALESCE(NEW.first_name || ' ' || NEW.last_name, NEW.email) || '" registered as an agent.',
      jsonb_build_object(
        'user_id', NEW.id,
        'user_email', NEW.email,
        'user_name', COALESCE(NEW.first_name || ' ' || NEW.last_name, NEW.email)
      )
    );
  END IF;
  
  -- Also notify if vetting_status changes to pending_review
  IF NEW.vetting_status = 'pending_review' AND (OLD IS NULL OR OLD.vetting_status != 'pending_review') THEN
    PERFORM notify_super_admins(
      'agent_vetting_pending',
      'Agent Vetting Required',
      'Agent "' || COALESCE(NEW.first_name || ' ' || NEW.last_name, NEW.email) || '" submitted vetting documents for review.',
      jsonb_build_object(
        'user_id', NEW.id,
        'user_email', NEW.email,
        'user_name', COALESCE(NEW.first_name || ' ' || NEW.last_name, NEW.email)
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for agent registrations
DROP TRIGGER IF EXISTS trigger_agent_registration ON profiles;
CREATE TRIGGER trigger_agent_registration
  AFTER INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_agent_registration();

-- Function to get unread notifications for admin dashboard
CREATE OR REPLACE FUNCTION get_admin_notifications(admin_email_param TEXT, limit_param INTEGER DEFAULT 50)
RETURNS TABLE (
  id UUID,
  type VARCHAR(50),
  title TEXT,
  message TEXT,
  data JSONB,
  read BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.type,
    n.title,
    n.message,
    n.data,
    n.read,
    n.created_at
  FROM admin_notifications n
  WHERE n.admin_email = admin_email_param
  ORDER BY n.created_at DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

-- Function to mark notifications as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE admin_notifications 
  SET read = TRUE, updated_at = NOW()
  WHERE id = notification_id;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON admin_notifications TO authenticated;
GRANT EXECUTE ON FUNCTION notify_super_admins TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_notifications TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notification_read TO authenticated;

-- Insert initial test notification
SELECT notify_super_admins(
  'system',
  'Admin Notification System Active',
  'The admin notification system has been successfully set up and is now monitoring for new properties and agent registrations.',
  jsonb_build_object('setup_date', NOW())
);

-- Show current admins who will receive notifications
SELECT 
  email,
  first_name || ' ' || last_name AS full_name,
  user_type,
  'Will receive notifications' AS status
FROM profiles 
WHERE user_type IN ('super_admin', 'admin');

-- Success message
SELECT 'Admin notification system setup complete! Check admin_notifications table for incoming alerts.' AS message;
