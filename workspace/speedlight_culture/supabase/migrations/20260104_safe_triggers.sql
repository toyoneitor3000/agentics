-- 1. Ensure Constraints allow 'cinema'
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_target_type_check;
ALTER TABLE comments ADD CONSTRAINT comments_target_type_check 
    CHECK (target_type IN ('project', 'gallery', 'marketplace', 'event', 'post', 'lesson', 'video', 'cinema'));

-- 2. Robust get_content_owner_id that doesn't crash on bad UUID casts
CREATE OR REPLACE FUNCTION get_content_owner_id(target_id uuid, target_type text) RETURNS uuid AS $$
DECLARE
    owner_id_text text;
    owner_id_uuid uuid;
BEGIN
    IF target_type = 'project' THEN
        SELECT user_id INTO owner_id_uuid FROM projects WHERE id = target_id;
    ELSIF target_type IN ('video', 'cinema') THEN
        SELECT user_id INTO owner_id_text FROM cinema_videos WHERE id = target_id;
        
        -- Try to cast to UUID, return NULL if fails
        BEGIN
            owner_id_uuid := owner_id_text::uuid;
        EXCEPTION WHENO OTHERS THEN
            owner_id_uuid := NULL;
        END;

    ELSIF target_type = 'gallery' THEN
        SELECT user_id INTO owner_id_uuid FROM gallery_albums WHERE id = target_id;
    ELSIF target_type = 'marketplace' THEN
        SELECT user_id INTO owner_id_uuid FROM marketplace_items WHERE id = target_id;
    ELSIF target_type = 'post' THEN
        SELECT user_id INTO owner_id_uuid FROM forum_posts WHERE id = target_id;
    ELSE
        RETURN NULL;
    END IF;
    
    RETURN owner_id_uuid;
EXCEPTION WHEN OTHERS THEN
    -- Failsafe: return NULL instead of crashing the transaction
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
