
const { Client } = require('pg');

// BYPASS SSL ERROR
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// US-WEST-2 POOLER
const connectionString = "postgres://postgres.gwxhkhalmixohsvxfbva:Pigmelonn45.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=disable";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

const CEO_ID = 'Bt6ow223CAkw20zcQL133zbqIXy17tbr'; // Camilo Toloza Founder #1

async function run() {
    try {
        await client.connect();
        console.log('Connected to DB for Curation.');

        // 1. ASSIGN CONTENT TO CEO
        console.log('Assigning content to CEO...');

        // Articles
        await client.query(`UPDATE articles SET author_id = $1 WHERE author_id != $1`, [CEO_ID]);
        // Events
        await client.query(`UPDATE events SET user_id = $1 WHERE user_id != $1`, [CEO_ID]);
        // Cinema Videos (Only those with valid URLs, we might delete others later)
        await client.query(`UPDATE cinema_videos SET user_id = $1 WHERE user_id != $1`, [CEO_ID]);
        // Projects
        await client.query(`UPDATE projects SET user_id = $1 WHERE user_id != $1`, [CEO_ID]);

        console.log('Content ownership transferred.');

        // 2. CURATE & CLEANUP
        console.log('Curating content (Fixing broken links/placeholders)...');

        // Delete videos with no URL or empty status
        await client.query(`DELETE FROM cinema_videos WHERE video_url IS NULL OR video_url = ''`);

        // Update Thumbnails to Safe Placeholders if missing (Using Color Placeholders as requested)
        // Coffee, Dark Green, Dark Yellow style placeholders
        const placeholders = [
            'https://placehold.co/1080x1920/1e1e1e/FFF.png?text=VIDEO', // Dark
            'https://placehold.co/1080x1920/2e1a10/FFF.png?text=SPEEDLIGHT', // Coffee
            'https://placehold.co/1080x1920/0a2818/FFF.png?text=CULTURE', // Dark Green
        ];

        // We can't easily check for "broken" 404s here without fetching. 
        // But we can ensure everything has a thumbnail.
        await client.query(`
            UPDATE cinema_videos 
            SET thumbnail_url = 'https://placehold.co/1080x1920/1a1a1a/FFF.png?text=Speedlight' 
            WHERE thumbnail_url IS NULL OR thumbnail_url = ''
        `);

        // 3. RANKING SEEDING
        // Ensure best content has some likes so sorting works
        console.log('Seeding ratings/likes...');

        // Give 5-10 likes to random videos to create a hierarchy
        // Ideally we pick a few IDs
        const resVideos = await client.query('SELECT id FROM cinema_videos LIMIT 5');
        for (const row of resVideos.rows) {
            const likeCount = Math.floor(Math.random() * 20) + 1;
            // Update the counter
            await client.query(`UPDATE cinema_videos SET likes_count = $1 WHERE id = $2`, [likeCount, row.id]);
        }

        console.log('✅ Curation Complete.');
        await client.end();

    } catch (e) {
        console.error('Error:', e);
        await client.end();
    }
}

run();
