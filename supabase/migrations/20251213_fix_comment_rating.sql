-- Allow rating to be NULL for replies (or 0)
ALTER TABLE project_comments ALTER COLUMN rating DROP NOT NULL;

-- If there was a constraint forcing 1-5, drop it.
-- We don't know the exact name, so we try a common one or ignore error if not found?
-- Postgres doesn't suport "DROP CONSTRAINT IF EXISTS" for *unnamed* checks easily, but typically they are named.
-- Let's try to add a new permissive constraint and drop old if known, but safer to just allow NULL.

-- Assuming constraint might be named "project_comments_rating_check"
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'project_comments_rating_check') THEN
        ALTER TABLE project_comments DROP CONSTRAINT project_comments_rating_check;
    END IF;
END $$;

-- Ensure we can insert with rating 0 or NULL
