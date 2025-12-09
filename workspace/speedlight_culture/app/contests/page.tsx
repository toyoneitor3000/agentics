"use client";

import Image from "next/image";
import { AdFeedCard } from "../components/AdBanners";

const CONTESTS = [
    {
        id: "1",
        title: "Mejor Foto Nocturna - Bogotá",
        status: "Activo",
        deadline: "15 Dic, 2025",
        prize: "$500,000 COP + Kit Speedlight",
        image: "https://images.unsplash.com/photo-1493238792015-164e8508639c?q=80&w=1000&auto=format&fit=crop",
        entries: 45
    },
    {
        id: "2",
        title: "Restauración del Año",
        status: "Votación",
        deadline: "20 Dic, 2025",
        prize: "Patrocinio Completo 2026",
        image: "https://images.unsplash.com/photo-1486262715619-01b8c22971f5?q=80&w=1000&auto=format&fit=crop",
        entries: 12
    },
    {
        id: "3",
        title: "Setup de Audio (Car Audio)",
        status: "Finalizado",
        deadline: "01 Nov, 2025",
        prize: "Componentes Focal",
        image: "https://images.unsplash.com/photo-1558485207-6a4a70a83151?q=80&w=1000&auto=format&fit=crop",
        entries: 28
    }
];

export default function ContestsPage() {
    return (
        <main className="min-h-screen bg-[#050302]">
            <div className="pt-48 pb-20 px-6 container mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF9800] via-[#FFEB3B] to-[#FF9800] animate-glow">
                            ARENA DE CONCURSOS
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#BCAAA4] max-w-2xl mx-auto font-light">
                        Demuestra tu nivel. Compite con los mejores creadores y constructores del país.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
                    {CONTESTS.map((contest) => (
                        <div key={contest.id} className="group relative bg-[#1A0F08] border border-[#2C1810] rounded-3xl overflow-hidden hover:border-[#FF9800]/50 transition-all duration-500">
                            <div className="grid md:grid-cols-2 h-full">
                                {/* Image Info */}
                                <div className="relative h-64 md:h-auto overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10 md:hidden"></div>
                                    <Image
                                        src={contest.image}
                                        alt={contest.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>

                                {/* Details */}
                                <div className="p-8 flex flex-col justify-center relative z-20">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                                            ${contest.status === 'Activo' ? 'bg-[#FF9800] text-black'
                                                : contest.status === 'Votación' ? 'bg-[#FFEB3B] text-black'
                                                    : 'bg-[#2C1810] text-[#8D6E63]'}`}>
                                            {contest.status}
                                        </span>
                                        <span className="text-[#8D6E63] text-xs font-mono">Participantes: {contest.entries}</span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-[#F5E6D3] mb-2 group-hover:text-[#FF9800] transition-colors">
                                        {contest.title}
                                    </h3>
                                    <p className="text-[#BCAAA4] text-sm mb-6">
                                        Premio: <span className="text-[#F5E6D3] font-bold">{contest.prize}</span>
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-[#8D6E63] font-mono border-t border-[#2C1810] pt-4 mt-auto">
                                        <span>Cierra: {contest.deadline}</span>
                                        <button className="text-[#FF9800] uppercase tracking-wider font-bold hover:underline">
                                            {contest.status === 'Finalizado' ? 'Ver Ganadores' : 'Participar →'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <AdFeedCard />
                </div>
            </div>
        </main>
    );
}
