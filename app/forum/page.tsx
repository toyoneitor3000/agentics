"use client";

import { AdSidebarSpec } from "../components/AdBanners";

export default function ForumPage() {
    return (
        <main className="min-h-screen">
            <div className="pt-48 pb-20 px-6 container mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF9800] via-[#FFEB3B] to-[#FF9800] animate-glow">
                            FORO
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#BCAAA4] max-w-2xl mx-auto font-light">
                        Debate, comparte y aprende con la comunidad automotriz más grande.
                    </p>
                </div>

                <div className="grid lg:grid-cols-[1fr_300px] gap-12 max-w-6xl mx-auto">

                    {/* Main Content Area */}
                    <div className="space-y-6">
                        {/* Discussion Topic 1 */}
                        <div className="p-6 bg-[#0A0604] border border-[#FF9800]/10 rounded-xl hover:border-[#FF9800]/30 transition-all cursor-pointer">
                            <div className="flex items-center gap-2 mb-2 text-xs text-[#FF9800]">
                                <span className="px-2 py-0.5 bg-[#FF9800]/10 rounded">Mecánica</span>
                                <span className="text-neutral-500">• Hace 2 horas</span>
                            </div>
                            <h3 className="text-xl text-[#F5E6D3] font-bold mb-2">¿Cuál es el mejor aceite para un motor turbo modificado?</h3>
                            <p className="text-[#BCAAA4] text-sm line-clamp-2">Estoy armando un proyecto con un GT35 y tengo dudas sobre la viscosidad adecuada para clima cálido...</p>
                        </div>

                        {/* Discussion Topic 2 */}
                        <div className="p-6 bg-[#0A0604] border border-[#FF9800]/10 rounded-xl hover:border-[#FF9800]/30 transition-all cursor-pointer">
                            <div className="flex items-center gap-2 mb-2 text-xs text-[#FF9800]">
                                <span className="px-2 py-0.5 bg-[#FF9800]/10 rounded">Proyecto</span>
                                <span className="text-neutral-500">• Hace 5 horas</span>
                            </div>
                            <h3 className="text-xl text-[#F5E6D3] font-bold mb-2">Restauración E30: Día 45 - Pintura</h3>
                            <p className="text-[#BCAAA4] text-sm line-clamp-2">Por fin salió de la cabina. Les comparto las fotos del acabado final en Techno Violet...</p>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        <div className="p-6 bg-[#0A0604] rounded-xl border border-white/5">
                            <h4 className="text-[#F5E6D3] font-bold mb-4 uppercase tracking-wider text-sm">Categorías</h4>
                            <ul className="space-y-2 text-[#BCAAA4] text-sm">
                                <li className="hover:text-[#FF9800] cursor-pointer">General</li>
                                <li className="hover:text-[#FF9800] cursor-pointer">Proyectos</li>
                                <li className="hover:text-[#FF9800] cursor-pointer">Mecánica</li>
                                <li className="hover:text-[#FF9800] cursor-pointer">Eventos</li>
                            </ul>
                        </div>

                        {/* CONTEXTUAL AD PLACEMENT */}
                        <AdSidebarSpec />
                    </div>

                </div>
            </div>
        </main>
    );
}
