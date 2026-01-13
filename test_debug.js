require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();

        // Listen for notices (RAISE NOTICE/WARNING)
        client.on('notice', (msg) => console.log('NOTICE:', msg.message));

        console.log("--- Checking Column Types ---");
        const res1 = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'id'");
        console.log("Profiles ID type:", res1.rows[0]);

        const res2 = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'recipient_id'");
        console.log("Notifications recipient_id type:", res2.rows[0]);

        console.log("\n--- Testing Logic Block ---");
        await client.query(`
        DO $$
        DECLARE
            content text := '@speedlightculture hello';
            match_val text[];
            username_match text;
            found_id text;
        BEGIN
            RAISE NOTICE 'Starting loop...';
            FOR match_val IN SELECT regexp_matches(content, '@([A-Za-z0-9_]+)', 'g') LOOP
                username_match := match_val[1];
                RAISE NOTICE 'Matched username: %', username_match;
                
                SELECT id::text INTO found_id FROM profiles WHERE lower(username) = lower(username_match);
                RAISE NOTICE 'Found Profile ID: %', found_id;
            END LOOP;
        END $$;
    `);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

run();
