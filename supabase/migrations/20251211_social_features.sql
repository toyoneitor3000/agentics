-- Create LIKES table
CREATE TABLE IF NOT EXISTS likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    target_id TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('project', 'gallery', 'marketplace', 'event')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, target_id, target_type)
);

-- Create COMMENTS table
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    target_id TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('project', 'gallery', 'marketplace', 'event')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create FOLLOWS table
CREATE TABLE IF NOT EXISTS follows (
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Policies for LIKES
CREATE POLICY "Public likes view" ON likes FOR SELECT USING (true);
CREATE POLICY "Auth users insert likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth users delete likes" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Policies for COMMENTS
CREATE POLICY "Public comments view" ON comments FOR SELECT USING (true);
CREATE POLICY "Auth users insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth users delete comments" ON comments FOR DELETE USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM projects WHERE projects.id = comments.target_id::uuid AND projects.user_id = auth.uid()
));

-- Policies for FOLLOWS
CREATE POLICY "Public follows view" ON follows FOR SELECT USING (true);
CREATE POLICY "Auth users follow" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Auth users unfollow" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- Optional: Add real-time if desired, but RLS is the main blocker usually.
