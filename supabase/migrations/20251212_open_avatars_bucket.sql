-- Ensure avatars bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remove conflicting policies
DROP POLICY IF EXISTS "Avatar Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Give me access" ON storage.objects;

-- Allow Public Read
CREATE POLICY "Avatar Public Read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Allow Public Upload (Anon)
CREATE POLICY "Avatar Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' );

-- Allow Public Update
CREATE POLICY "Avatar Public Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' );

-- Allow Public Delete
CREATE POLICY "Avatar Public Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'avatars' );
