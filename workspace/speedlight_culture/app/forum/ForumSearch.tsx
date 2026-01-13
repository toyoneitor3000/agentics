"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function ForumSearch({ initialSearch }: { initialSearch?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState(initialSearch || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        if (query.trim()) {
            params.set("search", query.trim());
        } else {
            params.delete("search");
        }

        startTransition(() => {
            router.push(`/forum?${params.toString()}`);
        });
    };

    return (
        <form onSubmit={handleSearch} className="flex-1 relative group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isPending ? 'text-[#FF9800] animate-pulse' : 'text-white/30 group-focus-within:text-[#FF9800]'}`} />
            <input
                type="text"
                placeholder="Buscar en el foro..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#0A0604] border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF9800]/50 focus:shadow-[0_0_20px_rgba(255,152,0,0.1)] transition-all"
            />
            {isPending && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-[#FF9800] border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </form>
    );
}
