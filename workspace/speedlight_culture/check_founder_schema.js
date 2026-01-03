
const { Client } = require('pg');

const connectionString = 'postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    try {
        await client.connect();

        console.log("--- Column Info for founder_number ---");
        const resCol = await client.query(`
            SELECT column_name, data_type, column_default, is_identity
            FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'founder_number'
        `);
        console.table(resCol.rows);

        console.log("--- Checking for Unique/PK constraints on founder_number ---");
        const resConstraints = await client.query(`
            SELECT tc.constraint_name, tc.constraint_type
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
            WHERE tc.table_name = 'profiles' AND kcu.column_name = 'founder_number'
        `);
        console.table(resConstraints.rows);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
