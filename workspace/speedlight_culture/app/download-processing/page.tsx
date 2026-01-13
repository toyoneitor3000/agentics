'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// --- HELPERS ---

// Helper to get video dimensions safely
const getVideoMetadata = async (blob: Blob): Promise<{ width: number; height: number; duration: number }> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            resolve({
                width: video.videoWidth,
                height: video.videoHeight,
                duration: video.duration
            });
            URL.revokeObjectURL(video.src);
        };
        video.onerror = () => {
            reject(new Error("No se pudo leer los metadatos del video."));
            URL.revokeObjectURL(video.src);
        };
        video.src = URL.createObjectURL(blob);
    });
};

const generateWatermarkBlob = async (logoUrl: string, videoWidth: number, videoHeight: number): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    // Calculations
    // Load Logo
    const logo = new window.Image();
    logo.crossOrigin = 'anonymous';
    logo.src = logoUrl;
    await new Promise((resolve, reject) => {
        logo.onload = () => resolve(true);
        logo.onerror = reject;
    });

    const logoAspectRatio = logo.width / logo.height;

    // Logic 
    const logoHeight = Math.min(videoWidth, videoHeight) * 0.09;
    const logoWidth = logoHeight * logoAspectRatio;

    // Measure Text
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Canvas");

    const text = 'www.speedlightculture.com';
    let fontSize = logoHeight * 0.3;
    ctx.font = `bold ${fontSize}px Arial`;
    const metrics = ctx.measureText(text);
    const scaleFactor = (logoWidth * 0.95) / metrics.width;
    const finalFontSize = fontSize * scaleFactor;

    // Resize canvas
    const spriteHeight = logoHeight + finalFontSize * 1.5;
    canvas.width = Math.ceil(Math.max(logoWidth, metrics.width) * 1.2);
    if (canvas.width < metrics.width) canvas.width = Math.ceil(metrics.width);
    canvas.height = Math.ceil(spriteHeight);

    // Draw
    const ctx2 = canvas.getContext('2d');
    if (!ctx2) throw new Error("Ctx");

    ctx2.globalAlpha = 0.5;
    const drawX = (canvas.width - logoWidth) / 2;
    ctx2.drawImage(logo, drawX, 0, logoWidth, logoHeight);

    ctx2.fillStyle = 'white';
    ctx2.strokeStyle = 'black';
    ctx2.lineWidth = 0.8;
    ctx2.font = `bold ${finalFontSize}px Arial`;
    ctx2.textAlign = 'center';

    const textY = logoHeight + finalFontSize;
    ctx2.strokeText(text, canvas.width / 2, textY);
    ctx2.fillText(text, canvas.width / 2, textY);

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to generate watermark"));
        }, 'image/png');
    });
};

