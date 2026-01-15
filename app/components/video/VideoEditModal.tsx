import { useState } from 'react';
import { X, Loader2, Save, Music } from 'lucide-react';
import { updateVideoMetadata } from '@/app/actions/cinema';
import { toast } from 'sonner';
import SpotifySearch from '@/app/components/cinema/SpotifySearch';
import Image from 'next/image';

interface VideoEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    video: {
        id: string;
        title: string;
        description: string;
        location?: string;
        hashtags?: string[];
        format?: 'horizontal' | 'vertical'; // Should be present in video object
        music_metadata?: any;
    };
}

export default function VideoEditModal({ isOpen, onClose, video }: VideoEditModalProps) {
    const [title, setTitle] = useState(video.title);
    const [description, setDescription] = useState(video.description || '');
    const [location, setLocation] = useState(video.location || video.music_metadata?.location || '');
    const [hashtags, setHashtags] = useState(video.hashtags?.join(' ') || video.music_metadata?.hashtags?.join(' ') || '');
    const [format, setFormat] = useState<'horizontal' | 'vertical'>(video.format || 'horizontal');
    const [musicMetadata, setMusicMetadata] = useState<any>(video.music_metadata || null);
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Convert hashtags string to array
            const tagsArray = hashtags.split(/[ ,]+/).filter((t: string) => t.length > 0).map((t: string) => t.startsWith('#') ? t : `#${t}`);

            await updateVideoMetadata(video.id, {
                title,
                description,
                location,
                hashtags: tagsArray,
                format,
                music_metadata: musicMetadata
            });
            toast.success('Video actualizado correctamente');
            onClose();
            // Refresh parent components
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error('Error al actualizar video');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 shrink-0">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">Editar Publicación</h3>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-white/50 uppercase">Título</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-white/50 uppercase">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase flex items-center gap-2">
                            Soundtrack
                            {musicMetadata && (
                                <button
                                    onClick={() => setMusicMetadata(null)}
                                    className="text-[10px] text-red-500 hover:underline uppercase ml-auto"
                                >
                                    Eliminar
                                </button>
                            )}
                        </label>

                        {/* Existing Music Card */}
                        {musicMetadata ? (
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
                                <div className="w-10 h-10 bg-black rounded flex-shrink-0 relative overflow-hidden">
                                    {musicMetadata.cover ? (
                                        <Image src={musicMetadata.cover} alt="Cover" fill className="object-cover" />
                                    ) : (
                                        <Music className="w-5 h-5 text-white/50 m-auto" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <input
                                        type="text"
                                        value={musicMetadata.name}
                                        onChange={(e) => setMusicMetadata({ ...musicMetadata, name: e.target.value })}
                                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-white focus:ring-0 focus:outline-none placeholder:text-white/20"
                                        placeholder="Nombre de la canción"
                                    />
                                    <input
                                        type="text"
                                        value={musicMetadata.artist}
                                        onChange={(e) => setMusicMetadata({ ...musicMetadata, artist: e.target.value })}
                                        className="w-full bg-transparent border-none p-0 text-xs text-white/50 focus:ring-0 focus:outline-none placeholder:text-white/20"
                                        placeholder="Artista"
                                    />
                                </div>
                            </div>
                        ) : (
                            <SpotifySearch onSelect={(track) => setMusicMetadata(track)} />
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-white/50 uppercase">Ubicación</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Bogotá, Colombia"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-white/50 uppercase">Hashtags</label>
                            <input
                                type="text"
                                value={hashtags}
                                onChange={(e) => setHashtags(e.target.value)}
                                placeholder="#JDM #Drift"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-white/50 uppercase">Formato / Categoría</label>
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value as 'horizontal' | 'vertical')}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors appearance-none"
                        >
                            <option value="horizontal">Cinema 16:9 (Horizontal)</option>
                            <option value="vertical">Social 9:16 (Vertical)</option>
                        </select>
                        <p className="text-[10px] text-white/30">Mover a Social o Cinema según corresponda.</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-lg bg-[#FF9800] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#FF9800]/90 transition-colors flex items-center gap-2"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
