"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { UserBadge } from "../components/UserBadge";
import { User as UserIcon, LogOut, Menu, X, ChevronRight, Loader2, LayoutDashboard, Megaphone } from "lucide-react";
// ... (existing imports)

// ...

// In the component:
{
    isMenuOpen && (
        <div className="absolute right-0 top-12 w-64 bg-[#1A0F08]/95 backdrop-blur-xl border border-[#FF9800]/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-white/5 bg-white/5">
                <p className="text-xs text-[#8D6E63] uppercase tracking-wider mb-1 flex items-center justify-between">
                    Conectado como
                    {/* Insignia aquí en el header del dropdown */}
                    <UserBadge role={userRole || 'user'} size="sm" showLabel={true} />
                </p>
                <p className="text-sm font-bold text-white truncate">{user.name || user.email}</p>
            </div>
            <div className="p-2 space-y-1">
                {/* Admin Link for CEO/Admins */}
                {isAdmin && (
                    <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-sm text-[#FFD700] hover:bg-[#FFD700]/10 rounded-lg transition-colors border border-[#FFD700]/20" onClick={() => setIsMenuOpen(false)}>
                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                    </Link>
                )}

                <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-[#F5E6D3] hover:bg-[#FF9800]/10 hover:text-[#FF9800] rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <UserIcon className="w-4 h-4" /> Mi Perfil
                </Link>

                {/* Nuevo Botón de Publicidad / Negocio */}
                <Link href="/advertising" className="flex items-center gap-3 px-3 py-2 text-sm text-cyan-400 hover:bg-cyan-900/20 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <Megaphone className="w-4 h-4" /> Publicidad / Negocio
                </Link>

                <div className="h-[1px] bg-white/5 my-1"></div>

                <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left">
                    <LogOut className="w-4 h-4" /> Cerrar Sesión
                </button>
            </div>
        </div>
    )
}
                    </div >

    {/* Mobile Menu Toggle */ }
    < button
className = "lg:hidden text-[#F5E6D3] hover:text-[#FF9800] transition-colors p-2"
onClick = {() => setIsMobileNavOpen(true)}
                    >
    <Menu className="w-6 h-6" />
                    </button >
                </div >
            </div >

    {/* 4. Immersive Mobile Menu (Glass Overlay) */ }
    < div className = {`fixed inset-0 z-[60] bg-[#1A0F08]/95 backdrop-blur-3xl transition-transform duration-500 lg:hidden ${isMobileNavOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */ }
        < div className = "flex justify-between items-center p-6 border-b border-white/5" >
                    <Link href="/" onClick={() => setIsMobileNavOpen(false)}>
                        <h2 className="text-2xl font-black italic tracking-tighter text-white">SPEEDLIGHT</h2>
                    </Link>
                    <button onClick={() => setIsMobileNavOpen(false)} className="text-[#BCAAA4] hover:text-white transition-colors bg-white/5 rounded-full p-2 hover:rotate-90 duration-300">
                        <X className="w-6 h-6" />
                    </button>
                </div >

    {/* Staggered Links */ }
    < div className = "flex flex-col p-8 space-y-2 overflow-y-auto h-full pb-32" >
    {
        navLinks.map((item, idx) => (
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
        ))
    }

{/* Mobile Auth */ }
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
                </div >
            </div >
        </header >
    );
}
