"use client";

import { UserBadge } from "../components/UserBadge";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, MonitorPlay, ShoppingBag, Calendar, Image as ImageIcon, MessageSquare, Search, Smartphone, Upload, DollarSign, Target, PlayCircle, MapPin, Trophy, Newspaper, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

// ----------------------------------------------------------------------
// DATA MOCKS (DEFINED BEFORE USAGE TO AVOID HOISTING ISSUES)
// ----------------------------------------------------------------------

const HERO_SLIDES = [
    { bgClass: "bg-gradient-to-br from-orange-600 to-red-600", title: "FRENOS GT", subtitle: "Potencia de frenado", icon: <Target className="w-8 h-8 text-white/80" /> },
    { bgClass: "bg-gradient-to-br from-neutral-800 to-neutral-900", title: "TURBO KIT", subtitle: "Stage 2 Disponible", icon: <Zap className="w-8 h-8 text-[#FF9800]" /> },
    { bgClass: "bg-gradient-to-br from-blue-900 to-slate-900", title: "RINES JDM", subtitle: "Importados Japón", icon: <CheckCircle2 className="w-8 h-8 text-cyan-400" /> }
];

const FEED_SLIDES = [
    { bgClass: "bg-gradient-to-b from-neutral-800 to-neutral-900", title: "SUSPENSIÓN", subtitle: "Ajustable", cta: "COMPRAR", icon: <DollarSign className="w-6 h-6 text-[#FF9800]" /> },
    { bgClass: "bg-neutral-800", title: "TALLER 911", subtitle: "Especialistas Porsche", cta: "AGENDAR", icon: <Upload className="w-6 h-6 text-white" /> },
    { bgClass: "bg-gradient-to-b from-[#FF9800] to-orange-700", title: "PROMO MES", subtitle: "20% OFF Aceites", cta: "OFERTA", icon: <Zap className="w-6 h-6 text-black" /> }
];

const CINEMA_SLIDES = [
    { bgClass: "bg-purple-900", title: "NUEVO VIDEO", subtitle: "Patrocinado por Motul", icon: <PlayCircle className="w-10 h-10 text-white" />, cta: "VER 15s" },
    { bgClass: "bg-black", title: "NEXT EPISODE", subtitle: "Speedlight Originals", icon: <MonitorPlay className="w-10 h-10 text-purple-500" />, cta: "TRAILER" },
];

