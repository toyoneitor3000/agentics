'use client';

import { useState, useEffect } from 'react';
import { Trash2, RotateCcw, Youtube, Video, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/app/utils/supabase/client';
import { toast } from 'sonner';
import ConfirmModal from '../ui/ConfirmModal';

export default function DeletedFilesManager() {
    const [deletedVideos, setDeletedVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchDeletedVideos();
    }, []);

    const fetchDeletedVideos = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('cinema_videos')
            .select('*')
            .eq('category', 'Deleted')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching deleted videos:', error);
            toast.error('Error al cargar archivos eliminados');
        } else {
            setDeletedVideos(data || []);
        }
        setLoading(false);
    };

    const handleRestore = async (id: string, originalCategory: string = 'Social') => {
        const { error } = await supabase
            .from('cinema_videos')
            .update({ category: originalCategory })
            .eq('id', id);

        if (error) {
            toast.error('Error al restaurar');
        } else {
            toast.success('Video restaurado');
            setDeletedVideos(prev => prev.filter(v => v.id !== id));
        }
    };

    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const handlePermanentDelete = async () => {
        if (!idToDelete) return;

        const { error } = await supabase
            .from('cinema_videos')
            .delete()
            .eq('id', idToDelete);

        if (error) {
            toast.error('Error al eliminar permanentemente');
        } else {
            toast.success('Archivo eliminado definitivamente');
            setDeletedVideos(prev => prev.filter(v => v.id !== idToDelete));
        }
        setIdToDelete(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#FF9800] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {deletedVideos.length === 0 ? (
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-12 text-center">
                    <Trash2 className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/40 font-bold uppercase tracking-widest text-sm">Papelera Vacía</p>
                    <p className="text-white/20 text-xs mt-1">No tienes archivos eliminados recientemente.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {deletedVideos.map((v) => (
                        <div key={v.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-lg bg-black relative overflow-hidden shrink-0 border border-white/5`}>
                                    {v.thumbnail_url ? (
                                        <img src={v.thumbnail_url} className="w-full h-full object-cover grayscale opacity-50" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
                                            <Video className="w-6 h-6 text-white/10" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-white font-bold text-sm truncate max-w-[200px]">{v.title}</h4>
                                    <p className="text-white/30 text-[10px] uppercase font-bold mt-1">
                                        Eliminado el {new Date(v.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleRestore(v.id, v.format === 'vertical' ? 'Social' : 'Native')}
                                    className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                                    title="Restaurar"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIdToDelete(v.id)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                    title="Eliminar permanentemente"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                <p className="text-[10px] text-yellow-500/80 leading-relaxed uppercase font-bold tracking-wider">
                    Los archivos en esta sección se pueden restaurar. Si los eliminas permanentemente, no se podrán recuperar.
                </p>
            </div>

            <ConfirmModal
                isOpen={!!idToDelete}
                onClose={() => setIdToDelete(null)}
                onConfirm={handlePermanentDelete}
                title="Eliminar permanentemente"
                message="¿Estás seguro de que deseas eliminar este video de forma definitiva? Esta acción no se puede deshacer y el archivo se perderá para siempre."
                confirmText="Eliminar para siempre"
            />
        </div>
    );
}
