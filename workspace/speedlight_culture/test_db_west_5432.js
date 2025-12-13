const { Client } = require('pg');

// Using Port 5432 (Session Mode) as defined in your .env.local
const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:5432/postgres";

console.log('Testing connection to US-WEST-2 on Port 5432...');

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false } // Required for Supabase connection
});

async function testConnection() {
    try {
        await client.connect();
        console.log('✅ Connection SUCCESSFUL! (US-WEST-2 / Port 5432)');
        const res = await client.query('SELECT NOW(), current_setting(\'server_version\')');
        console.log('DB Time:', res.rows[0].now);
        console.log('Version:', res.rows[0].current_setting);
        await client.end();
    } catch (err) {
        console.error('❌ Connection FAILED:', err.message);
        if (err.message.includes('self-signed')) {
            console.log('Tip: This might be a local environment CA issue, but if the code matches what works in production, it should be fine.');
        }
    }
}

testConnection();
