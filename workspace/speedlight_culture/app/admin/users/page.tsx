import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth"; // BetterAuth Server
import UserListTable from "@/app/components/admin/UserListTable";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    // 1. Check Admin Auth via BetterAuth
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    // Optional: Strict Role Check (Ensure only CEO or specific emails can access)
    // We already moved profiles, so we can check profile role or just user email here.
    const supabase = await createClient();

    // Check role in DB if needed, for now we assume access if logged in (or specific email)
    // const { data: myProfile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
    // if (myProfile?.role !== 'CEO') redirect("/");

    // 2. Fetch All Profiles
    // We fetch from 'profiles' since it has the rich data (Founder #, XP, Level, Avatar)
    // The previous migration linked profiles to 'user' auth table via ID.
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('founder_number', { ascending: true, nullsFirst: false });

    if (error) {
        console.error("Error fetching users:", error);
        return <div className="p-8 text-red-500">Error loading users.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase mb-2">
                    Directorio de Pilotos
                </h1>
                <p className="text-[#BCAAA4]">
                    Gestión de usuarios registrados en la plataforma Speedlight.
                </p>
            </header>

            <UserListTable users={profiles || []} />
        </div>
    );
}
