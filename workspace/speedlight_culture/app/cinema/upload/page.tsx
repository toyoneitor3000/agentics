"use client";

import { useState, useCallback, useRef } from 'react';
import { Upload, FileVideo, ChevronLeft, Loader2, Info, Check } from 'lucide-react';
import { submitVideo, getSignedUploadUrl } from '@/app/actions/cinema';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';

// Helper for file size
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function UploadReelPage() {
    const router = useRouter();

    // MODES: 'direct' (File) | 'link' (YouTube) - Keeping structure if we add link back later
    const [mode, setMode] = useState<'direct' | 'link'>('direct');

    // DATA
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // UI STATES
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Success Modal State
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successDetails, setSuccessDetails] = useState<{ title: string } | null>(null);

    // DROPZONE CONFIG
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            setSelectedFile(acceptedFiles[0]);
            setMode('direct');

            // Auto-fill title if empty
            if (!title) {
                const name = acceptedFiles[0].name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                setTitle(name);
            }
        }
    }, [title]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/*': ['.mp4', '.mov', '.webm', '.mkv']
        },
        maxFiles: 1,
        multiple: false
    });

    // 1. SMART UPLOAD LOGIC (Cloudflare > Supabase)
    const uploadFile = async () => {
        if (!selectedFile) return null;

        try {
            setIsUploading(true);
            setUploadProgress(5);

            // Dynamically import to ensure client-side execution safety for these actions if needed
            const { getCloudflareUploadUrl, getSignedUploadUrl } = await import('@/app/actions/cinema');

            const cfResult = await getCloudflareUploadUrl();

            if (cfResult && cfResult.provider === 'cloudflare') {
                // --- CLOUDFLARE UPLOAD FLOW ---
                console.log("🚀 Using Cloudflare Engine");

                const formData = new FormData();
                formData.append('file', selectedFile);

                const xhr = new XMLHttpRequest();

                return new Promise<string | null>((resolve, reject) => {
                    xhr.open('POST', cfResult.uploadUrl, true);

                    xhr.upload.onprogress = (e) => {
                        if (e.lengthComputable) {
                            const percentComplete = (e.loaded / e.total) * 100;
                            setUploadProgress(Math.round(percentComplete));
                        }
                    };

                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            const watchUrl = `https://watch.cloudflarestream.com/${cfResult.uid}`;
                            setUploadProgress(100);
                            resolve(watchUrl);
                        } else {
                            reject(new Error('Cloudflare Upload Failed'));
                        }
                    };

                    xhr.onerror = () => reject(new Error('Network Error'));
                    xhr.send(formData);
                });

            } else {
                // --- SUPABASE FALLBACK FLOW (Legacy/Free) ---
                console.log("⚠️ Fallback to Supabase Storage");

                if (selectedFile.size > 50 * 1024 * 1024) {
                    throw new Error("Sin Cloudflare configurado, el límite es 50MB. Añade las claves API o reduce el archivo.");
                }

                const fileName = `${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
                const { signedUrl, path } = await getSignedUploadUrl(fileName);

                const interval = setInterval(() => {
                    setUploadProgress(prev => Math.min(prev + 10, 90));
                }, 500);

                const uploadRes = await fetch(signedUrl, {
                    method: 'PUT',
                    body: selectedFile,
                    headers: { 'Content-Type': selectedFile.type }
                });

                clearInterval(interval);

                if (!uploadRes.ok) throw new Error('Upload failed.');

                setUploadProgress(100);
                const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                return `${projectUrl}/storage/v1/object/public/cinema/${path}`;
            }

        } catch (e: any) {
            console.error(e);
            alert("Error: " + e.message); // Fallback alert for upload specific errors
            setIsUploading(false);
            setUploadProgress(0);
            return null;
        }
    };

    // 2. MAIN SUBMIT HANDLER
    const handleSubmit = async () => {
        if (!title) return alert("Por favor escribe un título.");
        if (mode === 'direct' && !selectedFile) return alert("Por favor selecciona un video.");

        setIsSubmitting(true);

        try {
            let finalVideoUrl = '';

            if (mode === 'direct') {
                const url = await uploadFile();
                if (!url) {
                    setIsSubmitting(false);
                    return;
                }
                finalVideoUrl = url;
            } else {
                finalVideoUrl = videoUrl;
            }

            // GENERATE THUMBNAIL (Cloudflare Logic)
            let finalThumb = undefined;
            if (mode === 'link') {
                // YouTube logic would go here if we had meta
            } else if (finalVideoUrl.includes('cloudflarestream.com')) {
                const uid = finalVideoUrl.split('/').pop();
                if (uid) {
                    // Cloudflare Auto-Thumbnail (High Quality)
                    finalThumb = `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg?time=1s&height=600`;
                }
            }

            // Save to DB
            await submitVideo({
                title: title,
                description: description,
                video_url: finalVideoUrl,
                thumbnail_url: finalThumb,
                category: 'Native'
            });

            // SUCCESS!
            setSuccessDetails({ title });
            setShowSuccessModal(true);

            // Reset Form
            setSelectedFile(null);
            setVideoUrl('');
            setTitle('');
            setDescription('');
            setUploadProgress(0);

        } catch (e: any) {
            console.error(e);
            alert("Error: " + e.message);
        } finally {
            setIsUploading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen w-full relative font-sans text-white overflow-hidden flex flex-col items-center justify-center p-6">

            {/* BACKGROUND AMBIENCE */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#FF9800]/10 to-transparent pointer-events-none blur-3xl" />

            {/* HEADER */}
            <div className="absolute top-6 left-6 md:left-12 flex items-center gap-4 z-20">
                <Link href="/cinema" className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase hidden md:block">Volver a Cinema</span>
                </Link>
                <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                {/* Logo or Title if logo not available */}
                <span className="text-xl font-black italic tracking-tighter opacity-80">SPEEDLIGHT</span>
            </div>

            {/* MAIN CONTENT - SPLIT LAYOUT */}
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* LEFT: UPLOAD ZONE (Huge & Interactive) */}
                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <span className="text-[#FF9800] text-xs font-bold tracking-[0.2em] uppercase">Creator Studio</span>
                        <h1 className="text-4xl md:text-6xl font-black font-oswald uppercase leading-none">
                            Sube tu <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Masterpiece</span>
                        </h1>
                    </div>

                    <div
                        {...getRootProps()}
                        className={`
                            relative w-full aspect-video rounded-3xl border-2 border-dashed transition-all duration-500 group cursor-pointer overflow-hidden
                            ${isDragActive ? 'border-[#FF9800] bg-[#FF9800]/5 scale-[1.02]' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}
                            ${selectedFile ? 'border-solid border-[#FF9800]/50 bg-black' : ''}
                        `}
                    >
                        <input {...getInputProps()} />

                        {/* 1. IDLE STATE */}
                        {!selectedFile && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Upload className="w-8 h-8 text-white/50 group-hover:text-[#FF9800] transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Arrastra tu video aquí</h3>
                                <p className="text-white/40 text-sm max-w-xs">Soporta MP4, MOV, WebM. <br /> Calidad hasta 4K HDR sin límites.</p>
                                <div className="mt-8 px-6 py-2 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all">
                                    Explorar Archivos
                                </div>
                            </div>
                        )}

                        {/* 2. SELECTED / UPLOADING STATE */}
                        {selectedFile && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
                                <div className="w-16 h-16 mb-4 relative">
                                    {/* Spinner */}
                                    {isUploading && (
                                        <div className="absolute inset-0 border-4 border-white/10 border-t-[#FF9800] rounded-full animate-spin"></div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FileVideo className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                <div className="text-center w-full px-12">
                                    <h3 className="text-lg font-bold text-white mb-1 truncate w-full">{selectedFile.name.toUpperCase()}</h3>
                                    <p className="text-[#FF9800] text-xs font-bold tracking-widest uppercase mb-4">
                                        {isUploading ? `Subiendo ${uploadProgress}%` : formatFileSize(selectedFile.size) + ' • LISTO PARA PROCESAR'}
                                    </p>

                                    {/* Progress Bar */}
                                    {isUploading && (
                                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#FF9800] transition-all duration-300 ease-out"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    )}

                                    {!isUploading && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                            className="text-white/30 hover:text-white text-xs underline decoration-dotted transition-colors"
                                        >
                                            Cambiar archivo
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* MODE SWITCHER */}
                    <div className="flex gap-8 justify-center lg:justify-start pt-2">
                        <button
                            className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-colors ${mode === 'direct' ? 'text-white border-[#FF9800]' : 'text-white/30 border-transparent hover:text-white'}`}
                        >
                            Archivo Directo
                        </button>
                        <button
                            className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-colors ${mode === 'link' ? 'text-white border-[#FF9800]' : 'text-white/30 border-transparent hover:text-white'}`}
                            onClick={() => {
                                // Simple toggle logic if we ever re-enable link mode UI properly
                                // For now it's just a visual tab
                                setMode(prev => prev === 'direct' ? 'link' : 'direct');
                            }}
                        >
                            Importar Link
                        </button>
                    </div>
                </div>


                {/* RIGHT: METADATA FORM */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden group/form will-change-transform">
                    {/* Glass Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    <div className="space-y-4 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Título de la Obra</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "EJ: TRIBUTO PORSCHE 911"}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF9800] text-lg font-bold transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Descripción</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Añade contexto, créditos y detalles técnicos..."
                                rows={4}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF9800] text-sm font-medium transition-colors resize-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4 mt-auto space-y-4 relative z-10">
                        <div className="flex items-start gap-3 p-4 bg-[#FF9800]/5 rounded-xl border border-[#FF9800]/20">
                            <Info className="w-5 h-5 text-[#FF9800] shrink-0 mt-0.5" />
                            <p className="text-[10px] text-white/60 leading-relaxed">
                                Al publicar, confirmas que tienes los derechos de este contenido.
                                El material será procesado en <strong>High Bitrate</strong>.
                            </p>
                        </div>

                        <button
                            disabled={!selectedFile || isUploading}
                            onClick={handleSubmit}
                            className={`
                                w-full py-5 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 relative overflow-hidden group/btn shadow-xl
                                ${(!selectedFile || isUploading) ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-[#FF9800] text-black hover:scale-[1.02] hover:shadow-[#FF9800]/20'}
                            `}
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <span>Publicar Masterpiece</span>
                                )}
                            </div>
                            {/* Filling effect */}
                            <div className={`absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ${isUploading ? 'hidden' : ''}`} />
                        </button>
                    </div>
                </div>

            </div>

            {/* === SUCCESS MODAL === */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        {/* Status Light */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-80" />

                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                            <Check className="w-10 h-10 text-green-500" />
                        </div>

                        <h2 className="text-2xl font-black font-oswald text-white uppercase mb-2">¡Subida Exitosa!</h2>
                        <p className="text-white/60 text-sm mb-8 leading-relaxed">
                            Tu obra <strong className="text-white">"{successDetails?.title}"</strong> se está procesando en nuestros servidores 4K y estará disponible en breve.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Link href="/cinema" className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:scale-[1.02] transition-transform">
                                Ir al Cinema
                            </Link>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-4 bg-white/5 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-colors"
                            >
                                Subir Otro
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
