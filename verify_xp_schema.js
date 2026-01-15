
const { Client } = require('pg');

const connectionString = 'postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    try {
        await client.connect();

        console.log("Checking profiles table for XP column...");
        const resXP = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'xp'");
        if (resXP.rows.length > 0) {
            console.log("✅ XP column exists in profiles.");
        } else {
            console.error("❌ XP column MISSING in profiles.");
            // Optional: Add column if missing?
            // await client.query("ALTER TABLE profiles ADD COLUMN xp INTEGER DEFAULT 0;");
            // console.log("Created XP column.");
        }

        console.log("Checking cinema_likes table...");
        const resLikes = await client.query("SELECT to_regclass('cinema_likes');");
        if (resLikes.rows[0].to_regclass) {
            console.log("✅ cinema_likes table exists.");
        } else {
            console.error("❌ cinema_likes table MISSING.");
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
