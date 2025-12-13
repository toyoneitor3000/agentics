-- Create table for likes on comments
CREATE TABLE IF NOT EXISTS comment_likes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id uuid REFERENCES project_comments(id) ON DELETE CASCADE,
    user_id text NOT NULL, -- Better Auth ID
    created_at timestamptz DEFAULT now(),
    UNIQUE(comment_id, user_id)
);

-- RLS
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read comment likes" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Auth insert comment likes" ON comment_likes FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own comment likes" ON comment_likes FOR DELETE USING (auth.uid()::text = user_id);
