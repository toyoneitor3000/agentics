
const { Client } = require('pg');

const connectionString = 'postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    try {
        await client.connect();

        // Search for the video by title pattern seen in screenshot (timestamp-like)
        // or just list recent 5 videos to be sure.
        console.log("Searching for video...");
        const res = await client.query(`
            SELECT id, title, format, created_at 
            FROM cinema_videos 
            ORDER BY created_at DESC 
            LIMIT 10
        `);
        console.table(res.rows);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
