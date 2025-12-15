"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Play, Zap, Info, Camera, Wrench, ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function HomeIntro({ onEnterApp, featuredItems, recentActivity }: { onEnterApp: () => void, featuredItems: any[], recentActivity: any[] }) {

    console.log("HomeIntro rendered with items:", featuredItems, recentActivity); // Debug

    return (
        <div className="min-h-screen bg-black text-white relative pb-32">

            {/* 1. HERO SECTION (The "Manual" Intro) */}
            <section className="relative h-[80vh] w-full flex flex-col justify-end p-6 overflow-hidden">
                {/* Background Video/Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1983&auto=format&fit=crop"
                        alt="Hero"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#FF9800] tracking-[0.3em] text-xs font-black uppercase mb-4 block">Speedlight Culture</span>
                        <h1 className="text-5xl md:text-7xl font-oswald font-bold leading-[0.9] mb-6">
                            EL ARTE DE<br />LA VELOCIDAD
                        </h1>
                        <p className="text-white/80 text-lg mb-8 max-w-sm leading-relaxed">
                            Bienvenido a la comunidad definitiva. Aquí documentamos proyectos, compartimos builds y celebramos la cultura automotriz.
                        </p>

                        <button
                            onClick={onEnterApp}
                            className="bg-[#FF9800] text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2 group"
                        >
                            Explorar App <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* 2. "MANUAL" / FEATURES GRID */}
            <section className="px-6 py-20 bg-[#050505]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-10 border-b border-white/10 pb-4">Ecosistema</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Wrench, title: "Proyectos", desc: "Documenta tu build paso a paso." },
                            { icon: Play, title: "Cinema", desc: "Contenido vertical y horizontal 4K." },
                            { icon: Camera, title: "Galería", desc: "Fotografía automotriz de alto nivel." },
                            { icon: ShoppingBag, title: "Market", desc: "Compra y venta de piezas curadas." },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                            >
                                <feature.icon className="w-8 h-8 text-[#FF9800] mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="font-oswald font-bold text-xl mb-2">{feature.title}</h3>
                                <p className="text-xs text-white/50">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. FEATURED MACHINES (Carousel) */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0A0A0A] to-black z-[-1]" />
                <div className="px-6 mb-8 flex justify-between items-end max-w-4xl mx-auto w-full">
                    <div>
                        <span className="text-[#FF9800] text-xs font-bold uppercase tracking-widest block mb-2">Garaje Destacado</span>
                        <h2 className="font-oswald text-3xl font-bold">MÁQUINAS ÉPICAS</h2>
                    </div>
                    {/* Mobile Only: Horizontal Scroll Indicator */}
                    <span className="md:hidden text-[10px] text-white/30 uppercase">Desliza &rarr;</span>
                </div>

                {/* Carousel Container */}
                <div className="flex overflow-x-auto gap-6 px-6 pb-8 snap-x snap-mandatory scrollbar-hide">
                    {featuredItems && featuredItems.length > 0 ? featuredItems.map((item: any) => (
                        <Link href={`/projects/${item.id}`} key={item.uniqueId} className="snap-center shrink-0 w-[85vw] max-w-[350px] group cursor-pointer" onClick={onEnterApp}>
                            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
                                <Image
                                    src={item.content?.image || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop"}
                                    alt={item.content?.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="font-oswald font-bold text-xl uppercase leading-none mb-1">{item.content?.title}</h3>
                                    <p className="text-xs text-[#FF9800] font-bold tracking-widest">{item.user?.name}</p>
                                </div>
                            </div>
                        </Link>
                    )) : (
                        // Fallback items if array empty (Wait/Loading state visually handled by component logic usually, but here as fallback)
                        [1, 2, 3].map(i => (
                            <div key={i} className="snap-center shrink-0 w-[85vw] max-w-[350px] h-64 bg-white/5 rounded-xl animate-pulse" />
                        ))
                    )}
                </div>
            </section>

            {/* 4. RECENT ACTIVITY SNIPPET */}
            <section className="px-6 py-20 max-w-2xl mx-auto">
                <h2 className="text-center font-oswald text-2xl font-bold mb-10">ÚLTIMA ACTIVIDAD</h2>
                <div className="space-y-4">
                    {recentActivity && recentActivity.length > 0 ? recentActivity.slice(0, 3).map((item: any) => (
                        <div key={item.uniqueId} className="flex gap-4 items-center p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 relative">
                                <Image src={item.content?.image || item.user?.avatar || "https://via.placeholder.com/100"} alt="Thumb" fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">{item.content?.title}</p>
                                <p className="text-xs text-white/50 truncate">Por {item.user?.name}</p>
                            </div>
                            <span className="text-[10px] text-white/30 uppercase tracking-widest">{item.type}</span>
                        </div>
                    )) : (
                        <div className="text-center text-white/30 py-4">Cargando actividad...</div>
                    )}
                </div>
                <div className="mt-10 text-center">
                    <button onClick={onEnterApp} className="text-[#FF9800] text-sm font-bold uppercase tracking-widest hover:underline">
                        Ver todo el contenido
                    </button>
                </div>
            </section>

        </div>
    );
}
