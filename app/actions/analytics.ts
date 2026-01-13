'use server'

import { query } from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

// Ensure the table exists (Self-healing infrastructure)
async function ensureAnalyticsTable() {
    await query(`
        CREATE TABLE IF NOT EXISTS video_analytics (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES "user"(id),
            video_id INTEGER NOT NULL,
            event_type VARCHAR(50) NOT NULL, -- 'start', 'quartile_25', 'quartile_50', 'quartile_75', 'complete', 'heartbeat'
            watch_time_seconds FLOAT,
            created_at TIMESTAMP DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_analytics_video ON video_analytics(video_id);
    `);
}

export async function logWatchEvent(videoId: number, eventType: string, watchTime: number) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        const userId = session?.user?.id || null;

        // Lazy initialization of infrastructure
        await ensureAnalyticsTable();

        await query(
            `INSERT INTO video_analytics (user_id, video_id, event_type, watch_time_seconds) 
             VALUES ($1, $2, $3, $4)`,
            [userId, videoId, eventType, watchTime]
        );

        return { success: true };
    } catch (e) {
        console.error("Analytics Log Error:", e);
        // Fail silently to not disrupt UX
        return { success: false };
    }
}
