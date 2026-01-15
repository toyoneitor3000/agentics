"use client";

import { useState, useCallback, useRef } from 'react';
import { Upload, FileVideo, ChevronLeft, Loader2, Info, Check, Clapperboard, Film } from 'lucide-react';
import { submitVideo, getCloudflareUploadUrl, getSignedUploadUrl } from '@/app/actions/cinema';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import SpotifySearch from '@/app/components/cinema/SpotifySearch';
import LocationInput from '@/app/components/LocationInput';

// Helper for file size
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function UploadFilmPage() {
    const router = useRouter();

    // MODES: 'direct' (File) | 'link' (YouTube)
    const [mode, setMode] = useState<'direct' | 'link'>('direct');

    // DATA
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [hashtags, setHashtags] = useState('');

    // STRICT FORMAT: HORIZONTAL ONLY
    const [formatError, setFormatError] = useState<string | null>(null);
    const [musicMetadata, setMusicMetadata] = useState<any>(null); // Optional for films

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
            const file = acceptedFiles[0];

            // RESET STATES
            setFormatError(null);
            setSelectedFile(file);
            setMode('direct');

            // 1. Auto-fill title
            if (!title) {
                const name = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                setTitle(name);
            }

            // 2. DETECT ORIENTATION STRICTLY (HORIZONTAL PREFERRED)
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                const isVertical = video.videoHeight > video.videoWidth;

                if (isVertical) {
                    setFormatError("⚠️ Formato Incorrecto: Detectamos un video vertical. La sección 'Cinema Films' es exclusiva para contenido horizontal (16:9). Por favor usa 'Cinema Social'.");
                    console.error("❌ Invalid Format for Cinema: Vertical detected");
                } else {
                    console.log(`🎥 Detected Valid Format: Horizontal (Cinema) [${video.videoWidth}x${video.videoHeight}]`);
                }
            };
            video.src = URL.createObjectURL(file);
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

                const originalName = selectedFile.name;
                const extIndex = originalName.lastIndexOf('.');
                let cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '');

                if (extIndex !== -1) {
                    const namePart = originalName.substring(0, extIndex).replace(/[^a-zA-Z0-9.-]/g, '');
                    const extPart = originalName.substring(extIndex).toLowerCase();
                    cleanName = `${namePart}${extPart}`;
                }

                const fileName = `${Date.now()}-${cleanName}`;

                const { signedUrl, path } = await getSignedUploadUrl(fileName);

                const interval = setInterval(() => {
                    setUploadProgress(prev => Math.min(prev + 10, 90));
                }, 500);

                let contentType = selectedFile.type;
                if ((!contentType || contentType === '') && cleanName.endsWith('.mp4')) {
                    contentType = 'video/mp4';
                }

                const uploadRes = await fetch(signedUrl, {
                    method: 'PUT',
                    body: selectedFile,
                    headers: { 'Content-Type': contentType || 'application/octet-stream' }
                });

                clearInterval(interval);

                if (!uploadRes.ok) throw new Error('Upload failed.');

                setUploadProgress(100);
                const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                return `${projectUrl}/storage/v1/object/public/cinema/${path}`;
            }

        } catch (e: any) {
            console.error(e);
            alert("Error: " + e.message);
            setIsUploading(false);
            setUploadProgress(0);
            return null;
        }
    };

    // 2. MAIN SUBMIT HANDLER
    const handleSubmit = async () => {
        if (!title) return alert("Por favor escribe un título.");
        if (mode === 'direct' && !selectedFile) return alert("Por favor selecciona un video.");
        if (mode === 'link' && !videoUrl) return alert("Por favor ingresa un enlace de video.");
        if (formatError) return alert("Error de Formato: Solo se permiten videos horizontales.");

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
                // YouTube logic
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                const match = finalVideoUrl.match(regExp);
                if (match && match[2].length === 11) {
                    finalThumb = `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
                }
            } else if (finalVideoUrl.includes('cloudflarestream.com')) {
                const uid = finalVideoUrl.split('/').pop();
                if (uid) {
                    // Cloudflare Auto-Thumbnail (High Quality)
                    finalThumb = `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg?time=1s&height=600`;
                }
            }

            console.log("Submitting FILM payload:", {
                title,
                description,
                video_url: finalVideoUrl,
                thumbnail_url: finalThumb,
                category: 'Native', // Defaulting to Native for uploaded films
                format: 'horizontal',
                music_metadata: musicMetadata,
                location: location,
                hashtags: hashtags ? hashtags.split(' ').filter(tag => tag) : undefined
            });

            await submitVideo({
                title: title,
                description: description,
                video_url: finalVideoUrl,
                thumbnail_url: finalThumb,
                category: 'Native',
                format: 'horizontal',
                music_metadata: musicMetadata,
                location: location,
                hashtags: hashtags ? hashtags.split(' ').filter(tag => tag) : undefined
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
            setMusicMetadata(null);
            setLocation('');
            setHashtags('');

        } catch (e: any) {
            console.error(e);
            alert("Error: " + e.message);
        } finally {
            setIsUploading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#0D0805] min-h-screen w-full relative font-sans text-white overflow-hidden flex flex-col items-center justify-center p-6">

            {/* BACKGROUND AMBIENCE - BLUE/ORANGE FOR CINEMA */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#FF9800]/10 to-transparent pointer-events-none blur-3xl" />

            {/* HEADER */}
            <div className="absolute top-6 left-6 md:left-12 flex items-center gap-4 z-20">
                <Link href="/create" className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase hidden md:block">Volver</span>
                </Link>
                <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                <span className="text-xl font-black italic tracking-tighter opacity-80">SPEEDLIGHT <span className="text-[#FF9800] not-italic font-normal text-xs ml-1 bg-[#FF9800]/10 px-2 py-0.5 rounded border border-[#FF9800]/20">FILMS</span></span>
            </div>

            {/* MAIN CONTENT - SPLIT LAYOUT */}
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* LEFT: UPLOAD ZONE */}
                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <span className="text-[#FF9800] text-xs font-bold tracking-[0.2em] uppercase">Cinema Studio</span>
                        <h1 className="text-4xl md:text-6xl font-black font-oswald uppercase leading-none">
                            Producción <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Cinematográfica</span>
                        </h1>
                    </div>

                    {/* MODE A: DIRECT FILE UPLAOD */}
                    {mode === 'direct' && (
                        <div
                            {...getRootProps()}
                            className={`
                            relative w-full aspect-video rounded-3xl border-2 border-dashed transition-all duration-500 group cursor-pointer overflow-hidden
                            ${isDragActive ? 'border-[#FF9800] bg-[#FF9800]/5 scale-[1.02]' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}
                            ${selectedFile ? 'border-solid border-[#FF9800]/50 bg-black' : ''}
                            ${formatError ? 'border-red-500 bg-red-500/5 ring-1 ring-red-500' : ''}
                        `}
                        >
                            <input {...getInputProps()} />

                            {/* 1. IDLE STATE */}
                            {!selectedFile && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <Clapperboard className="w-8 h-8 text-white/50 group-hover:text-[#FF9800] transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Sube tu Film (Cine)</h3>
                                    <p className="text-white/40 text-sm max-w-xs">Formato 16:9 Requerido.<br />Soporta 4K HDR. Máxima calidad.</p>
                                    <div className="mt-8 px-6 py-2 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all">
                                        Explorar Archivos
                                    </div>
                                </div>
                            )}

                            {/* 2. SELECTED / UPLOADING STATE */}
                            {selectedFile && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">

                                    {formatError ? (
                                        <div className="text-center px-8 animate-in zoom-in duration-300">
                                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                                                <Info className="w-8 h-8 text-red-500" />
                                            </div>
                                            <h3 className="text-lg font-bold text-red-500 mb-2">Formato Incorrecto</h3>
                                            <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto">{formatError}</p>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setFormatError(null); }}
                                                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
                                            >
                                                Intentar de nuevo
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center">
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
                                                    {isUploading ? `Subiendo ${uploadProgress}%` : formatFileSize(selectedFile.size) + ' • LISTO (CINEMA)'}
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

                                                {!isUploading && !isSubmitting && (
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
                            )}
                        </div>
                    )}

                    {/* MODE B: EXTERNAL LINK IMPORT */}
                    {mode === 'link' && (
                        <div className="relative w-full aspect-video rounded-3xl border border-white/10 bg-white/5 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-500">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Importar desde YouTube</h3>
                            <input
                                type="url"
                                placeholder="Pega el enlace aquí (https://youtube.com/...)"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                className="w-full max-w-md bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF9800] text-sm transition-colors mb-2"
                            />
                            <p className="text-white/40 text-xs">Soporta YouTube, Vimeo o enlaces directos MP4.</p>
                        </div>
                    )}

                    {/* MODE SWITCHER */}
                    <div className="flex gap-8 justify-center lg:justify-start pt-2">
                        <button
                            onClick={() => setMode('direct')}
                            className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-colors ${mode === 'direct' ? 'text-white border-[#FF9800]' : 'text-white/30 border-transparent hover:text-white'}`}
                        >
                            Archivo Directo
                        </button>
                        <button
                            onClick={() => setMode('link')}
                            className={`text-xs font-bold uppercase tracking-widest pb-2 border-b-2 transition-colors ${mode === 'link' ? 'text-white border-[#FF9800]' : 'text-white/30 border-transparent hover:text-white'}`}
                        >
                            Importar Link
                        </button>
                    </div>
                </div>


                {/* RIGHT: METADATA FORM */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden group/form will-change-transform">
                    {/* Glass Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    <div className="space-y-4 relative z-10 transition-opacity duration-300" style={{ opacity: formatError ? 0.3 : 1, pointerEvents: formatError ? 'none' : 'auto' }}>
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

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Ubicación</label>
                            <LocationInput
                                value={location}
                                onChange={setLocation}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Hashtags (separados por espacio)</label>
                            <input
                                type="text"
                                value={hashtags}
                                onChange={(e) => setHashtags(e.target.value)}
                                placeholder="#movie #cinema #racing"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF9800] text-sm transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-4 mt-auto space-y-4 relative z-10 transition-opacity duration-300" style={{ opacity: formatError ? 0.3 : 1, pointerEvents: formatError ? 'none' : 'auto' }}>

                        {/* SPOTIFY SEARCH INTEGRATION */}
                        <div className="pt-2">
                            <SpotifySearch onSelect={(track: any) => setMusicMetadata(track)} />
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-[#FF9800]/5 rounded-xl border border-[#FF9800]/20">
                            <Info className="w-5 h-5 text-[#FF9800] shrink-0 mt-0.5" />
                            <p className="text-[10px] text-white/60 leading-relaxed">
                                Al publicar, confirmas que tienes los derechos de este contenido.
                                El material será procesado en <strong>High Bitrate</strong>.
                            </p>
                        </div>

                        <button
                            disabled={isUploading || isSubmitting || (mode === 'direct' && (!selectedFile || !!formatError)) || (mode === 'link' && !videoUrl)}
                            onClick={handleSubmit}
                            className={`
                                w-full py-5 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 relative overflow-hidden group/btn shadow-xl
                                ${isUploading || isSubmitting || (mode === 'direct' && (!selectedFile || !!formatError)) || (mode === 'link' && !videoUrl) ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-[#FF9800] text-black hover:scale-[1.02] hover:shadow-[#FF9800]/20'}
                            `}
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {(isUploading || isSubmitting) ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <span>Publicar Masterpiece</span>
                                )}
                            </div>
                            {/* Filling effect */}
                            <div className={`absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ${(isUploading || isSubmitting) ? 'hidden' : ''}`} />
                        </button>
                    </div>
                </div>

            </div>

            {/* === SUCCESS MODAL === */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        {/* Status Light */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF9800] to-transparent opacity-80" />

                        <div className="w-20 h-20 bg-[#FF9800]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#FF9800]/20">
                            <Check className="w-10 h-10 text-[#FF9800]" />
                        </div>

                        <h2 className="text-2xl font-black font-oswald text-white uppercase mb-2">¡Film Enviado!</h2>
                        <p className="text-white/60 text-sm mb-8 leading-relaxed">
                            Tu obra <strong className="text-white">"{successDetails?.title}"</strong> se está procesando en 4K. Te notificaremos cuando esté live.
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
