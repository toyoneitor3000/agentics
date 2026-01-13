-- Add supporting columns for Extended Profile and Privacy
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS alias TEXT,
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT FALSE;

-- Ensure RLS allows users to update these own columns (usually existing update policy covers this, but good to ensure)
-- Assuming 'Users can update own profile' policy exists.
