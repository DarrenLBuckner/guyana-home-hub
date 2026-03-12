-- Migration: Create deletion_requests table
-- Created: 2026-03-12

CREATE TABLE IF NOT EXISTS deletion_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text NOT NULL,
  reason       text,
  status       text NOT NULL DEFAULT 'pending',
  created_at   timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public/anon) to INSERT a deletion request
CREATE POLICY "Public can submit deletion requests"
  ON deletion_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- No SELECT, UPDATE, or DELETE policies for public — only admins via service role can read/manage
