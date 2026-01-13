-- Add music_metadata column to cinema_videos table
ALTER TABLE cinema_videos 
ADD COLUMN IF NOT EXISTS music_metadata JSONB DEFAULT NULL;
