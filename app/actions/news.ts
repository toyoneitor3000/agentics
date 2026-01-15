'use server'

import { query } from "@/app/lib/db";
import { exec } from 'child_process';
import { promisify } from 'util';
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const execAsync = promisify(exec);

export type Commit = {
    hash: string;
    author: string;
    date: string;
    message: string;
};

export async function getCommits(): Promise<Commit[]> {
    // 1. Try to fetch from local git log
    try {
        const { stdout } = await execAsync('git log -n 3 --pretty=format:\'%h|%an|%ad|%s\' --date=iso', { cwd: process.cwd() });
        // Format: hash|author|date|message
        const lines = stdout.trim().split('\n');
        return lines.map(line => {
            const parts = line.split('|');
            if (parts.length < 4) return null;
            const hash = parts[0];
            const author = parts[1];
            const date = parts[2];
            const message = parts.slice(3).join('|'); // Rejoin message in case it contained pipes
            return { hash, author, date, message };
        }).filter((c): c is Commit => c !== null);
    } catch (error) {
        console.error("Error fetching git log:", error);
        // Fallback or empty if no git
        return [];
    }
}

async function getSessionUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session?.user;
}

export async function publishNews(item: { title: string, content: string, category: string, commit_hash?: string }) {
    const user = await getSessionUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        // 1. Insert into News
        const { rows } = await query(
            `INSERT INTO speedlight_news (title, content, category, commit_hash, author_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, created_at`,
            [item.title, item.content, item.category, item.commit_hash, user.id]
        );
        const newsId = rows[0].id;

        // 2. Notify all users (Broadcast)
        // We will insert a notification for every user. This is potentially heavy for large apps but fine for MVP.
        // A better approach is "Global Notifications" where we query a separate table, but the current system is 1-to-1.
        // Let's see how many users there are. If < 1000, it's fine.

        // Fetch all user IDs
        const { rows: users } = await query(`SELECT id FROM auth.users`); // Or profiles? profiles is safer usually.
        // Wait, auth.users might not be accessible easily via query helper if it connects to postgres directly (it does).
        // But profiles table exists and is linked.
        const { rows: profiles } = await query(`SELECT id FROM profiles`);

        // Batch insert notifications?
        // Or one by one. Batch is better.
        // Construct values string
        // ($1, $2, ...), ($3, $4, ...)

        if (profiles.length > 0) {
            const values = [];
            const params = [];
            let pIndex = 1;

            for (const p of profiles) {
                // Ignore self? Or notify self too? Let's notify self too for confirmation.
                values.push(`($${pIndex}, $${pIndex + 1}, $${pIndex + 2}, $${pIndex + 3}, $${pIndex + 4}, $${pIndex + 5})`);
                params.push(
                    p.id, // recipient
                    null, // actor: NULL for anonymous "Speedlight Team" attribution
                    'system', // type: using 'system' or new 'news' type? existing types: like, comment, mention, follow, system. 'system' fits.
                    item.title, // message
                    newsId, // target_id
                    'news' // target_type
                );
                pIndex += 6;
            }

            const insertQuery = `
                INSERT INTO notifications (recipient_id, actor_id, type, message, target_id, target_type)
                VALUES ${values.join(', ')}
            `;

            await query(insertQuery, params);
        }


        // 3. Notify WhatsApp (Free API)
        await sendWhatsAppNotification(item.title);

        return { success: true, newsId };

    } catch (e: any) {
        console.error("Error publishing news:", e);
        return { success: false, error: e.message || "Failed to publish" };
    }
}

export async function getNews() {
    try {
        const { rows } = await query(`
            SELECT * FROM speedlight_news 
            ORDER BY published_at DESC 
            LIMIT 50
        `);
        return rows;
    } catch (e) {
        console.error("Error fetching news:", e);
        return [];
    }
}

export async function deleteNews(id: string) {
    const user = await getSessionUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        // 1. Delete associated notifications first (manual cascade)
        await query(`DELETE FROM notifications WHERE target_id = $1 AND target_type = 'news'`, [id]);

        // 2. Delete the news item
        await query(`DELETE FROM speedlight_news WHERE id = $1`, [id]);

        return { success: true };
    } catch (e: any) {
        console.error("Error deleting news:", e);
        return { success: false, error: e.message || "Failed to delete" };
    }
}

async function sendWhatsAppNotification(title: string) {
    const phone = process.env.WHATSAPP_PHONE;
    const apiKey = process.env.WHATSAPP_API_KEY;

    if (phone && apiKey) {
        try {
            const message = `🚨 *Speedlight News* 🚨\n\n${title}\n\nLee más en: https://speedlight_culture.com/news`;
            const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
            await fetch(url);
        } catch (error) {
            console.error("WhatsApp notification failed:", error);
        }
    }
}
