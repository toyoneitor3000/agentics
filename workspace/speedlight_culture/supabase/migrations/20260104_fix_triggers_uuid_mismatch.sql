-- Drop triggers and function first to update them safely
DROP TRIGGER IF EXISTS on_new_like ON likes;
DROP TRIGGER IF EXISTS on_new_comment ON comments;

-- Re-create notify_new_like with corrected type handling
CREATE OR REPLACE FUNCTION notify_new_like() RETURNS TRIGGER AS $$
DECLARE
    content_owner uuid;
    msg text;
    target_id_uuid uuid;
BEGIN
    -- Cast target_id to uuid safely if it's text representation
    target_id_uuid := NEW.target_id::uuid;
    content_owner := get_content_owner_id(target_id_uuid, NEW.target_type);
    
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
            NEW.target_id::text, -- notifications table expects text for target_id
            NEW.target_type,
            msg
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create notify_new_comment with corrected type handling
CREATE OR REPLACE FUNCTION notify_new_comment() RETURNS TRIGGER AS $$
DECLARE
    content_owner uuid;
    mentioned_user_id uuid;
    username_match text;
    match_array text[];
    target_id_uuid uuid;
BEGIN
    -- Cast target_id to uuid safely
    target_id_uuid := NEW.target_id::uuid;
    content_owner := get_content_owner_id(target_id_uuid, NEW.target_type);
    
    -- A. Notify Content Owner
    IF content_owner IS NOT NULL AND content_owner != NEW.user_id THEN
        INSERT INTO notifications (recipient_id, actor_id, type, target_id, target_type, message)
        VALUES (
            content_owner,
            NEW.user_id,
            'comment',
            NEW.target_id::text,
            NEW.target_type,
            'comentó: "' || substring(NEW.content from 1 for 40) || (CASE WHEN length(NEW.content) > 40 THEN '...' ELSE '' END) || '"'
        );
    END IF;
    
    -- B. Handle Mentions
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
                NEW.target_id::text,
                NEW.target_type,
                'te mencionó: "' || substring(NEW.content from 1 for 40) || (CASE WHEN length(NEW.content) > 40 THEN '...' ELSE '' END) || '"'
             );
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-bind triggers
CREATE TRIGGER on_new_like
    AFTER INSERT ON likes
    FOR EACH ROW EXECUTE FUNCTION notify_new_like();

CREATE TRIGGER on_new_comment
    AFTER INSERT ON comments
    FOR EACH ROW EXECUTE FUNCTION notify_new_comment();
