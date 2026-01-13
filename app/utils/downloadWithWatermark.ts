import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { toast } from 'sonner';

// Singleton FFmpeg instance (persists across calls)
let ffmpegInstance: FFmpeg | null = null;
let ffmpegLoaded = false;

const getCloudflareId = (url: string) => {
    const regExp = /(?:cloudflarestream\.com|videodelivery\.net)\/([a-zA-Z0-9]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
};

const loadFFmpeg = async (onProgress: (msg: string) => void) => {
    if (ffmpegInstance && ffmpegLoaded) return ffmpegInstance;

    ffmpegInstance = new FFmpeg();

    // Use single-threaded core - NO SharedArrayBuffer required
    // This means no special headers needed, works in any context
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

    onProgress('Cargando motor de video...');

    await ffmpegInstance.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    ffmpegLoaded = true;
    return ffmpegInstance;
};

const getVideoMetadata = (blob: Blob): Promise<{ width: number; height: number; duration: number }> => {
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

    // Load Logo
    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    logo.src = logoUrl;
    await new Promise((resolve, reject) => {
        logo.onload = () => resolve(true);
        logo.onerror = reject;
    });

    const logoAspectRatio = logo.width / logo.height;
    const logoHeight = Math.min(videoWidth, videoHeight) * 0.08; // Smaller logo
    const logoWidth = logoHeight * logoAspectRatio;

    // Measure Text
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Canvas init failed");

    const text = 'www.speedlightculture.com';
    let fontSize = logoHeight * 0.3;
    ctx.font = `bold ${fontSize}px Arial`;
    const metrics = ctx.measureText(text);
    const scaleFactor = (logoWidth * 0.95) / metrics.width;
    const finalFontSize = fontSize * scaleFactor;

    // Size canvas to sprite - EXTRA padding for text descenders (p, g, y)
    const textPadding = finalFontSize * 0.4; // Space for descenders
    const spriteHeight = logoHeight + finalFontSize + textPadding;
    canvas.width = Math.ceil(Math.max(logoWidth, metrics.width) * 1.1);
    canvas.height = Math.ceil(spriteHeight);

    // Re-get context after resize
    const ctx2 = canvas.getContext('2d');
    if (!ctx2) throw new Error("Ctx failed");

    // Draw Logo
    ctx2.globalAlpha = 0.5;
    const drawX = (canvas.width - logoWidth) / 2;
    ctx2.drawImage(logo, drawX, 0, logoWidth, logoHeight);

    // Draw Text
    ctx2.fillStyle = 'white';
    ctx2.strokeStyle = 'black';
    ctx2.lineWidth = 0.8;
    ctx2.font = `bold ${finalFontSize}px Arial`;
    ctx2.textAlign = 'center';

    // Text positioned with room for descenders
    const textY = logoHeight + finalFontSize * 0.85;
    ctx2.strokeText(text, canvas.width / 2, textY);
    ctx2.fillText(text, canvas.width / 2, textY);

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to generate watermark"));
        }, 'image/png');
    });
};

export const downloadWithWatermark = async (
    videoUrl: string,
    logoUrl: string = '/logonavbar.png'
) => {
    const toastId = toast.loading('Preparando descarga...');

    try {
        // 1. Load FFmpeg (cached after first load)
        const ffmpeg = await loadFFmpeg((msg) => toast.loading(msg, { id: toastId }));

        // 2. Download Video
        let finalUrl = videoUrl;
        const cfId = getCloudflareId(videoUrl);
        if (cfId) {
            finalUrl = `https://videodelivery.net/${cfId}/downloads/default.mp4?filename=source.mp4`;
        }

        toast.loading('Descargando video...', { id: toastId });
        const response = await fetch(finalUrl);
        if (!response.ok) throw new Error(`Error al descargar: ${response.status}`);
        const videoBlob = await response.blob();

        if (videoBlob.size < 100000) {
            throw new Error("El archivo es demasiado pequeño. Verifica la fuente.");
        }

        // 3. Get Metadata & Generate Watermark
        toast.loading('Generando marca de agua...', { id: toastId });
        const { width, height } = await getVideoMetadata(videoBlob);
        const watermarkBlob = await generateWatermarkBlob(logoUrl, width, height);

        // 4. Write files to FFmpeg virtual FS
        toast.loading('Procesando video...', { id: toastId });
        await ffmpeg.writeFile('input.mp4', await fetchFile(videoBlob));
        await ffmpeg.writeFile('watermark.png', await fetchFile(watermarkBlob));

        // 5. Progress handler
        ffmpeg.on('progress', ({ progress }) => {
            const pct = Math.round(progress * 100);
            toast.loading(`Renderizando... ${pct}%`, { id: toastId });
        });

        // 6. FFmpeg command - watermark moves corners
        // Positions: closer to edges (15px padding)
        // Cycle: 0-5s TL, 5-10s TR, 10-15s BR, 15-20s BL (20s total)
        const xExpr = `if(lt(mod(t,20),5), 15, if(lt(mod(t,20),10), main_w-overlay_w-15, if(lt(mod(t,20),15), main_w-overlay_w-15, 15)))`;
        const yExpr = `if(lt(mod(t,20),5), 30, if(lt(mod(t,20),10), 30, if(lt(mod(t,20),15), main_h-overlay_h-30, main_h-overlay_h-30)))`;

        await ffmpeg.exec([
            '-i', 'input.mp4',
            '-i', 'watermark.png',
            '-filter_complex', `[0:v][1:v]overlay=x='${xExpr}':y='${yExpr}'`,
            '-c:a', 'copy',
            '-preset', 'ultrafast',
            'output.mp4'
        ]);

        // 7. Read output and trigger download
        toast.loading('Finalizando...', { id: toastId });
        const data = await ffmpeg.readFile('output.mp4');
        const outBlob = new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' });

        const url = URL.createObjectURL(outBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `speedlight_${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Cleanup virtual FS
        await ffmpeg.deleteFile('input.mp4');
        await ffmpeg.deleteFile('watermark.png');
        await ffmpeg.deleteFile('output.mp4');

        toast.success('¡Descarga lista!', { id: toastId });

    } catch (err: any) {
        console.error("Download error:", err);
        const msg = err.message === 'MEMFS: FS error'
            ? 'Sin memoria suficiente. Cierra otras pestañas.'
            : err.message;
        toast.error(`Error: ${msg}`, { id: toastId });
    }
};
