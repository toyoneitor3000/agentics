-- Make Mentions Case-Insensitive to ensure notifications work even if typed differently
CREATE OR REPLACE FUNCTION notify_new_comment() RETURNS TRIGGER AS $$
DECLARE
    content_owner uuid;
    mentioned_user_id uuid;
    username_match text;
    match_array text[];
    target_id_uuid uuid;
BEGIN
    BEGIN
        target_id_uuid := NEW.target_id::uuid;
        content_owner := get_content_owner_id(target_id_uuid, NEW.target_type);
        
        -- A. Notify Content Owner
        IF content_owner IS NOT NULL AND content_owner <> NEW.user_id THEN
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
            EXCEPTION WHEN OTHERS THEN NULL; END;
        END IF;
        
        -- B. Handle Mentions (Case Insensitive)
        FOR match_array IN
            SELECT regexp_matches(NEW.content, '@([A-Za-z0-9_]+)', 'g')
        LOOP
            username_match := match_array[1];
            
            -- Use LOWER() comparison
            SELECT id INTO mentioned_user_id FROM profiles WHERE lower(username) = lower(username_match);
            
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
                 EXCEPTION WHEN OTHERS THEN NULL; END;
            END IF;
        END LOOP;
    
    EXCEPTION WHEN OTHERS THEN NULL; END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
