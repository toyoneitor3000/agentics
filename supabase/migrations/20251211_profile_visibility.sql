-- Add location column if it doesn't exist (it seemed to be used in code but might accept null)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS show_location BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_join_date BOOLEAN DEFAULT TRUE;
