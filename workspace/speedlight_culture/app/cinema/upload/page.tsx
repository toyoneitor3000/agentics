"use client";

import { useState, useEffect } from 'react';
import { Youtube, Link as LinkIcon, AlertTriangle, CheckCircle2, MonitorPlay, Loader2 } from 'lucide-react';
import { submitVideo } from '@/app/actions/cinema';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function UploadReelPage() {
    const router = useRouter();

    // State
    const [url, setUrl] = useState('');
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Extract YouTube ID
    useEffect(() => {
        const extractYoutubeId = (url: string) => {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        };

        const id = extractYoutubeId(url);
        if (id) {
            setIsValid(true);
            setThumbnail(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`);
        } else {
            setIsValid(false);
            setThumbnail(null);
        }
    }, [url]);

    const handleSubmit = async () => {
        if (!isValid || !formData.title.trim()) return;

        setIsSubmitting(true);
        try {
            await submitVideo({
                title: formData.title,
                description: formData.description,
                video_url: url,
                thumbnail_url: thumbnail || undefined,
                category: 'General'
            });

            // Use verify-style alert
            const shouldGo = confirm('¡Éxito! Tu video ha sido importado al ecosistema Cinema.\n\n¿Ir a la galería ahora?');
            if (shouldGo) router.push('/cinema');

        } catch (error: any) {
            console.error(error);
            alert('Error: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 md:pl-[244px] md:pt-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <span className="bg-[#FF9800] text-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                        Studio
                    </span>
                    <h1 className="text-3xl font-oswald font-bold uppercase">Submit to Cinema</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Input Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* URL Input Input */}
                        <div className="bg-[#111] p-8 rounded-2xl border border-white/10 space-y-6">
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-[#FF9800]/10 rounded-full flex items-center justify-center mx-auto text-[#FF9800]">
                                    <MonitorPlay className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold font-oswald uppercase">Cinema Cloud Link</h3>
                                <p className="text-white/50 text-sm max-w-md mx-auto">
                                    Conecta tu contenido 4K desde servidores globales de alta velocidad.
                                    <br />
                                    <span className="text-xs text-white/30">Motor de streaming nativo compatible con YouTube, Vimeo, etc.</span>
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                                    <LinkIcon className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Pega el enlace de video de alta calidad..."
                                    className={`w-full bg-black border ${isValid ? 'border-[#FF9800]/50' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#FF9800] transition-colors`}
                                />
                            </div>

                            {/* Preview with Custom Player Skin */}
                            {isValid && thumbnail && (
                                <div className="rounded-xl overflow-hidden border border-[#FF9800]/20 relative aspect-video group bg-black">
                                    <Image
                                        src={thumbnail}
                                        alt="Preview"
                                        fill
                                        className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700"
                                    />
                                    {/* Custom Player Overlay - This proves to user it wont look like generic YT */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-[#FF9800] rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,152,0,0.5)] group-hover:scale-110 transition-transform">
                                            <MonitorPlay className="w-10 h-10 ml-1" />
                                        </div>
                                    </div>

                                    {/* Native Controls Simulation */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                                        <div className="h-1 bg-white/20 rounded-full mb-3 overflow-hidden">
                                            <div className="h-full w-1/3 bg-[#FF9800]"></div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/80">
                                            <div className="flex gap-4">
                                                <span>Cinema Mode</span>
                                                <span className="text-[#FF9800]">4K HDR</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <span>Stream Ready</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Metadata Form */}
                        <div className="bg-[#111] p-6 rounded-2xl border border-white/5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-white/50 mb-2">Título</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Ej: Midnight Run GT3"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FF9800] outline-none transition-colors"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-white/50 mb-2">Descripción / Créditos</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Cuenta la historia detrás del build..."
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FF9800] outline-none transition-colors"
                                    disabled={isSubmitting}
                                ></textarea>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !isValid || !formData.title}
                                className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-black font-bold uppercase tracking-widest py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sincronizando...
                                    </>
                                ) : (
                                    <>
                                        <MonitorPlay className="w-5 h-5" />
                                        Importar a Cinema
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Guidelines */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#FF9800]/20 sticky top-4">
                            <h3 className="font-oswald font-bold text-lg uppercase mb-4 flex items-center gap-2">
                                <MonitorPlay className="w-5 h-5 text-[#FF9800]" />
                                Guía para Creadores
                            </h3>

                            <p className="text-sm text-white/70 mb-6 leading-relaxed">
                                Speedlight Cinema es el espacio premium. Al usar YouTube, garantizamos la mejor calidad de streaming mundial 4K/60fps sin costo para ti.
                            </p>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm">Sube a tu canal</h4>
                                        <p className="text-xs text-white/50">Sube el video a tu canal personal. Puede estar en modo "Oculto" (Unlisted) si quieres que sea exclusivo de aquí.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm">Comparte el Link</h4>
                                        <p className="text-xs text-white/50">Copia el enlace y pégalo aquí. Nosotros nos encargamos del resto.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <div className="flex items-start gap-3 bg-[#FF9800]/10 p-3 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-[#FF9800] shrink-0" />
                                    <p className="text-[10px] text-[#FF9800] font-bold leading-tight">
                                        Tu video ganará visitas directamente en tu canal. ¡Es un win-win!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