function ProcessorContent() {
    const searchParams = useSearchParams();
    const videoUrl = searchParams.get('video');
    const logoUrl = searchParams.get('logo') || '/logonavbar.png';

    const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle');
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Iniciando...');
    const [errorMsg, setErrorMsg] = useState('');
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const processedRef = useRef(false);

    useEffect(() => {
        if (!videoUrl) {
            setStatus('error');
            setErrorMsg('No se proporcionó URL de video.');
            return;
        }
        if (processedRef.current) return;
        processedRef.current = true;

        const processVideo = async () => {
            try {
                setStatus('loading');
                setMessage('Cargando motor de video...');

                if (!ffmpegRef.current) {
                    ffmpegRef.current = new FFmpeg();
                }
                const ffmpeg = ffmpegRef.current;
                const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

                // Load FFmpeg (Multi-threaded should work here due to headers)
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                });

                setMessage('Descargando video fuente...');

                // Get Video
                const cfRegExp = /(?:cloudflarestream\.com|videodelivery\.net)\/([a-zA-Z0-9]+)/;
                let finalUrl = videoUrl;
                const match = videoUrl.match(cfRegExp);
                if (match) {
                    finalUrl = `https://videodelivery.net/${match[1]}/downloads/default.mp4?filename=source.mp4`;
                }

                const response = await fetch(finalUrl);
                if (!response.ok) throw new Error('Error descargando el video.');
                const videoBlob = await response.blob();

                setMessage('Generando marca de agua...');
                const { width, height } = await getVideoMetadata(videoBlob);
                const watermarkBlob = await generateWatermarkBlob(logoUrl, width, height);

                setMessage('Escribiendo archivos en memoria...');
                await ffmpeg.writeFile('input.mp4', await fetchFile(videoBlob));
                await ffmpeg.writeFile('watermark.png', await fetchFile(watermarkBlob));

                setStatus('processing');
                setMessage('Renderizando video... (0%)');

                ffmpeg.on('progress', ({ progress: p }) => {
                    setProgress(Math.round(p * 100));
                    setMessage(`Renderizando video... (${Math.round(p * 100)}%)`);
                });

                // Expressions
                // Cycles every 12s. 
                // 0-3: TL (40, 80)
                // 3-6: TR (W-w-40, 80)
                // 6-9: BR (W-w-40, H-h-180)
                // 9-12: BL (40, H-h-180)
                const xExpr = `if(lt(mod(t,12),3), 40, if(lt(mod(t,12),6), main_w-overlay_w-40, if(lt(mod(t,12),9), main_w-overlay_w-40, 40)))`;
                const yExpr = `if(lt(mod(t,12),3), 80, if(lt(mod(t,12),6), 80, if(lt(mod(t,12),9), main_h-overlay_h-180, main_h-overlay_h-180)))`;

                await ffmpeg.exec([
                    '-i', 'input.mp4',
                    '-i', 'watermark.png',
                    '-filter_complex', `[0:v][1:v]overlay=x='${xExpr}':y='${yExpr}'`,
                    '-c:a', 'copy',
                    '-preset', 'ultrafast',
                    'output.mp4'
                ]);

                setMessage('Finalizando...');
                const data = await ffmpeg.readFile('output.mp4');
                const outBlob = new Blob([(data as any).buffer], { type: 'video/mp4' });
                const url = URL.createObjectURL(outBlob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `speedlight_watermarked_${Date.now()}.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                setStatus('done');
                setMessage('¡Descarga completa!');

                // Cleanup?
                setTimeout(() => {
                    // Optional: Close window
                    // window.close();
                }, 2000);

            } catch (err: any) {
                console.error(err);
                setStatus('error');
                setErrorMsg(err.message || 'Error desconocido');
            }
        };

        processVideo();
    }, [videoUrl, logoUrl]);

    return (
        <div className="flex flex-col items-center text-center max-w-md w-full p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            {status === 'loading' || status === 'processing' ? (
                <>
                    <Loader2 className="w-16 h-16 text-[#FF9800] animate-spin mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">Procesando Video</h2>
                    <p className="text-white/70 mb-6">{message}</p>
                    {status === 'processing' && (
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-[#FF9800] h-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                    <p className="text-white/40 text-xs mt-6">Por favor no cierres esta ventana.</p>
                </>
            ) : status === 'done' ? (
                <>
                    <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">¡Listo!</h2>
                    <p className="text-white/70 mb-6">Tu descarga debería haber comenzado.</p>
                    <button
                        onClick={() => window.close()}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                    >
                        Cerrar Ventana
                    </button>
                </>
            ) : status === 'error' ? (
                <>
                    <XCircle className="w-16 h-16 text-red-500 mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
                    <p className="text-red-300 mb-6">{errorMsg}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                    >
                        Reintentar
                    </button>
                </>
            ) : (
                <div className="text-white">Esperando...</div>
            )}
        </div>
    );
}

export default function DownloadPage() {
    return (
        <div className="min-h-screen bg-[#0D0805] flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FF9800]/10 rounded-full blur-[120px]" />
            </div>

            <Suspense fallback={<div className="text-white">Cargando...</div>}>
                <ProcessorContent />
            </Suspense>
        </div>
    );
}
