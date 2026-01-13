"use client";

import Image from "next/image";
import Link from "next/link";
import { AdCampaign } from "@/app/data/ads";
import { useLanguage } from "@/app/context/LanguageContext";

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

const t_ads = {
    es: {
        presentedBy: "Presentado por",
        partner: "Partner Speedlight",
        offer: "Oferta Especial",
        desc: "Descubre los beneficios exclusivos para miembros de nuestra comunidad.",
        seeDetails: "Ver Detalles",
        techRec: "Recomendación Tech",
        spec: "ESPECIFICACIÓN",
        highPerf: "Alto Rendimiento",
        seeSpec: "Ver Ficha",
        vipWorkshop: "Taller VIP",
        verified: "Verificado",
        certService: "Servicio Certificado",
        poweredBy: "Impulsado por",
        official: "Partner Oficial",
        skip: "Omitir en 5s",
        eduBadge: "Educación",
        learn: "Aprende en la Academia",
        goTo: "Ir a Speedlight Academy"
    },
    en: {
        presentedBy: "Presented By",
        partner: "Speedlight Partner",
        offer: "Special Offer",
        desc: "Discover exclusive benefits for our community members.",
        seeDetails: "See Details",
        techRec: "Tech Recommendation",
        spec: "SPEC",
        highPerf: "High Performance",
        seeSpec: "View Spec",
        vipWorkshop: "VIP Workshop",
        verified: "Verified",
        certService: "Certified Service",
        poweredBy: "Powered By",
        official: "Official Partner",
        skip: "Skip in 5s",
        eduBadge: "Education",
        learn: "Learn at the Academy",
        goTo: "Go to Speedlight Academy"
    }
};

