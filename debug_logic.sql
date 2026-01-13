-- CHECK TABLE COLUMNS
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'id';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notifications' AND column_name = 'recipient_id';

-- CHECK MATCH LOGIC
DO $$
DECLARE
    content text := '@speedlightculture hello';
    match_val text[];
    username_match text;
    found_id text;
BEGIN
    FOR match_val IN SELECT regexp_matches(content, '@([A-Za-z0-9_]+)', 'g') LOOP
        username_match := match_val[1];
        RAISE WARNING 'Matched username: %', username_match;
        
        SELECT id::text INTO found_id FROM profiles WHERE lower(username) = lower(username_match);
        RAISE WARNING 'Found Profile ID: %', found_id;
    END LOOP;
END $$;
