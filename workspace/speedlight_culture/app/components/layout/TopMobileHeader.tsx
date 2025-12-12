"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, User, LogIn, Search, Settings, Edit3, LogOut } from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";

export default function TopMobileHeader() {
    const [user, setUser] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    return (
        <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 pointer-events-none w-full">
            {/* Cinematic Deep Fade Gradient */}
            <div className="absolute inset-0 h-40 bg-gradient-to-b from-black via-black/60 to-transparent z-[-1] transition-opacity duration-300" />

            {/* Notifications & Messages (Bell) - Top Left */}
            <Link href="/notifications" className="pointer-events-auto text-white/80 hover:text-[#FF9800] transition-colors flex items-center justify-center relative group">
                <Bell className="w-6 h-6" />
                {/* Optional red dot if unread, logic can be added later */}
            </Link>

            {/* Logo Central Gigante (Brand Hero) */}
            <Link href="/" className="pointer-events-auto opacity-100 hover:scale-105 transition-transform duration-300 drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
                <Image
                    src="/logonavbar.png"
                    alt="Speedlight Culture"
                    width={160}
                    height={50}
                    className="w-36 h-auto object-contain filter drop-shadow-xl"
                    priority
                />
            </Link>

            {/* Profile / Auth Wrapper - Top Right */}
            {user ? (
                <div className="relative pointer-events-auto">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-[#FF9800] hover:text-[#FF9800]/80 transition-colors flex items-center justify-center"
                    >
                        <User className="w-6 h-6" />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <div className="absolute right-0 top-10 w-48 bg-[#111] border border-[#222] rounded-xl shadow-2xl py-2 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <Link
                                    href="/profile"
                                    className="px-4 py-3 text-sm text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User className="w-4 h-4 text-[#FF9800]" />
                                    Tu Perfil
                                </Link>
                                <Link
                                    href="/settings"
                                    className="px-4 py-3 text-sm text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Settings className="w-4 h-4 text-white/50" />
                                    Ajustes
                                </Link>
                                <Link
                                    href="/profile/edit"
                                    className="px-4 py-3 text-sm text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Edit3 className="w-4 h-4 text-white/50" />
                                    Editar Perfil
                                </Link>
                                <div className="h-px bg-white/10 my-1 mx-4"></div>
                                <button
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        window.location.href = "/login";
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <Link href="/login" className="pointer-events-auto text-white/30 hover:text-[#FF9800] transition-colors flex items-center justify-center">
                    <User className="w-6 h-6" />
                </Link>
            )}
        </header>
    );
}
