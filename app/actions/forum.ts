"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================
// TIPOS
// ============================================
export interface ForumPost {
    id: string;
    user_id: string;
    category: string;
    title: string;
    content: string;
    created_at: string;
    is_pinned?: boolean;
    views_count?: number;
    author?: {
        id: string;
        name: string;
        avatar_url: string | null;
        role: string | null;
    };
    replies_count?: number;
    last_activity?: string;
}

export interface ForumReply {
    id: string;
    user_id: string;
    target_type: string;
    target_id: string;
    content: string;
    created_at: string;
    author?: {
        id: string;
        name: string;
        avatar_url: string | null;
        role: string | null;
    };
}

// ============================================
// OBTENER POSTS DEL FORO
// ============================================
export async function getForumPosts(options?: {
    category?: string;
    limit?: number;
    search?: string;
}): Promise<ForumPost[]> {
<<<<<<< HEAD:workspace/speedlight_culture/app/actions/forum.ts
    const supabase = await createClient();
=======
    const supabase = await createServerClient();
>>>>>>> f366e8b6e529866b08bd4a287d50845372017710:app/actions/forum.ts
    const limit = options?.limit || 50;

    let query = supabase
        .from("forum_posts")
        .select(`
            id,
            user_id,
            category,
            title,
            content,
            created_at,
            is_pinned,
            views_count,
            profiles!forum_posts_user_id_fkey (
                id,
                name,
                avatar_url,
                role
            )
        `)
        .order("is_pinned", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(limit);

    // Filtrar por categoría si se especifica
    if (options?.category && options.category !== "all") {
        query = query.eq("category", options.category);
    }

    // Búsqueda por título o contenido
    if (options?.search) {
        query = query.or(`title.ilike.%${options.search}%,content.ilike.%${options.search}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching forum posts:", error);
        return [];
    }

    // Obtener conteos de respuestas para cada post
    const postsWithReplies = await Promise.all(
        (data || []).map(async (post: any) => {
            const { count } = await supabase
                .from("comments")
                .select("*", { count: "exact", head: true })
                .eq("target_type", "post")
                .eq("target_id", post.id);

            // Obtener última actividad (último comentario)
            const { data: lastComment } = await supabase
                .from("comments")
                .select("created_at")
                .eq("target_type", "post")
                .eq("target_id", post.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            return {
                ...post,
                author: post.profiles,
                replies_count: count || 0,
                last_activity: lastComment?.created_at || post.created_at,
            };
        })
    );

    return postsWithReplies;
}

// ============================================
// OBTENER UN POST ESPECÍFICO
// ============================================
export async function getForumPost(postId: string): Promise<ForumPost | null> {
<<<<<<< HEAD:workspace/speedlight_culture/app/actions/forum.ts
    const supabase = await createClient();
=======
    const supabase = await createServerClient();
>>>>>>> f366e8b6e529866b08bd4a287d50845372017710:app/actions/forum.ts

    const { data, error } = await supabase
        .from("forum_posts")
        .select(`
            id,
            user_id,
            category,
            title,
            content,
            created_at,
            is_pinned,
            views_count,
            profiles!forum_posts_user_id_fkey (
                id,
                name,
                avatar_url,
                role
            )
        `)
        .eq("id", postId)
        .single();

    if (error || !data) {
        console.error("Error fetching forum post:", error);
        return null;
    }

    // Incrementar contador de vistas
    await supabase
        .from("forum_posts")
        .update({ views_count: ((data as any).views_count || 0) + 1 })
        .eq("id", postId);

    // Obtener conteo de respuestas
    const { count } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("target_type", "post")
        .eq("target_id", postId);

    return {
        ...data,
        author: (data as any).profiles,
        replies_count: count || 0,
    } as ForumPost;
}

// ============================================
// CREAR NUEVO POST
// ============================================
export async function createForumPost(formData: {
    title: string;
    content: string;
    category: string;
}): Promise<{ success: boolean; postId?: string; error?: string }> {
<<<<<<< HEAD:workspace/speedlight_culture/app/actions/forum.ts
    const supabase = await createClient();
=======
    const supabase = await createServerClient();
>>>>>>> f366e8b6e529866b08bd4a287d50845372017710:app/actions/forum.ts

    // Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "Debes iniciar sesión para publicar" };
    }

    // Validaciones
    if (!formData.title?.trim() || formData.title.length < 5) {
        return { success: false, error: "El título debe tener al menos 5 caracteres" };
    }
    if (!formData.content?.trim() || formData.content.length < 10) {
        return { success: false, error: "El contenido debe tener al menos 10 caracteres" };
    }
    if (!formData.category) {
        return { success: false, error: "Debes seleccionar una categoría" };
    }

    const { data, error } = await supabase
        .from("forum_posts")
        .insert({
            user_id: user.id,
            title: formData.title.trim(),
            content: formData.content.trim(),
            category: formData.category,
            views_count: 0,
            is_pinned: false,
        })
        .select("id")
        .single();

    if (error) {
        console.error("Error creating forum post:", error);
        return { success: false, error: "Error al crear el post. Intenta de nuevo." };
    }

    revalidatePath("/forum");
    return { success: true, postId: data.id };
}

// ============================================
// OBTENER RESPUESTAS DE UN POST
// ============================================
export async function getPostReplies(postId: string): Promise<ForumReply[]> {
<<<<<<< HEAD:workspace/speedlight_culture/app/actions/forum.ts
    const supabase = await createClient();
=======
    const supabase = await createServerClient();
>>>>>>> f366e8b6e529866b08bd4a287d50845372017710:app/actions/forum.ts

    const { data, error } = await supabase
        .from("comments")
        .select(`
            id,
            user_id,
            target_type,
            target_id,
            content,
            created_at,
            profiles!comments_user_id_fkey (
                id,
                name,
                avatar_url,
                role
            )
        `)
        .eq("target_type", "post")
        .eq("target_id", postId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching replies:", error);
        return [];
    }

    return (data || []).map((reply: any) => ({
        ...reply,
        author: reply.profiles,
    }));
}

// ============================================
// CREAR RESPUESTA
// ============================================
export async function createReply(
    postId: string,
    content: string
): Promise<{ success: boolean; error?: string }> {
<<<<<<< HEAD:workspace/speedlight_culture/app/actions/forum.ts
    const supabase = await createClient();
=======
    const supabase = await createServerClient();
>>>>>>> f366e8b6e529866b08bd4a287d50845372017710:app/actions/forum.ts

    // Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "Debes iniciar sesión para responder" };
    }

    if (!content?.trim() || content.length < 2) {
        return { success: false, error: "La respuesta debe tener al menos 2 caracteres" };
    }

    const { error } = await supabase
        .from("comments")
        .insert({
            user_id: user.id,
            target_type: "post",
            target_id: postId,
            content: content.trim(),
        });

    if (error) {
        console.error("Error creating reply:", error);
        return { success: false, error: "Error al publicar la respuesta" };
    }

    revalidatePath(`/forum/${postId}`);
    revalidatePath("/forum");
    return { success: true };
}

// ============================================
// ESTADÍSTICAS DEL FORO
// ============================================
export async function getForumStats(): Promise<{
    totalPosts: number;
    totalReplies: number;
    totalMembers: number;
    onlineNow: number;
}> {
<<<<<<< HEAD:workspace/speedlight_culture/app/actions/forum.ts
    const supabase = await createClient();
=======
    const supabase = await createServerClient();
>>>>>>> f366e8b6e529866b08bd4a287d50845372017710:app/actions/forum.ts

    // Contar posts
    const { count: postsCount } = await supabase
        .from("forum_posts")
        .select("*", { count: "exact", head: true });

    // Contar respuestas (comments con target_type = 'post')
    const { count: repliesCount } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("target_type", "post");

    // Contar miembros
    const { count: membersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

    // Usuarios activos en las últimas 24 horas (aproximación)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: activeUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("updated_at", twentyFourHoursAgo);

    return {
        totalPosts: postsCount || 0,
        totalReplies: repliesCount || 0,
        totalMembers: membersCount || 0,
        onlineNow: activeUsers || Math.floor(Math.random() * 50) + 10, // Fallback si no hay datos
    };
}

// ============================================
// ESTADÍSTICAS POR CATEGORÍA
// ============================================
export async function getCategoryStats(): Promise<{ category: string; count: number }[]> {
<<<<<<< HEAD:workspace/speedlight_culture/app/actions/forum.ts
    const supabase = await createClient();
=======
    const supabase = await createServerClient();
>>>>>>> f366e8b6e529866b08bd4a287d50845372017710:app/actions/forum.ts

    const { data, error } = await supabase
        .from("forum_posts")
        .select("category");

    if (error || !data) return [];

    // Agrupar por categoría
    const stats: Record<string, number> = {};
    data.forEach((post: { category: string }) => {
        stats[post.category] = (stats[post.category] || 0) + 1;
    });

    return Object.entries(stats).map(([category, count]) => ({ category, count }));
}

// ============================================
// PIN/UNPIN POST (Solo admins)
// ============================================
export async function togglePinPost(postId: string): Promise<{ success: boolean; error?: string }> {
<<<<<<< HEAD:workspace/speedlight_culture/app/actions/forum.ts
    const supabase = await createClient();
=======
    const supabase = await createServerClient();
>>>>>>> f366e8b6e529866b08bd4a287d50845372017710:app/actions/forum.ts

    // Verificar que el usuario es admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "No autorizado" };
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || !["CEO", "ADMIN"].includes(profile.role)) {
        return { success: false, error: "No tienes permisos para fijar posts" };
    }

    // Obtener estado actual
    const { data: post } = await supabase
        .from("forum_posts")
        .select("is_pinned")
        .eq("id", postId)
        .single();

    if (!post) {
        return { success: false, error: "Post no encontrado" };
    }

    // Toggle
    const { error } = await supabase
        .from("forum_posts")
        .update({ is_pinned: !post.is_pinned })
        .eq("id", postId);

    if (error) {
        console.error("Error toggling pin:", error);
        return { success: false, error: "Error al fijar/desfijar el post" };
    }

    revalidatePath("/forum");
    return { success: true };
}

// ============================================
// ELIMINAR POST (Solo admins o autor)
// ============================================
export async function deleteForumPost(postId: string): Promise<{ success: boolean; error?: string }> {
<<<<<<< HEAD:workspace/speedlight_culture/app/actions/forum.ts
    const supabase = await createClient();
=======
    const supabase = await createServerClient();
>>>>>>> f366e8b6e529866b08bd4a287d50845372017710:app/actions/forum.ts

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "No autorizado" };
    }

    // Verificar permisos
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    const { data: post } = await supabase
        .from("forum_posts")
        .select("user_id")
        .eq("id", postId)
        .single();

    if (!post) {
        return { success: false, error: "Post no encontrado" };
    }

    const isAdmin = profile && ["CEO", "ADMIN"].includes(profile.role);
    const isAuthor = post.user_id === user.id;

    if (!isAdmin && !isAuthor) {
        return { success: false, error: "No tienes permisos para eliminar este post" };
    }

    // Eliminar primero los comentarios asociados
    await supabase
        .from("comments")
        .delete()
        .eq("target_type", "post")
        .eq("target_id", postId);

    // Eliminar el post
    const { error } = await supabase
        .from("forum_posts")
        .delete()
        .eq("id", postId);

    if (error) {
        console.error("Error deleting post:", error);
        return { success: false, error: "Error al eliminar el post" };
    }

    revalidatePath("/forum");
    return { success: true };
}
