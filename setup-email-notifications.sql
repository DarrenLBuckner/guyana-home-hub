-- EMAIL NOTIFICATION WEBHOOK SETUP
-- This creates a webhook function that sends emails when notifications are created

-- Enable the HTTP extension for making webhook requests
CREATE EXTENSION IF NOT EXISTS http;

-- First, create the admin_notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to send email notifications via HTTP request
CREATE OR REPLACE FUNCTION send_admin_email_notification()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT := 'https://guyanahomehub.com/api/admin-notifications'; -- Replace with your actual domain
  payload JSONB;
  http_response RECORD;
BEGIN
  -- Build the email payload
  payload := jsonb_build_object(
    'to', NEW.admin_email,
    'subject', NEW.title,
    'html', '<h2>' || NEW.title || '</h2><p>' || NEW.message || '</p><p><strong>Time:</strong> ' || NEW.created_at || '</p>',
    'text', NEW.title || chr(10) || chr(10) || NEW.message || chr(10) || chr(10) || 'Time: ' || NEW.created_at,
    'data', NEW.data
  );
  
  -- Make HTTP request to send email (requires http extension)
  BEGIN
    SELECT * INTO http_response FROM extensions.http_post(
      webhook_url,
      payload::text,
      'application/json'
    );
    
    -- Log successful email attempt
    INSERT INTO admin_email_log (
      notification_id,
      admin_email,
      email_payload,
      status,
      sent_at,
      created_at
    ) VALUES (
      NEW.id,
      NEW.admin_email,
      payload,
      CASE WHEN http_response.status_code = 200 THEN 'sent' ELSE 'failed' END,
      NOW(),
      NOW()
    );
    
  EXCEPTION WHEN OTHERS THEN
    -- Log failed email attempt
    INSERT INTO admin_email_log (
      notification_id,
      admin_email,
      email_payload,
      status,
      error_message,
      created_at
    ) VALUES (
      NEW.id,
      NEW.admin_email,
      payload,
      'failed',
      SQLERRM,
      NOW()
    );
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create email log table to track sent emails
CREATE TABLE IF NOT EXISTS admin_email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES admin_notifications(id) ON DELETE CASCADE,
  admin_email TEXT NOT NULL,
  email_payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to send emails when notifications are created
DROP TRIGGER IF EXISTS trigger_send_admin_email ON admin_notifications;
CREATE TRIGGER trigger_send_admin_email
  AFTER INSERT ON admin_notifications
  FOR EACH ROW
  EXECUTE FUNCTION send_admin_email_notification();

-- Create a function to manually check pending email notifications
CREATE OR REPLACE FUNCTION get_pending_email_notifications()
RETURNS TABLE (
  id UUID,
  admin_email TEXT,
  email_payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.admin_email,
    e.email_payload,
    e.created_at
  FROM admin_email_log e
  WHERE e.status = 'pending'
  ORDER BY e.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Set up immediate email notifications via Supabase Edge Functions (if available)
-- Or configure with your preferred email service (SendGrid, Mailgun, etc.)

GRANT ALL ON admin_email_log TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_email_notifications TO authenticated;

SELECT 'Email notification system ready! Configure webhook or email service to complete setup.' AS message;
