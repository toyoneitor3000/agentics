"use client";

import { useState, useCallback, useRef } from 'react';
import { Upload, FileVideo, ChevronLeft, Loader2, Info, Check, Smartphone } from 'lucide-react';
import { submitVideo, getCloudflareUploadUrl, getSignedUploadUrl } from '@/app/actions/cinema';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import SpotifySearch from '@/app/components/cinema/SpotifySearch';
import LocationInput from '@/app/components/LocationInput';
import { extractAudioSnippet } from '@/app/utils/ffmpegClient';
import { identifyAudio } from '@/app/actions/music';
import { toast } from 'sonner';

// Helper for file size
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function UploadSocialPage() {
    const router = useRouter();

    // MODES: 'direct' (File) | 'link' (YouTube) - Keeping structure if we add link back later
    const [mode, setMode] = useState<'direct' | 'link'>('direct');

    // DATA
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // STRICT FORMAT: VERTICAL ONLY
    const [formatError, setFormatError] = useState<string | null>(null);
    const [musicMetadata, setMusicMetadata] = useState<any>(null);
    const [location, setLocation] = useState('');
    const [hashtags, setHashtags] = useState('');

    // UI STATES
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAutoDetecting, setIsAutoDetecting] = useState(false);

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

            // 2. DETECT ORIENTATION STRICTLY
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                const isVertical = video.videoHeight > video.videoWidth;

                if (!isVertical) {
                    setFormatError("⚠️ Formato Incorrecto: Este espacio es solo para videos verticales (9:16). Por favor sube tu video en la sección 'Cinema Films'.");
                    console.error("❌ Invalid Format for Social: Horizontal detected");
                } else {
                    console.log(`📱 Detected Valid Format: Vertical (Social) [${video.videoWidth}x${video.videoHeight}]`);

                    // 3. AUTO-DETECT MUSIC (Only if valid format)
                    detectMusic(file);
                }
            };
            video.src = URL.createObjectURL(file);
        }
    }, [title]);

    const detectMusic = async (file: File) => {
        setIsAutoDetecting(true);
        const toastId = toast.loading("Analizando audio del video...");

        try {
            // 1. Extract audio snippet (15s)
            console.log("🔊 Extracting audio...");
            const audioBlob = await extractAudioSnippet(file, 15);

            // 2. Identify
            console.log("🎵 Identifying...");
            const formData = new FormData();
            formData.append('file', audioBlob as Blob);

            const res = await identifyAudio(formData);

            if (res.success && res.data) {
                console.log("✅ Music Detected:", res.data);
                setMusicMetadata({
                    name: res.data.name,
                    artist: res.data.artist,
                    cover: res.data.image,
                    id: 'acr-' + Date.now()
                });
                toast.success(`Música detectada: ${res.data.name}`, { id: toastId });
            } else {
                console.warn("⚠️ No music detected:", res.error);
                // Don't error blocking, just notify
                if (res.error?.includes('configuración')) {
                    toast.error("Configuración faltante para auto-detectar.", { id: toastId });
                } else {
                    toast.info("No se pudo identificar la música automáticamente.", { id: toastId });
                }
            }
        } catch (e) {
            console.error("Audio detection error", e);
            toast.error("Error analizando audio.", { id: toastId });
        } finally {
            setIsAutoDetecting(false);
        }
    };

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
        if (formatError) return alert("Error de Formato: Solo se permiten videos verticales.");

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
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                const match = finalVideoUrl.match(regExp);
                if (match && match[2].length === 11) {
                    finalThumb = `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
                }
            } else if (finalVideoUrl.includes('cloudflarestream.com')) {
                const uid = finalVideoUrl.split('/').pop();
                if (uid) {
                    finalThumb = `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg?time=1s&height=600`;
                }
            }

            console.log("Submitting SOCIAL video payload:", {
                title,
                description,
                video_url: finalVideoUrl,
                thumbnail_url: finalThumb,
                category: 'Social',
                format: 'vertical', // HARDCODED
                music_metadata: musicMetadata,
                location: location,
                hashtags: hashtags ? hashtags.split(' ').filter(tag => tag) : undefined
            });

            await submitVideo({
                title: title,
                description: description,
                video_url: finalVideoUrl,
                thumbnail_url: finalThumb,
                category: 'Social',
                format: 'vertical',
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

            {/* BACKGROUND AMBIENCE - GREEN FOR SOCIAL */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none blur-3xl" />

            {/* HEADER */}
            <div className="absolute top-6 left-6 md:left-12 flex items-center gap-4 z-20">
                <Link href="/create" className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase hidden md:block">Volver</span>
                </Link>
                <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                <span className="text-xl font-black italic tracking-tighter opacity-80">SPEEDLIGHT <span className="text-green-500 not-italic font-normal text-xs ml-1 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">SOCIAL</span></span>
            </div>

            {/* MAIN CONTENT - SPLIT LAYOUT */}
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* LEFT: UPLOAD ZONE */}
                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <span className="text-green-500 text-xs font-bold tracking-[0.2em] uppercase">Social Media Upload</span>
                        <h1 className="text-4xl md:text-6xl font-black font-oswald uppercase leading-none">
                            Comparte tu <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Historia Vertical</span>
                        </h1>
                    </div>

                    {/* DIRECT FILE UPLOADER */}
                    <div
                        {...getRootProps()}
                        className={`
                        relative w-full aspect-[9/16] md:aspect-video rounded-3xl border-2 border-dashed transition-all duration-500 group cursor-pointer overflow-hidden max-h-[500px]
                        ${isDragActive ? 'border-green-500 bg-green-500/5 scale-[1.02]' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}
                        ${selectedFile ? 'border-solid border-green-500/50 bg-black' : ''}
                        ${formatError ? 'border-red-500 bg-red-500/5 ring-1 ring-red-500' : ''}
                    `}
                    >
                        <input {...getInputProps()} />

                        {/* 1. IDLE STATE */}
                        {!selectedFile && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Smartphone className="w-8 h-8 text-white/50 group-hover:text-green-500 transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Sube tu Reel Vertical</h3>
                                <p className="text-white/40 text-sm max-w-xs">Formato 9:16 Requerido.<br />MP4, MOV. Max 60s sugerido.</p>
                                <div className="mt-8 px-6 py-2 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all">
                                    Seleccionar Video
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
                                        <p className="text-white/60 text-sm mb-6">{formatError}</p>
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
                                            {isUploading && (
                                                <div className="absolute inset-0 border-4 border-white/10 border-t-green-500 rounded-full animate-spin"></div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Smartphone className="w-6 h-6 text-white" />
                                            </div>
                                        </div>

                                        <div className="text-center w-full px-12">
                                            <h3 className="text-lg font-bold text-white mb-1 truncate w-full">{selectedFile.name.toUpperCase()}</h3>
                                            <p className="text-green-500 text-xs font-bold tracking-widest uppercase mb-4">
                                                {isUploading ? `Subiendo ${uploadProgress}%` : formatFileSize(selectedFile.size) + ' • LISTO (VERTICAL)'}
                                            </p>

                                            {isUploading && (
                                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-green-500 transition-all duration-300 ease-out"
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

                </div>


                {/* RIGHT: METADATA FORM */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden group/form will-change-transform">
                    {/* Glass Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    <div className="space-y-4 relative z-10 transition-opacity duration-300" style={{ opacity: formatError ? 0.3 : 1, pointerEvents: formatError ? 'none' : 'auto' }}>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Título del Reel</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "EJ: DRIFT NIGHT TOKYO"}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-green-500 text-lg font-bold transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Descripción</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Etiquetas, menciones y vibes..."
                                rows={4}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-green-500 text-sm font-medium transition-colors resize-none"
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
                                placeholder="#drift #jdm #night"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-green-500 text-sm transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-4 mt-auto space-y-4 relative z-10 transition-opacity duration-300" style={{ opacity: formatError ? 0.3 : 1, pointerEvents: formatError ? 'none' : 'auto' }}>

                        {/* SPOTIFY SEARCH INTEGRATION */}
                        <div className="pt-2 relative">
                            {isAutoDetecting && (
                                <div className="absolute top-0 right-0 z-20 flex items-center gap-2 text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded-full animate-pulse">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    ANALIZANDO AUDIO...
                                </div>
                            )}
                            <SpotifySearch onSelect={(track: any) => setMusicMetadata(track)} initialTrack={musicMetadata} />
                        </div>

                        <button
                            disabled={isUploading || isSubmitting || !selectedFile || !!formatError}
                            onClick={handleSubmit}
                            className={`
                                w-full py-5 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 relative overflow-hidden group/btn shadow-xl
                                ${isUploading || isSubmitting || !selectedFile || !!formatError ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-green-500 text-white hover:scale-[1.02] hover:shadow-green-500/20'}
                            `}
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {(isUploading || isSubmitting) ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <span>Publicar Reel</span>
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
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-80" />

                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                            <Check className="w-10 h-10 text-green-500" />
                        </div>

                        <h2 className="text-2xl font-black font-oswald text-white uppercase mb-2">¡Reel Publicado!</h2>
                        <p className="text-white/60 text-sm mb-8 leading-relaxed">
                            Tu contenido <strong className="text-white">"{successDetails?.title}"</strong> ya está disponible en el feed social.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Link href="/cinema" className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:scale-[1.02] transition-transform">
                                Ver Feed
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
