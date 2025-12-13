-- Remove size limit for cinema bucket (Set to NULL = Unlimited)
UPDATE storage.buckets
SET file_size_limit = null
WHERE id = 'cinema';
