
const { Pool } = require('pg');

// Direct Connection String (Port 5432)
// NOTE: For direct connection, host is db.[ref].supabase.co
const connectionString = "postgres://postgres:Pigmelonn45.@db.gwxhkhalmixohsvxfbva.supabase.co:5432/postgres?sslmode=require";

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function testDirectConnection() {
    try {
        console.log('Testing DIRECT connection (5432)...');
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

testDirectConnection();
