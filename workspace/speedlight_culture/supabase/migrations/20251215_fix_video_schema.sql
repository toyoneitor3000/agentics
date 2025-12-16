-- Add archived column to cinema_videos if not exists
ALTER TABLE cinema_videos 
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;
