-- Remove ALL limits for cinema bucket
UPDATE storage.buckets
SET file_size_limit = null,
    allowed_mime_types = null
WHERE id = 'cinema';
