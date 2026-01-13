-- Add archived column to content tables to support "soft delete" / private archiving

ALTER TABLE projects ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;
ALTER TABLE gallery_albums ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;

-- Update RLS policies to ensure archived content is only visible to the owner?
-- Currently:
-- Projects: "Public view projects" using (true);
-- Gallery: "Albums are viewable by everyone" using (true);
-- Events: "Public view events" using (true);

-- We need to change these to only allow public view if NOT archived.
-- BUT, typically RLS is hard to "UPDATE" without dropping.
-- However, for the frontend logic, if the API fetches everything, we can filter in logic.
-- Ideally, we should secure it.

-- Let's update policies ensuring public only sees non-archived.
-- Owners should see everything (which the existing "using (true)" allows, but we might want to restrict public).

-- NOTE: Changing policies can be tricky if not careful.
-- For now, "using (true)" enables EVERYONE (including public) to see everything.
-- If we want to hide archived items from public API responses, we should do:
-- using ( (archived = false) OR (auth.uid() = user_id) )

-- Let's drop and recreate the select policies for accurate privacy.

-- PROJECTS
DROP POLICY IF EXISTS "Public view projects" ON projects;
CREATE POLICY "Public view projects" ON projects FOR SELECT USING (
  (archived = false) OR (auth.uid()::text = user_id)
);

-- GALLERY
DROP POLICY IF EXISTS "Albums are viewable by everyone" ON gallery_albums;
CREATE POLICY "Albums are viewable by everyone" ON gallery_albums FOR SELECT USING (
  (archived = false) OR (auth.uid()::text = user_id)
);

-- EVENTS
DROP POLICY IF EXISTS "Public view events" ON events;
CREATE POLICY "Public view events" ON events FOR SELECT USING (
  (archived = false) OR (auth.uid()::text = user_id)
);
