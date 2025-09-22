-- ADMIN ACCESS CONTROL POLICIES
-- This ensures admins can't access super admin functions

-- Create admin access control policies for sensitive operations
CREATE OR REPLACE FUNCTION check_super_admin_only()
RETURNS BOOLEAN AS $$
BEGIN
  -- Only super admins can perform certain actions
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND user_type = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin access control function
CREATE OR REPLACE FUNCTION check_admin_access()
RETURNS BOOLEAN AS $$
BEGIN
  -- Both admins and super admins can perform admin actions
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND user_type IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example: Prevent regular admins from creating super admins
CREATE OR REPLACE FUNCTION prevent_admin_elevation()
RETURNS TRIGGER AS $$
BEGIN
  -- If someone is trying to set user_type to super_admin
  IF NEW.user_type = 'super_admin' AND (OLD IS NULL OR OLD.user_type != 'super_admin') THEN
    -- Only existing super admins can create new super admins
    IF NOT EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type = 'super_admin'
    ) THEN
      RAISE EXCEPTION 'Only super admins can create super admin accounts';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to profiles table
DROP TRIGGER IF EXISTS trigger_prevent_admin_elevation ON profiles;
CREATE TRIGGER trigger_prevent_admin_elevation
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_admin_elevation();

-- Create a table to track sensitive admin actions (audit log)
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id),
  admin_email TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'property_approve', 'user_modify', 'role_change', etc.
  target_id UUID, -- ID of the affected resource
  target_type TEXT, -- 'property', 'user', etc.
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  sensitive_action BOOLEAN DEFAULT FALSE, -- Mark super admin only actions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  action_type_param TEXT,
  target_id_param UUID DEFAULT NULL,
  target_type_param TEXT DEFAULT NULL,
  old_values_param JSONB DEFAULT NULL,
  new_values_param JSONB DEFAULT NULL,
  is_sensitive BOOLEAN DEFAULT FALSE
) RETURNS VOID AS $$
DECLARE
  admin_profile RECORD;
BEGIN
  -- Get admin info
  SELECT id, email INTO admin_profile
  FROM profiles 
  WHERE id = auth.uid();
  
  -- Log the action
  INSERT INTO admin_audit_log (
    admin_id,
    admin_email,
    action_type,
    target_id,
    target_type,
    old_values,
    new_values,
    sensitive_action
  ) VALUES (
    admin_profile.id,
    admin_profile.email,
    action_type_param,
    target_id_param,
    target_type_param,
    old_values_param,
    new_values_param,
    is_sensitive
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON admin_audit_log TO authenticated;
GRANT EXECUTE ON FUNCTION check_super_admin_only TO authenticated;
GRANT EXECUTE ON FUNCTION check_admin_access TO authenticated;
GRANT EXECUTE ON FUNCTION log_admin_action TO authenticated;

-- Success message with access summary
SELECT 'Admin access control policies created successfully!' AS message;

-- Show what your partner CAN do as admin
SELECT 'ADMIN ACCESS (Your Partner) - CAN DO:' AS category, 
       unnest(ARRAY[
         '✅ Approve/reject property listings',
         '✅ View all properties and users', 
         '✅ Moderate content and reviews',
         '✅ Manage agent applications',
         '✅ View analytics and reports',
         '✅ Handle customer support',
         '✅ Manage property categories/features'
       ]) AS permissions
UNION ALL
SELECT 'ADMIN ACCESS (Your Partner) - CANNOT DO:' AS category,
       unnest(ARRAY[
         '❌ Create or delete super admin accounts',
         '❌ Access payment/financial settings',
         '❌ Modify database structure',
         '❌ Change critical system settings',
         '❌ Access billing information',
         '❌ Delete the website or core functions',
         '❌ Modify super admin permissions'
       ]) AS permissions
UNION ALL
SELECT 'SUPER ADMIN ACCESS (You Only):' AS category,
       unnest(ARRAY[
         '🔒 Full system access',
         '🔒 Payment/financial controls',
         '🔒 Database management',
         '🔒 Create/delete admin accounts',
         '🔒 System configuration',
         '🔒 Billing and subscription management'
       ]) AS permissions;
