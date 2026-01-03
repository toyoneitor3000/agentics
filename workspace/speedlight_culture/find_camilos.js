
const { Client } = require('pg');

const connectionString = 'postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    try {
        await client.connect();

        console.log("--- Searching for variants of 'Camilo' ---");
        const res = await client.query(`
            SELECT id, email, full_name, role, founder_number, created_at 
            FROM profiles 
            WHERE full_name ILIKE '%camilo%'
            ORDER BY created_at ASC
        `);

        console.table(res.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
