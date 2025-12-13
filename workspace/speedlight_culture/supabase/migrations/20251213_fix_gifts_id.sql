-- Drop policies
DROP POLICY IF EXISTS "Auth insert gifts" ON project_gifts;
DROP POLICY IF EXISTS "Users can send gifts" ON project_gifts;
DROP POLICY IF EXISTS "Public read gifts" ON project_gifts;
DROP POLICY IF EXISTS "Public view gifts" ON project_gifts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON project_gifts;

-- Drop Foreign Key Constraint
ALTER TABLE project_gifts DROP CONSTRAINT IF EXISTS project_gifts_sender_id_fkey;

-- Fix project_gifts sender_id type
ALTER TABLE project_gifts ALTER COLUMN sender_id TYPE text;

-- Recreate Policies
CREATE POLICY "Auth insert gifts" ON project_gifts FOR INSERT WITH CHECK (auth.uid()::text = sender_id);
CREATE POLICY "Public read gifts" ON project_gifts FOR SELECT USING (true);
