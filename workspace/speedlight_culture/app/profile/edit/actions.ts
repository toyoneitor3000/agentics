'use server';

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { query } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: {
    full_name: string;
    alias: string;
    bio: string;
    location: string;
    avatar_url: string;
    cover_url: string;
    show_location: boolean;
    show_join_date: boolean;
}) {
    // 1. Verify Session via BetterAuth
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    // 2. Direct SQL Update
    try {
        await query(
            `UPDATE profiles SET 
                full_name = $1,
                alias = $2,
                bio = $3,
                location = $4,
                avatar_url = $5,
                cover_url = $6,
                show_location = $7,
                show_join_date = $8,
                updated_at = NOW()
                WHERE id = $9`,
            [
                formData.full_name,
                formData.alias,
                formData.bio,
                formData.location,
                formData.avatar_url,
                formData.cover_url,
                formData.show_location,
                formData.show_join_date,
                userId
            ]
        );

        revalidatePath('/profile');
        return { success: true };
    } catch (error: any) {
        console.error("Database Error:", error);
        throw new Error("Failed to update profile: " + error.message);
    }
}
