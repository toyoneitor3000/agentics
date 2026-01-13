-- 1. Modify NOTIFICATIONS table to support Text-based IDs (Non-UUID)
-- We need to drop the Foreign Key constraints first because they likely enforce UUID matching against auth.users
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_recipient_id_fkey;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_actor_id_fkey;

-- Now change the column types
ALTER TABLE notifications ALTER COLUMN recipient_id TYPE text;
ALTER TABLE notifications ALTER COLUMN actor_id TYPE text;

-- Re-add FK to PROFILES instead of auth.users (since profiles seems to be the source of truth for these text IDs)
-- Assuming profiles.id is the primary key and is Text.
-- We might fail if profiles.id is not unique or PK, but standardly it is.
-- ALTER TABLE notifications ADD CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES profiles(id) ON DELETE CASCADE;
-- ALTER TABLE notifications ADD CONSTRAINT notifications_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES profiles(id) ON DELETE CASCADE;


-- 2. Update Helper Function to return TEXT
DROP FUNCTION IF EXISTS get_content_owner_id(uuid, text);
DROP FUNCTION IF EXISTS get_content_owner_id(text, text);

CREATE OR REPLACE FUNCTION get_content_owner_id(target_id text, target_type text) RETURNS text AS $$
DECLARE
    owner_id text;
BEGIN
    IF target_type = 'project' THEN
        SELECT user_id::text INTO owner_id FROM projects WHERE id::text = target_id;
    ELSIF target_type IN ('video', 'cinema') THEN
        SELECT user_id::text INTO owner_id FROM cinema_videos WHERE id::text = target_id;
    ELSIF target_type = 'gallery' THEN
        SELECT user_id::text INTO owner_id FROM gallery_albums WHERE id::text = target_id;
    ELSIF target_type = 'marketplace' THEN
        SELECT user_id::text INTO owner_id FROM marketplace_items WHERE id::text = target_id;
    ELSIF target_type = 'post' THEN
        SELECT user_id::text INTO owner_id FROM forum_posts WHERE id::text = target_id;
    END IF;
    
    RETURN owner_id;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- 3. Update Triggers to use TEXT variables
CREATE OR REPLACE FUNCTION notify_new_comment() RETURNS TRIGGER AS $$
DECLARE
    content_owner text;
    mentioned_user_id text;
    username_match text;
    match_array text[];
    target_id_text text;
BEGIN
    BEGIN
        target_id_text := NEW.target_id::text;
        content_owner := get_content_owner_id(target_id_text, NEW.target_type);
        
        -- A. Notify Content Owner
        IF content_owner IS NOT NULL AND content_owner <> NEW.user_id::text THEN
            INSERT INTO notifications (recipient_id, actor_id, type, target_id, target_type, message)
            VALUES (
                content_owner,
                NEW.user_id::text,
                'comment',
                target_id_text,
                NEW.target_type,
                'comentó: "' || substring(NEW.content from 1 for 40) || (CASE WHEN length(NEW.content) > 40 THEN '...' ELSE '' END) || '"'
            );
        END IF;
        
        -- B. Handle Mentions (Case Insensitive)
        FOR match_array IN
            SELECT regexp_matches(NEW.content, '@([A-Za-z0-9_]+)', 'g')
        LOOP
            username_match := match_array[1];
            
            SELECT id::text INTO mentioned_user_id FROM profiles WHERE lower(username) = lower(username_match);
            
            IF mentioned_user_id IS NOT NULL AND mentioned_user_id <> NEW.user_id::text THEN
                 INSERT INTO notifications (recipient_id, actor_id, type, target_id, target_type, message)
                 VALUES (
                    mentioned_user_id,
                    NEW.user_id::text,
                    'mention',
                    target_id_text,
                    NEW.target_type,
                    'te mencionó: "' || substring(NEW.content from 1 for 40) || (CASE WHEN length(NEW.content) > 40 THEN '...' ELSE '' END) || '"'
                 );
            END IF;
        END LOOP;
    
    EXCEPTION WHEN OTHERS THEN 
        -- Log critical failure but don't stop comment
        RAISE WARNING 'Notification Trigger Failed: %', SQLERRM;
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION notify_new_like() RETURNS TRIGGER AS $$
DECLARE
    content_owner text;
    msg text;
    target_id_text text;
BEGIN
    BEGIN
        target_id_text := NEW.target_id::text;
        content_owner := get_content_owner_id(target_id_text, NEW.target_type);
        
        IF content_owner IS NOT NULL AND content_owner <> NEW.user_id::text THEN
            
            IF NEW.target_type = 'project' THEN msg := 'le gustó tu proyecto.';
            ELSIF NEW.target_type IN ('video', 'cinema') THEN msg := 'le gustó tu video.';
            ELSE msg := 'le gustó tu publicación.';
            END IF;

            INSERT INTO notifications (recipient_id, actor_id, type, target_id, target_type, message)
            VALUES (
                content_owner,
                NEW.user_id::text,
                'like',
                target_id_text,
                NEW.target_type,
                msg
            );
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Like Notification Trigger Failed: %', SQLERRM;
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
