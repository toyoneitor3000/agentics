"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, User, LogIn, Search, Settings, Edit3, LogOut, Loader2, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "@/app/lib/auth-client";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

export default function AppHeader() {
    const { data: session, isPending } = useSession();
    const user = session?.user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const supabase = createClient();

    // Check Admin Role
    useEffect(() => {
        async function checkRole() {
            if (user?.id) {
                const { data } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (data) {
                    setUserRole(data.role);
                }
            }
        }
        checkRole();
    }, [user?.id, supabase]);

    const isAdmin = userRole === 'CEO' || userRole === 'ADMIN';

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.reload();
                }
            }
        });
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-[60] flex justify-between items-center px-4 md:px-8 py-3 w-full bg-transparent h-[70px] pointer-events-none">
            {/* Cinematic Deep Fade Gradient (Background) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-[-1]" />

            {/* Left: Logo (Desktop) / Bell (Mobile) */}
            <div className="flex items-center gap-4 z-10 pointer-events-auto">
                {/* Mobile: Notification Bell */}
                <Link href="/notifications" className="md:hidden text-white/80 hover:text-[#FF9800] transition-colors p-2">
                    <Bell className="w-6 h-6" />
                </Link>

                {/* Desktop: Brand Logo */}
                <Link href="/" className="hidden md:block opacity-100 hover:scale-105 transition-transform duration-300">
                    <Image
                        src="/logonavbar.png"
                        alt="Speedlight Culture"
                        width={180}
                        height={50}
                        className="w-40 h-auto object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* Center: Logo (Mobile Only) */}
            <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
                <Link href="/" className="block opacity-100 hover:scale-105 transition-transform duration-300">
                    <Image
                        src="/logonavbar.png"
                        alt="Speedlight Culture"
                        width={140}
                        height={40}
                        className="w-32 h-auto object-contain drop-shadow-xl"
                        priority
                    />
                </Link>
            </div>

            {/* Right: Profile / Auth */}
            <div className="flex items-center gap-4 z-10 pointer-events-auto">
                {/* Desktop: Extra Actions (e.g. Notifications) */}
                <div className="hidden md:flex items-center gap-2 mr-2">
                    <Link href="/notifications" className="text-white/60 hover:text-[#FF9800] p-2 transition-colors relative">
                        <Bell className="w-5 h-5" />
                    </Link>
                </div>

                {/* Auth Status */}
                {isPending ? (
                    <Loader2 className="w-6 h-6 text-[#FF9800] animate-spin" />
                ) : user ? (
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-3 text-white hover:text-[#FF9800] transition-colors group"
                        >
                            <div className="flex flex-col items-end hidden md:flex">
                                <span className="text-xs font-bold uppercase tracking-wider">{user.name?.split(' ')[0]}</span>
                                <span className="text-[10px] text-gray-400">{isAdmin ? 'ADMIN' : 'MEMBER'}</span>
                            </div>
                            {user.image ? (
                                <div className="w-9 h-9 rounded-full border border-[#FF9800]/50 group-hover:border-[#FF9800] overflow-hidden transition-colors shadow-[0_0_10px_rgba(255,152,0,0.1)]">
                                    <Image src={user.image} alt={user.name || "User"} width={36} height={36} className="object-cover w-full h-full" />
                                </div>
                            ) : (
                                <div className="w-9 h-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsMenuOpen(false)}
                                />
                                <div className="absolute right-0 top-12 w-56 bg-[#0A0A0A] border border-[#222] rounded-xl shadow-2xl py-2 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-white/5 md:hidden">
                                        <p className="text-white font-bold text-sm truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>

                                    {/* Admin Link */}
                                    {isAdmin && (
                                        <Link
                                            href="/admin/users"
                                            className="px-4 py-3 text-sm text-[#FFD700] hover:bg-white/5 flex items-center gap-3 transition-colors border-b border-white/5"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Admin Panel
                                        </Link>
                                    )}

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
                                    <div className="h-px bg-white/10 my-1 mx-4"></div>
                                    <button
                                        onClick={handleSignOut}
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
                    <Link href="/login" className="flex items-center gap-2 bg-[#FF9800] hover:bg-[#F57C00] text-black px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(255,152,0,0.2)]">
                        <LogIn className="w-4 h-4" />
                        <span className="hidden md:inline">Acceder</span>
                    </Link>
                )}
            </div>
        </header>
    );
}
