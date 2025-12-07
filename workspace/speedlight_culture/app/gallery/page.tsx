"use client";


import Link from "next/link";

export default function GalleryPage() {
    return (
        <main className="min-h-screen">


            <div className="pt-48 pb-20 px-6 container mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF9800] via-[#FFEB3B] to-[#FF9800] animate-glow">
                            GALERÍA VISUAL
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#BCAAA4] max-w-2xl mx-auto font-light">
                        Explora el arte de la velocidad. Desde fondos exclusivos hasta coberturas completas de los mejores eventos.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Backgrounds Card */}
                    <Link href="/gallery/background" className="group relative h-[500px] overflow-hidden rounded-2xl border border-[#4A2C1A] hover:border-[#FF9800]/50 transition-all duration-500">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 filter brightness-50 group-hover:brightness-75"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F08] via-transparent to-transparent opacity-90"></div>

                        <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h2 className="text-4xl font-bold mb-2 text-[#FFF8F0] group-hover:text-[#FF9800] transition-colors">FONDOS</h2>
                            <p className="text-[#BCAAA4] mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                Wallpapers exclusivos en alta resolución para tus dispositivos.
                            </p>
                            <div className="flex items-center text-[#FF9800] font-medium tracking-widest uppercase text-sm">
                                <span>Explorar Colección</span>
                                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Events Card */}
                    <Link href="/gallery/events" className="group relative h-[500px] overflow-hidden rounded-2xl border border-[#4A2C1A] hover:border-[#D32F2F]/50 transition-all duration-500">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 filter brightness-50 group-hover:brightness-75"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F08] via-transparent to-transparent opacity-90"></div>

                        <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h2 className="text-4xl font-bold mb-2 text-[#FFF8F0] group-hover:text-[#D32F2F] transition-colors">EVENTOS</h2>
                            <p className="text-[#BCAAA4] mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                Álbumes completos de los eventos más recientes cargados por nuestros fotógrafos.
                            </p>
                            <div className="flex items-center text-[#D32F2F] font-medium tracking-widest uppercase text-sm">
                                <span>Ver Álbumes</span>
                                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    );
}
