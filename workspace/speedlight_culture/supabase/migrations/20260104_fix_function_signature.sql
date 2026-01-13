-- Drop the text version to avoid confusion (optional but clean)
DROP FUNCTION IF EXISTS get_content_owner_id(text, text);

-- Create the correct version that accepts UUID as the first argument
CREATE OR REPLACE FUNCTION get_content_owner_id(target_id uuid, target_type text) RETURNS uuid AS $$
DECLARE
    owner_id uuid;
BEGIN
    -- No need to cast target_id as it is already UUID
    IF target_type = 'project' THEN
        SELECT user_id INTO owner_id FROM projects WHERE id = target_id;
    ELSIF target_type IN ('video', 'cinema') THEN
        -- Handle potential integer/uuid mismatch if any, but assuming uuid for this schema
        BEGIN
            SELECT user_id::uuid INTO owner_id FROM cinema_videos WHERE id = target_id;
        EXCEPTION WHEN OTHERS THEN
            RETURN NULL;
        END;
    ELSIF target_type = 'gallery' THEN
        SELECT user_id INTO owner_id FROM gallery_albums WHERE id = target_id;
    ELSIF target_type = 'marketplace' THEN
        SELECT user_id INTO owner_id FROM marketplace_items WHERE id = target_id;
    ELSIF target_type = 'post' THEN
        SELECT user_id INTO owner_id FROM forum_posts WHERE id = target_id;
    ELSIF target_type = 'lesson' THEN
        RETURN NULL; 
    END IF;
    
    RETURN owner_id;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
