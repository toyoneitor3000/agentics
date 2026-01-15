
const { Client } = require('pg');

const connectionString = 'postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    try {
        await client.connect();

        console.log("Updating video format...");
        const res = await client.query(`
            UPDATE cinema_videos 
            SET format = 'vertical' 
            WHERE id = '25530871-4d9e-4432-84be-2f857cbe3bfb'
        `);
        console.log("Update complete. Rows affected:", res.rowCount);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
