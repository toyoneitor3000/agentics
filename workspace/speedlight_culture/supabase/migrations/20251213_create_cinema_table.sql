-- Create Cinema (Reels) Table
CREATE TABLE IF NOT EXISTS cinema_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Using TEXT for BetterAuth compatibility
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT DEFAULT 'General',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE cinema_videos ENABLE ROW LEVEL SECURITY;

-- Policies

-- Public Read: Everyone can view 'approved' videos. 
-- The Creator can view their own 'pending' videos.
CREATE POLICY "Public view approved videos" ON cinema_videos
    FOR SELECT USING (status = 'approved' OR auth.uid()::text = user_id);

-- Insert: Authenticated users can upload
CREATE POLICY "Users upload videos" ON cinema_videos
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Update: Users can update their own videos
CREATE POLICY "Users update own videos" ON cinema_videos
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Delete: Users can delete their own videos
CREATE POLICY "Users delete own videos" ON cinema_videos
    FOR DELETE USING (auth.uid()::text = user_id);
