-- Add slug column to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug text;
CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_idx ON projects (slug);
