"use client";

import Image from "next/image";
import Link from "next/link";

/* 
  Estrategia de Publicidad "Non-Intrusive Premium"
  
  Objetivo: 
  La publicidad debe sentirse como contenido nativo de alta calidad. 
  Incluso si el usuario paga para "no ver anuncios", estos elementos 
  se transforman en "Recomendaciones Curadas" o "Partners Oficiales", 
  manteniendo la estética pero eliminando el ruido comercial directo.
*/

// CONSTANTS FOR CONSISTENCY
const BRAND_ORANGE = "#FF9800";
const BRAND_BG_DARK = "#0F0A08";

// ==========================================
// 1. HERO SPONSOR (The "Powered By" Badge)
// ==========================================
// Ubicación: Top Right en Headers o sobrepuesto en imágenes Hero.
// Estilo: Minimalista, Glassmorphism, Solo Logo monocromático o blanco.
export function AdHeroSponsor() {
    return (
        <div className="group relative flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 hover:border-[#FF9800]/50 transition-all duration-300 cursor-pointer hover:shadow-[0_0_15px_rgba(255,152,0,0.1)]">
            <span className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-[#FF9800] transition-colors font-medium">
                Presented By
            </span>
            <div className="h-4 w-[1px] bg-white/10 group-hover:bg-[#FF9800]/30 transition-colors"></div>
            {/* Placeholder Logo - Usando texto estilizado por ahora */}
            <span className="font-oswald text-lg font-bold italic tracking-tighter text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] transition-all">
                BREMBO
            </span>
        </div>
    );
}

// ==========================================
// 2. NATIVE FEED CARD (The "In-Grid" Promo)
// ==========================================
// Ubicación: Dentro del Grid de Marketplace o Galería (ej: cada 8 items).
// Estilo: Idéntico a una tarjeta de producto pero con etiqueta "Destacado".
export function AdFeedCard() {
    return (
        <div className="relative group w-full max-w-sm rounded-xl overflow-hidden bg-[#0A0604] border border-white/5 hover:border-[#FF9800]/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,152,0,0.1)]">
            {/* Etiqueta "Partner" discreta - Synchronized Style */}
            <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-[#FF9800] text-black text-[9px] font-bold uppercase tracking-wider rounded-sm shadow-lg">
                Partner Speedlight
            </div>

            <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0604] via-transparent to-transparent z-10 opacity-80"></div>
                {/* Visual Glare Effect on Hover */}
                <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:animate-shine" />

                {/* Imagen simulada */}
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center relative">
                    <span className="text-neutral-700 font-bold text-4xl opacity-20 group-hover:opacity-30 transition-opacity">MOTUL</span>
                </div>
            </div>

            <div className="p-5 relative z-10 -mt-12">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-[#FF9800] flex items-center justify-center text-[10px] font-bold text-black border border-white/20">M</div>
                    <span className="text-xs text-[#FF9800] font-medium tracking-wide">Motul Colombia</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-[#FF9800] transition-colors">
                    Kit Sintético 8100
                </h3>
                <p className="text-sm text-neutral-400 mb-4 line-clamp-2 leading-relaxed">
                    Maximiza el rendimiento con la fórmula 100% sintética. Oferta exclusiva para miembros.
                </p>
                <button className="w-full py-2.5 bg-white/5 hover:bg-[#FF9800] text-white/90 hover:text-black border border-white/10 hover:border-transparent rounded text-xs uppercase font-bold tracking-[0.15em] transition-all duration-300">
                    Ver Oferta
                </button>
            </div>
        </div>
    );
}

// ==========================================
// 3. SIDEBAR TECH SPEC (The "Information" Ad)
// ==========================================
// Ubicación: Sidebars de Foros o Artículos Técnicos.
// Estilo: Ficha técnica / Dashboard UI. Parece información útil, no un anuncio.
export function AdSidebarSpec() {
    return (
        <div className="w-full bg-[#0F0A08] border-l-2 border-[#FF9800] p-6 relative overflow-hidden group hover:bg-[#15100E] transition-colors">
            {/* Glow de fondo - Synchronized */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF9800]/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#FF9800]/10 transition-all duration-500"></div>

            <h4 className="text-[#FF9800] text-[10px] font-bold uppercase tracking-[0.2em] mb-5 flex items-center gap-2 opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9800] animate-pulse"></span>
                Tech Recommendation
            </h4>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-3xl font-black text-white mb-1 italic tracking-tighter">PS4S</h3>
                    <p className="text-xs text-neutral-400 uppercase tracking-wide">Michelin Pilot Sport</p>
                </div>
                <div className="text-right">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded border border-[#FF9800]/30 bg-[#FF9800]/10 text-[#FF9800] font-bold text-lg">
                        9.8
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs border-b border-white/5 pb-2 group-hover:border-white/10 transition-colors">
                    <span className="text-neutral-500 font-medium">Wet Braking</span>
                    <span className="text-white font-mono">Class A</span>
                </div>
                <div className="flex justify-between text-xs border-b border-white/5 pb-2 group-hover:border-white/10 transition-colors">
                    <span className="text-neutral-500 font-medium">Durability</span>
                    <span className="text-white font-mono">30k Miles</span>
                </div>
            </div>

            <Link href="#" className="flex items-center justify-between text-xs font-bold text-neutral-400 hover:text-[#FF9800] group/link transition-colors uppercase tracking-wider">
                <span className="border-b border-transparent group-hover/link:border-[#FF9800] pb-0.5 transition-all">Ver Ficha Técnica</span>
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
            </Link>
        </div>
    );
}

// ==========================================
// 4. WORKSHOP TRUST BADGE (The "Verified" Pin)
// ==========================================
// Ubicación: Mapa de talleres o Cards de Directorio.
// Estilo: Sello de calidad.
export function AdWorkshopBadge() {
    return (
        <div className="flex items-center gap-4 bg-[#110C0A] border border-[#FF9800]/20 rounded-lg p-4 relative overflow-hidden group hover:border-[#FF9800]/60 transition-all duration-300 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF9800]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Changed from Gold to Speedlight Orange for Synchronization */}
            <div className="relative w-12 h-12 flex-shrink-0 bg-[#FF9800]/10 rounded-full flex items-center justify-center border border-[#FF9800]/40 text-[#FF9800] font-bold text-xl font-serif shadow-[0_0_15px_rgba(255,152,0,0.1)] group-hover:scale-110 transition-transform duration-300">
                ★
            </div>

            <div className="flex-grow z-10">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold tracking-tight">Lavafante Detailing</h3>
                    <span className="bg-[#FF9800] text-black text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Verified
                    </span>
                </div>
                <p className="text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors">Corrección de Pintura & PPF</p>
            </div>

            <div className="text-right z-10">
                <span className="block text-[#FF9800] text-[10px] font-bold tracking-widest opacity-80 group-hover:opacity-100">TOP</span>
                <span className="text-white/40 text-[9px] tracking-widest">RATED</span>
            </div>
        </div>
    );
}

// ==========================================
// 5. ACADEMY POWERED INTRO (The "Video" Sponsor)
// ==========================================
// Ubicación: Antes de iniciar un curso o video en Academy.
// Estilo: Cinematic, pantalla completa o overlay inferior.
export function AdAcademyIntro() {
    return (
        <div className="w-full aspect-video relative bg-[#050505] rounded-xl overflow-hidden flex items-center justify-center border border-white/10 group hover:border-[#FF9800]/30 transition-all duration-700">
            {/* Background Content Placeholder */}
            <div className="absolute inset-0 opacity-30 grayscale group-hover:grayscale-0 transition-all duration-1000">
                <div className="w-full h-full bg-[linear-gradient(45deg,#111_25%,transparent_25%,transparent_75%,#111_75%,#111),linear-gradient(45deg,#111_25%,transparent_25%,transparent_75%,#111_75%,#111)] bg-[length:20px_20px] opacity-20"></div>
                <div className="w-full h-full bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>

            {/* Sponsor Overlay */}
            <div className="relative z-10 text-center transform group-hover:scale-105 transition-transform duration-700 ease-out">
                <p className="text-[#FF9800] text-[10px] uppercase tracking-[0.4em] font-bold mb-6 opacity-80">
                    Powered By
                </p>
                <div className="relative inline-block">
                    <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 italic tracking-tighter drop-shadow-2xl group-hover:to-white transition-all">
                        TOYOTECH
                    </h2>
                    <div className="absolute -inset-4 bg-[#FF9800]/20 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                </div>

                <p className="text-neutral-500 text-xs mt-6 tracking-[0.2em] uppercase font-medium border-t border-white/5 pt-4 inline-block px-8">
                    Performance Parts
                </p>
            </div>

            {/* Play Button simulating functionality */}
            <div className="absolute bottom-6 right-6 flex items-center gap-4 group/skip cursor-pointer">
                <span className="text-[10px] text-white/30 uppercase tracking-widest group-hover/skip:text-white transition-colors">Omitir en 5s</span>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 text-xs group-hover/skip:border-white group-hover/skip:text-white transition-all bg-black/50 backdrop-blur">
                    ✕
                </div>
            </div>
        </div>
    );
}
