const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = new Client({
    connectionString: connectionString,
});

async function runMigration() {
    const filePath = process.argv[2];
    if (!filePath) {
        console.error("Please provide a SQL file path.");
        process.exit(1);
    }

    try {
        await client.connect();
        console.log('Connected to database.');

        const sqlPath = path.resolve(filePath);
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log(`Running migration from ${filePath}...`);
        await client.query(sql);
        console.log('Migration completed successfully.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
