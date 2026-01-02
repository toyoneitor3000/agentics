-- Add delivered_at column to messages
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- Index for querying unread/undelivered messages
CREATE INDEX IF NOT EXISTS idx_messages_read_delivered ON messages(conversation_id) WHERE read_at IS NULL OR delivered_at IS NULL;
