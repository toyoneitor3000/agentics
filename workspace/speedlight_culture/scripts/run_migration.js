const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Simple .env.local parser to avoid dependencies
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    console.log('Loading .env.local...');
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        // Skip comments
        if (line.trim().startsWith('#')) return;

        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
        }
    });
}

if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL not found in .env.local');
    process.exit(1);
}

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log('Connecting to database...');
        await client.connect();

        const sqlPath = path.join(__dirname, '../supabase/migrations/20251212_migrate_legacy_to_better_auth.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing migration from:', sqlPath);
        await client.query(sql);
        console.log('✅ Migration completed successfully.');
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

run();