// ==========================================
// 1. HERO SPONSOR (The "Powered By" Badge)
// ==========================================
export function AdHeroSponsor({ data }: AdComponentProps) {
    const { language } = useLanguage();
    const text = t_ads[language];

    if (!data) return null; // Or render a default "Partner with us"
    const { content } = data;

    return (
        <Link href={content.ctaLink || '#'} target="_blank" className="group relative flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 hover:border-[#FF9800]/50 transition-all duration-300 cursor-pointer hover:shadow-[0_0_15px_rgba(255,152,0,0.1)]">
            <span className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-[#FF9800] transition-colors font-medium">
                {content.badgeText || text.presentedBy}
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
// ==========================================
// 2. NATIVE FEED CARD (The "In-Grid" Carousel)
// ==========================================
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function AdFeedCard({ data }: AdComponentProps) {
    const { language } = useLanguage();
    const text = t_ads[language];
    const [currentIndex, setCurrentIndex] = useState(0);

    // Mock data fallback if no prop provided
    const content = data?.content || {
        brandName: "Speedlight Originals",
        title: "Colección Limitada",
        description: "Equipamiento profesional para conductores exigentes. Diseño aerodinámico y materiales de fibra de carbono.",
        ctaText: "Ver Colección",
        ctaLink: "/shop",
        images: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1966&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583121274602-3e2820c698d9?q=80&w=2070&auto=format&fit=crop"
        ],
        badgeText: "Patrocinado"
    } as any;

    // Normalize images: use array if exists, otherwise single image, otherwise fallback
    const images = content.images && content.images.length > 0
        ? content.images
        : [content.imageUrl || "https://images.unsplash.com/photo-1493238792015-fa094a3672a0?q=80&w=2073&auto=format&fit=crop"];

    const nextSlide = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative group w-full max-w-sm h-fit rounded-xl overflow-hidden bg-[#0A0604] border border-white/5 hover:border-[#FF9800]/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,152,0,0.1)] flex flex-col">

            {/* Header: Brand Identity (Native Feel) */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-[#0F0A08]">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF9800] to-orange-900 p-[1px]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                            {content.brandName ? content.brandName.charAt(0) : "S"}
                        </div>
                    </div>
                    <span className="text-xs text-white font-bold tracking-wide">{content.brandName || "Brand"}</span>
                </div>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                    {content.badgeText || text.partner}
                </span>
            </div>

            {/* Carousel Section */}
            <div className="relative h-64 overflow-hidden bg-neutral-900 group/slider">
                {images.map((img: string, idx: number) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${idx === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        <Image
                            src={img}
                            alt="Ad Content"
                            fill
                            className="object-cover"
                        />
                        {/* Vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0604] via-transparent to-transparent opacity-60"></div>
                    </div>
                ))}

                {/* Controls (Only if multiple images) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-[#FF9800] hover:text-black z-20"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-[#FF9800] hover:text-black z-20"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                            {images.map((_: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-[#FF9800] w-3' : 'bg-white/30'}`}
                                ></div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Content Body (Native CTA) */}
            <div className="p-5 flex flex-col gap-3">
                <div>
                    <h3 className="text-lg font-bold text-white leading-tight mb-1">
                        {content.title || text.offer}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {content.description || text.desc}
                    </p>
                </div>

                <Link
                    href={content.ctaLink || "#"}
                    className="w-full mt-2 bg-[#FF9800]/10 hover:bg-[#FF9800] text-[#FF9800] hover:text-black border border-[#FF9800]/20 hover:border-transparent py-3 rounded-lg flex items-center justify-center gap-2 transition-all group/btn"
                >
                    <span className="text-xs font-bold uppercase tracking-widest">{content.ctaText || text.seeDetails}</span>
                    <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </div>
    );
}

// ==========================================
// 3. SIDEBAR TECH SPEC (The "Information" Ad)
// ==========================================
export function AdSidebarSpec({ data }: AdComponentProps) {
    const { language } = useLanguage();
    const text = t_ads[language];

    if (!data) return null;
    const { content } = data;

    return (
        <div className="w-full h-full bg-[#0F0A08] border-l-2 border-[#FF9800] p-6 relative overflow-hidden group hover:bg-[#15100E] transition-colors rounded-r-xl">
            {/* Glow de fondo */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF9800]/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#FF9800]/10 transition-all duration-500"></div>

            <h4 className="text-[#FF9800] text-[10px] font-bold uppercase tracking-[0.2em] mb-5 flex items-center gap-2 opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9800] animate-pulse"></span>
                {text.techRec}
            </h4>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-3xl font-black text-white mb-1 italic tracking-tighter">{content.title || text.spec}</h3>
                    <p className="text-xs text-neutral-400 uppercase tracking-wide">{content.subtitle || text.highPerf}</p>
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
                <span className="border-b border-transparent group-hover/link:border-[#FF9800] pb-0.5 transition-all">{content.ctaText || text.seeSpec}</span>
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
            </Link>
        </div>
    );
}

// ==========================================
// 4. WORKSHOP TRUST BADGE (The "Verified" Pin)
// ==========================================
export function AdWorkshopBadge({ data }: AdComponentProps) {
    const { language } = useLanguage();
    const text = t_ads[language];

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
                    <h3 className="text-white font-bold tracking-tight">{content.brandName || text.vipWorkshop}</h3>
                    <span className="bg-[#FF9800] text-black text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {content.badgeText || text.verified}
                    </span>
                </div>
                <p className="text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors">{content.description || text.certService}</p>
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
    const { language } = useLanguage();
    const text = t_ads[language];

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
                    {content.badgeText || text.poweredBy}
                </p>
                <div className="relative inline-block">
                    <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 italic tracking-tighter drop-shadow-2xl group-hover:to-white transition-all">
                        {content.brandName || "SPONSOR"}
                    </h2>
                    <div className="absolute -inset-4 bg-[#FF9800]/20 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                </div>

                <p className="text-neutral-500 text-xs mt-6 tracking-[0.2em] uppercase font-medium border-t border-white/5 pt-4 inline-block px-8">
                    {content.subtitle || text.official}
                </p>
            </div>

            {/* Play Button simulating functionality */}
            <div className="absolute bottom-6 right-6 flex items-center gap-4 group/skip cursor-pointer">
                <span className="text-[10px] text-white/30 uppercase tracking-widest group-hover/skip:text-white transition-colors">{text.skip}</span>
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
    const { language } = useLanguage();
    const text = t_ads[language];

    return (
        <div className="w-full bg-gradient-to-r from-[#003366] via-[#008080] to-[#4CAF50] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg group cursor-pointer hover:shadow-[0_0_20px_rgba(76,175,80,0.3)] transition-all duration-300">
            <div className="flex items-center gap-4">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider border border-white/10">
                    {text.eduBadge}
                </span>
                <span className="text-white font-medium tracking-wide">
                    {text.learn}
                </span>
            </div>

            <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide group-hover:gap-4 transition-all">
                <span>{text.goTo}</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z" />
                </svg>
            </div>
        </div>
    );
}
