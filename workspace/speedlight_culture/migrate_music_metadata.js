const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
    try {
        console.log("Running migration: ADD COLUMN music_metadata...");
        await pool.query(`
            ALTER TABLE cinema_videos 
            ADD COLUMN IF NOT EXISTS music_metadata JSONB DEFAULT NULL;
        `);
        console.log("Migration successful!");
    } catch (err) {
        console.error('Error running migration:', err);
    } finally {
        await pool.end();
    }
}

runMigration();
