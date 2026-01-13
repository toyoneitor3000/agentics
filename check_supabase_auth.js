
const { Pool } = require('pg');

const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require";

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function checkAuthUsers() {
    try {
        console.log('Connecting to DB...');
        const client = await pool.connect();

        // 1. Check if we can access the original Supabase auth.users table
        try {
            const resAuth = await client.query('SELECT id, email FROM auth.users LIMIT 5');
            console.log('✅ Access to auth.users SUCCESSFUL!');
            console.log('--- Sample Emails from auth.users ---');
            console.table(resAuth.rows);
        } catch (e) {
            console.error('❌ Could not access auth.users (Permissions or table missing):', e.message);
        }

        // 2. Check a profile ID against these
        const resProfiles = await client.query('SELECT id, full_name, founder_number FROM profiles WHERE founder_number IS NOT NULL LIMIT 5');
        console.log('--- Sample Profiles (Classic IDs) ---');
        console.table(resProfiles.rows);

        client.release();
    } catch (err) {
        console.error('❌ Database connection error:', err);
    } finally {
        await pool.end();
    }
}

checkAuthUsers();
