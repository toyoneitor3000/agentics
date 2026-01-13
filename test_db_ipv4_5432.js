const { Client } = require('pg');

// Try connecting via the Supavisor IPv4 Pooler on Session Port 5432
const connectionString = "postgresql://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-east-1.pooler.supabase.com:5432/postgres";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false } // Important for Supabase
});

async function testConnection() {
    try {
        console.log('Testing connection to Supabase Pooler (IPv4 - Session Mode 5432)...');
        await client.connect();
        console.log('✅ Connection SUCCESSFUL!');
        const res = await client.query('SELECT NOW()');
        console.log('Time from DB:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('❌ Connection FAILED:', err);
    }
}

testConnection();
