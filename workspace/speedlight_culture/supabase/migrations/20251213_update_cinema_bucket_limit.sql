-- Update 'cinema' bucket limit to 2GB
UPDATE storage.buckets
SET file_size_limit = 2147483648 -- 2GB
WHERE id = 'cinema';

-- Ensure policies are correct (re-apply just in case)
DROP POLICY IF EXISTS "Cinema videos are publicly accessible" ON storage.objects;
CREATE POLICY "Cinema videos are publicly accessible"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'cinema' );

DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'cinema' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can update their own videos" ON storage.objects;
CREATE POLICY "Users can update their own videos"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'cinema' AND auth.uid() = owner );

DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;
CREATE POLICY "Users can delete their own videos"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'cinema' AND auth.uid() = owner );
