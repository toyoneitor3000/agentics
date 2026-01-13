const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Try to read .env.local to find DATABASE_URL if possible, otherwise fallback or error
// But since I saw a hardcoded one in test_db.js that seemed to work (or be attempted), I will use that one as a fallback or primary if I can't read env.
// Actually, I'll allow the user to modify this script if it fails.

// Connection string from test_db.js (assuming it's valid for this workspace)
const connectionString = "postgresql://postgres:Pigmelonn45.@db.gwxhkhalmixohsvxfbva.supabase.co:5432/postgres";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS speedlight_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    category TEXT DEFAULT 'update',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author_id UUID REFERENCES auth.users(id),
    commit_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

async function setup() {
    try {
        console.log('Connecting to DB...');
        await client.connect();
        console.log('Creating speedlight_news table...');
        await client.query(createTableQuery);
        console.log('✅ Table speedlight_news created successfully.');
        await client.end();
    } catch (err) {
        console.error('❌ Failed to setup news table:', err);
        process.exit(1);
    }
}

setup();
