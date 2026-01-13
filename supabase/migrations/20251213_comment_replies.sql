-- Add parent_id to allow nested comments (replies)
ALTER TABLE project_comments 
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES project_comments(id) ON DELETE CASCADE;

-- Update RLS if needed (usually Insert covers it if simply adding a column)
-- Existing Insert policy: auth.uid()::text = user_id. This is fine.
-- New column doesn't affect existing rows.
