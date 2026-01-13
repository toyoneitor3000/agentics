const { Pool } = require('pg');

// Removed ?sslmode=require from string, relying on config object
const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres";

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function testConnection() {
    try {
        console.log('Testing connection to Supabase Transaction Pooler (6543) without query param...');
        const client = await pool.connect();
        console.log('✅ Connection SUCCESSFUL!');
        const res = await client.query('SELECT NOW()');
        console.log('Time from DB:', res.rows[0]);
        client.release();
        await pool.end();
    } catch (err) {
        console.error('❌ Connection FAILED:', err);
    }
}

testConnection();
