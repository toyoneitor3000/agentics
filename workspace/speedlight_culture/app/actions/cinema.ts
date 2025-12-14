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

interface CinemaVideoData {
    title: string;
    description: string;
    video_url: string;
    thumbnail_url?: string;
    category?: string;
}

export async function submitVideo(data: CinemaVideoData) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    try {
        await query(
            `INSERT INTO cinema_videos (user_id, title, description, video_url, thumbnail_url, category, status) 
             VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
            [
                user.id,
                data.title,
                data.description,
                data.video_url,
                data.thumbnail_url || null,
                data.category || 'General'
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

export async function getCinemaFeed() {
    try {
        const { rows } = await query(
            `SELECT 
                v.id, 
                v.title, 
                v.description, 
                v.video_url, 
                v.thumbnail_url,
                v.category,
                v.created_at,
                u.name as creator_name,
                u.image as creator_avatar
             FROM cinema_videos v
             LEFT JOIN "user" u ON v.user_id = u.id
             ORDER BY v.created_at DESC`
        );

        return rows.map(row => ({
            id: row.id,
            title: row.title,
            creator: row.creator_name || "Unknown Driver",
            avatar: row.creator_avatar || "",
            videoUrl: row.video_url,
            poster: row.thumbnail_url || "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop", // Fallback
            likes: Math.floor(Math.random() * 1000), // Mock for now
            comments: Math.floor(Math.random() * 100), // Mock for now
            description: row.description
        }));
    } catch (e) {
        console.error("Error fetching cinema feed:", e);
        return [];
    }
}
