-- Database Schema Check and Fix
-- Run this in your Supabase SQL Editor

-- 1. First, let's see what columns exist in the properties table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check current RLS policies that might be causing infinite recursion
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles' OR tablename = 'properties';

-- 3. Add missing columns if they don't exist (run these one by one)
-- Uncomment and run if needed:

/*
-- Add contact_email column if missing
ALTER TABLE properties ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);

-- Add contact_name column if missing  
ALTER TABLE properties ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255);

-- Add contact_phone column if missing
ALTER TABLE properties ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50);

-- Ensure features column exists as text array
ALTER TABLE properties ADD COLUMN IF NOT EXISTS features TEXT[];

-- Update any existing properties to have empty features array if null
UPDATE properties SET features = '{}' WHERE features IS NULL;
*/
