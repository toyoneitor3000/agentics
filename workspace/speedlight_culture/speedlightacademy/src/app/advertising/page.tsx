"use client";

import Header from "../../components/layout/Header";
import {
    AdHeroSponsor,
    AdFeedCard,
    AdSidebarSpec,
    AdWorkshopBadge,
    AdAcademyIntro
} from "../../components/AdBanners";

export default function AdvertisingPage() {
    return (
        <main className="min-h-screen pt-48 pb-20 bg-[#050302]">
            <div className="container mx-auto px-6">
                <header className="mb-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-[#F5E6D3] mb-6">
                        Sistema de Publicidad <span className="text-[#FF9800]">Nativo</span>
                    </h1>
                    <p className="text-xl text-[#BCAAA4] max-w-2xl mx-auto">
                        Ejemplos de integraciones comerciales que respetan la estética y no interrumpen la experiencia educativa.
                    </p>
                </header>

                <div className="grid gap-20 max-w-5xl mx-auto">

                    {/* Ejemplo 1 */}
                    <section className="grid md:grid-cols-[300px_1fr] gap-8 items-center border-b border-white/5 pb-12">
                        <div>
                            <h2 className="text-2xl font-bold text-[#F5E6D3] mb-2">1. Hero Sponsor</h2>
                            <p className="text-[#BCAAA4] text-sm">
                                Integración sutil en cabeceras o banners principales. Ideal para patrocinadores "Globales".
                            </p>
                            <div className="mt-4 p-2 bg-white/5 rounded text-xs text-neutral-500 font-mono">
                                Ubicación: Navbar, Headers
                            </div>
                        </div>
                        <div className="p-8 bg-neutral-900/50 rounded-xl flex justify-center items-center shadow-inner min-h-[150px]">
                            <AdHeroSponsor />
                        </div>
                    </section>

                    {/* Ejemplo 2 */}
                    <section className="grid md:grid-cols-[300px_1fr] gap-8 items-start border-b border-white/5 pb-12">
                        <div>
                            <h2 className="text-2xl font-bold text-[#F5E6D3] mb-2">2. Native Feed Card</h2>
                            <p className="text-[#BCAAA4] text-sm">
                                Se camufla en el grid de contenido. Mantiene la misma estructura visual que el contenido orgánico.
                            </p>
                            <div className="mt-4 p-2 bg-white/5 rounded text-xs text-neutral-500 font-mono">
                                Ubicación: Recursos, Galería
                            </div>
                        </div>
                        <div className="p-8 bg-neutral-900/50 rounded-xl flex justify-center items-center shadow-inner min-h-[400px]">
                            <AdFeedCard />
                        </div>
                    </section>

                    {/* Ejemplo 3 */}
                    <section className="grid md:grid-cols-[300px_1fr] gap-8 items-center border-b border-white/5 pb-12">
                        <div>
                            <h2 className="text-2xl font-bold text-[#F5E6D3] mb-2">3. Sidebar Spec</h2>
                            <p className="text-[#BCAAA4] text-sm">
                                Información técnica presentada como "Feature". Aporta valor educativo mientras promociona.
                            </p>
                            <div className="mt-4 p-2 bg-white/5 rounded text-xs text-neutral-500 font-mono">
                                Ubicación: Lecciones, Artículos
                            </div>
                        </div>
                        <div className="p-8 bg-neutral-900/50 rounded-xl flex justify-center items-center shadow-inner">
                            <div className="max-w-xs w-full">
                                <AdSidebarSpec />
                            </div>
                        </div>
                    </section>

                    {/* Ejemplo 4 */}
                    <section className="grid md:grid-cols-[300px_1fr] gap-8 items-center border-b border-white/5 pb-12">
                        <div>
                            <h2 className="text-2xl font-bold text-[#F5E6D3] mb-2">4. Workshop Trusted Badge</h2>
                            <p className="text-[#BCAAA4] text-sm">
                                Distintivo de verificación premium para talleres o partners. Genera confianza inmediata.
                            </p>
                            <div className="mt-4 p-2 bg-white/5 rounded text-xs text-neutral-500 font-mono">
                                Ubicación: Mapa, Perfiles
                            </div>
                        </div>
                        <div className="p-8 bg-neutral-900/50 rounded-xl flex justify-center items-center shadow-inner">
                            <div className="max-w-md w-full">
                                <AdWorkshopBadge />
                            </div>
                        </div>
                    </section>

                    {/* Ejemplo 5 */}
                    <section className="grid md:grid-cols-[300px_1fr] gap-8 items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-[#F5E6D3] mb-2">5. Academy Video Intro</h2>
                            <p className="text-[#BCAAA4] text-sm">
                                Pantalla de introducción cinematográfica. Impacto visual alto para contenido educativo.
                            </p>
                            <div className="mt-4 p-2 bg-white/5 rounded text-xs text-neutral-500 font-mono">
                                Ubicación: Intro Cursos, Videos
                            </div>
                        </div>
                        <div className="p-8 bg-neutral-900/50 rounded-xl flex justify-center items-center shadow-inner w-full">
                            <div className="w-full">
                                <AdAcademyIntro />
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}
