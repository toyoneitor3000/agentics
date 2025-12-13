-- Add specs column to projects for storing car details (JSONB for flexibility)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS specs jsonb DEFAULT '{}'::jsonb;
