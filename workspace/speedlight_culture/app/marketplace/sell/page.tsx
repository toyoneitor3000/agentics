'use client';

import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ShoppingBag, DollarSign, Tag, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function SellItemPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        const { error } = await supabase
            .from('marketplace_items')
            .insert({
                user_id: user.id,
                title: formData.get('title'),
                price: parseFloat(formData.get('price') as string),
                description: formData.get('description'),
                condition: formData.get('condition'),
                category: formData.get('category'),
                status: 'available',
                currency: 'COP'
                // Images omitted for simplicity in this step
            });

        if (error) {
            alert('Error al publicar: ' + error.message);
            setIsLoading(false);
        } else {
            router.push('/marketplace');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-12">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-[#111] border border-[#222] rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-oswald font-bold uppercase">Vender Pieza</h1>
                            <p className="text-white/40 text-sm">Convierte tus partes sobrantes en efectivo.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Título del Anuncio</label>
                            <input
                                name="title"
                                type="text"
                                placeholder="Ej: Suspensión Tein Super Street S13"
                                required
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase font-bold text-white/40 mb-2">Precio (COP)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                    <input
                                        name="price"
                                        type="number"
                                        placeholder="1200000"
                                        required
                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-white/40 mb-2">Condición</label>
                                <select
                                    name="condition"
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors appearance-none"
                                >
                                    <option value="Usado">Usado</option>
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="Restaurado">Restaurado</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Categoría</label>
                            <select
                                name="category"
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors appearance-none"
                            >
                                <option value="Piezas de Motor">Piezas de Motor</option>
                                <option value="Suspensión y Frenos">Suspensión y Frenos</option>
                                <option value="Exterior y Bodykits">Exterior y Bodykits</option>
                                <option value="Interior">Interior</option>
                                <option value="Rines y Llantas">Rines y Llantas</option>
                                <option value="Audio y Electrónica">Audio y Electrónica</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Descripción</label>
                            <textarea
                                name="description"
                                rows={4}
                                placeholder="Describe el estado de la pieza, compatibilidad y detalles importantes..."
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                            />
                        </div>

                        <div className="pt-4 border-t border-[#222]">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Publicar Artículo
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
