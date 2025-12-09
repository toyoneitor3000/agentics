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

// ==========================================
// 1. HERO SPONSOR (The "Powered By" Badge)
// ==========================================
// Ubicación: Top Right en Headers o sobrepuesto en imágenes Hero.
// Estilo: Minimalista, Glassmorphism, Solo Logo monocromático o blanco.
export function AdHeroSponsor() {
    return (
        <div className="group relative flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:border-[#FF9800]/30 transition-all cursor-pointer">
            <span className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-[#FF9800] transition-colors">
                Presented By
            </span>
            <div className="h-4 w-[1px] bg-white/10"></div>
            {/* Placeholder Logo - Usando texto estilizado por ahora */}
            <span className="font-oswald text-lg font-bold italic tracking-tighter text-white">
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
        <div className="relative group w-full max-w-sm rounded-xl overflow-hidden bg-[#0A0604] border border-[#FF9800]/20 hover:border-[#FF9800] transition-all duration-500">
            {/* Etiqueta "Partner" discreta */}
            <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-[#FF9800] text-black text-[10px] font-bold uppercase tracking-wider rounded-sm">
                Partner Speedlight
            </div>

            <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60"></div>
                {/* Imagen simulada */}
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-600">
                    [Product Image]
                </div>
            </div>

            <div className="p-5 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-white/10"></div>
                    <span className="text-xs text-[#FF9800] font-medium">Motul Colombia</span>
                </div>
                <h3 className="text-xl font-bold text-[#F5E6D3] mb-2 leading-tight">
                    Kit de Mantenimiento Sintético 8100
                </h3>
                <p className="text-sm text-[#BCAAA4] mb-4 line-clamp-2">
                    Maximiza el rendimiento de tu motor con la línea 100% sintética. Oferta exclusiva para miembros.
                </p>
                <button className="w-full py-2 bg-white/5 hover:bg-[#FF9800] text-[#F5E6D3] hover:text-black border border-white/10 hover:border-transparent rounded text-sm uppercase font-bold tracking-wider transition-all">
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
        <div className="w-full bg-[#0F0A08] border-l-2 border-[#FF9800] p-6 relative overflow-hidden">
            {/* Glow de fondo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9800]/10 blur-[50px] rounded-full pointer-events-none"></div>

            <h4 className="text-[#FF9800] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                Tech Recommendation
            </h4>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-1">PS4S</h3>
                    <p className="text-sm text-neutral-400">Michelin Pilot Sport</p>
                </div>
                <div className="text-right">
                    <span className="block text-2xl font-bold text-[#FF9800]">9.8</span>
                    <span className="text-[10px] text-neutral-500 uppercase">Grip Rating</span>
                </div>
            </div>

            <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                    <span className="text-neutral-500">Wet Braking</span>
                    <span className="text-[#F5E6D3]">Class A</span>
                </div>
                <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                    <span className="text-neutral-500">Durability</span>
                    <span className="text-[#F5E6D3]">30k Miles</span>
                </div>
            </div>

            <Link href="#" className="flex items-center justify-between text-sm text-white hover:text-[#FF9800] group transition-colors">
                <span className="border-b border-transparent group-hover:border-[#FF9800]">Encontrar Distribuidor</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
        </div>
    );
}

// ==========================================
// 4. WORKSHOP TRUST BADGE (The "Verified" Pin)
// ==========================================
// Ubicación: Mapa de talleres o Cards de Directorio.
// Estilo: Sello de calidad dorado/metálico.
export function AdWorkshopBadge() {
    return (
        <div className="flex items-center gap-4 bg-gradient-to-r from-[#1A1A1A] to-[#0A0604] border border-[#FFD700]/30 rounded-lg p-4 relative overflow-hidden group hover:border-[#FFD700]/60 transition-colors cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative w-12 h-12 flex-shrink-0 bg-[#FFD700]/10 rounded-full flex items-center justify-center border border-[#FFD700]/50 text-[#FFD700] font-bold text-xl font-serif">
                ★
            </div>

            <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[#F5E6D3] font-bold">Lavafante Detailing</h3>
                    <span className="bg-[#FFD700] text-black text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Verified
                    </span>
                </div>
                <p className="text-xs text-[#BCAAA4]">Especialistas en Corrección de Pintura</p>
            </div>

            <div className="text-right">
                <span className="block text-[#FFD700] text-xs font-bold">TOP</span>
                <span className="text-[#FFD700] text-xs">RATED</span>
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
        <div className="w-full aspect-video relative bg-black rounded-xl overflow-hidden flex items-center justify-center border border-white/10 group">
            {/* Background Content Placeholder */}
            <div className="absolute inset-0 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                <div className="w-full h-full bg-[url('/grid-pattern.png')] bg-repeat opacity-20"></div>
                <div className="w-full h-full bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            </div>

            {/* Sponsor Overlay */}
            <div className="relative z-10 text-center transform group-hover:scale-105 transition-transform duration-500">
                <p className="text-[#FF9800] text-xs uppercase tracking-[0.3em] font-medium mb-4">
                    Curso traído a ustedes por
                </p>
                <h2 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter drop-shadow-2xl">
                    TOYOTECH
                </h2>
                <p className="text-neutral-500 text-sm mt-4 tracking-widest uppercase">
                    Repuestos Genuinos & Performance
                </p>
            </div>

            {/* Play Button simulating functionality */}
            <div className="absolute bottom-8 right-8 flex items-center gap-3">
                <span className="text-xs text-white/50 uppercase tracking-widest">Saltar en 5s</span>
                <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white text-xs">
                    x
                </div>
            </div>
        </div>
    );
}
