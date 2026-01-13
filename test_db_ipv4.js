const { Client } = require('pg');

// Try connecting via the Supavisor IPv4 Pooler
const connectionString = "postgresql://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require";

// Try Port 5432 (Session Mode) on the pooler as well if 6543 fails or for prepared statements? 
// Usually 6543 is safer for connection limits, but BetterAuth uses standard queries.
// Let's stick to 6543 first.

console.log('Testing connection string:', connectionString);

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function testConnection() {
    try {
        console.log('Testing connection to Supabase Pooler (IPv4)...');
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
