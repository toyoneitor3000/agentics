const { Client } = require('pg');

const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:5432/postgres";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function checkTables() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE';
        `);
        console.log('Tables in public schema:', res.rows.map(r => r.table_name));
        await client.end();
    } catch (err) {
        console.error('Error checking tables:', err);
    }
}

checkTables();
