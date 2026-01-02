'use server';

import { query } from "@/app/lib/db";
import { auth } from "@/app/lib/auth"; // Assuming this exists or similar from social.ts
import { headers } from "next/headers";

// Helper to get current user
async function getSessionUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session?.user;
}

export async function getConversations() {
    const user = await getSessionUser();
    if (!user) return [];

    try {
        // Complex query to get conversations + other user details
        const sql = `
            SELECT 
                c.id, 
                c.last_message, 
                c.last_message_at,
                p.username as other_username,
                p.avatar_url as other_avatar,
                p.full_name as other_name,
                p.id as other_user_id
            FROM conversations c
            JOIN conversation_participants cp_me ON c.id = cp_me.conversation_id
            JOIN conversation_participants cp_other ON c.id = cp_other.conversation_id
            JOIN profiles p ON cp_other.user_id = p.id
            WHERE cp_me.user_id = $1
            AND cp_other.user_id != $1
            ORDER BY c.last_message_at DESC NULLS LAST
        `;
        const { rows } = await query(sql, [user.id]);
        return rows;
    } catch (e) {
        console.error("Error fetching conversations:", e);
        return [];
    }
}

export async function getMessages(conversationId: string) {
    const user = await getSessionUser();
    if (!user) return [];

    try {
        // Check access
        const accessCheck = `SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2`;
        const { rows: access } = await query(accessCheck, [conversationId, user.id]);
        if (access.length === 0) throw new Error("Unauthorized");

        const sql = `
            SELECT 
                m.*,
                p.username,
                p.avatar_url
            FROM messages m
            JOIN profiles p ON m.sender_id = p.id
            WHERE m.conversation_id = $1
            ORDER BY m.created_at ASC
        `;
        const { rows } = await query(sql, [conversationId]);
        return rows;
    } catch (e) {
        console.error("Error fetching messages:", e);
        return [];
    }
}

export async function sendMessage(conversationId: string, content: string, type: string = 'text') {
    const user = await getSessionUser();
    if (!user) return null;

    try {
        // Insert message
        const sql = `
            INSERT INTO messages (conversation_id, sender_id, content, type)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const { rows } = await query(sql, [conversationId, user.id, content, type]);
        const newMessage = rows[0];

        // Update conversation last_message
        await query(
            `UPDATE conversations SET last_message = $1, last_message_at = NOW() WHERE id = $2`,
            [type === 'text' ? content : `[${type}]`, conversationId]
        );

        return newMessage;
    } catch (e) {
        console.error("Error sending message:", e);
        throw e;
    }
}

export async function startConversation(targetUserId: string) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");
    if (user.id === targetUserId) throw new Error("Cannot chat with self");

    try {
        // 1. Check if conversation already exists between these two
        const checkSql = `
            SELECT c.id 
            FROM conversations c
            JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
            JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
            WHERE cp1.user_id = $1 AND cp2.user_id = $2
            LIMIT 1
        `;
        const { rows } = await query(checkSql, [user.id, targetUserId]);

        if (rows.length > 0) {
            return rows[0].id;
        }

        // 2. Create new conversation
        const { rows: newConvo } = await query(`INSERT INTO conversations DEFAULT VALUES RETURNING id`);
        const convoId = newConvo[0].id;

        // 3. Add participants
        await query(
            `INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)`,
            [convoId, user.id, targetUserId]
        );

        return convoId;
    } catch (e) {
        console.error("Error starting conversation:", e);
        throw e;
    }
}
