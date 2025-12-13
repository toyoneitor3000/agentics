import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { query } from "@/app/lib/db";
import { redirect, notFound } from 'next/navigation';
import EditProjectForm from './EditProjectForm';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default async function EditProjectPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect('/login');
    }

    const { id } = params;

    const { rows: projectRows } = await query(
        'SELECT * FROM projects WHERE id = $1',
        [id]
    );

    if (projectRows.length === 0) {
        notFound();
    }

    const project = projectRows[0];

    // Ownership Check
    if (project.user_id !== session.user.id) {
        // Optional: Check for ADMIN role here
        // const { rows: roleRows } = await query('SELECT role FROM profiles WHERE id = $1', [session.user.id]);
        // if (roleRows[0]?.role !== 'ADMIN') redirect('/profile');
        redirect('/profile');
    }

    return (
        <div className="min-h-screen bg-black text-white py-24 pb-12">
            <div className="max-w-3xl mx-auto px-4">
                <Link href="/profile" className="text-white/40 hover:text-white flex items-center gap-2 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Cancelar y volver
                </Link>

                <EditProjectForm project={project} />
            </div>
        </div>
    );
}
