"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, Heart, User, Play } from "lucide-react";
import { useScrollDirection } from "@/app/hooks/useScrollDirection";

export default function MobileNav() {
    const pathname = usePathname();
    const scrollDirection = useScrollDirection();
    const isHidden = scrollDirection === "down";

    const isActive = (path: string) => pathname === path;

    return (
        <div
            className={`md:hidden fixed bottom-6 left-6 right-6 z-50 bg-black/20 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-transform duration-300 ease-in-out ${isHidden ? 'translate-y-[150%]' : 'translate-y-0'}`}
        >
            <div className="flex justify-between items-center">
                <Link href="/" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-[#FF9800]' : 'text-[#8D6E63]'}`}>
                    <Home className="w-6 h-6" strokeWidth={isActive('/') ? 2.5 : 2} />
                </Link>

                <Link href="/explore" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/explore') ? 'text-[#FF9800]' : 'text-[#8D6E63]'}`}>
                    <Search className="w-6 h-6" strokeWidth={isActive('/explore') ? 2.5 : 2} />
                </Link>

                <Link href="/reels" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/reels') ? 'text-[#FF9800] scale-110 drop-shadow-[0_0_10px_rgba(255,152,0,0.5)]' : 'text-[#F5E6D3] hover:text-[#FF9800]'}`}>
                    <Play className="w-7 h-7 fill-current" strokeWidth={isActive('/reels') ? 2.5 : 2} />
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
