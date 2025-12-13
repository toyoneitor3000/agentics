-- Force update 'cinema' bucket limit to 50GB explicitly
UPDATE storage.buckets
SET file_size_limit = 53687091200, -- 50GB
    allowed_mime_types = ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v']
WHERE id = 'cinema';

-- Verify operation (this will return the row if successful)
SELECT id, file_size_limit FROM storage.buckets WHERE id = 'cinema';
