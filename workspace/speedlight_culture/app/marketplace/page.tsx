import { createClient } from '@/app/utils/supabase/server';
import Link from 'next/link';
import { ShoppingBag, Filter, Tag } from 'lucide-react';

export default async function MarketplacePage() {
    const supabase = await createClient();

    const { data: items } = await supabase
        .from('marketplace_items')
        .select('*, profiles(username, avatar_url)')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-black text-white py-12">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-[#333] pb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-oswald font-bold uppercase mb-2">Marketplace</h1>
                        <p className="text-white/40 font-roboto-mono">Compra y vende piezas de alto rendimiento entre entusiastas.</p>
                    </div>
                    <Link href="/marketplace/sell">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-full transition-all flex items-center gap-2">
                            <Tag className="w-4 h-4" /> Vender Artículo
                        </button>
                    </Link>
                </div>

                {/* Filters (Mock UI) */}
                <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
                    {['Todos', 'Motor', 'Suspensión', 'Rines', 'Interior', 'Electrónica'].map((cat) => (
                        <button key={cat} className="px-5 py-2 rounded-full border border-[#333] hover:border-green-500 hover:text-green-500 transition-colors text-sm whitespace-nowrap">
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items && items.length > 0 ? (
                        items.map((item) => (
                            <div key={item.id} className="bg-[#111] border border-[#222] rounded-xl overflow-hidden group hover:border-green-500/50 transition-all cursor-pointer">
                                <div className="h-48 bg-[#1a1a1a] relative flex items-center justify-center">
                                    {/* Placeholder Image because we skipped image upload for now */}
                                    <ShoppingBag className="w-12 h-12 text-white/10 group-hover:text-green-500 transition-colors" />
                                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-green-400 border border-green-500/20">
                                        ${item.price.toLocaleString()}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white group-hover:text-green-500 transition-colors truncate pr-2">{item.title}</h3>
                                    </div>
                                    <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-3">{item.condition} • {item.category}</p>

                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#222]">
                                        <div className="w-6 h-6 rounded-full bg-[#333] overflow-hidden">
                                            {/* User Avatar Placeholder */}
                                        </div>
                                        <span className="text-xs text-white/60">Vendedor Verificado</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-white/30">
                            <p>No hay artículos publicados aún. ¡Sé el primero!</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