const MARKET_SLIDES = [
    { bgClass: "bg-emerald-900", title: "VENDIDO", subtitle: "Nissan GTR R35", icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" /> },
    { bgClass: "bg-neutral-900 border border-emerald-500/20", title: "DESTACADO", subtitle: "Toyota Supra MK4", icon: <ShoppingBag className="w-6 h-6 text-emerald-500" /> },
    { bgClass: "bg-teal-800", title: "NUEVO", subtitle: "Bodykit Liberty Walk", icon: <Zap className="w-6 h-6 text-white" /> }
];

const EVENT_SLIDES = [
    { bgClass: "bg-pink-900", title: "TRACK DAY", subtitle: "Autódromo Tocancipá", icon: <Calendar className="w-6 h-6 text-white" /> },
    { bgClass: "bg-neutral-800", title: "CARS & COFFEE", subtitle: "Domingo 9AM", icon: <Calendar className="w-6 h-6 text-pink-500" /> }
];

const GALLERY_SLIDES = [
    { bgClass: "bg-blue-900", title: "MICHELIN", subtitle: "Official Partner", cta: "GALERIA", icon: <ImageIcon className="w-6 h-6 text-white" /> },
    { bgClass: "bg-slate-800", title: "SONAX", subtitle: "Detailing Pro", cta: "VER MÁS", icon: <ImageIcon className="w-6 h-6 text-blue-400" /> }
];

const FORUM_SLIDES = [
    { bgClass: "bg-yellow-900", title: "HILO OFICIAL", subtitle: "Mecánica General", icon: <MessageSquare className="w-6 h-6 text-white" /> },
    { bgClass: "bg-neutral-800", title: "DEBATE", subtitle: "Mejor Aceite 2024", icon: <MessageSquare className="w-6 h-6 text-yellow-500" /> }
];

const SEARCH_SLIDES = [
    { bgClass: "bg-neutral-800", title: "TALLER BMW", subtitle: "Resultado #1", icon: <Search className="w-6 h-6 text-neutral-500" /> },
    { bgClass: "bg-neutral-900 border border-[#FF9800]/30", title: "FRENOS", subtitle: "Resultado Patrocinado", icon: <Search className="w-6 h-6 text-[#FF9800]" /> }
];

const PROJECT_SLIDES = [
    { bgClass: "bg-slate-900", title: "POWERED BY", subtitle: "HKS Japan", icon: <Zap className="w-6 h-6 text-yellow-400" /> },
    { bgClass: "bg-neutral-800 border border-red-500/30", title: "OFFICIAL BUILD", subtitle: "Patrocinado por Brembo", icon: <Target className="w-6 h-6 text-red-500" /> }
];

const MAP_SLIDES = [
    { bgClass: "bg-emerald-900", title: "TALLER 24H", subtitle: "A 2km de ti", icon: <MapPin className="w-6 h-6 text-emerald-400" /> },
    { bgClass: "bg-neutral-800", title: "PUNTO DE REUNIÓN", subtitle: "Car Audio Fest", icon: <MapPin className="w-6 h-6 text-[#FF9800]" /> }
];

const CHALLENGE_SLIDES = [
    { bgClass: "bg-yellow-900", title: "RETO MEGUIAR'S", subtitle: "Sube tu mejor foto", cta: "PARTICIPAR", icon: <Trophy className="w-6 h-6 text-yellow-400" /> },
    { bgClass: "bg-neutral-800", title: "GANADOR SEMANA", subtitle: "Premio: Kit Limpieza", icon: <Trophy className="w-6 h-6 text-white" /> }
];

const EDITORIAL_SLIDES = [
    { bgClass: "bg-neutral-900 border-l-4 border-[#FF9800]", title: "REVIEW A FONDO", subtitle: "Nueva Toyota Prado", cta: "LEER", icon: <Newspaper className="w-6 h-6 text-[#FF9800]" /> },
    { bgClass: "bg-neutral-800", title: "HISTORIA DE MARCA", subtitle: "El legado de BBS", icon: <Newspaper className="w-6 h-6 text-white" /> }
];

const NOTIFICATION_SLIDES = [
    { bgClass: "bg-blue-900", title: "OFERTA FLASH", subtitle: "Solo por 2 horas", icon: <Bell className="w-6 h-6 text-white" /> },
    { bgClass: "bg-neutral-800 border border-blue-500/30", title: "LANZAMIENTO", subtitle: "Nueva Colección", icon: <Bell className="w-6 h-6 text-blue-500" /> }
];

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

// SLIDER UNIVERSAL: Hace que cualquier formato cobre vida
function UniversalAdSlider({ slides, interval = 3000, aspectRatio = "aspect-square", overlay }: any) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Random offset inicial para que no cambien todos al tiempo robóticamente
        const timeout = setTimeout(() => {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % slides.length);
            }, interval);
            return () => clearInterval(timer);
        }, Math.random() * 2000);

        return () => clearTimeout(timeout);
    }, [interval, slides.length]);

    return (
        <div className={`w-full ${aspectRatio} bg-neutral-900 relative rounded-lg overflow-hidden flex flex-col group-hover:shadow-2xl transition-all`}>
            {/* Slides Container */}
            <div className="flex-1 relative w-full h-full">
                {slides.map((slide: any, index: number) => (
                    <div
                        key={index}
                        className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center transition-all duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'
                            } ${slide.bgClass || 'bg-neutral-800'}`}
                    >
                        {/* Icono animado */}
                        <div className={`mb-2 transform transition-all duration-700 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                            {slide.icon}
                        </div>

                        {/* Texto Principal */}
                        <span className="text-white font-black text-lg md:text-xl uppercase tracking-tight leading-none mb-1 drop-shadow-md">
                            {slide.title}
                        </span>

                        {/* Subtexto */}
                        <span className="text-white/90 text-xs font-medium bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">
                            {slide.subtitle}
                        </span>

                        {/* Tag de Acción (Simulado) */}
                        {slide.cta && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg transform transition-transform hover:scale-110">
                                {slide.cta}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Progress indicators */}
            <div className="absolute top-2 right-2 flex gap-1 z-20">
                {slides.map((_: any, idx: number) => (
                    <div
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-500 shadow-sm ${idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/30'}`}
                    />
                ))}
            </div>

            {/* Optional Static Overlay */}
            {overlay}
        </div>
    );
}

// COMPONENTE INTERNO PARA TARJETAS DE FORMATO
function AdFormatCard({ title, description, icon, children, gradient, accentColor, placement }: any) {
    return (
        <div className="group relative h-full">
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl opacity-20 blur transition duration-500 group-hover:opacity-50`}></div>
            <div className="relative h-full bg-[#0F0A08] p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${accentColor} border border-current px-2 py-0.5 rounded-full opacity-70`}>
                        {placement}
                    </span>
                    {icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                    {description}
                </p>

                <div className="w-full mt-auto rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-black/50 p-2 group-hover:scale-[1.02] transition-transform duration-500 ease-out">
                    {children}
                </div>
            </div>
        </div>
    );
}

// COMPONENTE: CALCULADORA DE CAMPAÑA (SIMULADOR)
function CampaignSimulator() {
    const [days, setDays] = useState(7);
    const [dailyBudget, setDailyBudget] = useState(50000); // 50k COP default

    const totalCost = days * dailyBudget;

    // Impacto ficticio basado en presupuesto
    const impactPercentage = Math.min((dailyBudget / 200000) * 100, 100);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="relative bg-[#0F0A08] border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl max-w-2xl mx-auto">
            {/* Header del Simulador */}
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#FF9800]" /> Simulador de Campaña
                </h3>
                <span className="text-[10px] bg-green-500/10 text-green-500 font-bold px-2 py-0.5 rounded-full border border-green-500/20 animate-pulse">
                    ● SISTEMA ACTIVO
                </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* COLUMNA IZQUIERDA: CONTROLES */}
                <div className="space-y-8">

                    {/* Control: Días */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm font-bold">
                            <label className="text-neutral-400">Duración</label>
                            <span className="text-white">{days} Días</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#FF9800]"
                        />
                        <div className="flex justify-between text-[10px] text-neutral-600 font-mono">
                            <span>1 Día</span>
                            <span>30 Días</span>
                        </div>
                    </div>

                    {/* Control: Presupuesto */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm font-bold">
                            <label className="text-neutral-400">Intensidad Diaria</label>
                            <span className="text-[#FF9800]">{formatCurrency(dailyBudget)}</span>
                        </div>
                        <input
                            type="range"
                            min="20000"
                            max="200000"
                            step="10000"
                            value={dailyBudget}
                            onChange={(e) => setDailyBudget(Number(e.target.value))}
                            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#FF9800]"
                        />
                        {/* Barra de Impacto Visual */}
                        <div className="pt-2">
                            <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-neutral-500 font-bold">NIVEL DE EXPOSICIÓN ESTIMADO</span>
                                <span className="text-white font-bold">{Math.round(impactPercentage)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-300"
                                    style={{ width: `${impactPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Resultado Total */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
                        <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-1">Inversión Total Estimada</p>
                        <p className="text-3xl font-black text-white">{formatCurrency(totalCost)}</p>
                        <p className="text-[10px] text-neutral-500 mt-2">*Impuestos incluidos (IVA).</p>
                    </div>
                </div>

                {/* COLUMNA DERECHA: VISUALIZADOR (CELULAR) */}
                <div className="relative flex items-center justify-center bg-neutral-900/50 rounded-xl border border-white/5 p-4">
                    {/* Celular Mockup */}
                    <div className="bg-black rounded-[20px] border-[3px] border-neutral-700 p-1 relative overflow-hidden h-64 w-32 shadow-2xl">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-16 bg-black rounded-b-lg z-20"></div>

                        {/* Dynamic Slider (Using HERO_SLIDES) */}
                        <div className="h-full w-full rounded-[15px] overflow-hidden relative">
                            <UniversalAdSlider
                                slides={HERO_SLIDES}
                                aspectRatio="h-full"
                                interval={2000}
                            />
                            <div className="absolute top-2 left-2 z-30 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded text-[6px] text-white font-bold border border-white/10">
                                PUBLICIDAD
                            </div>
                        </div>
                    </div>

                    {/* Floating Badge Impact */}
                    <div className="absolute -bottom-3 bg-[#FF9800] text-black text-xs font-black px-3 py-1 rounded-full shadow-lg border-2 border-black">
                        LIVE PREVIEW
                    </div>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// MAIN PAGE COMPONENT
// ----------------------------------------------------------------------

export default function AdvertisingPage() {
    return (
        <main className="min-h-screen bg-[#0D0805] selection:bg-[#FF9800] selection:text-black pb-20">
            {/* HERO SECTION - CAMPAIGN MANAGER STYLE */}
            <header className="relative pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* LEFT: COPY & CTA */}
                        <div>
                            <span className="inline-block py-1 px-3 border border-[#FF9800]/30 rounded-full bg-[#FF9800]/5 text-[#FF9800] text-xs font-bold uppercase tracking-widest mb-6">
                                Speedlight Ads Manager
                            </span>
                            <h1 className="text-5xl font-black text-white leading-tight mb-6">
                                Publicidad Inteligente <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9800] to-orange-600">
                                    sin intermediarios.
                                </span>
                            </h1>
                            <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
                                Define tu presupuesto, sube tus creativos y lanza tu campaña en minutos.
                                Tus anuncios rotan dinámicamente cada 5 segundos para maximizar el impacto sin saturar.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/advertising/create"
                                    className="px-8 py-4 bg-[#FF9800] hover:bg-orange-600 text-black font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-[0_0_20px_rgba(255,152,0,0.4)]"
                                >
                                    <Zap className="w-5 h-5 fill-black" />
                                    Crear Campaña
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT: INTERACTIVE SIMULATOR */}
                        <div className="relative w-full">
                            <div className="absolute inset-0 bg-[#FF9800]/20 blur-[100px] rounded-full pointer-events-none"></div>
                            <CampaignSimulator />
                        </div>
                    </div>
                </div>
            </header>

            {/* VALUE PROPOSITION GRID */}
            <section className="py-20 bg-[#0A0604] border-y border-white/5">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

                    {/* Visual Demo: The "Official" Look */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-[60px] opacity-50"></div>
                        <div className="relative bg-[#110C0A] p-8 rounded-2xl border border-white/10 shadow-2xl overflow-hidden group hover:border-cyan-500/30 transition-colors">
                            <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-6">
                                {/* Abstract Logo */}
                                <div className="w-16 h-16 bg-gradient-to-br from-cyan-900 to-blue-900 rounded-lg flex items-center justify-center border border-white/10">
                                    <span className="text-cyan-200 font-black text-xs">LOGO</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-white">Su Marca Oficial</h3>
                                        <UserBadge role="official_business" size="md" />
                                    </div>
                                    <p className="text-cyan-400 text-sm font-medium mt-1">@su_empresa • Repuestos</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-2 items-start">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                                    <p className="text-neutral-300 text-sm">Perfil de Negocio Verificado</p>
                                </div>
                                <div className="flex gap-2 items-start">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                                    <p className="text-neutral-300 text-sm">Facturación Automática</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Copy */}
                    <div>
                        <h2 className="text-3xl font-black text-white mb-6">Control Total</h2>
                        <ul className="space-y-6 mb-8">
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#FF9800]/10 flex items-center justify-center text-[#FF9800] shrink-0">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Presupuesto Flexible</h4>
                                    <p className="text-neutral-400 text-sm mt-1">Paute desde $50.000 COP. Detenga la campaña cuando quiera.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#FF9800]/10 flex items-center justify-center text-[#FF9800] shrink-0">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Segmentación Precisa</h4>
                                    <p className="text-neutral-400 text-sm mt-1">Decida dónde aparecer: Solo Feed, Solo Marketplace o Todo el Ecosistema.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* AD FORMATS INVENTORY */}
            <section className="py-24 container mx-auto px-6">
                <header className="text-center mb-20 max-w-2xl mx-auto">
                    <span className="text-[#FF9800] text-xs font-bold uppercase tracking-widest mb-2 block">Inventario de Espacios</span>
                    <h2 className="text-4xl font-black text-white mb-6">Formatos Dinámicos</h2>
                    <p className="text-neutral-400">
                        Cada espacio es un carrusel. Su anuncio rota con otros, garantizando frescura y atención del usuario.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* 1. NATIVE FEED */}
                    <AdFormatCard title="Native Feed" icon={<Smartphone className="text-[#FF9800]" />} placement="Feed" gradient="from-orange-500/20 to-red-500/20" accentColor="text-[#FF9800]" description="Post en carrusel integrado.">
                        <UniversalAdSlider slides={FEED_SLIDES} aspectRatio="aspect-[4/5]" />
                    </AdFormatCard>

                    {/* 2. CINEMA PRE-ROLL */}
                    <AdFormatCard
                        title="Cinema Pre-Roll"
                        description="Video corto de 15s antes de los contenidos exclusivos."
                        icon={<MonitorPlay className="w-5 h-5 text-purple-500" />}
                        gradient="from-purple-500/20 to-indigo-600/20"
                        accentColor="text-purple-500"
                        placement="Sección Cinema"
                    >
                        <UniversalAdSlider slides={CINEMA_SLIDES} aspectRatio="aspect-video" />
                    </AdFormatCard>

                    {/* 3. MARKETPLACE */}
                    <AdFormatCard
                        title="Marketplace Hero"
                        description="Tarjeta de producto destacada en categorías de compra/venta."
                        icon={<ShoppingBag className="w-5 h-5 text-emerald-500" />}
                        gradient="from-emerald-500/20 to-teal-600/20"
                        accentColor="text-emerald-500"
                        placement="Marketplace"
                    >
                        <UniversalAdSlider slides={MARKET_SLIDES} aspectRatio="aspect-square" />
                    </AdFormatCard>

                    {/* 4. EVENTS */}
                    <AdFormatCard
                        title="Evento Patrocinado"
                        description="Fije su evento en la parte superior del calendario."
                        icon={<Calendar className="w-5 h-5 text-pink-500" />}
                        gradient="from-pink-500/20 to-rose-600/20"
                        accentColor="text-pink-500"
                        placement="Eventos & Calendario"
                    >
                        <UniversalAdSlider slides={EVENT_SLIDES} aspectRatio="h-32" />
                    </AdFormatCard>

                    {/* 5. GALLERY */}
                    <AdFormatCard
                        title="Gallery Interstitial"
                        description="Banner de alto impacto entre álbumes."
                        icon={<ImageIcon className="w-5 h-5 text-blue-500" />}
                        gradient="from-blue-500/20 to-indigo-600/20"
                        accentColor="text-blue-500"
                        placement="Galería"
                    >
                        <UniversalAdSlider slides={GALLERY_SLIDES} aspectRatio="aspect-[16/6]" />
                    </AdFormatCard>

                    {/* 6. FORUM */}
                    <AdFormatCard
                        title="Hilo Patrocinado"
                        description="Conversación fijada con badge oficial."
                        icon={<MessageSquare className="w-5 h-5 text-yellow-500" />}
                        gradient="from-yellow-500/20 to-orange-600/20"
                        accentColor="text-yellow-500"
                        placement="Foro Speedlight"
                    >
                        <UniversalAdSlider slides={FORUM_SLIDES} aspectRatio="h-24" />
                    </AdFormatCard>

                    {/* 7. SEARCH */}
                    <AdFormatCard
                        title="Búsqueda Patrocinada"
                        description="Primer resultado en búsquedas clave."
                        icon={<Search className="w-5 h-5 text-white" />}
                        gradient="from-neutral-700 to-neutral-800"
                        accentColor="text-white"
                        placement="Buscador Global"
                    >
                        <UniversalAdSlider slides={SEARCH_SLIDES} aspectRatio="h-20" />
                    </AdFormatCard>

                    {/* 8. PROJECT SPONSOR */}
                    <AdFormatCard
                        title="Project Sponsor"
                        description="Su marca 'apadrina' la construcción de un carro. Logo visible en el perfil del proyecto."
                        icon={<Zap className="w-5 h-5 text-red-500" />}
                        gradient="from-red-500/20 to-orange-600/20"
                        accentColor="text-red-500"
                        placement="Garaje de Proyectos"
                    >
                        <UniversalAdSlider slides={PROJECT_SLIDES} aspectRatio="aspect-square" />
                    </AdFormatCard>

                    {/* 9. MAP PIN */}
                    <AdFormatCard
                        title="Punto Speedlight"
                        description="Destaque su taller o local en el mapa de la comunidad. Ideal para 'Drive-Thrus' y tiendas."
                        icon={<MapPin className="w-5 h-5 text-emerald-500" />}
                        gradient="from-emerald-500/20 to-green-600/20"
                        accentColor="text-emerald-500"
                        placement="Mapa de la Ciudad"
                    >
                        <UniversalAdSlider slides={MAP_SLIDES} aspectRatio="aspect-square" />
                    </AdFormatCard>

                    {/* 10. CHALLENGE HOST */}
                    <AdFormatCard
                        title="Challenge Host"
                        description="Patrocine un concurso semanal de fotografía o videos. Máxima interacción con la comunidad."
                        icon={<Trophy className="w-5 h-5 text-yellow-500" />}
                        gradient="from-yellow-500/20 to-amber-600/20"
                        accentColor="text-yellow-500"
                        placement="Concursos & Retos"
                    >
                        <UniversalAdSlider slides={CHALLENGE_SLIDES} aspectRatio="h-40" />
                    </AdFormatCard>

                    {/* 11. EDITORIAL SPOTLIGHT */}
                    <AdFormatCard
                        title="Editorial Spotlight"
                        description="Contenido de marca profundo en la sección de noticias. Cuente la historia de su producto."
                        icon={<Newspaper className="w-5 h-5 text-blue-400" />}
                        gradient="from-blue-500/20 to-cyan-600/20"
                        accentColor="text-blue-400"
                        placement="Noticias & Blog"
                    >
                        <UniversalAdSlider slides={EDITORIAL_SLIDES} aspectRatio="aspect-video" />
                    </AdFormatCard>

                    {/* 12. NOTIFICATION HIGHLIGHT */}
                    <AdFormatCard
                        title="Alerta Flash"
                        description="Notificación pasiva en el centro de actividades. Ideal para ofertas relámpago."
                        icon={<Bell className="w-5 h-5 text-indigo-500" />}
                        gradient="from-indigo-500/20 to-violet-600/20"
                        accentColor="text-indigo-500"
                        placement="Centro de Notificaciones"
                    >
                        <UniversalAdSlider slides={NOTIFICATION_SLIDES} aspectRatio="h-20" />
                    </AdFormatCard>

                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-20 bg-gradient-to-b from-[#0A0604] to-black border-t border-white/5">
                <div className="container mx-auto px-6 text-center max-w-3xl">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
                        ¿Listo para dominar?
                    </h2>
                    <p className="text-xl text-neutral-400 mb-12">
                        Speedlight Culture no es para todos. Es para las marcas que entienden que la calidad y la pasión mueven este mercado.
                    </p>
                    <Link
                        href="https://wa.me/573138830156"
                        target="_blank"
                        className="inline-flex px-10 py-5 bg-[#FF9800] hover:bg-orange-600 text-black font-black text-xl rounded-full transition-all shadow-[0_0_40px_rgba(255,152,0,0.3)] hover:shadow-[0_0_60px_rgba(255,152,0,0.5)] hover:scale-105 items-center gap-3"
                    >
                        Hablar con un Asesor
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                    <p className="mt-8 text-neutral-600 text-sm">
                        *Sujeto a disponibilidad y aprobación de marca.
                    </p>
                </div>
            </section>
        </main >
    );
}
