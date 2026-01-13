-- 1. Update Notification Type to include 'mention'
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check CHECK (type IN ('like', 'comment', 'follow', 'system', 'admin_broadcast', 'mention'));

-- 2. Update actor_id to reference PROFILES for easier joins
-- First check if the constraint exists, usually 'notifications_actor_id_fkey'
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_actor_id_fkey;
-- Check if it references auth.users first, it does.
-- We switch it to profiles.
ALTER TABLE notifications ADD CONSTRAINT notifications_actor_id_fkey 
    FOREIGN KEY (actor_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 3. Helper function to get content owner
CREATE OR REPLACE FUNCTION get_content_owner_id(target_id text, target_type text) RETURNS uuid AS $$
DECLARE
    owner_id uuid;
BEGIN
    IF target_type = 'project' THEN
        SELECT user_id INTO owner_id FROM projects WHERE id = target_id::uuid;
    ELSIF target_type IN ('video', 'cinema') THEN
        SELECT user_id::uuid INTO owner_id FROM cinema_videos WHERE id = target_id::uuid;
    ELSIF target_type = 'gallery' THEN
        SELECT user_id INTO owner_id FROM gallery_albums WHERE id = target_id::uuid;
    ELSIF target_type = 'marketplace' THEN
        SELECT user_id INTO owner_id FROM marketplace_items WHERE id = target_id::uuid;
    END IF;
    
    RETURN owner_id;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger for LIKES
CREATE OR REPLACE FUNCTION notify_new_like() RETURNS TRIGGER AS $$
DECLARE
    content_owner uuid;
    msg text;
BEGIN
    content_owner := get_content_owner_id(NEW.target_id, NEW.target_type);
    
    IF content_owner IS NOT NULL AND content_owner != NEW.user_id THEN
        
        IF NEW.target_type = 'project' THEN msg := 'le gustó tu proyecto.';
        ELSIF NEW.target_type IN ('video', 'cinema') THEN msg := 'le gustó tu video.';
        ELSE msg := 'le gustó tu publicación.';
        END IF;

        INSERT INTO notifications (recipient_id, actor_id, type, target_id, target_type, message)
        VALUES (
            content_owner,
            NEW.user_id,
            'like',
            NEW.target_id,
            NEW.target_type,
            msg
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_like ON likes;
CREATE TRIGGER on_new_like
    AFTER INSERT ON likes
    FOR EACH ROW EXECUTE FUNCTION notify_new_like();

-- 5. Trigger for COMMENTS (including mentions)
CREATE OR REPLACE FUNCTION notify_new_comment() RETURNS TRIGGER AS $$
DECLARE
    content_owner uuid;
    mentioned_user_id uuid;
    username_match text;
    match_array text[];
BEGIN
    -- A. Notify Content Owner
    content_owner := get_content_owner_id(NEW.target_id, NEW.target_type);
    
    IF content_owner IS NOT NULL AND content_owner != NEW.user_id THEN
        INSERT INTO notifications (recipient_id, actor_id, type, target_id, target_type, message)
        VALUES (
            content_owner,
            NEW.user_id,
            'comment',
            NEW.target_id,
            NEW.target_type,
            'comentó: "' || substring(NEW.content from 1 for 40) || (CASE WHEN length(NEW.content) > 40 THEN '...' ELSE '' END) || '"'
        );
    END IF;
    
    -- B. Handle Mentions
    -- Iterate over all matches
    FOR match_array IN
        SELECT regexp_matches(NEW.content, '@([A-Za-z0-9_]+)', 'g')
    LOOP
        username_match := match_array[1];
        
        SELECT id INTO mentioned_user_id FROM profiles WHERE username = username_match;
        
        IF mentioned_user_id IS NOT NULL AND mentioned_user_id != NEW.user_id THEN
             INSERT INTO notifications (recipient_id, actor_id, type, target_id, target_type, message)
             VALUES (
                mentioned_user_id,
                NEW.user_id,
                'mention',
                NEW.target_id,
                NEW.target_type,
                'te mencionó: "' || substring(NEW.content from 1 for 40) || (CASE WHEN length(NEW.content) > 40 THEN '...' ELSE '' END) || '"'
             );
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_comment ON comments;
CREATE TRIGGER on_new_comment
    AFTER INSERT ON comments
    FOR EACH ROW EXECUTE FUNCTION notify_new_comment();
