'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Music, CheckCircle, XCircle, Play, Pause, AlertTriangle } from 'lucide-react';
import { getVideosWithoutMusic, updateVideoMusic, identifyMusicFromAudio } from '@/app/actions/musicBatch';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

interface VideoToProcess {
    id: string;
    title: string;
    videoUrl: string;
    status?: 'pending' | 'processing' | 'success' | 'error' | 'skipped';
    music?: { name: string; artist: string };
    error?: string;
}

export default function MusicBatchPage() {
    const [videos, setVideos] = useState<VideoToProcess[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [stats, setStats] = useState({ processed: 0, success: 0, errors: 0 });
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

    // Load videos on mount
    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        setIsLoading(true);
        const result = await getVideosWithoutMusic();
        if (result.error) {
            alert(result.error);
            return;
        }
        setVideos(result.videos?.map(v => ({ ...v, status: 'pending' })) || []);
        setIsLoading(false);
    };

    const loadFFmpeg = async () => {
        if (ffmpegRef.current && ffmpegLoaded) return ffmpegRef.current;

        ffmpegRef.current = new FFmpeg();
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

        await ffmpegRef.current.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });

        setFfmpegLoaded(true);
        return ffmpegRef.current;
    };

    const extractAudioFromUrl = async (videoUrl: string): Promise<string | null> => {
        try {
            const ffmpeg = await loadFFmpeg();

            // Get Cloudflare download URL if needed
            let downloadUrl = videoUrl;
            const cfMatch = videoUrl.match(/(?:cloudflarestream\.com|watch\.cloudflarestream\.com)\/([a-zA-Z0-9]+)/);
            if (cfMatch) {
                downloadUrl = `https://videodelivery.net/${cfMatch[1]}/downloads/default.mp4`;
            }

            // Download video
            const response = await fetch(downloadUrl);
            if (!response.ok) throw new Error('Download failed');
            const videoBlob = await response.blob();
            const videoBuffer = await videoBlob.arrayBuffer();

            // Write to FFmpeg
            await ffmpeg.writeFile('input.mp4', new Uint8Array(videoBuffer));

            // Extract 15s of audio
            await ffmpeg.exec([
                '-i', 'input.mp4',
                '-t', '15',
                '-vn',
                '-ac', '1',
                '-ar', '44100',
                '-b:a', '128k',
                'output.mp3'
            ]);

            const audioData = await ffmpeg.readFile('output.mp3');
            const audioBuffer = (audioData as Uint8Array).buffer as ArrayBuffer;

            // Convert to base64
            const base64 = btoa(
                new Uint8Array(audioBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            // Cleanup
            await ffmpeg.deleteFile('input.mp4');
            await ffmpeg.deleteFile('output.mp3');

            return base64;
        } catch (e) {
            console.error('Audio extraction error:', e);
            return null;
        }
    };

    const processVideo = async (video: VideoToProcess, index: number) => {
        // Update status to processing
        setVideos(prev => prev.map((v, i) => i === index ? { ...v, status: 'processing' } : v));

        try {
            // 1. Extract audio
            const audioBase64 = await extractAudioFromUrl(video.videoUrl);
            if (!audioBase64) {
                throw new Error('No se pudo extraer audio');
            }

            // 2. Identify music
            const result = await identifyMusicFromAudio(audioBase64);

            if (result.success && result.data) {
                // 3. Update database
                await updateVideoMusic(video.id, result.data);

                setVideos(prev => prev.map((v, i) => i === index ? {
                    ...v,
                    status: 'success',
                    music: result.data
                } : v));

                setStats(prev => ({ ...prev, processed: prev.processed + 1, success: prev.success + 1 }));
            } else {
                setVideos(prev => prev.map((v, i) => i === index ? {
                    ...v,
                    status: 'error',
                    error: result.error || 'No identificado'
                } : v));
                setStats(prev => ({ ...prev, processed: prev.processed + 1, errors: prev.errors + 1 }));
            }
        } catch (e: any) {
            setVideos(prev => prev.map((v, i) => i === index ? {
                ...v,
                status: 'error',
                error: e.message
            } : v));
            setStats(prev => ({ ...prev, processed: prev.processed + 1, errors: prev.errors + 1 }));
        }
    };

    const startProcessing = async () => {
        setIsProcessing(true);
        setStats({ processed: 0, success: 0, errors: 0 });

        for (let i = 0; i < videos.length; i++) {
            if (videos[i].status === 'pending') {
                setCurrentIndex(i);
                await processVideo(videos[i], i);

                // Rate limit: wait 2 seconds between requests to respect ACRCloud free tier
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        setIsProcessing(false);
    };

    const stopProcessing = () => {
        setIsProcessing(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0D0805] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#FF9800] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D0805] text-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black font-oswald uppercase mb-2">
                        <Music className="inline w-8 h-8 mr-2 text-[#FF9800]" />
                        Identificación de Música
                    </h1>
                    <p className="text-white/60">
                        Procesamiento automático de videos sin información de música
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-white">{videos.length}</div>
                        <div className="text-xs text-white/50 uppercase">Total</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-[#FF9800]">{stats.processed}</div>
                        <div className="text-xs text-white/50 uppercase">Procesados</div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-500">{stats.success}</div>
                        <div className="text-xs text-white/50 uppercase">Exitosos</div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-red-500">{stats.errors}</div>
                        <div className="text-xs text-white/50 uppercase">Errores</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4 mb-8">
                    {!isProcessing ? (
                        <button
                            onClick={startProcessing}
                            disabled={videos.length === 0}
                            className="flex items-center gap-2 px-6 py-3 bg-[#FF9800] text-black font-bold uppercase text-sm rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                        >
                            <Play className="w-4 h-4" />
                            Iniciar Procesamiento
                        </button>
                    ) : (
                        <button
                            onClick={stopProcessing}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-bold uppercase text-sm rounded-xl hover:scale-105 transition-transform"
                        >
                            <Pause className="w-4 h-4" />
                            Detener
                        </button>
                    )}

                    <button
                        onClick={loadVideos}
                        disabled={isProcessing}
                        className="px-6 py-3 bg-white/10 text-white font-bold uppercase text-sm rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
                    >
                        Recargar Lista
                    </button>
                </div>

                {/* Warning */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-yellow-200 font-bold">Importante</p>
                        <p className="text-xs text-white/60">
                            Este proceso descarga cada video para extraer el audio. Mantenga esta ventana abierta.
                            Hay un delay de 2 segundos entre cada video para respetar los límites de ACRCloud (Free Tier).
                        </p>
                    </div>
                </div>

                {/* Video List */}
                <div className="space-y-2">
                    {videos.map((video, index) => (
                        <div
                            key={video.id}
                            className={`
                                flex items-center gap-4 p-4 rounded-xl border transition-all
                                ${video.status === 'processing' ? 'bg-[#FF9800]/10 border-[#FF9800]/30' : ''}
                                ${video.status === 'success' ? 'bg-green-500/10 border-green-500/20' : ''}
                                ${video.status === 'error' ? 'bg-red-500/10 border-red-500/20' : ''}
                                ${video.status === 'pending' ? 'bg-white/5 border-white/10' : ''}
                            `}
                        >
                            {/* Status Icon */}
                            <div className="w-8 h-8 flex items-center justify-center">
                                {video.status === 'pending' && <div className="w-2 h-2 bg-white/30 rounded-full" />}
                                {video.status === 'processing' && <Loader2 className="w-5 h-5 text-[#FF9800] animate-spin" />}
                                {video.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                {video.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{video.title}</p>
                                {video.music && (
                                    <p className="text-xs text-green-400">♫ {video.music.name} - {video.music.artist}</p>
                                )}
                                {video.error && (
                                    <p className="text-xs text-red-400">{video.error}</p>
                                )}
                            </div>

                            {/* Position */}
                            <div className="text-xs text-white/30">
                                #{index + 1}
                            </div>
                        </div>
                    ))}

                    {videos.length === 0 && (
                        <div className="text-center py-12 text-white/40">
                            <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Todos los videos ya tienen información de música</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
