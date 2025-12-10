'use client';

import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Camera, Save, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const make = formData.get('make') as string;
        const model = formData.get('model') as string;
        const year = formData.get('year') as string;
        const description = formData.get('description') as string;

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/login');
            return;
        }

        const { error } = await supabase
            .from('projects')
            .insert({
                user_id: user.id,
                title,
                make,
                model,
                year: parseInt(year),
                description,
                // For now we skip image upload logic to keep it simple in first iteration
                // Ideally we upload images to Supabase Storage first, then get URL
            });

        if (error) {
            alert('Error al crear proyecto: ' + error.message);
            setIsLoading(false);
        } else {
            router.push('/profile'); // Redirect to profile to see the new car
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="max-w-2xl mx-auto px-4">
                <Link href="/profile" className="text-white/40 hover:text-white flex items-center gap-2 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Cancelar y volver
                </Link>

                <div className="bg-[#111] border border-[#222] rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#FF9800]/10 rounded-xl flex items-center justify-center text-[#FF9800]">
                            <Camera className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-oswald font-bold uppercase">Publicar Proyecto</h1>
                            <p className="text-white/40 text-sm">Comparte tu vehículo con la comunidad Speedlight.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Título del Proyecto</label>
                            <input
                                name="title"
                                type="text"
                                placeholder="Ej: Proyecto Drift S13 'The Ghost'"
                                required
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase font-bold text-white/40 mb-2">Marca</label>
                                <input
                                    name="make"
                                    type="text"
                                    placeholder="Nissan"
                                    required
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-white/40 mb-2">Modelo</label>
                                <input
                                    name="model"
                                    type="text"
                                    placeholder="Silvia S13"
                                    required
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Año</label>
                            <input
                                name="year"
                                type="number"
                                placeholder="1992"
                                required
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Historia / Modificaciones</label>
                            <textarea
                                name="description"
                                rows={4}
                                placeholder="Cuenta la historia de tu auto, lista las modificaciones y futuros planes..."
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                            />
                        </div>

                        <div className="pt-4 border-t border-[#222]">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Guardar Proyecto en Garaje
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
