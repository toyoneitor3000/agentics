
const { Client } = require('pg');

const connectionString = 'postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    try {
        await client.connect();

        console.log("--- Users Table ---");
        const resUser = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user'");
        console.table(resUser.rows);

        console.log("--- Profiles Table (if exists seperate) ---");
        const resProfiles = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles'");
        console.table(resProfiles.rows);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
