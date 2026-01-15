"use client";

import Link from "next/link";
import { Camera, Wrench, Film, ChevronRight } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

export default function CreatePage() {
    const { language } = useLanguage();

    const t = {
        es: {
            badge: "Speedlight Studio",
            title: "El Garaje",
            titleHighlight: "Virtual",
            desc: "Comparte tu viaje automotriz con la comunidad. Desde la restauración de un clásico hasta la producción de cine de alto nivel.",
            projectTitle: "Project Build",
            projectDesc: "Documenta la restauración o modificación de tu máquina paso a paso.",
            projectAction: "Iniciar Build",
            galleryTitle: "Gallery Upload",
            galleryDesc: "Comparte fotografía de alta resolución. Ideal para eventos y detalles.",
            galleryAction: "Subir Fotos",
            cinemaTitle: "Cinema Films",
            cinemaBadge: "High Quality Only",
            cinemaDesc: "Producciones cinematográficas horizontales. Formato 16:9.",
            cinemaAction: "Enviar Video",
            socialTitle: "Cinema Social",
            socialBadge: "Vertical / Reels",
            socialDesc: "Contenido vertical corto y dinámico. Formato 9:16.",
            socialAction: "Subir Reel"
        },
        en: {
            badge: "Speedlight Studio",
            title: "Create",
            titleHighlight: "Legacy",
            desc: "Share your automotive journey with the community. From classic restoration to high-end cinema production.",
            projectTitle: "Project Build",
            projectDesc: "Document the restoration or modification of your machine step-by-step.",
            projectAction: "Start Build",
            galleryTitle: "Gallery Upload",
            galleryDesc: "Share high-resolution photography. Ideal for car meets and details.",
            galleryAction: "Upload Photos",
            cinemaTitle: "Cinema Films",
            cinemaBadge: "High Quality Only",
            cinemaDesc: "Horizontal cinematic productions. 16:9 Format.",
            cinemaAction: "Submit Video",
            socialTitle: "Cinema Social",
            socialBadge: "Vertical / Reels",
            socialDesc: "Short and dynamic vertical content. 9:16 Format.",
            socialAction: "Upload Reel"
        }
    };

    const content = t[language];

    return (
        <div className="min-h-screen bg-[#0D0805] text-white p-6 pb-24 md:pl-[244px] md:pt-20">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12 text-center md:text-left animate-fade-in">
                    <div className="inline-block bg-[#FF9800] text-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm mb-4">
                        {content.badge}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-oswald font-bold uppercase mb-4 leading-none">
                        {content.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9800] to-[#FFEB3B]">{content.titleHighlight}</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl font-light">
                        {content.desc}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* OPTION 4: CINEMA SOCIAL (VERTICAL TALL CARD) - MOVED TO FIRST */}
                    <Link href="/cinema/upload" className="group relative h-[550px] lg:h-auto lg:row-span-2 border border-white/10 rounded-2xl overflow-hidden ring-1 ring-[#FF9800]/20 hover:ring-[#FF9800] hover:scale-[1.01] transition-all duration-500 bg-[#0A0A0A]">
                        {/* Different BG for Social - New Image V2 */}
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700 pointer-events-none"
                            style={{ backgroundImage: "url('/social-cinema-bg-v2.png')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"></div>

                        <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            <div className="w-6 h-6 border-2 border-black rounded-sm flex items-center justify-center">
                                <div className="w-2 h-2 bg-black rounded-full"></div>
                            </div>
                        </div>

                        <div className="absolute top-6 right-6 px-3 py-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-md">
                            <span className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                {content.socialBadge}
                            </span>
                        </div>

                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <h3 className="font-oswald font-bold text-3xl uppercase mb-2 text-white drop-shadow-lg">{content.socialTitle}</h3>
                            <p className="text-white/80 text-sm mb-6 font-medium max-w-[200px]">{content.socialDesc}</p>
                            <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest group-hover:text-[#FF9800] transition-colors">
                                {content.socialAction} <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>

                    {/* OPTION 1: PROJECT (Standard) */}
                    <Link href="/projects/new" className="group relative h-[400px] border border-white/10 rounded-2xl overflow-hidden hover:border-[#FF9800]/50 transition-all duration-500">
                        <div className="absolute inset-0 bg-neutral-900 group-hover:bg-neutral-800 transition-colors"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"></div>

                        <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-[#FF9800]/10 flex items-center justify-center group-hover:bg-[#FF9800] transition-colors duration-500">
                            <Wrench className="w-6 h-6 text-[#FF9800] group-hover:text-black" />
                        </div>

                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <h3 className="font-oswald font-bold text-2xl uppercase mb-2">{content.projectTitle}</h3>
                            <p className="text-white/50 text-sm mb-6 h-10">{content.projectDesc}</p>
                            <div className="flex items-center gap-2 text-[#FF9800] text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                {content.projectAction} <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>

                    {/* OPTION 2: GALLERY (Standard) */}
                    <Link href="/gallery/new" className="group relative h-[400px] border border-white/10 rounded-2xl overflow-hidden hover:border-[#FF9800]/50 transition-all duration-500">
                        <div className="absolute inset-0 bg-neutral-900 group-hover:bg-neutral-800 transition-colors"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"></div>

                        <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-[#FF9800]/10 flex items-center justify-center group-hover:bg-[#FF9800] transition-colors duration-500">
                            <Camera className="w-6 h-6 text-[#FF9800] group-hover:text-black" />
                        </div>

                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <h3 className="font-oswald font-bold text-2xl uppercase mb-2">{content.galleryTitle}</h3>
                            <p className="text-white/50 text-sm mb-6 h-10">{content.galleryDesc}</p>
                            <div className="flex items-center gap-2 text-[#FF9800] text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                {content.galleryAction} <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>

                    {/* OPTION 3: CINEMA FILMS (HORIZONTAL WIDE CARD) */}
                    <Link href="/cinema/upload" className="md:col-span-2 group relative h-[260px] border border-white/10 rounded-2xl overflow-hidden ring-1 ring-[#FF9800]/20 hover:ring-[#FF9800] hover:scale-[1.01] transition-all duration-500 bg-[#0A0A0A]">
                        <video
                            src="https://videos.pexels.com/video-files/854671/854671-hd_1920_1080_25fps.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700 pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"></div>

                        <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-[#FF9800] flex items-center justify-center shadow-[0_0_20px_rgba(255,152,0,0.5)]">
                            <Film className="w-6 h-6 text-black" />
                        </div>

                        <div className="absolute top-6 right-6 px-3 py-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-md">
                            <span className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                {content.cinemaBadge}
                            </span>
                        </div>

                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <h3 className="font-oswald font-bold text-2xl uppercase mb-1 text-white drop-shadow-lg">{content.cinemaTitle}</h3>
                            <p className="text-white/80 text-sm mb-4 font-medium">{content.cinemaDesc}</p>
                            <div className="flex items-center gap-2 text-[#FF9800] text-xs font-bold uppercase tracking-widest">
                                {content.cinemaAction} <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
}
