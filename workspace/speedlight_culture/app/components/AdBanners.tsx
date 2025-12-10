"use client";

import Image from "next/image";
import Link from "next/link";
import { AdCampaign } from "@/app/data/ads";

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

interface AdComponentProps {
    data?: AdCampaign;
}

// ==========================================
// 1. HERO SPONSOR (The "Powered By" Badge)
// ==========================================
export function AdHeroSponsor({ data }: AdComponentProps) {
    if (!data) return null; // Or render a default "Partner with us"
    const { content } = data;

    return (
        <Link href={content.ctaLink || '#'} target="_blank" className="group relative flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 hover:border-[#FF9800]/50 transition-all duration-300 cursor-pointer hover:shadow-[0_0_15px_rgba(255,152,0,0.1)]">
            <span className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-[#FF9800] transition-colors font-medium">
                {content.badgeText || "Presented By"}
            </span>
            <div className="h-4 w-[1px] bg-white/10 group-hover:bg-[#FF9800]/30 transition-colors"></div>
            <span className="font-oswald text-lg font-bold italic tracking-tighter text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] transition-all">
                {content.brandName || content.logoText || "SPONSOR"}
            </span>
        </Link>
    );
}

// ==========================================
// 2. NATIVE FEED CARD (The "In-Grid" Promo)
// ==========================================
export function AdFeedCard({ data }: AdComponentProps) {
    if (!data) return null;
    const { content } = data;

    return (
        <div className="relative group w-full max-w-sm h-full rounded-xl overflow-hidden bg-[#0A0604] border border-white/5 hover:border-[#FF9800]/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,152,0,0.1)] flex flex-col">
            {/* Etiqueta "Partner" discreta */}
            <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-[#FF9800] text-black text-[9px] font-bold uppercase tracking-wider rounded-sm shadow-lg">
                {content.badgeText || "Partner Speedlight"}
            </div>

            <div className="relative h-48 sm:h-64 overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0604] via-transparent to-transparent z-10 opacity-80"></div>
                {/* Visual Glare Effect */}
                <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:animate-shine" />

                {/* Imagen simulada/real */}
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center relative">
                    {content.imageUrl && content.imageUrl.startsWith('/') ? (
                        // If we had a real image component we'd use it, for now fallback to text if image fails or just the bg
                        <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${content.imageUrl})` }}></div>
                    ) : null}
                    <span className="text-neutral-700 font-bold text-4xl opacity-20 group-hover:opacity-30 transition-opacity z-0">
                        {content.brandName?.substring(0, 5) || "AD"}
                    </span>
                </div>
            </div>

            <div className="p-5 relative z-10 -mt-12 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-[#FF9800] flex items-center justify-center text-[10px] font-bold text-black border border-white/20">
                        {content.brandName ? content.brandName.charAt(0) : "S"}
                    </div>
                    <span className="text-xs text-[#FF9800] font-medium tracking-wide">{content.brandName || "Brand"}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-[#FF9800] transition-colors">
                    {content.title || "Oferta Especial"}
                </h3>
                <p className="text-sm text-neutral-400 mb-4 line-clamp-3 leading-relaxed flex-grow">
                    {content.description || "Descubre los beneficios exclusivos para miembros de nuestra comunidad."}
                </p>
                <Link href={content.ctaLink || "#"} className="w-full text-center py-2.5 bg-white/5 hover:bg-[#FF9800] text-white/90 hover:text-black border border-white/10 hover:border-transparent rounded text-xs uppercase font-bold tracking-[0.15em] transition-all duration-300 mt-auto">
                    {content.ctaText || "Ver Detalles"}
                </Link>
            </div>
        </div>
    );
}

// ==========================================
// 3. SIDEBAR TECH SPEC (The "Information" Ad)
// ==========================================
export function AdSidebarSpec({ data }: AdComponentProps) {
    if (!data) return null;
    const { content } = data;

    return (
        <div className="w-full h-full bg-[#0F0A08] border-l-2 border-[#FF9800] p-6 relative overflow-hidden group hover:bg-[#15100E] transition-colors rounded-r-xl">
            {/* Glow de fondo */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF9800]/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#FF9800]/10 transition-all duration-500"></div>

            <h4 className="text-[#FF9800] text-[10px] font-bold uppercase tracking-[0.2em] mb-5 flex items-center gap-2 opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9800] animate-pulse"></span>
                Tech Recommendation
            </h4>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-3xl font-black text-white mb-1 italic tracking-tighter">{content.title || "SPEC"}</h3>
                    <p className="text-xs text-neutral-400 uppercase tracking-wide">{content.subtitle || "High Performance"}</p>
                </div>
                <div className="text-right">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded border border-[#FF9800]/30 bg-[#FF9800]/10 text-[#FF9800] font-bold text-lg">
                        {content.rating || "10"}
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                {content.specs?.map((spec, idx) => (
                    <div key={idx} className="flex justify-between text-xs border-b border-white/5 pb-2 group-hover:border-white/10 transition-colors">
                        <span className="text-neutral-500 font-medium">{spec.label}</span>
                        <span className="text-white font-mono">{spec.value}</span>
                    </div>
                ))}
            </div>

            <Link href={content.ctaLink || "#"} className="flex items-center justify-between text-xs font-bold text-neutral-400 hover:text-[#FF9800] group/link transition-colors uppercase tracking-wider">
                <span className="border-b border-transparent group-hover/link:border-[#FF9800] pb-0.5 transition-all">{content.ctaText || "Ver Ficha"}</span>
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
            </Link>
        </div>
    );
}

// ==========================================
// 4. WORKSHOP TRUST BADGE (The "Verified" Pin)
// ==========================================
export function AdWorkshopBadge({ data }: AdComponentProps) {
    if (!data) return null;
    const { content } = data;

    return (
        <Link href={content.ctaLink || "#"} className="flex items-center gap-4 bg-[#110C0A] border border-[#FF9800]/20 rounded-lg p-4 relative overflow-hidden group hover:border-[#FF9800]/60 transition-all duration-300 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF9800]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative w-12 h-12 flex-shrink-0 bg-[#FF9800]/10 rounded-full flex items-center justify-center border border-[#FF9800]/40 text-[#FF9800] font-bold text-xl font-serif shadow-[0_0_15px_rgba(255,152,0,0.1)] group-hover:scale-110 transition-transform duration-300">
                ★
            </div>

            <div className="flex-grow z-10">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold tracking-tight">{content.brandName || "Taller VIP"}</h3>
                    <span className="bg-[#FF9800] text-black text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {content.badgeText || "Verified"}
                    </span>
                </div>
                <p className="text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors">{content.description || "Servicio Certificado"}</p>
            </div>

            <div className="text-right z-10">
                <span className="block text-[#FF9800] text-[10px] font-bold tracking-widest opacity-80 group-hover:opacity-100">TOP</span>
                <span className="text-white/40 text-[9px] tracking-widest">RATED</span>
            </div>
        </Link>
    );
}

// ==========================================
// 5. ACADEMY POWERED INTRO (The "Video" Sponsor)
// ==========================================
export function AdAcademyIntro({ data }: AdComponentProps) {
    if (!data) return null;
    const { content } = data;

    return (
        <div className="w-full h-full relative bg-[#050505] overflow-hidden flex items-center justify-center group hover:border-[#FF9800]/30 transition-all duration-700">
            {/* Background Content Placeholder */}
            <div className="absolute inset-0 opacity-30 grayscale group-hover:grayscale-0 transition-all duration-1000">
                <div className="w-full h-full bg-[linear-gradient(45deg,#111_25%,transparent_25%,transparent_75%,#111_75%,#111),linear-gradient(45deg,#111_25%,transparent_25%,transparent_75%,#111_75%,#111)] bg-[length:20px_20px] opacity-20"></div>
                <div className="w-full h-full bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>

            {/* Sponsor Overlay */}
            <div className="relative z-10 text-center transform group-hover:scale-105 transition-transform duration-700 ease-out p-6">
                <p className="text-[#FF9800] text-[10px] uppercase tracking-[0.4em] font-bold mb-6 opacity-80">
                    {content.badgeText || "Powered By"}
                </p>
                <div className="relative inline-block">
                    <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 italic tracking-tighter drop-shadow-2xl group-hover:to-white transition-all">
                        {content.brandName || "SPONSOR"}
                    </h2>
                    <div className="absolute -inset-4 bg-[#FF9800]/20 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                </div>

                <p className="text-neutral-500 text-xs mt-6 tracking-[0.2em] uppercase font-medium border-t border-white/5 pt-4 inline-block px-8">
                    {content.subtitle || "Official Partner"}
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

// ==========================================
// 6. GRADIENT STRIP (The "Education" Banner)
// ==========================================
export function AdGradientStrip() {
    return (
        <div className="w-full bg-gradient-to-r from-[#003366] via-[#008080] to-[#4CAF50] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg group cursor-pointer hover:shadow-[0_0_20px_rgba(76,175,80,0.3)] transition-all duration-300">
            <div className="flex items-center gap-4">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider border border-white/10">
                    Education
                </span>
                <span className="text-white font-medium tracking-wide">
                    Aprende en la Academia
                </span>
            </div>

            <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide group-hover:gap-4 transition-all">
                <span>Ir a Speedlight Academy</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z" />
                </svg>
            </div>
        </div>
    );
}
