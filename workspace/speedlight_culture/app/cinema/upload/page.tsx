"use client";

import { useState, useEffect, useRef } from 'react';
import { Youtube, Link as LinkIcon, AlertTriangle, CheckCircle2, MonitorPlay, Loader2, UploadCloud, FileVideo, X } from 'lucide-react';
import { submitVideo, getSignedUploadUrl } from '@/app/actions/cinema';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function UploadReelPage() {
    const router = useRouter();

    // State
    const [mode, setMode] = useState<'youtube' | 'native'>('youtube');
    const [url, setUrl] = useState('');
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Native Upload State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Extract YouTube ID
    useEffect(() => {
        if (mode !== 'youtube') return;

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
    }, [url, mode]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation: Max 50MB for Free Tier safety
        if (file.size > 50 * 1024 * 1024) {
            alert("El archivo supera el límite de 50MB del plan gratuito. Por favor optimiza tu video o usa YouTube.");
            return;
        }

        setSelectedFile(file);
        setIsValid(true); // Technically valid to start upload
        // Create a fake object URL for preview if browser supports it (for <video>)
        const infoUrl = URL.createObjectURL(file);
        setThumbnail(null); // Clear thumb, we might want to show a video preview instead or generic icon
    };

    const uploadFileToSupabase = async () => {
        if (!selectedFile) return null;

        try {
            setIsUploading(true);
            setUploadProgress(10); // Start

            // 1. Get Signed URL
            const fileName = `${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const { signedUrl, path, fullPath } = await getSignedUploadUrl(fileName);

            setUploadProgress(30);

            // 2. Upload via PUT
            const uploadRes = await fetch(signedUrl, {
                method: 'PUT',
                body: selectedFile,
                headers: {
                    'Content-Type': selectedFile.type
                }
            });

            if (!uploadRes.ok) throw new Error('Upload failed');

            setUploadProgress(80);

            // 3. Get Public URL (Construct it manually or need another action? Supabase usually follows pattern)
            // Pattern: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
            // We know the bucket is 'cinema' from action.
            const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // e.g. https://xyz.supabase.co
            const publicUrl = `${projectUrl}/storage/v1/object/public/cinema/${path}`; // path returned from action

            setUploadProgress(100);
            return publicUrl;
        } catch (e) {
            console.error(e);
            alert("Error subiendo el archivo. Intenta de nuevo.");
            setIsUploading(false);
            setUploadProgress(0);
            return null;
        }
    };

    const handleSubmit = async () => {
        if (!isValid || !formData.title.trim()) return;

        setIsSubmitting(true);
        try {
            let finalUrl = url;

            // Handle Native Upload First
            if (mode === 'native' && selectedFile) {
                const uploadedUrl = await uploadFileToSupabase();
                if (!uploadedUrl) {
                    setIsSubmitting(false);
                    return;
                }
                finalUrl = uploadedUrl;
            }

            await submitVideo({
                title: formData.title,
                description: formData.description,
                video_url: finalUrl,
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
            setIsUploading(false); // Valid cleanup
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

                            {/* Tabs Switch */}
                            <div className="flex bg-black p-1 rounded-xl border border-white/10 w-fit mx-auto mb-4">
                                <button
                                    onClick={() => { setMode('youtube'); setIsValid(false); setUrl(''); }}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${mode === 'youtube' ? 'bg-[#FF9800] text-black' : 'text-white/50 hover:text-white'}`}
                                >
                                    <Youtube className="w-4 h-4" /> YouTube
                                </button>
                                <button
                                    onClick={() => { setMode('native'); setIsValid(false); setSelectedFile(null); }}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${mode === 'native' ? 'bg-[#FF9800] text-black' : 'text-white/50 hover:text-white'}`}
                                >
                                    <UploadCloud className="w-4 h-4" /> Nativo (Beta)
                                </button>
                            </div>

                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-[#FF9800]/10 rounded-full flex items-center justify-center mx-auto text-[#FF9800]">
                                    <MonitorPlay className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold font-oswald uppercase">
                                    {mode === 'youtube' ? 'Cinema Cloud Link' : 'Subida Directa'}
                                </h3>
                                <p className="text-white/50 text-sm max-w-md mx-auto">
                                    {mode === 'youtube'
                                        ? "Conecta tu contenido 4K desde servidores globales de alta velocidad."
                                        : "Sube archivos MP4 directamente. Máximo 50MB (Free Tier)."
                                    }
                                </p>
                            </div>

                            {mode === 'youtube' ? (
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
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative border-2 border-dashed ${selectedFile ? 'border-[#FF9800] bg-[#FF9800]/5' : 'border-white/20 hover:border-white/40 hover:bg-white/5'} rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all h-40`}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="video/mp4,video/quicktime,video/webm"
                                        onChange={handleFileSelect}
                                    />
                                    {selectedFile ? (
                                        <>
                                            <FileVideo className="w-8 h-8 text-[#FF9800] mb-2" />
                                            <span className="text-white font-bold text-sm">{selectedFile.name}</span>
                                            <span className="text-white/50 text-xs">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="w-8 h-8 text-white/50 mb-2" />
                                            <span className="text-white/70 font-bold text-sm">Click para seleccionar</span>
                                            <span className="text-white/30 text-xs mt-1">MP4, MOV (Max 50MB)</span>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Preview (Only for YouTube for now, Native handled differently) */}
                            {mode === 'youtube' && isValid && thumbnail && (
                                <div className="rounded-xl overflow-hidden border border-[#FF9800]/20 relative aspect-video group bg-black">
                                    <Image
                                        src={thumbnail}
                                        alt="Preview"
                                        fill
                                        className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-[#FF9800] rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,152,0,0.5)] group-hover:scale-110 transition-transform">
                                            <MonitorPlay className="w-10 h-10 ml-1" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Upload Progress (Native) */}
                            {mode === 'native' && isUploading && (
                                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                    <div className="bg-[#FF9800] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
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
