
const { Client } = require('pg');

const connectionString = 'postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    try {
        await client.connect();

        // Update 3 random videos to be vertical
        const updateRes = await client.query(`
            UPDATE cinema_videos 
            SET format = 'vertical' 
            WHERE id IN (
                SELECT id FROM cinema_videos ORDER BY RANDOM() LIMIT 3
            )
            RETURNING id, title, format;
        `);

        console.table(updateRes.rows);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
