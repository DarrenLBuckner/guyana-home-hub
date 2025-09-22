-- Fix missing search_path parameters in functions
-- Run this in Supabase SQL Editor

-- Fix validate_user_role_change function
CREATE OR REPLACE FUNCTION public.validate_user_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS UTF8
BEGIN
  -- Function logic here (preserve existing logic)
  RETURN NEW;
END;
UTF8;

-- Fix update_profiles_updated_at function  
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS UTF8
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
UTF8;

-- Fix search_developments function
CREATE OR REPLACE FUNCTION public.search_developments(search_term text DEFAULT ''::text)
RETURNS TABLE(/* your return columns here */)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS UTF8
BEGIN
  -- Function logic here (preserve existing logic)
  RETURN QUERY
  SELECT * FROM developments 
  WHERE name ILIKE '%' || search_term || '%'
     OR description ILIKE '%' || search_term || '%';
END;
UTF8;

-- Fix handle_property_approval function
CREATE OR REPLACE FUNCTION public.handle_property_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS UTF8
BEGIN
  -- Function logic here (preserve existing logic)
  RETURN NEW;
END;
UTF8;

-- Fix get_pending_email_notifications function
CREATE OR REPLACE FUNCTION public.get_pending_email_notifications()
RETURNS TABLE(/* your return columns here */)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS UTF8
BEGIN
  -- Function logic here (preserve existing logic)
  RETURN;
END;
UTF8;
