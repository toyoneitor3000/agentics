require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        client.on('notice', (msg) => console.log('NOTICE:', msg.message));

        // Get IDs
        const speedRes = await client.query("SELECT id FROM profiles WHERE username = 'speedlightculture'");
        const speedId = speedRes.rows[0].id;

        const otherRes = await client.query("SELECT id FROM profiles WHERE username != 'speedlightculture' LIMIT 1");
        const actorId = otherRes.rows[0].id;

        console.log(`Speedlight ID: ${speedId}, Actor ID: ${actorId}`);

        // Get a valid cinema video ID (target)
        const videoRes = await client.query("SELECT id FROM cinema_videos LIMIT 1");
        if (videoRes.rows.length === 0) {
            console.log("No videos found to comment on.");
            return;
        }
        const targetId = videoRes.rows[0].id;

        console.log(`Target Video ID: ${targetId}`);

        // INSERT COMMENT
        console.log("Inserting comment...");
        const content = `@speedlightculture Hello from debug script ${Date.now()}`;

        // We expect the trigger to fire
        const insertRes = await client.query(`
        INSERT INTO comments (user_id, target_id, target_type, content)
        VALUES ($1, $2, 'cinema', $3)
        RETURNING id;
    `, [actorId, targetId, content]);

        console.log("Comment inserted:", insertRes.rows[0].id);

        // CHECK NOTIFICATIONS
        console.log("Checking notifications...");
        // Wait a moment (though triggers are synchronous usually)
        await new Promise(r => setTimeout(r, 1000));

        const notifRes = await client.query(`
        SELECT * FROM notifications 
        WHERE recipient_id = $1 
        AND type = 'mention'
        ORDER BY created_at DESC LIMIT 1
    `, [speedId]);

        if (notifRes.rows.length > 0) {
            console.log("SUCCESS! Notification found:", notifRes.rows[0]);
        } else {
            console.log("FAILURE! No notification found.");
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

run();
