const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function applyMigration() {
    const client = await pool.connect();
    try {
        const sqlPath = path.join(__dirname, '../supabase/migrations/20251213_business_accounts.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Applying migration: Business Accounts...');
        await client.query(sql);
        console.log('✅ Migration applied successfully.');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        client.release();
        pool.end();
    }
}

applyMigration();
