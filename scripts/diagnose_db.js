const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Simple .env.local parser
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        if (line.trim().startsWith('#')) return;
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            process.env[key] = value;
        }
    });
}

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        console.log('--- DIAGNOSTIC START ---');

        // 1. List Profiles
        const profiles = await client.query('SELECT id, email, full_name, founder_number FROM profiles LIMIT 5');
        console.log('Profiles:', profiles.rows);

        // 2. List Users (BetterAuth)
        const users = await client.query('SELECT id, email, name FROM "user" LIMIT 5');
        console.log('BetterAuth Users:', users.rows);

        // 3. Count content by User ID
        // We want to see if there are projects that DON'T match known profile IDs
        const orphans = await client.query(`
        SELECT DISTINCT user_id 
        FROM projects 
        WHERE user_id NOT IN (SELECT id FROM profiles)
      `);
        console.log('Orphaned Project Owner IDs:', orphans.rows);

        const projectCounts = await client.query(`SELECT user_id, COUNT(*) FROM projects GROUP BY user_id`);
        console.log('Project Counts per User:', projectCounts.rows);

        console.log('--- DIAGNOSTIC END ---');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
