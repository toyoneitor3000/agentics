const { Pool } = require('pg');

// Testing the exact string from .env.local
const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require";

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false } // We are overriding this in code, let's see if it works with the string
});

async function testConnection() {
    try {
        console.log('Testing connection to Supabase Transaction Pooler (6543)...');
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
