require('dotenv').config({ path: '.env.local' }); // Load env from .env.local if exists, or rely on system env
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();

        // 1. Check if user 'speedlight' exists
        const userRes = await client.query("SELECT id, username, full_name, email FROM profiles WHERE username ILIKE '%speedlight%'");
        console.log("Users found matching 'speedlight':", userRes.rows);

        if (userRes.rows.length === 0) {
            console.log("CRITICAL: No user found with username like speedlight");
        }

        // 2. Check the last 5 comments
        const commentsRes = await client.query("SELECT id, content, user_id, target_type, created_at FROM comments ORDER BY created_at DESC LIMIT 5");
        console.log("Last 5 comments:", commentsRes.rows);

        // 3. Check notifications for the speedlight user(s) found
        for (const u of userRes.rows) {
            const notifRes = await client.query("SELECT * FROM notifications WHERE recipient_id = $1 ORDER BY created_at DESC LIMIT 5", [u.id]);
            console.log(`Notifications for ${u.username} (${u.id}):`, notifRes.rows);
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

run();
