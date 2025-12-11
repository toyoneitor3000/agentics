"use client";

import Link from 'next/link';
import { Shield, Bell, Lock, Key, CreditCard, ChevronLeft, LogOut } from 'lucide-react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const supabase = createClient();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-[#050302] text-[#F5E6D3] pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-[#050302]/95 backdrop-blur-xl border-b border-[#FF9800]/10 px-4 py-4 flex items-center gap-4">
                <Link href="/profile" className="p-2 -ml-2 text-[#999] hover:text-white">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-bold">Configuración</h1>
            </div>

            <div className="p-6 max-w-2xl mx-auto space-y-8">

                {/* Account Security */}
                <section>
                    <h2 className="text-[#FF9800] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Seguridad y Cuenta
                    </h2>
                    <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors border-b border-[#222]">
                            <div className="flex items-center gap-4">
                                <Lock className="w-5 h-5 text-white/50" />
                                <div className="text-left">
                                    <p className="font-bold text-sm text-white">Contraseña</p>
                                    <p className="text-xs text-[#999]">Cambiar contraseña actual</p>
                                </div>
                            </div>
                            <span className="text-[#665] text-xs">Editar</span>
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors">
                            <div className="flex items-center gap-4">
                                <Key className="w-5 h-5 text-white/50" />
                                <div className="text-left">
                                    <p className="font-bold text-sm text-white">Autenticación de Dos Pasos</p>
                                    <p className="text-xs text-[#999]">Protege tu cuenta (Desactivado)</p>
                                </div>
                            </div>
                            <span className="text-[#665] text-xs">Activar</span>
                        </button>
                    </div>
                </section>

                {/* Subscription */}
                <section>
                    <h2 className="text-[#FF9800] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Suscripción
                    </h2>
                    <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden p-6 relative">
                        <div className="absolute top-0 right-0 p-3 bg-[#FF9800]/10 text-[#FF9800] text-xs font-bold rounded-bl-xl">PLAN FREE</div>
                        <h3 className="text-xl font-bold text-white mb-2">Spectator</h3>
                        <p className="text-sm text-[#999] mb-4">Acceso básico a la comunidad.</p>
                        <button className="w-full py-3 rounded-lg bg-[#FF9800] text-black font-bold uppercase tracking-wide hover:bg-[#FFB74D] transition-colors">
                            Mejorar Plan
                        </button>
                    </div>
                </section>

                {/* Notifications */}
                <section>
                    <h2 className="text-[#FF9800] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Bell className="w-4 h-4" /> Notificaciones
                    </h2>
                    <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                        <div className="p-4 flex items-center justify-between border-b border-[#222]">
                            <span className="text-sm font-medium text-white">Nuevos Seguidores</span>
                            <div className="w-10 h-6 bg-[#FF9800] rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full shadow-sm"></div>
                            </div>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <span className="text-sm font-medium text-white">Actualizaciones de Proyectos</span>
                            <div className="w-10 h-6 bg-[#FF9800] rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <div className="pt-8">
                    <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 text-red-500 font-bold border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 p-4 rounded-xl transition-all">
                        <LogOut className="w-5 h-5" /> Cerrar Sesión
                    </button>
                </div>

            </div>
        </div>
    );
}
