'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Globe, Shield, ChevronRight, LogOut, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [isPrivate, setIsPrivate] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getSettings = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('is_private')
                .eq('id', user.id)
                .single();

            if (profile) {
                setIsPrivate(profile.is_private || false);
            }
            setLoading(false);
        };
        getSettings();
    }, [router, supabase]);

    const togglePrivacy = async () => {
        const newState = !isPrivate;
        setIsPrivate(newState); // Optimistic update

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from('profiles')
                .update({ is_private: newState })
                .eq('id', user.id);

            if (error) {
                console.error("Error updating privacy:", error);
                setIsPrivate(!newState); // Revert
                alert("No se pudo actualizar la configuración.");
            }
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <div className="max-w-xl mx-auto pb-20">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-[#222] px-4 py-4 flex items-center gap-4">
                    <Link href="/profile" className="p-2 -ml-2 text-white/60 hover:text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-bold font-oswald uppercase">Configuración</h1>
                </header>

                <div className="p-4 space-y-8">

                    {/* Privacy Section */}
                    <section>
                        <h2 className="text-[#FF9800] text-xs font-bold uppercase tracking-wider mb-4 px-2">Privacidad de la Cuenta</h2>
                        <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
                            <div className="p-4 flex items-center justify-between border-b border-[#222]">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPrivate ? 'bg-[#FF9800]/10 text-[#FF9800]' : 'bg-white/5 text-white/50'}`}>
                                        {isPrivate ? <Lock className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-white">Cuenta Privada</h3>
                                        <p className="text-xs text-white/40">
                                            {isPrivate ? 'Solo información básica visible' : 'Tu perfil es visible para todos'}
                                        </p>
                                    </div>
                                </div>

                                {/* Toggle Switch */}
                                <button
                                    onClick={togglePrivacy}
                                    className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 relative ${isPrivate ? 'bg-[#FF9800]' : 'bg-[#333]'}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isPrivate ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            <div className="p-4 bg-[#1a1a1a]/50">
                                <p className="text-xs text-white/40 leading-relaxed">
                                    <Shield className="w-3 h-3 inline mr-1" />
                                    {isPrivate
                                        ? "Tu actividad detallada está oculta. Los usuarios solo verán tu nombre, foto y bio."
                                        : "Tus proyectos, eventos y garaje son visibles para toda la comunidad Speedlight."}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* General Settings Placeholders */}
                    <section>
                        <h2 className="text-[#FF9800] text-xs font-bold uppercase tracking-wider mb-4 px-2">Cuenta</h2>
                        <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden divide-y divide-[#222]">
                            <button className="w-full p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors text-left group">
                                <span className="text-sm font-medium text-white group-hover:text-[#FF9800] transition-colors">Notificaciones</span>
                                <ChevronRight className="w-4 h-4 text-white/20" />
                            </button>
                            <button className="w-full p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors text-left group">
                                <span className="text-sm font-medium text-white group-hover:text-[#FF9800] transition-colors">Seguridad</span>
                                <ChevronRight className="w-4 h-4 text-white/20" />
                            </button>
                            <button className="w-full p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors text-left group">
                                <span className="text-sm font-medium text-white group-hover:text-[#FF9800] transition-colors">Ayuda y Soporte</span>
                                <ChevronRight className="w-4 h-4 text-white/20" />
                            </button>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section>
                        <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden divide-y divide-[#222]">
                            <button
                                onClick={handleLogout}
                                className="w-full p-4 flex items-center gap-3 hover:bg-red-900/10 transition-colors text-left text-red-500"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="text-sm font-bold">Cerrar Sesión</span>
                            </button>
                            <button className="w-full p-4 flex items-center gap-3 hover:bg-red-900/10 transition-colors text-left text-red-500/50 hover:text-red-500">
                                <Trash2 className="w-5 h-5" />
                                <span className="text-sm font-bold">Eliminar Cuenta</span>
                            </button>
                        </div>
                        <p className="text-center text-[10px] text-white/20 mt-6 uppercase tracking-widest">
                            Speedlight Culture v1.0.0
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
