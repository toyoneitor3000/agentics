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

interface ProjectData {
    title: string;
    make: string;
    model: string;
    year: number;
    description: string;
    location: string;
    specs: any;
}

export async function updateProject(projectId: string, data: ProjectData) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    try {
        // Validation: Check if user owns project or is admin
        const { rows: projectRows } = await query('SELECT user_id FROM projects WHERE id = $1', [projectId]);
        if (projectRows.length === 0) throw new Error("Project not found");

        // TODO: Check Admin role if needed. For now, strict owner check.
        if (projectRows[0].user_id !== user.id) {
            // Fetch role to allow admins
            // const { rows: roleRows } = await query('SELECT role FROM profiles WHERE id = $1', [user.id]);
            // if (roleRows[0]?.role !== 'ADMIN') throw new Error("Forbidden");
            // Let's assume strict ownership for now unless we import role logic.
            // Given user is editing their own project usually.
            if (projectRows[0].user_id !== user.id) throw new Error("Forbidden: You do not own this project");
        }

        await query(
            `UPDATE projects SET 
                title = $1, 
                make = $2, 
                model = $3, 
                year = $4, 
                description = $5, 
                location = $6, 
                specs = $7 
            WHERE id = $8`,
            [
                data.title,
                data.make,
                data.model,
                data.year,
                data.description,
                data.location,
                data.specs,
                projectId
            ]
        );

        revalidatePath(`/projects/${projectId}`);
        revalidatePath('/profile');
        return true;
    } catch (e) {
        console.error('updateProject Error:', e);
        throw e;
    }
}

export async function setProjectCover(projectId: string, url: string) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    try {
        // Ownership check (simplified for speed, reuse logic if possible)
        const { rows: projectRows } = await query('SELECT user_id FROM projects WHERE id = $1', [projectId]);
        if (projectRows.length === 0 || projectRows[0].user_id !== user.id) throw new Error("Forbidden");

        await query('UPDATE projects SET cover_image = $1 WHERE id = $2', [url, projectId]);
        revalidatePath(`/projects/${projectId}`);
        revalidatePath(`/projects/${projectId}/edit`); // Important for edit page state
        return true;
    } catch (e) {
        console.error('setProjectCover Error:', e);
        throw e;
    }
}

export async function deleteProjectImage(projectId: string, urlToDelete: string) {
    const user = await getSessionUser();
    if (!user) throw new Error("Unauthorized");

    try {
        const { rows: projectRows } = await query('SELECT user_id, gallery_images, cover_image FROM projects WHERE id = $1', [projectId]);
        if (projectRows.length === 0 || projectRows[0].user_id !== user.id) throw new Error("Forbidden");

        const currentGallery = projectRows[0].gallery_images || [];
        const newGallery = currentGallery.filter((u: string) => u !== urlToDelete);

        let newCover = projectRows[0].cover_image;
        if (newCover === urlToDelete) {
            newCover = newGallery.length > 0 ? newGallery[0] : null;
        }

        await query(
            'UPDATE projects SET gallery_images = $1, cover_image = $2 WHERE id = $3',
            [newGallery, newCover, projectId]
        );

        revalidatePath(`/projects/${projectId}`);
        revalidatePath(`/projects/${projectId}/edit`);
        return true;
    } catch (e) {
        console.error('deleteProjectImage Error:', e);
        throw e;
    }
}
