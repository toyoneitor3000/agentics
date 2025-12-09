"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AdHeroSponsor } from "./AdBanners";
import { createClient } from "@/app/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { User as UserIcon, LogOut } from "lucide-react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);

        // Check Auth and Listen for Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (event === 'SIGNED_IN') {
                console.log('User signed in:', session?.user);
            }
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        window.location.reload();
    };

    return (
        <header
            className={`relative w-full transition-all duration-500 z-50 ${scrolled ? "py-2" : "py-6"
                }`}
        >
            {/* Glassmorphic Background Layer with Fade */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                    background: "linear-gradient(to bottom, rgba(13, 9, 7, 0.8) 0%, rgba(13, 9, 7, 0.4) 60%, rgba(13, 9, 7, 0) 100%)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)"
                }}
            />

            {/* Galactic Top Glow Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF9800]/50 to-transparent opacity-50"></div>

            <div className="container mx-auto px-6 relative flex justify-between items-center">
                {/* Logo & Sponsor Area */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center group cursor-pointer">
                        <Link href="/" className="relative">
                            <div className="absolute inset-0 bg-[#FF9800]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <Image
                                src="/logonavbar.png"
                                alt="Speedlight Culture"
                                width={240}
                                height={120}
                                className={`w-auto transition-all duration-500 object-contain ${scrolled ? "h-20" : "h-32"
                                    }`}
                            />
                        </Link>
                    </div>

                    {/* Hero Sponsor (Hidden on mobile) */}
                    <div className="hidden xl:block opacity-0 animate-in fade-in slide-in-from-left duration-1000 delay-500 fill-mode-forwards">
                        <AdHeroSponsor />
                    </div>
                </div>

                {/* Minimalist Navigation */}
                <nav className="hidden md:flex items-center space-x-12">
                    {["Inicio", "Proyectos", "Academy", "Marketplace", "Foro", "Galería"].map((item) => {
                        const links: { [key: string]: string } = {
                            "Inicio": "/",
                            "Proyectos": "/projects",
                            "Academy": "/academy",
                            "Marketplace": "/marketplace",
                            "Foro": "/forum",
                            "Galería": "/gallery",
                            "Concursos": "/contests"
                        };
                        return (
                            <Link
                                key={item}
                                href={links[item]}
                                className="relative text-[#F5E6D3]/80 hover:text-[#FFF8F0] text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-300 group"
                            >
                                {item}
                                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-gradient-to-r from-[#FF9800] to-[#FFEB3B] group-hover:w-full transition-all duration-300 ease-out"></span>
                                <span className="absolute -bottom-2 right-0 w-0 h-[1px] bg-gradient-to-l from-[#FF9800] to-[#FFEB3B] group-hover:w-full transition-all duration-300 ease-out delay-75"></span>
                            </Link>
                        );
                    })}
                </nav>

                {/* High Class CTA */}
                {/* Auth & User Area */}
                <div className="flex items-center gap-4">
                    {!user ? (
                        <Link href="/login">
                            <button className="group relative px-8 py-3 overflow-hidden rounded-full bg-transparent border border-[#FF9800]/30 hover:border-[#FF9800]/60 transition-all duration-300">
                                <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#FF9800]/10 to-[#D32F2F]/10 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                                <span className="relative text-[#F5E6D3] text-xs uppercase tracking-[0.15em] font-bold group-hover:text-white transition-colors">
                                    Acceder
                                </span>
                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF9800] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </button>
                        </Link>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 group"
                            >
                                <div className="w-10 h-10 rounded-full border-2 border-[#FF9800] overflow-hidden bg-[#1A0F08] flex items-center justify-center">
                                    {user.user_metadata?.avatar_url ? (
                                        <Image
                                            src={user.user_metadata.avatar_url}
                                            alt="Avatar"
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon className="w-5 h-5 text-[#F5E6D3]" />
                                    )}
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 top-12 w-48 bg-[#1A0F08] border border-[#FF9800]/20 rounded-xl shadow-2xl p-2 flex flex-col gap-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-2 text-xs text-[#8D6E63] border-b border-[#333] mb-1">
                                        {user.user_metadata?.full_name || user.email}
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#F5E6D3] hover:bg-[#FF9800]/10 rounded-lg transition-colors w-full text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
