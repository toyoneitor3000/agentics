-- Add index on following_id to optimize reverse lookups (finding followers)
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
