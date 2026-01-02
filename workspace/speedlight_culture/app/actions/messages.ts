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

export async function markMessagesAsDelivered(conversationId: string) {
    const user = await getSessionUser();
    if (!user) return;

    try {
        await query(
            `UPDATE messages 
             SET delivered_at = NOW() 
             WHERE conversation_id = $1 
             AND sender_id != $2 
             AND delivered_at IS NULL`,
            [conversationId, user.id]
        );
    } catch (e) {
        console.error("Error marking messages as delivered:", e);
    }
}

export async function markMessagesAsRead(conversationId: string) {
    const user = await getSessionUser();
    if (!user) return;

    try {
        await query(
            `UPDATE messages 
             SET read_at = NOW(), delivered_at = COALESCE(delivered_at, NOW())
             WHERE conversation_id = $1 
             AND sender_id != $2 
             AND read_at IS NULL`,
            [conversationId, user.id]
        );
    } catch (e) {
        console.error("Error marking messages as read:", e);
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

export async function searchUsers(queryStr: string) {
    const user = await getSessionUser();
    if (!user) return [];

    if (!queryStr || queryStr.trim().length === 0) return [];

    try {
        // Search users by name/username
        // Prioritize: 
        // 1. Mutual follows
        // 2. People I follow
        // 3. Others
        const sql = `
            SELECT 
                p.id, 
                p.username, 
                p.full_name, 
                p.avatar_url,
                CASE 
                    WHEN f1.follower_id IS NOT NULL AND f2.follower_id IS NOT NULL THEN 'mutual'
                    WHEN f1.follower_id IS NOT NULL THEN 'following'
                    ELSE 'none'
                END as relationship,
                CASE 
                    WHEN c.id IS NOT NULL THEN TRUE 
                    ELSE FALSE 
                END as has_conversation,
                c.id as conversation_id
            FROM profiles p
            LEFT JOIN follows f1 ON f1.follower_id = $1 AND f1.following_id = p.id
            LEFT JOIN follows f2 ON f2.follower_id = p.id AND f2.following_id = $1
            LEFT JOIN conversation_participants cp_other ON p.id = cp_other.user_id
            LEFT JOIN conversation_participants cp_me ON cp_other.conversation_id = cp_me.conversation_id AND cp_me.user_id = $1
            LEFT JOIN conversations c ON cp_me.conversation_id = c.id
            WHERE p.id != $1
            AND (p.username ILIKE $2 OR p.full_name ILIKE $2)
            GROUP BY p.id, p.username, p.full_name, p.avatar_url, f1.follower_id, f2.follower_id, c.id
            ORDER BY 
                (CASE 
                    WHEN f1.follower_id IS NOT NULL AND f2.follower_id IS NOT NULL THEN 1
                    WHEN f1.follower_id IS NOT NULL THEN 2
                    ELSE 3
                END) ASC,
                p.username ASC
            LIMIT 10
        `;
        const { rows } = await query(sql, [user.id, `${queryStr}%`]);
        return rows;
    } catch (e) {
        console.error("Error searching users:", e);
        return [];
    }
}

export async function getSuggestedContacts() {
    const user = await getSessionUser();
    if (!user) return [];

    try {
        // Get mutual follows
        const sql = `
            SELECT 
                p.id, 
                p.username, 
                p.full_name, 
                p.avatar_url,
                'mutual' as relationship
            FROM profiles p
            JOIN follows f1 ON f1.follower_id = $1 AND f1.following_id = p.id
            JOIN follows f2 ON f2.follower_id = p.id AND f2.following_id = $1
            WHERE p.id != $1
            LIMIT 10
        `;
        const { rows } = await query(sql, [user.id]);
        return rows;
    } catch (e) {
        console.error("Error fetching suggestions:", e);
        return [];
    }
}
