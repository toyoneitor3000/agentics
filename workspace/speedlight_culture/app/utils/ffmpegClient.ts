import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;
let ffmpegLoaded = false;

export const loadFFmpeg = async () => {
    if (ffmpegInstance && ffmpegLoaded) return ffmpegInstance;

    ffmpegInstance = new FFmpeg();

    // Use single-threaded core - NO SharedArrayBuffer required
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

    await ffmpegInstance.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    ffmpegLoaded = true;
    return ffmpegInstance;
};

export const extractAudioSnippet = async (videoFile: File, duration: number = 15): Promise<Blob> => {
    const ffmpeg = await loadFFmpeg();
    const inputName = 'input_video';
    const outputName = 'output_audio.mp3';

    await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

    // Extract first 15 seconds to MP3 (low quality is fine for recognition)
    // -t = duration, -vn = no video, -ac = 1 (mono), -ar = 44100
    await ffmpeg.exec([
        '-i', inputName,
        '-t', duration.toString(),
        '-vn',
        '-ac', '1',
        '-ar', '44100',
        '-map', 'a',
        outputName
    ]);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([(data as Uint8Array).buffer as ArrayBuffer], { type: 'audio/mp3' });

    // Cleanup
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

    return blob;
};

// Helper for fetchFile (copy from ffmpeg/util if not exported, but usually we need to re-implement or import)
const fetchFile = async (file: File): Promise<Uint8Array> => {
    return new Uint8Array(await file.arrayBuffer());
};
