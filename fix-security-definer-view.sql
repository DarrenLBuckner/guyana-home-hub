-- Fix SECURITY DEFINER view issue
-- Run this in Supabase SQL Editor

-- Drop and recreate the developments view with SECURITY INVOKER
DROP VIEW IF EXISTS public.developments;

CREATE VIEW public.developments
WITH (security_invoker = true)
AS
  SELECT d.id,
         d.name,
         d.description,
         d.location,
         d.developer,
         d.total_units,
         d.price_range_min,
         d.price_range_max,
         d.completion_date,
         d.images,
         d.features,
         d.status,
         d.created_at,
         d.updated_at
  FROM developments d
  WHERE d.status = 'active'::text;

-- Enable RLS on developments table if not already enabled
ALTER TABLE developments ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for public access to active developments
CREATE POLICY "Public can view active developments" ON developments
  FOR SELECT USING (status = 'active');
