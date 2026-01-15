const { Client } = require('pg');

const connectionString = 'postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = new Client({
    connectionString: connectionString,
});

async function checkBucket() {
    try {
        await client.connect();
        console.log('Connected.');

        const res = await client.query("SELECT id, name, file_size_limit, allowed_mime_types, public FROM storage.buckets WHERE id = 'cinema'");
        console.log('Result:', res.rows);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkBucket();
