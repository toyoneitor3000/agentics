const { Client } = require('pg');

// Try connecting via the Supavisor IPv4 Pooler in US-WEST-2
// Based on .env.local entry
const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require";

console.log('Testing connection string:', connectionString);

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function testConnection() {
    try {
        console.log('Testing connection to Supabase Pooler (IPv4 - US-WEST-2)...');
        await client.connect();
        console.log('✅ Connection SUCCESSFUL!');
        const res = await client.query('SELECT NOW()');
        console.log('Time from DB:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('❌ Connection FAILED:', err);
        process.exit(1);
    }
}

testConnection();
