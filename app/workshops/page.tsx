"use client";

import { AdWorkshopBadge } from "../components/AdBanners";

export default function WorkshopsPage() {
    return (
        <main className="min-h-screen">
            <div className="pt-48 pb-20 px-6 container mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF9800] via-[#FFEB3B] to-[#FF9800] animate-glow">
                            TALLERES
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#BCAAA4] max-w-2xl mx-auto font-light">
                        Directorio curado de los mejores especialistas para tu vehículo.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* VERIFIED PARTNER (Ad Placement) */}
                    <div className="transform hover:-translate-y-1 transition-transform duration-300">
                        <AdWorkshopBadge />
                    </div>

                    {/* Standard Workshop 1 */}
                    <div className="p-6 rounded-xl bg-[#0A0604] border border-[#FF9800]/10 hover:border-[#FF9800]/30 transition-all">
                        <h3 className="text-[#F5E6D3] font-bold text-lg mb-2">Taller Hermanos Gasca</h3>
                        <p className="text-[#BCAAA4] text-sm mb-4">Mecánica General • Frenos</p>
                        <div className="flex justify-between items-center border-t border-white/5 pt-4">
                            <span className="text-xs text-neutral-500">Bogotá, Norte</span>
                            <span className="text-[#FF9800] text-sm font-bold">4.5 ★</span>
                        </div>
                    </div>

                    {/* Standard Workshop 2 */}
                    <div className="p-6 rounded-xl bg-[#0A0604] border border-[#FF9800]/10 hover:border-[#FF9800]/30 transition-all">
                        <h3 className="text-[#F5E6D3] font-bold text-lg mb-2">Paint Mods Studio</h3>
                        <p className="text-[#BCAAA4] text-sm mb-4">Pintura • Latonería</p>
                        <div className="flex justify-between items-center border-t border-white/5 pt-4">
                            <span className="text-xs text-neutral-500">Medellín, Poblado</span>
                            <span className="text-[#FF9800] text-sm font-bold">4.8 ★</span>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
