"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";
import { useScrollDirection } from "@/app/hooks/useScrollDirection";

export default function MobileNav() {
    const pathname = usePathname();
    const scrollDirection = useScrollDirection();
    const isHidden = scrollDirection === "down";

    const isActive = (path: string) => pathname === path;

    return (
        <div
            className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050302]/95 backdrop-blur-xl border-t border-[#FF9800]/20 px-6 py-3 pb-8 safe-area-bottom transition-transform duration-300 ease-in-out ${isHidden ? 'translate-y-full' : 'translate-y-0'}`}
        >
            <div className="flex justify-between items-center">
                <Link href="/" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-[#FF9800]' : 'text-[#8D6E63]'}`}>
                    <Home className="w-6 h-6" strokeWidth={isActive('/') ? 2.5 : 2} />
                </Link>

                <Link href="/explore" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/explore') ? 'text-[#FF9800]' : 'text-[#8D6E63]'}`}>
                    <Search className="w-6 h-6" strokeWidth={isActive('/explore') ? 2.5 : 2} />
                </Link>

                <Link href="/create" className="flex flex-col items-center gap-1 text-[#F5E6D3] hover:text-[#FF9800] transition-colors">
                    <PlusSquare className="w-7 h-7" strokeWidth={2} />
                </Link>

                <Link href="/notifications" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/notifications') ? 'text-[#FF9800]' : 'text-[#8D6E63]'}`}>
                    <Heart className="w-6 h-6" strokeWidth={isActive('/notifications') ? 2.5 : 2} />
                </Link>

                <Link href="/profile" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/profile') ? 'text-[#FF9800]' : 'text-[#8D6E63]'}`}>
                    <User className="w-6 h-6" strokeWidth={isActive('/profile') ? 2.5 : 2} />
                </Link>
            </div>
        </div>
    );
}
