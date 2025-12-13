'use server'

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { query } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

async function getSessionUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session?.user;
}

export async function toggleLike(projectId: string) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    try {
        // Check if liked
        const { rows } = await query(
            'SELECT * FROM project_likes WHERE project_id = $1 AND user_id = $2',
            [projectId, user.id]
        );

        if (rows.length > 0) {
            // Unlike
            await query(
                'DELETE FROM project_likes WHERE project_id = $1 AND user_id = $2',
                [projectId, user.id]
            );
            revalidatePath(`/projects/${projectId}`);
            return false;
        } else {
            // Like
            await query(
                'INSERT INTO project_likes (project_id, user_id) VALUES ($1, $2)',
                [projectId, user.id]
            );
            revalidatePath(`/projects/${projectId}`);
            return true;
        }
    } catch (e) {
        console.error('toggleLike Error:', e);
        throw e;
    }
}

export async function toggleSave(projectId: string) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    try {
        const { rows } = await query(
            'SELECT * FROM project_saves WHERE project_id = $1 AND user_id = $2',
            [projectId, user.id]
        );

        if (rows.length > 0) {
            await query(
                'DELETE FROM project_saves WHERE project_id = $1 AND user_id = $2',
                [projectId, user.id]
            );
            revalidatePath(`/projects/${projectId}`);
            return false;
        } else {
            await query(
                'INSERT INTO project_saves (project_id, user_id) VALUES ($1, $2)',
                [projectId, user.id]
            );
            revalidatePath(`/projects/${projectId}`);
            return true;
        }
    } catch (e) {
        console.error('toggleSave Error:', e);
        throw e;
    }
}

export async function logShare(projectId: string) {
    const user = await getSessionUser();
    // Share doesn't strictly require auth, but if logged in we track it
    const userId = user?.id || null;

    await query(
        'INSERT INTO project_shares (project_id, user_id, platform) VALUES ($1, $2, $3)',
        [projectId, userId, 'web_click']
    );
    revalidatePath(`/projects/${projectId}`);
    return true;
}

export async function toggleFollow(targetUserId: string) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    try {
        const { rows } = await query(
            'SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2',
            [user.id, targetUserId]
        );

        if (rows.length > 0) {
            // Unfollow
            await query(
                'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
                [user.id, targetUserId]
            );
            revalidatePath(`/profile/${targetUserId}`);
            return false;
        } else {
            // Follow
            await query(
                'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
                [user.id, targetUserId]
            );
            revalidatePath(`/profile/${targetUserId}`);
            return true;
        }
    } catch (e) {
        console.error('toggleFollow Error:', e);
        throw e;
    }
}

export async function postComment(projectId: string, content: string, rating: number, parentId?: string) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    try {
        await query(
            'INSERT INTO project_comments (project_id, user_id, content, rating, parent_id) VALUES ($1, $2, $3, $4, $5)',
            [projectId, user.id, content, rating, parentId || null]
        );
        revalidatePath(`/projects/${projectId}`);
        return true;
    } catch (e) {
        console.error('postComment Error:', e);
        throw e;
    }
}

export async function updateComment(commentId: string, content: string) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    try {
        const { rows } = await query(
            'UPDATE project_comments SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING project_id',
            [content, commentId, user.id]
        );
        if (rows.length > 0) {
            revalidatePath(`/projects/${rows[0].project_id}`);
            return true;
        }
        return false;
    } catch (e) {
        console.error('updateComment Error:', e);
        throw e;
    }
}

export async function deleteComment(commentId: string) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    try {
        const { rows } = await query(
            'DELETE FROM project_comments WHERE id = $1 AND user_id = $2 RETURNING project_id',
            [commentId, user.id]
        );
        if (rows.length > 0) {
            revalidatePath(`/projects/${rows[0].project_id}`);
            return true;
        }
        return false;
    } catch (e) {
        console.error('deleteComment Error:', e);
        throw e;
    }
}

export async function toggleCommentLike(commentId: string) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    try {
        const { rows } = await query(
            'SELECT * FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
            [commentId, user.id]
        );

        if (rows.length > 0) {
            // Unlike
            await query(
                'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2 RETURNING comment_id',
                [commentId, user.id]
            );
            const { rows: commentRows } = await query('SELECT project_id FROM project_comments WHERE id = $1', [commentId]);
            if (commentRows.length > 0) {
                revalidatePath(`/projects/${commentRows[0].project_id}`);
            }
            return false;
        } else {
            // Like
            await query(
                'INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2)',
                [commentId, user.id]
            );
            const { rows: commentRows } = await query('SELECT project_id FROM project_comments WHERE id = $1', [commentId]);
            if (commentRows.length > 0) {
                revalidatePath(`/projects/${commentRows[0].project_id}`);
            }
            return true;
        }
    } catch (e) {
        console.error('toggleCommentLike Error:', e);
        throw e;
    }
}

export async function sendGift(projectId: string, giftId: string) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    try {
        // Client code used sender_id. I will use sender_id.
        await query(
            'INSERT INTO project_gifts (project_id, gift_id, sender_id) VALUES ($1, $2, $3)',
            [projectId, giftId, user.id]
        );
        revalidatePath(`/projects/${projectId}`);
        return true;
    } catch (e) {
        console.error('sendGift Error:', e);
        throw e;
    }
}
