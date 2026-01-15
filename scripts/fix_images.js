
const { Client } = require('pg');

// BYPASS SSL ERROR
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=disable";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        console.log('Connected to DB for Image Fix.');

        // Update Cars & Coffee Image with a reliable high-res car meet image
        await client.query(`
            UPDATE events 
            SET image = 'https://images.unsplash.com/photo-1502161254066-6c70811b0e12?q=80&w=2070' 
            WHERE title ILIKE '%cars & coffee%'
        `);

        console.log('✅ Cars & Coffee Image Updated.');

        await client.end();

    } catch (e) {
        console.error('Error:', e);
        await client.end();
    }
}

run();
