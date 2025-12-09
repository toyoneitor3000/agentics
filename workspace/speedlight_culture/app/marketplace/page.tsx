"use client";

import { AdFeedCard } from "../components/AdBanners";

export default function MarketplacePage() {
    return (
        <main className="min-h-screen">
            <div className="pt-48 pb-20 px-6 container mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF9800] via-[#FFEB3B] to-[#FF9800] animate-glow">
                            MARKETPLACE
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#BCAAA4] max-w-2xl mx-auto font-light">
                        Compra y venta segura de partes y accesorios exclusivos.
                    </p>
                </div>

                {/* Grid Layout containing organic products and AdFeedCards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Organic Product 1 */}
                    <div className="group rounded-xl bg-[#0A0604] border border-[#FF9800]/10 overflow-hidden hover:border-[#FF9800]/50 transition-all">
                        <div className="h-64 bg-neutral-900 flex items-center justify-center text-neutral-600">
                            [Producto 1]
                        </div>
                        <div className="p-4">
                            <h3 className="text-[#F5E6D3] font-bold">Turbo Garrett GT35</h3>
                            <p className="text-[#FF9800] text-sm mt-1">$1,200 USD</p>
                        </div>
                    </div>

                    {/* Organic Product 2 */}
                    <div className="group rounded-xl bg-[#0A0604] border border-[#FF9800]/10 overflow-hidden hover:border-[#FF9800]/50 transition-all">
                        <div className="h-64 bg-neutral-900 flex items-center justify-center text-neutral-600">
                            [Producto 2]
                        </div>
                        <div className="p-4">
                            <h3 className="text-[#F5E6D3] font-bold">Rines Volk TE37</h3>
                            <p className="text-[#FF9800] text-sm mt-1">$3,500 USD</p>
                        </div>
                    </div>

                    {/* NATIVE AD PLACEMENT */}
                    <AdFeedCard />

                    {/* Organic Product 3 */}
                    <div className="group rounded-xl bg-[#0A0604] border border-[#FF9800]/10 overflow-hidden hover:border-[#FF9800]/50 transition-all">
                        <div className="h-64 bg-neutral-900 flex items-center justify-center text-neutral-600">
                            [Producto 3]
                        </div>
                        <div className="p-4">
                            <h3 className="text-[#F5E6D3] font-bold">Suspensión Öhlins</h3>
                            <p className="text-[#FF9800] text-sm mt-1">$2,800 USD</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
