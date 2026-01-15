-- Allow ANONYMOUS uploads to 'cinema' bucket
-- This enables TUS (Resumable Uploads) without needing complex Auth Sync between BetterAuth and Supabase
-- Security is handled by the application layer: files uploaded but not linked in 'cinema_videos' table are effectively orphaned/hidden.

DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;

CREATE POLICY "Anyone can upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'cinema' );
