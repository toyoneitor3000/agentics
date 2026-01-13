const { Client } = require('pg');

const connectionString = "postgresql://postgres:Pigmelonn45.@db.gwxhkhalmixohsvxfbva.supabase.co:5432/postgres";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function anonymizeNewsNotifications() {
    try {
        await client.connect();
        console.log('Connected to DB...');

        // Set actor_id to NULL for all news notifications to maintain admin anonymity
        const result = await client.query(`
            UPDATE notifications 
            SET actor_id = NULL 
            WHERE target_type = 'news'
        `);

        console.log(`✅ Anonymized ${result.rowCount} news notification(s).`);
        await client.end();
    } catch (err) {
        console.error('❌ Failed to anonymize notifications:', err);
    }
}

anonymizeNewsNotifications();
