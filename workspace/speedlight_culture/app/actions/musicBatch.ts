'use server';

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { query } from "@/app/lib/db";
import crypto from 'crypto';

async function getUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session?.user;
}

/**
 * Get all videos that need music identification
 */
export async function getVideosWithoutMusic() {
    const user = await getUser();
    if (!user || user.email !== 'speedlightculture@gmail.com') {
        return { error: "Unauthorized" };
    }

    const { rows } = await query(`
        SELECT id, title, video_url, music_metadata 
        FROM cinema_videos 
        WHERE (music_metadata IS NULL OR music_metadata->>'name' IS NULL OR music_metadata->>'name' = '')
        AND video_url IS NOT NULL
        AND status = 'approved'
        ORDER BY created_at DESC
    `);

    return {
        videos: rows.map(r => ({
            id: r.id,
            title: r.title,
            videoUrl: r.video_url
        })),
        total: rows.length
    };
}

/**
 * Update music metadata for a specific video
 */
export async function updateVideoMusic(videoId: string, musicData: { name: string; artist: string }) {
    const user = await getUser();
    if (!user || user.email !== 'speedlightculture@gmail.com') {
        return { error: "Unauthorized" };
    }

    if (!musicData.name || !musicData.artist) {
        return { error: "Invalid music data" };
    }

    await query(
        `UPDATE cinema_videos SET music_metadata = $1 WHERE id = $2`,
        [JSON.stringify(musicData), videoId]
    );

    return { success: true };
}

/**
 * Server-side music identification using ACRCloud
 * Takes base64 encoded audio
 */
export async function identifyMusicFromAudio(audioBase64: string): Promise<{ success: boolean; data?: { name: string; artist: string }; error?: string }> {
    const user = await getUser();
    if (!user || user.email !== 'speedlightculture@gmail.com') {
        return { success: false, error: "Unauthorized" };
    }

    const host = process.env.ACRCLOUD_HOST;
    const access_key = process.env.ACRCLOUD_ACCESS_KEY;
    const access_secret = process.env.ACRCLOUD_SECRET_KEY;

    if (!host || !access_key || !access_secret) {
        return {
            success: false,
            error: "ACRCloud no configurado. Añade ACRCLOUD_HOST, ACRCLOUD_ACCESS_KEY, ACRCLOUD_SECRET_KEY en .env"
        };
    }

    try {
        const buffer = Buffer.from(audioBase64, 'base64');

        const timestamp = Math.floor(Date.now() / 1000).toString();
        const method = 'POST';
        const uri = '/v1/identify';
        const signature_version = '1';
        const data_type = 'audio';

        const stringToSign = [method, uri, access_key, signature_version, timestamp].join('\n');
        const signature = crypto.createHmac('sha1', access_secret)
            .update(stringToSign)
            .digest('base64');

        const formData = new FormData();
        formData.append('sample', new Blob([buffer]), 'sample.mp3');
        formData.append('access_key', access_key);
        formData.append('data_type', data_type);
        formData.append('signature_version', signature_version);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp);

        const res = await fetch(`https://${host}${uri}`, {
            method: 'POST',
            body: formData as any
        });

        const data = await res.json();

        if (data.status?.code === 0 && data.metadata?.music?.length > 0) {
            const track = data.metadata.music[0];
            return {
                success: true,
                data: {
                    name: track.title,
                    artist: track.artists?.map((a: any) => a.name).join(', ') || 'Unknown'
                }
            };
        } else {
            return { success: false, error: "No se encontró coincidencia" };
        }

    } catch (e: any) {
        console.error("ACRCloud Error:", e);
        return { success: false, error: "Error de conexión" };
    }
}
