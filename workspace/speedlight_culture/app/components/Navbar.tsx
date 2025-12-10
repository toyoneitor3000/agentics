"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AdHeroSponsor } from "./AdBanners";
import { createClient } from "@/app/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { User as UserIcon, LogOut, Menu, X, ChevronRight } from "lucide-react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const supabase = createClient();

    const navLinks = [
        { name: "Inicio", path: "/" },
        { name: "Proyectos", path: "/projects" },
        { name: "Academy", path: "/academy" },
        { name: "Marketplace", path: "/marketplace" },
        { name: "Foro", path: "/forum" },
        { name: "Galería", path: "/gallery" },
        { name: "Eventos", path: "/events" },
        { name: "Planes", path: "/pricing" },
        { name: "Publicidad", path: "/admin/ads" }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
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
            className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 border-b ${scrolled
                    ? "py-2 bg-[#050302]/80 backdrop-blur-2xl border-[#FF9800]/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                    : "py-6 bg-transparent border-transparent"
                }`}
        >
            {/* Ambient Top Glow (Neon Effect) */}
            <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF9800] to-transparent transition-opacity duration-700 ${scrolled ? 'opacity-100' : 'opacity-0'}`}></div>

            <div className="container mx-auto px-6 relative flex justify-between items-center">
                {/* 1. Logo & Sponsor - Kinetic Entrance */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center group cursor-pointer relative">
                        <Link href="/" className="relative z-10 block">
                            <Image
                                src="/logonavbar.png"
                                alt="Speedlight Culture"
                                width={180}
                                height={60}
                                className={`w-auto transition-all duration-500 object-contain ${scrolled ? "h-7" : "h-10"} drop-shadow-[0_0_10px_rgba(255,152,0,0.1)] group-hover:drop-shadow-[0_0_15px_rgba(255,152,0,0.4)]`}
                            />
                        </Link>
                    </div>

                    {/* Hero Sponsor (Hidden on mobile) */}
                    <div className="hidden xl:block opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
                        <AdHeroSponsor />
                    </div>
                </div>

                {/* 2. Desktop Navigation - Kinetic Type & Glow */}
                <nav className="hidden lg:flex items-center space-x-8">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className="relative text-[#F5E6D3]/70 hover:text-white text-[11px] uppercase tracking-[0.25em] font-bold transition-all duration-300 group py-2"
                        >
                            <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(255,152,0,0.8)] transition-all">
                                {item.name}
                            </span>
                            {/* Hover Underline Glitch Effect */}
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FF9800] group-hover:w-full transition-all duration-300 ease-out shadow-[0_0_10px_#FF9800]"></span>
                        </Link>
                    ))}
                </nav>

                {/* 3. Auth & Mobile Toggle - Neon Interactions */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        {!user ? (
                            <Link href="/login">
                                <button className="relative group px-6 py-2 overflow-hidden rounded-full bg-black/50 border border-[#FF9800]/30 hover:border-[#FF9800] transition-all duration-500 shadow-[0_0_20px_rgba(255,152,0,0)] hover:shadow-[0_0_20px_rgba(255,152,0,0.3)]">
                                    <div className="absolute inset-0 w-0 bg-[#FF9800] transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
                                    <span className="relative z-10 flex items-center gap-2 text-[#FF9800] text-[10px] uppercase tracking-[0.2em] font-bold group-hover:text-white transition-colors">
                                        Acceder <ChevronRight className="w-3 h-3" />
                                    </span>
                                </button>
                            </Link>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-2 group p-1 rounded-full border border-transparent hover:border-[#FF9800]/50 transition-all duration-300"
                                >
                                    <div className="w-9 h-9 rounded-full border border-[#FF9800]/30 overflow-hidden bg-[#1A0F08] flex items-center justify-center shadow-[0_0_15px_rgba(255,152,0,0.1)] group-hover:shadow-[0_0_20px_rgba(255,152,0,0.4)] transition-all">
                                        {user.user_metadata?.avatar_url ? (
                                            <Image src={user.user_metadata.avatar_url} alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon className="w-4 h-4 text-[#F5E6D3]" />
                                        )}
                                    </div>
                                </button>
                                {/* Dropdown */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 top-12 w-56 bg-[#0D0907]/95 backdrop-blur-xl border border-[#FF9800]/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b border-white/5 bg-white/5">
                                            <p className="text-xs text-[#8D6E63] uppercase tracking-wider mb-1">Conectado como</p>
                                            <p className="text-sm font-bold text-white truncate">{user.user_metadata?.full_name || user.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-[#F5E6D3] hover:bg-[#FF9800]/10 hover:text-[#FF9800] rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                                <UserIcon className="w-4 h-4" /> Mi Perfil
                                            </Link>
                                            <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left">
                                                <LogOut className="w-4 h-4" /> Cerrar Sesión
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden text-[#F5E6D3] hover:text-[#FF9800] transition-colors p-2"
                        onClick={() => setIsMobileNavOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* 4. Immersive Mobile Menu (Glass Overlay) */}
            <div className={`fixed inset-0 z-[60] bg-[#050302]/95 backdrop-blur-3xl transition-transform duration-500 lg:hidden ${isMobileNavOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                    <Link href="/" onClick={() => setIsMobileNavOpen(false)}>
                        <h2 className="text-2xl font-black italic tracking-tighter text-white">SPEEDLIGHT</h2>
                    </Link>
                    <button onClick={() => setIsMobileNavOpen(false)} className="text-[#BCAAA4] hover:text-white transition-colors bg-white/5 rounded-full p-2 hover:rotate-90 duration-300">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Staggered Links */}
                <div className="flex flex-col p-8 space-y-2 overflow-y-auto h-full pb-32">
                    {navLinks.map((item, idx) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            onClick={() => setIsMobileNavOpen(false)}
                            className="group flex items-center justify-between py-4 border-b border-white/5 text-2xl font-light text-[#F5E6D3] uppercase tracking-widest hover:text-[#FF9800] hover:pl-4 transition-all duration-300"
                            style={{ transitionDelay: `${idx * 50}ms` }}
                        >
                            <span>{item.name}</span>
                            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                        </Link>
                    ))}

                    {/* Mobile Auth */}
                    <div className="pt-8 mt-4">
                        {!user ? (
                            <Link href="/login" onClick={() => setIsMobileNavOpen(false)} className="w-full flex justify-center py-4 bg-[#FF9800] text-black font-bold uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(255,152,0,0.4)]">
                                Acceder / Registro
                            </Link>
                        ) : (
                            <button onClick={handleSignOut} className="w-full flex justify-center py-4 border border-red-500/50 text-red-500 font-bold uppercase tracking-widest rounded-lg hover:bg-red-500/10">
                                Desconectar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
