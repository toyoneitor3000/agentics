"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { GiftingSystem } from "../../components/GiftingSystem";

// Mock Data (In a real app, fetch this based on ID)
const PROJECTS_DB: Record<string, any> = {
    "1": {
        id: "1",
        title: "Restauración BMW E30 1989",
        owner: "Juan Pérez",
        image: "https://images.unsplash.com/photo-1554744512-d6c603f27c54?q=80&w=1000&auto=format&fit=crop",
        goal: 5000000,
        current: 1250000,
        description: "Devolviendo la gloria a este clásico alemán. El proyecto comenzó hace 6 meses cuando lo encontré abandonado en un granero. El motor M20B25 necesita un overhaul completo, y la carrocería requiere trabajo de latonería. Mi sueño es dejarlo como salió de concesionario.",
        category: "Restauración",
        mods: ["Swap M20B25", "Suspensión Bilstein", "Rines BBS RS", "Tapicería Original"],
        gallery: [
            "https://images.unsplash.com/photo-1580273916550-e323be2ebcc5?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1000&auto=format&fit=crop"
        ]
    },
    // Fallback for demo
    "default": {
        id: "0",
        title: "Proyecto Demo",
        owner: "Speedlight User",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop",
        goal: 10000000,
        current: 2500000,
        description: "Proyecto de demostración para el sistema de donaciones.",
        category: "Demo",
        mods: ["Demo Mod 1", "Demo Mod 2"],
        gallery: []
    }
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const projectId = resolvedParams.id;
    const project = PROJECTS_DB[projectId] || PROJECTS_DB["default"];
    const progress = (project.current / project.goal) * 100;

    return (
        <main className="min-h-screen bg-[#050302]">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050302] via-[#050302]/50 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-6 pb-12 sm:p-12 sm:pb-24 container mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                        <div>
                            <span className="inline-block px-3 py-1 mb-4 rounded-full border border-[#FF9800]/50 bg-black/50 text-[#FF9800] text-sm font-bold uppercase tracking-wider backdrop-blur-md">
                                {project.category}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                                {project.title}
                            </h1>
                            <p className="text-xl text-[#BCAAA4] font-light">Propietario: {project.owner}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-20 relative z-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details & Story */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Card */}
                        <div className="bg-[#1A0F08] border border-[#2C1810] rounded-2xl p-8 shadow-2xl">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-[#8D6E63] text-sm uppercase tracking-wider mb-1">Recaudado</p>
                                    <p className="text-3xl md:text-4xl font-bold text-[#FF9800] font-mono">
                                        ${project.current.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#8D6E63] text-sm uppercase tracking-wider mb-1">Meta</p>
                                    <p className="text-xl font-bold text-[#BCAAA4] font-mono">
                                        ${project.goal.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-4 bg-[#050302] rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full bg-gradient-to-r from-[#FF9800] to-[#FFEB3B] rounded-full relative overflow-hidden"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                            <p className="text-right text-[#8D6E63] text-sm">{progress.toFixed(1)}% financiado</p>
                        </div>

                        {/* Story */}
                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-2xl font-bold text-[#F5E6D3] mb-4">Historia del Proyecto</h3>
                            <p className="text-[#BCAAA4] leading-relaxed text-lg">
                                {project.description}
                            </p>
                        </div>

                        {/* Mod List */}
                        <div className="bg-[#1A0F08] rounded-xl p-6 border border-[#2C1810]">
                            <h3 className="text-xl font-bold text-[#F5E6D3] mb-4">Modificaciones Planeadas</h3>
                            <ul className="grid sm:grid-cols-2 gap-4">
                                {project.mods?.map((mod: string, i: number) => (
                                    <li key={i} className="flex items-center text-[#BCAAA4]">
                                        <span className="w-2 h-2 rounded-full bg-[#FF9800] mr-3"></span>
                                        {mod}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Donation Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <GiftingSystem projectTitle={project.title} />

                            {/* Top Donors (Mock) */}
                            <div className="mt-8 bg-[#1A0F08] rounded-xl p-6 border border-[#2C1810]">
                                <h4 className="text-[#F5E6D3] font-bold mb-4 uppercase tracking-wider text-sm flex items-center">
                                    <span className="text-[#FFEB3B] mr-2">👑</span> Top Donadores
                                </h4>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#2C1810] flex items-center justify-center text-xs font-bold text-[#FF9800] border border-[#FF9800]/20">
                                                {i}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[#F5E6D3] text-sm font-medium">Usuario Anónimo</p>
                                                <p className="text-[#8D6E63] text-xs">Donó 2 Turbos</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
