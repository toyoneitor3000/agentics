-- Ultra Safe Triggers: Never fail the main action (Comment/Like) if notification logic crashes.

CREATE OR REPLACE FUNCTION notify_new_comment() RETURNS TRIGGER AS $$
DECLARE
    content_owner uuid;
    mentioned_user_id uuid;
    username_match text;
    match_array text[];
    target_id_uuid uuid;
BEGIN
    -- Wrap everything in a sub-block to catch errors and prevent blocking the Comment
    BEGIN
        -- Cast target_id to uuid safely
        target_id_uuid := NEW.target_id::uuid;
        content_owner := get_content_owner_id(target_id_uuid, NEW.target_type);
        
        -- A. Notify Content Owner
        IF content_owner IS NOT NULL AND content_owner <> NEW.user_id THEN
            -- Check existence of Foreign Keys to avoid hard crashes? 
            -- Better: Just Try/Catch the insert.
            BEGIN
                INSERT INTO notifications (recipient_id, actor_id, type, target_id, target_type, message)
                VALUES (
                    content_owner,
                    NEW.user_id,
                    'comment',
                    NEW.target_id::text,
                    NEW.target_type,
                    'comentó: "' || substring(NEW.content from 1 for 40) || (CASE WHEN length(NEW.content) > 40 THEN '...' ELSE '' END) || '"'
                );
            EXCEPTION WHEN OTHERS THEN
                -- Ignore notification error
                RAISE WARNING 'Failed to insert comment notification for owner: %', SQLERRM;
            END;
        END IF;
        
        -- B. Handle Mentions
        FOR match_array IN
            SELECT regexp_matches(NEW.content, '@([A-Za-z0-9_]+)', 'g')
        LOOP
            username_match := match_array[1];
            
            SELECT id INTO mentioned_user_id FROM profiles WHERE username = username_match;
            
            IF mentioned_user_id IS NOT NULL AND mentioned_user_id <> NEW.user_id THEN
                 BEGIN
                     INSERT INTO notifications (recipient_id, actor_id, type, target_id, target_type, message)
                     VALUES (
                        mentioned_user_id,
                        NEW.user_id,
                        'mention',
                        NEW.target_id::text,
                        NEW.target_type,
                        'te mencionó: "' || substring(NEW.content from 1 for 40) || (CASE WHEN length(NEW.content) > 40 THEN '...' ELSE '' END) || '"'
                     );
                 EXCEPTION WHEN OTHERS THEN
                    RAISE WARNING 'Failed to insert mention notification: %', SQLERRM;
                 END;
            END IF;
        END LOOP;
    
    EXCEPTION WHEN OTHERS THEN
        -- If anything else goes wrong (e.g. variable casting), just log and continue
        RAISE WARNING 'Notification Trigger Failed completely: %', SQLERRM;
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Update Like Trigger to be ultra safe too
CREATE OR REPLACE FUNCTION notify_new_like() RETURNS TRIGGER AS $$
DECLARE
    content_owner uuid;
    msg text;
    target_id_uuid uuid;
BEGIN
    BEGIN
        target_id_uuid := NEW.target_id::uuid;
        content_owner := get_content_owner_id(target_id_uuid, NEW.target_type);
        
        IF content_owner IS NOT NULL AND content_owner <> NEW.user_id THEN
            
            IF NEW.target_type = 'project' THEN msg := 'le gustó tu proyecto.';
            ELSIF NEW.target_type IN ('video', 'cinema') THEN msg := 'le gustó tu video.';
            ELSE msg := 'le gustó tu publicación.';
            END IF;

            BEGIN
                INSERT INTO notifications (recipient_id, actor_id, type, target_id, target_type, message)
                VALUES (
                    content_owner,
                    NEW.user_id,
                    'like',
                    NEW.target_id::text,
                    NEW.target_type,
                    msg
                );
            EXCEPTION WHEN OTHERS THEN
                 RAISE WARNING 'Failed to insert like notification: %', SQLERRM;
            END;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Like Notification Trigger Failed: %', SQLERRM;
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
