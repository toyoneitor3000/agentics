const { Client } = require('pg');

const connectionString = 'postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    try {
        await client.connect();

        const res = await client.query(`
            SELECT format, COUNT(*) 
            FROM cinema_videos 
            GROUP BY format
        `);
        console.table(res.rows);

        const recent = await client.query(`
            SELECT id, title, format 
            FROM cinema_videos 
            ORDER BY created_at DESC 
            LIMIT 5
        `);
        console.table(recent.rows);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
