-- Add uploaded_by column to property_images table
ALTER TABLE property_images ADD COLUMN uploaded_by uuid;

-- Example: When uploading an image, set uploaded_by to the agent's profile id
-- In your app, when an agent uploads an image, save their profile id in uploaded_by
-- Example insert:
-- INSERT INTO property_images (property_id, url, uploaded_by) VALUES ('property-uuid', 'image-url', 'agent-profile-uuid');

-- RLS policy: Agents can delete their own images
CREATE POLICY "Agents can delete their own images"
ON property_images
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'agent'
      AND profiles.vetting_status = 'approved'
      AND property_images.uploaded_by = auth.uid()
  )
);

-- RLS policy: Admins can delete any image
CREATE POLICY "Admins can delete any image"
ON property_images
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
      AND profiles.vetting_status = 'approved'
  )
);

-- RLS policy: Super admins can manage all images
CREATE POLICY "Super admins can manage all images"
ON property_images
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'super_admin'
  )
);
