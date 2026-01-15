'use client';

import React from 'react';
import Image from 'next/image';
import { FaInstagram, FaWhatsapp, FaGlobe } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

const PromoFlyer = () => {
    return (
        <div id="flyer-content" className="relative w-full max-w-[600px] aspect-[4/5] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-white/10 group bg-[#020617]">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/promo-car.png"
                    alt="Premium Detailing"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/85 to-[#020617]/30" />
            </div>

            {/* Tech Design Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Scanline Effect */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-cyan/20 shadow-[0_0_15px_rgba(6,182,212,1)] animate-scan" style={{ animation: 'scan 4s linear infinite' }} />

                {/* Cyber Grid */}
                <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px]" />

                {/* Tech Corners */}
                <div className="absolute top-10 left-10 w-12 h-12 border-t-2 border-l-2 border-brand-cyan/30" />
                <div className="absolute top-10 right-10 w-12 h-12 border-t-2 border-r-2 border-brand-cyan/30" />
            </div>

            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-between p-10 text-white font-inter">

                {/* Top Header */}
                <div className="flex justify-between items-start">
                    <div className="relative h-24 w-52 -mt-4 -ml-2">
                        <Image
                            src="/logo.png"
                            alt="Victory Cars Logo"
                            fill
                            className="object-contain filter brightness-0 invert drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                        />
                    </div>
                    <div className="flex flex-col items-end pt-2">
                        <div className="bg-brand-cyan/10 border-r-4 border-brand-cyan px-4 py-1.5 backdrop-blur-sm">
                            <span className="text-brand-cyan font-bold tracking-[0.3em] text-[11px] uppercase font-orbitron block leading-none">
                                Premium Detailing
                            </span>
                        </div>
                        <span className="text-[10px] text-white/40 font-medium tracking-widest mt-2 uppercase mr-1">
                            SILEX • GTECHNIQ • IGL
                        </span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-8 mb-6 space-y-6 relative">
                    <div className="space-y-1 relative">
                        <div className="absolute -left-6 top-0 w-1.5 h-full bg-brand-cyan shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
                        <h2 className="text-brand-cyan font-orbitron text-2xl tracking-[0.3em] uppercase opacity-70 mb-2 font-bold">
                            Bono de Regalo
                        </h2>
                        <div className="flex items-center gap-6">
                            <h1 className="text-8xl md:text-9xl font-orbitron font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] tracking-tighter leading-none">
                                20%
                            </h1>
                            <div className="flex flex-col">
                                <span className="text-5xl md:text-6xl font-orbitron font-bold text-brand-cyan leading-none">OFF</span>
                                <div className="h-1.5 w-full bg-brand-cyan mt-2 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                            </div>
                        </div>
                    </div>

                    <p className="text-lg md:text-xl font-light text-slate-300 leading-tight max-w-[90%]">
                        En servicios de PDR, Cerámicos, <br />
                        <span className="text-white font-bold tracking-tight bg-white/5 px-2 py-1 rounded inline-block mt-2 border border-white/10 uppercase text-sm md:text-base">
                            Detailing Interior y Piezas de Pintura (3 piezas)
                        </span>
                    </p>
                </div>

                {/* Footer Info */}
                <div className="flex justify-between items-end border-t border-white/10 pt-8 mt-4 relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent" />

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-slate-200">
                            <div className="p-2 bg-brand-cyan/10 rounded-lg border border-brand-cyan/20">
                                <FaInstagram className="text-brand-cyan" size={16} />
                            </div>
                            <span className="font-semibold tracking-wide">@victorycars_paintdetailing</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-200">
                            <div className="p-2 bg-brand-cyan/10 rounded-lg border border-brand-cyan/20">
                                <FaWhatsapp className="text-brand-cyan" size={16} />
                            </div>
                            <span className="font-semibold tracking-wide">+57 315 774 2419</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-200 hover:text-brand-cyan transition-colors group cursor-pointer">
                            <div className="p-2 bg-brand-cyan/10 rounded-lg border border-brand-cyan/20 group-hover:bg-brand-cyan/20 transition-all">
                                <FaGlobe className="text-brand-cyan" size={16} />
                            </div>
                            <span className="font-semibold tracking-wide lowercase opacity-80">www.victorycarsdetailing.com</span>
                        </div>

                        <div className="flex items-center gap-4 mt-6 opacity-20">
                            <span className="text-[10px] font-orbitron font-bold tracking-widest uppercase">Precision</span>
                            <div className="w-1 h-1 rounded-full bg-brand-cyan" />
                            <span className="text-[10px] font-orbitron font-bold tracking-widest uppercase">Excellence</span>
                            <div className="w-1 h-1 rounded-full bg-brand-cyan" />
                            <span className="text-[10px] font-orbitron font-bold tracking-widest uppercase">Victory</span>
                        </div>
                    </div>

                    {/* QR Container */}
                    <div className="flex flex-col items-end gap-3 translate-y-1">
                        <div className="bg-white p-2.5 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.3)] border border-brand-cyan/20">
                            <div className="relative">
                                <QRCodeSVG
                                    value="https://victorycarsdetailing.com/promociones"
                                    size={95}
                                    level="H"
                                    includeMargin={false}
                                    fgColor="#020617"
                                />
                                {/* Overlay Logo con fondo oscuro para que resalte */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-[34px] h-[34px] bg-[#020617] rounded-lg shadow-xl flex items-center justify-center p-1.5 border border-brand-cyan/30">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src="/logo.png"
                                                alt="QR Mini Logo"
                                                fill
                                                className="object-contain filter brightness-0 invert"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] uppercase font-orbitron font-extrabold tracking-[0.1em] text-brand-cyan text-right leading-none">
                            ESCANEA PARA<br />
                            <span className="text-white text-[9px] opacity-60">REDIMIR CÓDIGO</span>
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scan {
                    from { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 0.5; }
                    to { transform: translateY(100vh); opacity: 0; }
                }
            `}</style>
            {/* Lighting effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-cyan/10 blur-[120px] pointer-events-none" />
        </div>
    );
};

export default PromoFlyer;
