import Link from "next/link";
import { User, Database, Megaphone } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { createClient } from "@/app/utils/supabase/server";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Check Auth (Must be logged in)
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    // 2. Check Role (Must be CEO or ADMIN)
    const supabase = await createClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

    const allowedRoles = ['CEO', 'ADMIN'];
    if (!profile || !allowedRoles.includes(profile.role)) {
        // Unauthorized: Redirect to home or show 404
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-[#050505] text-[#F5E6D3] font-sans flex">

            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-[#0F0A08] hidden md:flex flex-col h-screen fixed top-0 left-0 pt-20">
                <div className="px-6 mb-8">
                    <h2 className="text-xs uppercase tracking-[0.2em] text-[#FF9800] font-bold mb-1">Admin Panel</h2>
                    <p className="text-white font-black italic text-xl">SPEEDLIGHT</p>
                </div>

                <div className="px-6 mb-6">
                    <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">ADMIN USER</p>
                        <p className="text-xs text-white truncate font-mono">{session.user.email}</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-[#BCAAA4] hover:text-white transition-colors group">
                        <User className="w-5 h-5 group-hover:text-[#FF9800] transition-colors" />
                        <span className="font-bold text-sm tracking-wide">Usuarios</span>
                    </Link>
                    <Link href="/admin/ads" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-[#BCAAA4] hover:text-white transition-colors group">
                        <Megaphone className="w-5 h-5 group-hover:text-[#FF9800] transition-colors" />
                        <span className="font-bold text-sm tracking-wide">Publicidad</span>
                    </Link>
                    <Link href="/admin/data" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-[#BCAAA4] hover:text-white transition-colors group">
                        <Database className="w-5 h-5 group-hover:text-[#FF9800] transition-colors" />
                        <span className="font-bold text-sm tracking-wide">Base de Datos</span>
                    </Link>
                </nav>

                <div className="p-6 border-t border-white/10">
                    <p className="text-[10px] text-white/30 text-center">v1.0.0 &bull; Secure Access</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 pt-24 w-full">
                {children}
            </main>

        </div>
    );
}
