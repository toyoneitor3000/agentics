'use server'

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { query } from "@/app/lib/db";

async function getSessionUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session?.user;
}

export async function getNotifications() {
    const user = await getSessionUser();
    if (!user) return [];

    try {
        const { rows } = await query(
            `SELECT 
                n.id, 
                n.type, 
                n.target_id, 
                n.target_type, 
                n.message, 
                n.is_read, 
                n.created_at,
                p.username as actor_username, 
                p.full_name as actor_full_name, 
                p.avatar_url as actor_avatar_url
             FROM notifications n
             LEFT JOIN profiles p ON n.actor_id = p.id
             WHERE n.recipient_id = $1
             ORDER BY n.created_at DESC
             LIMIT 50`,
            [user.id]
        );

        // Map to client-friendly structure
        return rows.map((row: any) => ({
            id: row.id,
            type: row.type,
            target_id: row.target_id,
            target_type: row.target_type,
            message: row.message,
            is_read: row.is_read,
            created_at: row.created_at,
            actor: {
                username: row.actor_username || 'Sistema',
                full_name: row.actor_full_name || 'Sistema',
                avatar_url: row.actor_avatar_url
            }
        }));

    } catch (e) {
        console.error("Error fetching notifications:", e);
        return [];
    }
}

export async function markNotificationRead(id: string) {
    const user = await getSessionUser();
    if (!user) return { success: false };

    try {
        await query(
            `UPDATE notifications SET is_read = true WHERE id = $1 AND recipient_id = $2`,
            [id, user.id]
        );
        return { success: true };
    } catch (e) {
        console.error("Error marking read:", e);
        return { success: false };
    }
}

export async function markAllNotificationsRead() {
    const user = await getSessionUser();
    if (!user) return { success: false };

    try {
        await query(
            `UPDATE notifications SET is_read = true WHERE recipient_id = $1`,
            [user.id]
        );
        return { success: true };
    } catch (e) {
        console.error("Error marking all read:", e);
        return { success: false };
    }
}

export async function deleteAllNotifications() {
    const user = await getSessionUser();
    if (!user) return { success: false };

    try {
        await query(
            `DELETE FROM notifications WHERE recipient_id = $1`,
            [user.id]
        );
        return { success: true };
    } catch (e) {
        console.error("Error deleting all notifications:", e);
        return { success: false };
    }
}
