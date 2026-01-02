'use server'

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { query } from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from '@supabase/supabase-js';

async function getSessionUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session?.user;
}

export interface CinemaVideoData {
    title: string;
    description: string;
    video_url: string;
    location?: string;
    hashtags?: string[];
    thumbnail_url?: string;
    category?: string;
    format?: 'horizontal' | 'vertical';
    music_metadata?: any; // JSONB
}

export async function submitVideo(data: CinemaVideoData) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    try {
        // Prepare music_metadata with location and hashtags if they exist
        const musicMetadata = data.music_metadata || {};
        if (data.location) {
            musicMetadata.location = data.location;
        }
        if (data.hashtags) {
            musicMetadata.hashtags = data.hashtags;
        }

        await query(
            `INSERT INTO cinema_videos (user_id, title, description, video_url, thumbnail_url, category, format, music_metadata, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'approved')`,
            [
                user.id,
                data.title,
                data.description,
                data.video_url,
                data.thumbnail_url || null,
                data.category || 'General',
                data.format || 'horizontal',
                musicMetadata || null
            ]
        );

        revalidatePath('/cinema');
        console.log("Video submitted by:", user.id);
        return { success: true };
    } catch (e) {
        console.error('submitVideo Error:', e);
        throw e;
    }
}

export async function updateVideoMetadata(id: string, data: { title: string; description: string; location?: string; hashtags?: string[]; format?: 'horizontal' | 'vertical'; music_metadata?: any }) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    // Verify ownership
    const { rows } = await query('SELECT user_id FROM cinema_videos WHERE id = $1', [id]);
    if (rows.length === 0) throw new Error("Not found");
    if (rows[0].user_id !== user.id) throw new Error("Forbidden");

    // Dynamic Update Query Construction
    const updates: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    // Prepare music_metadata with hashtags and location
    const musicMeta = data.music_metadata || {};
    if (data.location) musicMeta.location = data.location;
    if (data.hashtags) musicMeta.hashtags = data.hashtags;

    if (data.title) { updates.push(`title = $${queryIndex++}`); values.push(data.title); }
    if (data.description !== undefined) { updates.push(`description = $${queryIndex++}`); values.push(data.description); }
    if (data.format) { updates.push(`format = $${queryIndex++}`); values.push(data.format); }
    updates.push(`music_metadata = $${queryIndex++}`); values.push(musicMeta);

    // Add ID as last parameter
    values.push(id);

    if (updates.length === 0) return { success: true }; // Nothing to update

    await query(
        `UPDATE cinema_videos SET ${updates.join(', ')} WHERE id = $${queryIndex}`,
        values
    );

    revalidatePath('/cinema');
    revalidatePath('/profile');
    return { success: true };
}

export async function getSignedUploadUrl(fileName: string) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("Configuración requerida: Falta SUPABASE_SERVICE_ROLE_KEY en .env.local");
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Create a Signed Upload URL for a specific path
    // The path will include the user ID to organize files: {userId}/{timestamp}-{filename}
    // We expect the client to generate the path, or we generate it here?
    // Let's generate it here for security.

    // Actually, createSignedUploadUrl generates a token for a path.
    // path: 'user_id/filename'

    const path = `${user.id}/${fileName}`;

    const { data, error } = await supabaseAdmin
        .storage
        .from('cinema')
        .createSignedUploadUrl(path);

    if (error) {
        console.error("Storage Sign Error:", error);
        throw error;
    }

    return {
        signedUrl: data.signedUrl,
        token: data.token,
        path: data.path, // This is the full path in the bucket
        fullPath: path // Redundant but explicit
    };
}


// ... existing imports
// Add these:

export async function getCloudflareUploadUrl() {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const token = process.env.CLOUDFLARE_API_TOKEN;

    // Check if Cloudflare is configured
    if (!accountId || !token) {
        return null; // Fallback to Supabase logic if keys missing
    }

    try {
        // Request a Direct Upload URL from Cloudflare
        // This URL lets the user upload directly to CF servers securely
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                maxDurationSeconds: 10800, // 3 Hours Max
                meta: {
                    userId: user.id,
                    name: `Upload by ${user.name}`
                }
            })
        });

        const data = await response.json();

        if (!data.success) {
            console.error("CF Stream Error:", data.errors);
            throw new Error("Error connecting to Cloudflare Stream");
        }

        return {
            provider: 'cloudflare',
            uploadUrl: data.result.uploadURL,
            uid: data.result.uid // The Video ID we need to save
        };

    } catch (e) {
        console.error("Cloudflare Action Error:", e);
        return null; // Fallback
    }
}

