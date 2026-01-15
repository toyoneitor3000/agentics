"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/app/lib/auth-client";

export default function NewPostButton() {
    const { data: session } = useSession();

    if (!session?.user) {
        return (
            <Link
                href="/login?redirect=/forum/new"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/20 text-white/60 font-bold uppercase tracking-wider rounded-2xl hover:bg-white/10 hover:text-white transition-all"
            >
                <Plus className="w-5 h-5" />
                Inicia sesión para publicar
            </Link>
        );
    }

    return (
        <Link
            href="/forum/new"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-[#FF9800] text-black font-bold uppercase tracking-wider rounded-2xl hover:bg-[#F57C00] transition-colors shadow-[0_0_30px_rgba(255,152,0,0.2)] hover:shadow-[0_0_40px_rgba(255,152,0,0.4)]"
        >
            <Plus className="w-5 h-5" />
            Nuevo Tema
        </Link>
    );
}
