-- Add archived column to cinema_videos
ALTER TABLE cinema_videos 
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- Ensure RLS is enabled
ALTER TABLE cinema_videos ENABLE ROW LEVEL SECURITY;

-- Allow users to UPDATE their own videos (including archiving)
CREATE POLICY "Users can update their own videos"
ON cinema_videos
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to DELETE their own videos
CREATE POLICY "Users can delete their own videos"
ON cinema_videos
FOR DELETE
USING (auth.uid() = user_id);
