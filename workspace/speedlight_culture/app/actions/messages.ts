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

        // Updated query to handle both 1-on-1 and Group chats
        const sql = `
            SELECT 
                c.id, 
                c.last_message, 
                c.last_message_at,
                c.is_group,
                c.name as group_name,
                c.group_image,
                -- For 1-on-1, pick the other participant's details
                -- We use an aggregation or a subquery to pick one 'other' user for display logic if needed for group previews too, 
                -- but mainly for 1-1 it matters.
                CASE WHEN c.is_group THEN NULL ELSE p.username END as other_username,
                CASE WHEN c.is_group THEN NULL ELSE p.avatar_url END as other_avatar,
                CASE WHEN c.is_group THEN NULL ELSE p.full_name END as other_name,
                CASE WHEN c.is_group THEN NULL ELSE p.id END as other_user_id
            FROM conversations c
            JOIN conversation_participants cp_me ON c.id = cp_me.conversation_id
            -- Left join for other participants to handle 1-on-1 specific fields
            LEFT JOIN conversation_participants cp_other ON c.id = cp_other.conversation_id AND cp_other.user_id != $1
            LEFT JOIN profiles p ON cp_other.user_id = p.id
            WHERE cp_me.user_id = $1
            -- Ensure we don't get duplicates for groups by grouping or distinct
            -- For 1-on-1 this logic was fine because there's only 1 'other'. 
            -- For groups, there are many. We need to respect that.
            -- Simplest fix: Distinct on Conversation ID
            GROUP BY c.id, c.last_message, c.last_message_at, c.is_group, c.name, c.group_image, p.username, p.avatar_url, p.full_name, p.id
            -- If it's a group, we might get multiple rows due to multiple 'other' participants if we are not careful with the Join.
            -- Actually, if we want one row per conversation:
            ORDER BY c.last_message_at DESC NULLS LAST
        `;

        // Refined Query to avoid duplicates in groups:
        // We select the underlying conversation.
        // If it's 1-on-1, joined profile is the other person.
        // If it's group, we rely on c.name and c.group_image.
        const refinedSql = `
            WITH other_participant AS (
                SELECT cp.conversation_id, p.username, p.avatar_url, p.full_name, p.id
                FROM conversation_participants cp
                JOIN profiles p ON cp.user_id = p.id
                WHERE cp.user_id != $1
                -- Limit to 1 for 1-on-1 logic to avoid duplication
            )
            SELECT DISTINCT ON (c.id)
                c.id,
                c.last_message,
                c.last_message_at,
                c.is_group,
                c.name as group_name,
                c.group_image,
                op.username as other_username,
                op.avatar_url as other_avatar,
                op.full_name as other_name,
                op.id as other_user_id
            FROM conversations c
            JOIN conversation_participants cp_me ON c.id = cp_me.conversation_id
            LEFT JOIN other_participant op ON c.id = op.conversation_id
            WHERE cp_me.user_id = $1
            ORDER BY c.id, c.last_message_at DESC NULLS LAST
        `;

        // To keep ordering right, we should sort in JS or use a better query structure.
        // Recursive sort is tricky with DISTINCT ON.
        // Let's stick to a simpler approach: 
        const finalSql = `
            SELECT 
                c.id, 
                c.last_message, 
                c.last_message_at,
                c.is_group,
                c.name as group_name,
                c.group_image,
                (SELECT username FROM profiles p JOIN conversation_participants cp ON p.id = cp.user_id WHERE cp.conversation_id = c.id AND cp.user_id != $1 LIMIT 1) as other_username,
                (SELECT avatar_url FROM profiles p JOIN conversation_participants cp ON p.id = cp.user_id WHERE cp.conversation_id = c.id AND cp.user_id != $1 LIMIT 1) as other_avatar,
                (SELECT full_name FROM profiles p JOIN conversation_participants cp ON p.id = cp.user_id WHERE cp.conversation_id = c.id AND cp.user_id != $1 LIMIT 1) as other_name,
                (SELECT id FROM profiles p JOIN conversation_participants cp ON p.id = cp.user_id WHERE cp.conversation_id = c.id AND cp.user_id != $1 LIMIT 1) as other_user_id
            FROM conversations c
            JOIN conversation_participants cp_me ON c.id = cp_me.conversation_id
            WHERE cp_me.user_id = $1
            ORDER BY c.last_message_at DESC NULLS LAST
        `;

        const { rows } = await query(finalSql, [user.id]);
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

export async function getFollowingContacts() {
    const user = await getSessionUser();
    if (!user) return [];

    try {
        const sql = `
            SELECT 
                p.id, 
                p.username, 
                p.full_name, 
                p.avatar_url,
                'following' as relationship
            FROM profiles p
            JOIN follows f ON f.following_id = p.id
            WHERE f.follower_id = $1
            ORDER BY p.username ASC
        `;
        const { rows } = await query(sql, [user.id]);
        return rows;
    } catch (e) {
        console.error("Error fetching following:", e);
        return [];
    }
}

export async function createGroupConversation(name: string, participantIds: string[]) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    // Add self to participants if not included (though UI should handle this)
    const allParticipants = Array.from(new Set([...participantIds, user.id]));

    if (allParticipants.length < 2) {
        throw new Error("Group must have at least 2 participants");
    }

    try {
        // Create conversation
        const { rows: newConvo } = await query(
            `INSERT INTO conversations (is_group, name, owner_id) VALUES (TRUE, $1, $2) RETURNING id`,
            [name, user.id]
        );
        const convoId = newConvo[0].id;

        // Add all participants
        const values = allParticipants.map((_, i) => `($1, $${i + 2})`).join(",");
        await query(
            `INSERT INTO conversation_participants (conversation_id, user_id) VALUES ${values}`,
            [convoId, ...allParticipants]
        );

        return convoId;
    } catch (e) {
        console.error("Error creating group:", e);
        throw e;
    }
}
