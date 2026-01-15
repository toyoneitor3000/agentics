-- Enable console logging for this session (though RAISE WARNING shows regardless)
SET client_min_messages TO WARNING;

DO $$
DECLARE
    test_comment_id uuid;
    recipient_id uuid;
    actor_id uuid;
BEGIN
    -- 1. Get IDs
    SELECT id INTO recipient_id FROM profiles WHERE username = 'speedlightculture';
    SELECT id INTO actor_id FROM profiles WHERE username != 'speedlightculture' LIMIT 1;

    RAISE WARNING 'Recipient ID: %, Actor ID: %', recipient_id, actor_id;

    -- 2. Insert Comment simulating the frontend action
    INSERT INTO comments (user_id, target_id, target_type, content)
    VALUES (
        actor_id, 
        '6e029314-ec0b-46a4-bcc0-8903c727038e'::uuid, -- Use a fake UUID for target, hopefully FK doesn't fail or we use a real one.
        'cinema',
        '@speedlightculture Test Message from SQL'
    ) RETURNING id INTO test_comment_id;

    RAISE WARNING 'Inserted Comment ID: %', test_comment_id;

END $$;