export async function toggleLike(videoId: string) {
    const user = await getSessionUser();
    if (!user) return { error: "Unauthorized" };

    try {
        // 1. Get Video Owner
        const { rows: videoRows } = await query(
            'SELECT user_id FROM cinema_videos WHERE id = $1',
            [videoId]
        );

        if (videoRows.length === 0) return { error: "Video not found" };
        const ownerId = videoRows[0].user_id;

        // 2. Check if Like exists
        const { rows } = await query(
            'SELECT 1 FROM cinema_likes WHERE user_id = $1 AND video_id = $2',
            [user.id, videoId]
        );

        if (rows.length > 0) {
            // UNLIKE
            await query('DELETE FROM cinema_likes WHERE user_id = $1 AND video_id = $2', [user.id, videoId]);

            // Decrease XP (Link Economy) - Only if not self-like
            if (ownerId !== user.id) {
                // REVERTED: XP is for GIVER now.
                // await query('UPDATE profiles SET xp = GREATEST(0, xp - 1) WHERE id = $1', [ownerId]);
                await query('UPDATE profiles SET xp = GREATEST(0, xp - 1) WHERE id = $1', [user.id]);
            }

            revalidatePath('/cinema');
            return { liked: false };
        } else {
            // LIKE
            await query('INSERT INTO cinema_likes (user_id, video_id) VALUES ($1, $2)', [user.id, videoId]);

            // Increase XP (Link Economy) - Only if not self-like
            if (ownerId !== user.id) {
                // REVERTED: XP is for GIVER now.
                // await query('UPDATE profiles SET xp = xp + 1 WHERE id = $1', [ownerId]);
                await query('UPDATE profiles SET xp = xp + 1 WHERE id = $1', [user.id]);
            }

            revalidatePath('/cinema');
            return { liked: true };
        }
    } catch (error) {
        console.error("Toggle Like Error", error);
        return { error: "Failed" };
    }
}

export async function getCinemaFeed() {
    try {
        const user = await getSessionUser();
        const userId = user?.id || null;

        const { rows } = await query(
            `SELECT 
                v.id, 
                v.title, 
                v.description, 
                v.video_url, 
                v.thumbnail_url,
                v.category,
                v.created_at,
                v.format,
                v.music_metadata,
                u.id as creator_id,
                u.name as creator_name,
                u.image as creator_avatar,
                (SELECT COUNT(*) FROM cinema_likes l WHERE l.video_id = v.id) as like_count,
                ${userId ? `(EXISTS(SELECT 1 FROM cinema_likes l WHERE l.video_id = v.id AND l.user_id = $1))` : 'false'} as liked_by_user,
                ${userId ? `(EXISTS(SELECT 1 FROM follows f WHERE f.follower_id = $1 AND f.following_id = u.id))` : 'false'} as is_following
             FROM cinema_videos v
             LEFT JOIN "user" u ON v.user_id = u.id
             WHERE v.status = 'approved' AND v.video_url IS NOT NULL AND (v.archived IS FALSE OR v.archived IS NULL)
             ORDER BY v.created_at DESC
             LIMIT 50`,
            userId ? [userId] : []
        );

        return rows.map(row => {
            // Respect the Database Value purely.
            const effectiveFormat = row.format || 'horizontal';

            // like_count comes as string from COUNT
            const likes = parseInt(row.like_count || '0');

            return {
                id: row.id,
                title: row.title,
                creatorId: row.creator_id,
                creator: row.creator_name || "Unknown Driver",
                avatar: row.creator_avatar || "",
                videoUrl: row.video_url,
                poster: row.thumbnail_url || "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop",
                likes: likes, // REAL LIKES
                liked_by_user: row.liked_by_user, // REAL STATUS
                isFollowing: row.is_following, // REAL FOLLOW STATUS
                comments: 0, // Pending comments
                description: row.description,
                format: effectiveFormat,
                music_metadata: row.music_metadata,
                archived: row.archived || false,
                created_at: row.created_at // Expose Date for sorting
            };
        });
    } catch (e) {
        console.error("Error fetching cinema feed:", e);
        return [];
    }
}

export async function archiveVideo(id: string) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    // Verify ownership
    const { rows } = await query('SELECT user_id, archived FROM cinema_videos WHERE id = $1', [id]);
    if (rows.length === 0) throw new Error("Not found");
    if (rows[0].user_id !== user.id) throw new Error("Forbidden");

    const newArchivedState = !rows[0].archived;

    await query(
        'UPDATE cinema_videos SET archived = $1 WHERE id = $2',
        [newArchivedState, id]
    );

    revalidatePath('/cinema');
    return { success: true, archived: newArchivedState };
}

export async function deleteVideo(id: string) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    // Verify ownership
    const { rows } = await query('SELECT user_id FROM cinema_videos WHERE id = $1', [id]);
    if (rows.length === 0) throw new Error("Not found");
    if (rows[0].user_id !== user.id) throw new Error("Forbidden");

    await query('DELETE FROM cinema_videos WHERE id = $1', [id]);

    revalidatePath('/cinema');
    return { success: true };
}

