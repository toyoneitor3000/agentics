
const { Pool } = require('pg');

// Pooler Host but Port 5432 (Session Mode)
const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:5432/postgres?sslmode=require";

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function testPoolerSession() {
    try {
        console.log('Testing Pooler Session Mode (5432)...');
        const client = await pool.connect();
        console.log('✅ Connection SUCCESSFUL!');
        const res = await client.query('SELECT NOW()');
        console.log('Time:', res.rows[0]);
        client.release();
        await pool.end();
    } catch (err) {
        console.error('❌ Connection FAILED:', err.message);
    }
}

testPoolerSession();
