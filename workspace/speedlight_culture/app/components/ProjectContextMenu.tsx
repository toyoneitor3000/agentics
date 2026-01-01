'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreVertical, Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import { createClient } from '@/app/utils/supabase/client';
import { toast } from 'sonner';
import ConfirmModal from './ui/ConfirmModal';

export default function ProjectContextMenu({ projectId, isArchived }: { projectId: string, isArchived?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const toggleMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleArchive = async () => {
        await supabase.from('projects').update({ archived: !isArchived }).eq('id', projectId);
        toast.success(isArchived ? 'Proyecto restaurado' : 'Proyecto archivado');
        setIsOpen(false);
        router.refresh();
    };

    const handleDelete = async () => {
        toast.promise(async () => {
            await supabase.from('projects').delete().eq('id', projectId);
            router.push('/profile');
            router.refresh();
        }, {
            loading: 'Eliminando proyecto...',
            success: 'Proyecto eliminado',
            error: 'Error al eliminar'
        });
    };

    return (
        <div className="relative">
            <button
                onClick={toggleMenu}
                className="bg-black/30 hover:bg-[#FF9800] hover:text-black text-white p-2 rounded-full backdrop-blur-sm transition-all border border-white/10 items-center justify-center flex"
                aria-label="Opciones"
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 top-full mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        {/* Edit */}
                        <Link
                            href={`/projects/${projectId}/edit`}
                            className="px-5 py-4 text-left text-sm font-bold text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Edit className="w-4 h-4" /> Editar Proyecto
                        </Link>

                        {/* Archive */}
                        <button
                            onClick={handleArchive}
                            className="px-5 py-4 text-left text-sm font-bold text-white hover:bg-white/5 flex items-center gap-3 transition-colors border-t border-white/5"
                        >
                            {isArchived ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-yellow-500" />}
                            {isArchived ? 'Mostrar en perfil' : 'Archivar (Ocultar)'}
                        </button>

                        {/* Delete */}
                        <button
                            onClick={() => { setConfirmDelete(true); setIsOpen(false); }}
                            className="px-5 py-4 text-left text-sm font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors border-t border-white/5"
                        >
                            <Trash2 className="w-4 h-4" /> Eliminar Proyecto
                        </button>
                    </div>
                </>
            )}

            <ConfirmModal
                isOpen={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                title="Eliminar Proyecto"
                message="¿Estás seguro de que deseas eliminar este proyecto permanentemente? Esta acción borrará todas las fotos y datos asociados."
                confirmText="Eliminar permanentemente"
            />
        </div>
    );
}
