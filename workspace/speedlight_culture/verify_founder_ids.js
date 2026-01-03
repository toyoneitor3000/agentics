
const { Client } = require('pg');

const connectionString = 'postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    try {
        await client.connect();

        console.log("--- Fetching Profiles ---");
        const res = await client.query("SELECT id, email, full_name, founder_number FROM profiles ORDER BY founder_number ASC");

        console.log(`Total count: ${res.rows.length}`);

        console.table(res.rows.map(r => ({
            name: r.full_name,
            founder_num: r.founder_number
        })));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
