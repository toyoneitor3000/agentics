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
        console.log('--- ADMIN ACCESS CHECK ---');
        console.log('Fetching users with role CEO or ADMIN...');

        const res = await client.query(`
          SELECT id, full_name, email, role, founder_number 
          FROM profiles 
          WHERE role IN ('CEO', 'ADMIN')
      `);

        if (res.rows.length === 0) {
            console.log('NO users have admin access currently.');
        } else {
            console.table(res.rows);
        }

        console.log('--------------------------');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
