-- Create 'cinema' bucket for videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'cinema', 
    'cinema', 
    true, 
    524288000, -- 500MB Limit (adjust as needed, Supabase default is small, Pro is bigger)
    ARRAY['video/mp4', 'video/quicktime', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 524288000,
    allowed_mime_types = ARRAY['video/mp4', 'video/quicktime', 'video/webm'];

-- Policies for Cinema Bucket
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
