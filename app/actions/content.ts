'use server';

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Initialize Admin Client for DB Operations (Bypassing RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ContentType = 'projects' | 'gallery_albums' | 'events' | 'cinema_videos';

async function getSession() {
    return await auth.api.getSession({
        headers: await headers()
    });
}

export async function archiveContent(type: ContentType, id: string, setArchived: boolean) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    // Verify ownership
    // CRITICAL FIX: We must only select the column that exists for this specific table type.
    const ownerColumn = type === 'events' ? 'created_by' : 'user_id';

    const { data: item, error: fetchError } = await supabaseAdmin
        .from(type)
        .select(ownerColumn)
        .eq('id', id)
        .single();

    if (fetchError || !item) {
        console.error("Archive Error:", fetchError);
        throw new Error("Item not found or access denied");
    }

    const ownerId = (item as any)[ownerColumn];
    if (ownerId !== session.user.id) {
        throw new Error("Forbidden");
    }

    // Execute Update
    const { error } = await supabaseAdmin
        .from(type)
        .update({ archived: setArchived })
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/profile');
    return { success: true };
}

export async function deleteContent(type: ContentType, id: string) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    // Verify ownership
    // CRITICAL FIX: We must only select the column that exists for this specific table type.
    // Querying for 'created_by' on 'cinema_videos' will CRASH the query.
    const ownerColumn = type === 'events' ? 'created_by' : 'user_id';

    const { data: item, error: fetchError } = await supabaseAdmin
        .from(type)
        .select(ownerColumn)
        .eq('id', id)
        .single();

    if (fetchError || !item) {
        console.error("Delete Error:", fetchError);
        throw new Error("Item not found or access denied");
    }

    const ownerId = (item as any)[ownerColumn];
    if (ownerId !== session.user.id) {
        throw new Error("Forbidden");
    }

    // Execute Delete
    // IF it's a video, we do a SOFT DELETE (move to Deleted category)
    if (type === 'cinema_videos') {
        const { error } = await supabaseAdmin
            .from(type)
            .update({ category: 'Deleted' })
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    } else {
        // Execute Hard Delete
        const { error } = await supabaseAdmin
            .from(type)
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }

    revalidatePath('/profile');
    revalidatePath('/settings');
    return { success: true };
}

export async function bulkDeleteContent(type: ContentType, ids: string[]) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const ownerColumn = type === 'events' ? 'created_by' : 'user_id';

    const { data: items, error: fetchError } = await supabaseAdmin
        .from(type)
        .select(`id, ${ownerColumn}`)
        .in('id', ids);

    if (fetchError || !items) throw new Error("Error verifying items");

    const allOwned = items.every((item: any) => item[ownerColumn] === session.user.id);
    if (!allOwned) throw new Error("Forbidden");

    const { error } = await supabaseAdmin
        .from(type)
        .delete()
        .in('id', ids);

    if (error) throw new Error(error.message);

    revalidatePath('/profile');
    return { success: true };
}

export async function bulkArchiveContent(type: ContentType, ids: string[], setArchived: boolean) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const ownerColumn = type === 'events' ? 'created_by' : 'user_id';

    const { data: items, error: fetchError } = await supabaseAdmin
        .from(type)
        .select(`id, ${ownerColumn}`)
        .in('id', ids);

    if (fetchError || !items) throw new Error("Error verifying items");

    const allOwned = items.every((item: any) => item[ownerColumn] === session.user.id);
    if (!allOwned) throw new Error("Forbidden");

    const { error } = await supabaseAdmin
        .from(type)
        .update({ archived: setArchived })
        .in('id', ids);

    if (error) throw new Error(error.message);

    revalidatePath('/profile');
    return { success: true };
}

export async function bulkUpdateFormat(type: ContentType, ids: string[], format: 'horizontal' | 'vertical') {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    // Only applicable to cinema_videos for now
    if (type !== 'cinema_videos') throw new Error("Format update only supported for videos");

    const ownerColumn = 'user_id';

    const { data: items, error: fetchError } = await supabaseAdmin
        .from(type)
        .select(`id, ${ownerColumn}`)
        .in('id', ids);

    if (fetchError || !items) throw new Error("Error verifying items");

    const allOwned = items.every((item: any) => item[ownerColumn] === session.user.id);
    if (!allOwned) throw new Error("Forbidden");

    const { error } = await supabaseAdmin
        .from(type)
        .update({ format: format })
        .in('id', ids);

    if (error) throw new Error(error.message);

    revalidatePath('/profile');
    revalidatePath('/cinema');
    return { success: true };
}
