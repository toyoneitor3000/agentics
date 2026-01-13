const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkVideos() {
    try {
        const res = await pool.query('SELECT id, title, video_url, format FROM cinema_videos');
        console.table(res.rows);
    } catch (err) {
        console.error('Error querying videos:', err);
    } finally {
        await pool.end();
    }
}

checkVideos();
