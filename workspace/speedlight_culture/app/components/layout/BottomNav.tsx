"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, User, Play, ShoppingBag, GraduationCap, Calendar, Wrench, MessageSquare, Camera, MessageCircle, Image as ImageIcon, Search } from "lucide-react";
import { useScrollDirection } from "@/app/hooks/useScrollDirection";
import { useRef, useEffect } from "react";

export default function BottomNav() {
    const pathname = usePathname();
    const scrollDirection = useScrollDirection();
    const isHidden = scrollDirection === "down";
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => pathname === path || (path !== '/' && pathname?.startsWith(path));

    // Reordered per user request ("Heart -> Gallery -> Cinema...")
    const navItems = [
        { name: "Galería", path: "/gallery", icon: ImageIcon }, // Changed to Image (Picture Frame)
        { name: "Cinema", path: "/reels", icon: Play },
        { name: "Proyectos", path: "/projects", icon: Compass },
        { name: "Marketplace", path: "/marketplace", icon: ShoppingBag },
        { name: "Academy", path: "/academy", icon: GraduationCap },
        { name: "Talleres", path: "/workshops", icon: Wrench },
        { name: "Eventos", path: "/events", icon: Calendar },
        { name: "AutoStudio", path: "/autostudio", icon: MessageSquare },
        { name: "Buscar", path: "/search", icon: Search },
    ];

    // Auto-scroll to active item
    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeIndex = navItems.findIndex(item => isActive(item.path));
            if (activeIndex > 1) { // Only scroll if it's not one of the first few
                const itemWidth = 80; // Approximate width including gap
                scrollContainerRef.current.scrollTo({
                    left: (activeIndex * itemWidth) - 100, // Center it roughly
                    behavior: 'smooth'
                });
            } else {
                scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            }
        }
    }, [pathname]);

    return (
        <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0F0F0F] border border-[#222] rounded-full h-[76px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-in-out ${isHidden ? 'translate-y-[150%]' : 'translate-y-0'} overflow-hidden flex items-center pr-1 w-[90%] max-w-md md:max-w-xl`}
        >
            {/* 1. PINNED HOME (Left Anchor) */}
            <div className="pl-2 pr-4 h-full flex items-center relative z-20 bg-[#0F0F0F] shadow-[10px_0_20px_0px_#0F0F0F]">
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ${isActive('/') ? 'bg-[#FF9800] text-black shadow-[0_0_20px_rgba(255,152,0,0.5)] scale-105' : 'text-white/40 hover:text-white'}`}
                >
                    <Home className="w-6 h-6" strokeWidth={isActive('/') ? 2.5 : 2} />
                </Link>
                {/* Subtle Divider */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-[1px] bg-white/5"></div>
            </div>

            {/* 2. SCROLLABLE ICONS */}
            <div
                ref={scrollContainerRef}
                className="flex-1 h-full overflow-x-auto flex items-center gap-6 px-2 scrollbar-hide mask-image-scroll-fade"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex flex-col items-center justify-center shrink-0 transition-all duration-500 relative rounded-full items-center justify-center
                                ${active
                                    ? 'w-14 h-14 bg-[#FF9800] text-black shadow-[0_0_20px_rgba(255,152,0,0.5)] scale-105 z-10'  // The "Big Circle"
                                    : 'w-10 h-10 text-white/40 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            <Icon className={`${active ? 'w-7 h-7' : 'w-6 h-6'}`} strokeWidth={active ? 2.5 : 2} />

                            {/* Optional: Tiny label only for active if needed, but icon is cleaner */}
                        </Link>
                    );
                })}

                <div className="w-4 shrink-0"></div>
            </div>
        </div>
    );
}
