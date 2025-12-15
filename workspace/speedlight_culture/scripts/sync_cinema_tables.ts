import { query } from '@/app/lib/db';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function syncLikes() {
    try {
        console.log('Checking existence of cinema_likes table...');
        // We'll try to insert a dummy like to see if it fails, or just create table if not exists
        // Since we are using 'query' which is likely a pool wrapper, we can run DDL.

        await query(`
            CREATE TABLE IF NOT EXISTS cinema_likes (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                video_id UUID NOT NULL REFERENCES cinema_videos(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(user_id, video_id)
            );
        `);

        // Also ensure cinema_comments exists
        await query(`
            CREATE TABLE IF NOT EXISTS cinema_comments (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                video_id UUID NOT NULL REFERENCES cinema_videos(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);

        console.log('Successfully synced/created interaction tables.');

    } catch (e) {
        console.error('Migration failed:', e);
    }
}

syncLikes();
