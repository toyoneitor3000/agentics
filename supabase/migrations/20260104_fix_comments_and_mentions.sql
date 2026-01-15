-- 1. Relax comments target_type constraint to allow all ecosystems
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_target_type_check;
ALTER TABLE comments ADD CONSTRAINT comments_target_type_check 
    CHECK (target_type IN ('project', 'gallery', 'marketplace', 'event', 'post', 'lesson', 'video', 'cinema'));

-- 2. Ensure Profiles are searchable (Public Read is usually on, but let's ensure for index/perf)
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles (username);
CREATE INDEX IF NOT EXISTS profiles_full_name_idx ON profiles (full_name);

-- 3. Explicitly ensure RLS allows reading profiles (in case it was missing or strict)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);

-- 4. Fix Notifications Trigger to handle 'post' and 'lesson' and prevent errors
CREATE OR REPLACE FUNCTION get_content_owner_id(target_id text, target_type text) RETURNS uuid AS $$
DECLARE
    owner_id uuid;
BEGIN
    IF target_type = 'project' THEN
        SELECT user_id INTO owner_id FROM projects WHERE id = target_id::uuid;
    ELSIF target_type IN ('video', 'cinema') THEN
        -- Handle potential integer/uuid mismatch if any, but assuming uuid for this schema
        BEGIN
            SELECT user_id::uuid INTO owner_id FROM cinema_videos WHERE id = target_id::uuid;
        EXCEPTION WHEN OTHERS THEN
            RETURN NULL;
        END;
    ELSIF target_type = 'gallery' THEN
        SELECT user_id INTO owner_id FROM gallery_albums WHERE id = target_id::uuid;
    ELSIF target_type = 'marketplace' THEN
        SELECT user_id INTO owner_id FROM marketplace_items WHERE id = target_id::uuid;
    ELSIF target_type = 'post' THEN
        SELECT user_id INTO owner_id FROM forum_posts WHERE id = target_id::uuid;
    ELSIF target_type = 'lesson' THEN
        -- Lessons are usually admin owned or static, returning NULL to skip notification is fine
        RETURN NULL; 
    END IF;
    
    RETURN owner_id;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
