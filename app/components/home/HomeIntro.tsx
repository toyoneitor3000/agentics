"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Play, Zap, Info, Camera, Wrench, ShoppingBag, Globe, Bot, Calendar, GraduationCap } from "lucide-react";
import { useState } from "react";


export default function HomeIntro({ onEnterApp, onSignUp, featuredItems, recentActivity, isLoggedIn }: { onEnterApp: () => void, onSignUp: () => void, featuredItems: any[], recentActivity: any[], isLoggedIn: boolean }) {

    console.log("HomeIntro rendered with items:", featuredItems, recentActivity); // Debug

    return (
        <div className="min-h-screen bg-transparent text-white relative pb-32">

            {/* 1. HERO SECTION (The "Manual" Intro) */}
            <section className="relative h-screen w-full flex flex-col justify-center items-center text-center p-6 overflow-hidden">
                {/* Background Video/Image */}
                <div className="absolute inset-0 z-0 h-screen">
                    <Image
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1983&auto=format&fit=crop"
                        alt="Hero"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    {/* Cinematic Gradients - Lighter touch */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-70" />
                </div>

                {/* UI FRAME - Tech borders */}
                <div className="absolute inset-4 md:inset-10 border border-white/10 rounded-3xl pointer-events-none z-10 hidden md:block">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#FF9800]"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#FF9800]"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#FF9800]"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#FF9800]"></div>
                </div>

                {/* Content - Glass Card Container */}
                <div className="relative z-20 max-w-3xl w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-16 shadow-2xl relative overflow-hidden"
                    >
                        {/* Glow effect behind text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FF9800] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

                        <div className="flex items-center justify-center gap-3 mb-8 opacity-90">
                            <div className="w-2 h-2 rounded-full bg-[#FF9800] animate-pulse shadow-[0_0_10px_#FF9800]"></div>
                            <span className="text-white/80 tracking-[0.5em] text-[10px] uppercase font-roboto-mono">
                                Speedlight Culture
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-oswald font-black leading-[0.9] mb-8 text-white tracking-tighter uppercase italic transform -skew-x-2">
                            LA CULTURA <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9800] via-[#FF5722] to-[#FF9800] animate-gradient-x">DE LA VELOCIDAD</span>
                        </h1>

                        <p className="text-white/60 text-sm md:text-base mb-12 max-w-lg mx-auto leading-relaxed font-sans font-medium tracking-wide">
                            La comunidad definitiva para constructores y entusiastas. <br className="hidden md:block" /> Documenta, comparte y celebra el automovilismo real.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <button
                                onClick={onEnterApp}
                                className="w-full md:w-auto px-8 py-4 bg-[#FF9800] text-black rounded-none skew-x-[-10deg] hover:skew-x-0 transition-all duration-300 group block text-center"
                            >
                                <span className="block skew-x-[10deg] group-hover:skew-x-0 font-oswald font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                    {isLoggedIn ? "Entrar al Garage" : "Iniciar Motor"} <ChevronRight className="w-4 h-4" />
                                </span>
                            </button>

                            <button
                                onClick={() => {
                                    const section = document.getElementById('features-section');
                                    if (section) {
                                        const y = section.getBoundingClientRect().top + window.scrollY - 20;
                                        window.scrollTo({ top: y, behavior: 'smooth' });
                                    }
                                }}
                                className="w-full md:w-auto px-8 py-4 border border-white/20 text-white hover:bg-white/10 transition-all rounded-none skew-x-[-10deg] hover:skew-x-0 group backdrop-blur-md"
                            >
                                <span className="block skew-x-[10deg] group-hover:skew-x-0 font-oswald font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                    <Info className="w-4 h-4" /> Saber más
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom UI Data props */}
                <div className="absolute bottom-10 left-10 hidden md:flex items-center gap-4 text-[10px] text-white/30 font-roboto-mono uppercase tracking-widest">
                    <span>Lat: 4.7110° N</span>
                    <span>Lon: 74.0721° W</span>
                    <span className="w-20 h-[1px] bg-white/10"></span>
                    <span>System: Online</span>
                </div>
            </section>

            {/* 1.5 ONBOARDING STEPS (Vertical Timeline - Speedlight Style) */}
            <section id="features-section" className="py-12 px-6 max-w-4xl mx-auto scroll-mt-24" >
                <div className="space-y-12 relative pl-8 border-l border-white/10">

                    {[
                        {
                            step: "01",
                            title: "Crea tu Cuenta",
                            desc: "Únete a la comunidad #1 de constructores.",
                            icon: Zap,
                            action: "Registrarse Gratis"
                        },
                        {
                            step: "02",
                            title: "Constructores y Creadores",
                            desc: "Sube tus Proyectos, Cinema 4K o Galerías.",
                            icon: Camera,
                            action: "Crear Contenido"
                        },
                        {
                            step: "03",
                            title: "Explora y Conecta",
                            desc: "Descubre builds épicos y piezas en el Market.",
                            icon: Globe, // Fallback icon if needed, or reuse others
                            action: "Ver Feed"
                        }
                    ].map((s, i) => (
                        <div key={i} className="relative group z-10">
                            {/* Timeline Dot */}
                            <div className="absolute -left-[41px] top-6 w-5 h-5 rounded-full bg-black border-2 border-white/20 group-hover:border-[#FF9800] group-hover:scale-125 transition-all z-20 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-[#FF9800] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>

                            {/* Clickable Step Card */}
                            <button
                                onClick={i === 2 ? onEnterApp : onSignUp}
                                className="w-full text-left bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#FF9800] hover:bg-white/5 transition-all group flex flex-col md:flex-row gap-6 items-start md:items-center shadow-lg relative z-10"
                            >
                                {/* Icon Box */}
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#FF9800] group-hover:text-black transition-colors">
                                    <s.icon className="w-6 h-6 text-[#FF9800] group-hover:text-black transition-colors" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-1 font-oswald uppercase italic transform -skew-x-2 tracking-wide">{s.title}</h3>
                                    <p className="text-white/50 text-sm font-sans">{s.desc}</p>
                                </div>

                                {/* CTA Button inside Card */}
                                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-[#FF9800] group-hover:bg-[#FF9800] group-hover:text-black transition-all uppercase tracking-wider flex items-center gap-2">
                                    {s.action} <ChevronRight className="w-3 h-3" />
                                </div>
                            </button>
                        </div>
                    ))}

                </div>
            </section>

            {/* 2. BENTO GRID - ECOSISTEMA COMPLETO */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <h2 className="text-center font-oswald text-4xl font-black text-white mb-10 tracking-tighter uppercase italic transform -skew-x-2">
                    Todo tu mundo <span className="text-[#FF9800]">Automotriz</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">

                    {/* Item 1: PROYECTOS (Big / Hero) */}
                    <div className="md:col-span-2 md:row-span-2 relative group rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:border-[#FF9800]/50 transition-all cursor-pointer" onClick={onEnterApp}>
                        <Image
                            src="https://images.unsplash.com/photo-1580273916550-e323be2ebdd9?q=80&w=2070"
                            alt="Proyectos"
                            fill
                            className="object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end">
                            <Wrench className="w-10 h-10 text-[#FF9800] mb-4" />
                            <h3 className="text-3xl font-bold text-white mb-2 font-oswald uppercase italic transform -skew-x-2 tracking-wide">PROYECTOS</h3>
                            <p className="text-white/70 text-base max-w-sm font-sans">
                                La base de datos de builds más grande. Documenta tu proceso y recibe feedback de expertos.
                            </p>
                        </div>
                    </div>

                    {/* Item 2: AUTOSTUDIO (AI Feature) - NEW */}
                    <div className="md:col-span-1 md:row-span-1 relative group rounded-3xl overflow-hidden border border-white/10 bg-[#FF9800]/10 hover:border-[#FF9800] transition-all cursor-pointer" onClick={onEnterApp}>
                        <div className="absolute top-4 right-4 bg-[#FF9800] text-black text-[10px] font-bold px-2 py-1 rounded uppercase animate-pulse">AI Powered</div>
                        <Image
                            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070"
                            alt="AutoStudio"
                            fill
                            className="object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-700 mixture-blend-luminosity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-6 flex flex-col justify-end">
                            <Bot className="w-8 h-8 text-[#FF9800] mb-2" />
                            <h3 className="text-xl font-bold text-white mb-1 font-oswald uppercase italic transform -skew-x-2">AUTOSTUDIO</h3>
                            <p className="text-white/60 text-xs font-sans">Tu asistente inteligente de personalización.</p>
                        </div>
                    </div>

                    {/* Item 3: CINEMA (Tall) */}
                    <div className="md:col-span-1 md:row-span-2 relative group rounded-3xl overflow-hidden border border-white/10 bg-black hover:border-red-500/50 transition-all cursor-pointer" onClick={onEnterApp}>
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase animate-pulse">Live</div>
                        <Image
                            src="https://images.unsplash.com/photo-1542361345-89e58247f2d1?q=80&w=2070"
                            alt="Cinema"
                            fill
                            className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-6 flex flex-col justify-end">
                            <Play className="w-8 h-8 text-red-500 mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2 font-oswald uppercase italic transform -skew-x-2">CINEMA 4K</h3>
                            <p className="text-white/70 text-xs font-sans">Producciones originales y contenido vertical de alta velocidad.</p>
                        </div>
                    </div>

                    {/* Item 4: ACADEMY (School) - NEW */}
                    <div className="md:col-span-1 md:row-span-1 relative group rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:border-[#FF9800]/50 transition-all cursor-pointer" onClick={onEnterApp}>
                        <Image
                            src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=2070"
                            alt="Academy"
                            fill
                            className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-6 flex flex-col justify-end">
                            <GraduationCap className="w-8 h-8 text-[#FF9800] mb-2" />
                            <h3 className="text-xl font-bold text-white mb-1 font-oswald uppercase italic transform -skew-x-2">ACADEMY</h3>
                            <p className="text-white/60 text-xs font-sans">Aprende mecánica y conducción.</p>
                        </div>
                    </div>

                    {/* Item 5: EVENTS (Wide) - NEW */}
                    <div className="md:col-span-2 md:row-span-1 relative group rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:border-[#FF9800]/50 transition-all cursor-pointer" onClick={onEnterApp}>
                        <Image
                            src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=2071"
                            alt="Events"
                            fill
                            className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent p-8 flex flex-col justify-center items-start">
                            <Calendar className="w-8 h-8 text-[#FF9800] mb-2" />
                            <h3 className="text-2xl font-bold text-white mb-1 font-oswald uppercase italic transform -skew-x-2">CALENDARIO GLOBAL</h3>
                            <p className="text-white/70 text-sm font-sans max-w-xs">
                                Car meets, track days y eventos oficiales en tu ciudad.
                            </p>
                        </div>
                    </div>

                    {/* Item 6: MARKETPLACE */}
                    <div className="md:col-span-1 md:row-span-1 relative group rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:border-[#FF9800]/50 transition-all cursor-pointer" onClick={onEnterApp}>
                        <Image
                            src="https://images.unsplash.com/photo-1600705722838-d537fac611d3?q=80&w=2069"
                            alt="Market"
                            fill
                            className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-6 flex flex-col justify-end">
                            <ShoppingBag className="w-6 h-6 text-[#FF9800] mb-2" />
                            <h3 className="text-lg font-bold text-white mb-1 font-oswald uppercase italic transform -skew-x-2">MARKET</h3>
                            <p className="text-white/70 text-xs font-sans">Piezas curadas.</p>
                        </div>
                    </div>

                    {/* Item 7: GALERIA */}
                    <div className="md:col-span-1 md:row-span-1 relative group rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:border-[#FF9800]/50 transition-all cursor-pointer" onClick={onEnterApp}>
                        <Image
                            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070"
                            alt="Gallery"
                            fill
                            className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-6 flex flex-col justify-end">
                            <Camera className="w-6 h-6 text-[#FF9800] mb-2" />
                            <h3 className="text-lg font-bold text-white mb-1 font-oswald uppercase italic transform -skew-x-2">GALERÍA</h3>
                            <p className="text-white/70 text-xs font-sans">Fotos nivel editorial.</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* 5. LANDING FOOTER - ULTIMATE VERSION */}
            <footer className="relative pt-20 pb-10 bg-black/40 backdrop-blur-md mt-auto z-10 overflow-hidden">
                {/* Tech Separator */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF9800]/50 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

                        {/* 1. Brand & Newsletter (lg:col-span-4) */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#FF9800] rounded-full shadow-[0_0_10px_#FF9800]"></div>
                                    <span className="font-sans font-bold tracking-wide text-white text-lg">SPEEDLIGHT CULTURE</span>
                                </div>
                                <p className="text-xs text-white/50 leading-relaxed font-sans max-w-sm">
                                    Documentando la cultura automotriz global. Construido por entusiastas, para entusiastas.
                                </p>
                            </div>

                            {/* APP CTAs */}
                            <div className="flex flex-col gap-3 max-w-xs">
                                <button
                                    onClick={onSignUp}
                                    className="w-full bg-[#FF9800] text-black font-bold py-3 px-6 rounded-lg hover:bg-white transition-colors flex items-center justify-between group shadow-[0_0_20px_rgba(255,152,0,0.2)]"
                                >
                                    <span>Crear Cuenta Gratis</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-[10px] text-white/30 text-center">
                                    ¿Ya eres miembro? <button className="text-[#FF9800] hover:text-white transition-colors underline decoration-white/30 hover:decoration-[#FF9800]" onClick={onSignUp}>Iniciar Sesión</button>
                                </p>
                            </div>
                        </div>

                        {/* 2. Links Grid (lg:col-span-5) - Mobile: 2 cols, Desktop: 3 cols */}
                        <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4">
                            <div>
                                <h4 className="font-sans font-bold text-white text-sm mb-4">Producto</h4>
                                <ul className="space-y-2 text-xs text-white/50 font-sans">
                                    <li className="hover:text-[#FF9800] transition-colors cursor-pointer">Proyectos</li>
                                    <li className="hover:text-[#FF9800] transition-colors cursor-pointer">Cinema 4K</li>
                                    <li className="hover:text-[#FF9800] transition-colors cursor-pointer">Marketplace</li>
                                    <li className="hover:text-[#FF9800] transition-colors cursor-pointer">Talleres</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-sans font-bold text-white text-sm mb-4">Comunidad</h4>
                                <ul className="space-y-2 text-xs text-white/50 font-sans">
                                    <li className="hover:text-[#FF9800] transition-colors cursor-pointer">Eventos</li>
                                    <li className="hover:text-[#FF9800] transition-colors cursor-pointer">Discord Oficial</li>
                                    <li className="hover:text-[#FF9800] transition-colors cursor-pointer">Reglas</li>
                                    <li className="hover:text-[#FF9800] transition-colors cursor-pointer">Buzón de Mejoras</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-sans font-bold text-white text-sm mb-4">Legal</h4>
                                <ul className="space-y-2 text-xs text-white/50 font-sans">
                                    <li className="hover:text-[#FF9800] transition-colors cursor-pointer">Términos</li>
                                    <li className="hover:text-[#FF9800] transition-colors cursor-pointer">Privacidad</li>
                                    <li className="hover:text-[#FF9800] transition-colors cursor-pointer">Cookies</li>
                                </ul>
                            </div>
                        </div>

                        {/* 3. Socials (lg:col-span-3) */}
                        <div className="lg:col-span-3">
                            <h4 className="font-sans font-bold text-white text-sm mb-4">Síguenos</h4>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { label: "IG", color: "hover:bg-pink-600" },
                                    { label: "FB", color: "hover:bg-blue-600" },
                                    { label: "TK", color: "hover:bg-black border border-white/10" },
                                    { label: "WA", color: "hover:bg-green-500" },
                                    { label: "YT", color: "hover:bg-red-600" },
                                    { label: "✉️", color: "hover:bg-[#FF9800]" },
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-white transition-all hover:scale-110 ${social.color}`}
                                    >
                                        {social.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-roboto-mono text-white/30">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <span>© {new Date().getFullYear()} Speedlight Culture.</span>
                            <span className="hidden md:inline text-white/10">|</span>
                        </div>

                        {/* PurrPurr Badge */}
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 hover:border-[#D946EF]/50 transition-colors group">
                            <span className="opacity-60">Dev by</span>
                            <a
                                href="https://www.purrpurr.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-[#D946EF] group-hover:text-[#E879F9] transition-colors tracking-wide flex items-center gap-1"
                            >
                                purrpurr.dev <span className="text-white/30 group-hover:text-white/50">🇨🇴</span>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}
