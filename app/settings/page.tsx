'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from "@/app/lib/auth-client";
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Globe, Shield, ChevronRight, LogOut, Trash2, Palette, Video, History } from 'lucide-react';
import DeletedFilesManager from '@/app/components/settings/DeletedFilesManager';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { useBackground } from '@/app/context/BackgroundContext';

export default function SettingsPage() {
    const { data: session, isPending } = useSession();
    const user = session?.user;

    // We can keep local loading state if needed, or rely on isPending
    const loading = isPending;

    const [isPrivate, setIsPrivate] = useState(false);
    // const [user, setUser] = useState<any>(null); // Removed local state, use hook directly
    const [supabase] = useState(() => createClient());
    const router = useRouter();
    const { language, toggleLanguage } = useLanguage();
    const { themeColor, brightness, saturation, updateSettings } = useBackground();

    useEffect(() => {
        const getSettings = async () => {
            if (user) {
                // Fetch profile data (privacy & background) using the user ID from BetterAuth
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_private, background_image')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setIsPrivate(profile.is_private || false);
                    // Sync background if it exists in DB but not in local or different
                    if (profile.background_image) {
                        updateSettings({ staticImage: profile.background_image });
                    }
                }
            }
        };
        // Only fetch if user is defined
        if (user) getSettings();
    }, [user, supabase]);

    const togglePrivacy = async () => {
        if (!user) return;
        const newState = !isPrivate;
        setIsPrivate(newState); // Optimistic update

        const { error } = await supabase
            .from('profiles')
            .update({ is_private: newState })
            .eq('id', user.id);

        if (error) {
            console.error("Error updating privacy:", error);
            setIsPrivate(!newState); // Revert
            alert("No se pudo actualizar la configuración.");
        }
    };

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.reload(); // Reload to clear state/header
                    router.push('/login');
                }
            }
        });
    };

    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `backgrounds/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars') // Using avatars bucket as temp solution
                .upload(fileName, file);

            if (uploadError) {
                console.error('Error uploading background:', uploadError);
                alert('Error al subir la imagen. Intenta de nuevo.');
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            // Update Context (LocalStorage/State)
            updateSettings({ staticImage: publicUrl });

            // Update Database if logged in
            if (user) {
                await supabase
                    .from('profiles')
                    .update({ background_image: publicUrl })
                    .eq('id', user.id);
            }

        } catch (error) {
            console.error('Error uploading background:', error);
        } finally {
            setUploading(false);
        }
    };

    const clearBackground = async () => {
        updateSettings({ staticImage: null });
        if (user) {
            await supabase
                .from('profiles')
                .update({ background_image: null })
                .eq('id', user.id);
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-white">
            <div className="max-w-xl mx-auto pb-20">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center gap-4">
                    <Link href="/profile" className="p-2 -ml-2 text-white/60 hover:text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-lg font-bold font-oswald uppercase">Configuración</h1>
                </header>

                <div className="p-4 space-y-8">

                    {/* Appearance Section - ALWAYS VISIBLE */}
                    <section>
                        <h2 className="text-[#FF9800] text-xs font-bold uppercase tracking-wider mb-4 px-2">Apariencia</h2>
                        <div className="bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50">
                                    <Palette className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-white">Fondo de Aplicación</h3>
                                    <p className="text-xs text-white/40">Personaliza el tono base</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-5 gap-2">
                                <ThemeOption color="#0D0805" label="Café" theme="coffee" active={themeColor === 'coffee'} onClick={() => updateSettings({ themeColor: 'coffee' })} />
                                <ThemeOption color="#2E2000" label="Amber" theme="amber" active={themeColor === 'amber'} onClick={() => updateSettings({ themeColor: 'amber' })} />
                                <ThemeOption color="#051A10" label="Verde" theme="emerald" active={themeColor === 'emerald'} onClick={() => updateSettings({ themeColor: 'emerald' })} />

                                <ThemeOption color="#2A0505" label="Crimson" theme="crimson" active={themeColor === 'crimson'} onClick={() => updateSettings({ themeColor: 'crimson' })} />
                                <ThemeOption color="#10001A" label="Violet" theme="violet" active={themeColor === 'violet'} onClick={() => updateSettings({ themeColor: 'violet' })} />
                            </div>

                            {/* Background Image Input */}
                            <div className="mt-4 border-t border-white/5 pt-4">
                                <label className="text-[10px] font-bold text-white/60 uppercase mb-2 block">Imagen de Fondo (Subir)</label>
                                <div className="flex gap-2 items-center">
                                    <label className="flex-1 cursor-pointer">
                                        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white w-full hover:bg-white/10 transition-colors flex items-center gap-2">
                                            {uploading ? (
                                                <span className="animate-pulse">Subiendo...</span>
                                            ) : (
                                                <>
                                                    <span className="text-white/50">Elige una imagen...</span>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                    <button
                                        onClick={clearBackground}
                                        className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white"
                                        title="Eliminar fondo"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-white/30 mt-1">Sube una imagen desde tu dispositivo para usarla de fondo.</p>
                            </div>

                            {/* Advanced Controls */}
                            <div className="mt-6 space-y-4 border-t border-white/5 pt-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-[10px] font-bold text-white/60 uppercase">Brillo</label>
                                        <span className="text-[10px] font-mono text-[#FF9800]">{Math.round((brightness || 1) * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="3"
                                        step="0.1"
                                        value={brightness || 1}
                                        onChange={(e) => updateSettings({ brightness: parseFloat(e.target.value) })}
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF9800]"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-[10px] font-bold text-white/60 uppercase">Saturación</label>
                                        <span className="text-[10px] font-mono text-[#FF9800]">{Math.round((saturation || 1) * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.1"
                                        value={saturation || 1}
                                        onChange={(e) => updateSettings({ saturation: parseFloat(e.target.value) })}
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF9800]"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. LANGUAGE (Public) */}
                    <section className="mb-6">
                        <h2 className="text-[#FF9800] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 px-1">
                            <Globe className="w-4 h-4" /> Ajustes de Idioma / Language
                        </h2>
                        <div className="bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                            <button
                                onClick={toggleLanguage}
                                className="w-full flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-sm text-white">Idioma Actual</h3>
                                        <p className="text-xs text-white/40">
                                            {language === 'es' ? 'Español (Spanish)' : 'Inglés (English)'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#FF9800] uppercase tracking-wider">
                                        {language === 'es' ? 'CAMBIAR' : 'CHANGE'}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#FF9800]" />
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* Privacy Section (User Only) */}
                    <section>
                        <h2 className="text-[#FF9800] text-xs font-bold uppercase tracking-wider mb-4 px-2">Privacidad de la Cuenta</h2>
                        <div className="bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
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
                                    onClick={user ? togglePrivacy : () => router.push('/login')}
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

                    {/* Deleted Files Manager (User Only) */}
                    {user && (
                        <section>
                            <h2 className="text-[#FF9800] text-xs font-bold uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                                <History className="w-4 h-4" /> Gestión de Archivos
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 px-2">Archivos Eliminados Recentemente</h3>
                                    <DeletedFilesManager />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* General Account Actions */}
                    <section>
                        <h2 className="text-[#FF9800] text-xs font-bold uppercase tracking-wider mb-4 px-2">Cuenta</h2>
                        <div className="bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden divide-y divide-[#222]">
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full p-4 flex items-center gap-3 hover:bg-red-900/10 transition-colors text-left text-red-500"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm font-bold">Cerrar Sesión</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => router.push('/login')}
                                    className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors text-left text-[#FF9800]"
                                >
                                    <LogOut className="w-5 h-5 rotate-180" />
                                    <span className="text-sm font-bold">Iniciar Sesión</span>
                                </button>
                            )}
                        </div>
                    </section>

                    <section className="pt-8">
                        <p className="text-center text-[10px] text-white/20 uppercase tracking-widest">
                            Speedlight Culture v1.0.0
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

const ThemeOption = ({ color, label, theme, active, onClick }: { color: string, label: string, theme: string, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
        <div
            className={`w-full aspect-square rounded-xl border-2 transition-all shadow-lg flex items-center justify-center ${active ? 'border-[#FF9800] scale-105' : 'border-transparent hover:border-white/20'}`}
            style={{ backgroundColor: color }}
        >
            {active && <div className="w-2 h-2 bg-[#FF9800] rounded-full" />}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-[#FF9800]' : 'text-white/30 group-hover:text-white/60'}`}>{label}</span>
    </button>
);
