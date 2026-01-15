'use client';
import React from 'react';
import Image from 'next/image';
import { FaInstagram, FaWhatsapp, FaGlobe } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { ASSETS } from './PromoAssets';

const PromoFlyer = () => {
    return (
        <div id="flyer-content" className="relative w-full max-w-[600px] aspect-[4/5] mx-auto overflow-hidden rounded-2xl shadow-2xl border border-white/10 group bg-[#020617]">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={ASSETS.promoCar}
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
            <div className="relative h-full flex flex-col justify-between px-6 py-8 md:px-10 md:py-10 text-white font-inter">

                {/* Top Header */}
                <div className="flex justify-between items-start">
                    <div className="relative h-16 w-36 md:h-24 md:w-52 -mt-2 md:-mt-4 -ml-1 md:-ml-2">
                        <Image
                            src={ASSETS.logo}
                            alt="Victory Cars Logo"
                            fill
                            className="object-contain filter brightness-0 invert drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                        />
                    </div>
                    <div className="flex flex-col items-end pt-1 md:pt-2">
                        <div className="bg-brand-cyan/10 border-r-4 border-brand-cyan px-3 py-1 md:px-4 md:py-1.5 backdrop-blur-sm">
                            <span className="text-brand-cyan font-bold tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[11px] uppercase font-orbitron block leading-none">
                                Premium Detailing
                            </span>
                        </div>
                        <span className="text-[8px] md:text-[10px] text-white/40 font-medium tracking-widest mt-1 md:mt-2 uppercase mr-1">
                            SILEX • GTECHNIQ • IGL
                        </span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-2 md:mt-4 mb-2 md:mb-4 space-y-3 md:space-y-6 relative">
                    <div className="space-y-1 relative">
                        <div className="absolute -left-6 top-0 w-1 md:w-1.5 h-full bg-brand-cyan shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
                        <h2 className="text-brand-cyan font-orbitron text-sm md:text-xl tracking-[0.2em] md:tracking-[0.4em] uppercase opacity-70 mb-0.5 md:mb-2 font-bold leading-none">
                            Bono de Regalo
                        </h2>
                        <div className="flex items-center gap-3 md:gap-8">
                            <h1 className="text-6xl md:text-9xl font-orbitron font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] tracking-tighter leading-none">
                                20%
                            </h1>
                            <div className="flex flex-col">
                                <span className="text-3xl md:text-7xl font-orbitron font-black text-brand-cyan leading-none">OFF</span>
                                <div className="h-0.5 md:h-2 w-full bg-brand-cyan mt-1 md:mt-2 shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 md:space-y-3 pt-1 md:pt-2">
                        <p className="text-[8px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-2">
                            <span className="w-4 md:w-6 h-[1px] bg-brand-cyan/40" />
                            Servicios Seleccionados
                        </p>
                        <div className="space-y-1.5 md:space-y-3">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-1 md:w-1.5 h-1 md:h-1.5 rotate-45 bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,1)]" />
                                <span className="text-sm md:text-xl font-bold text-white tracking-widest uppercase italic">PDR & Cerámicos</span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-1 md:w-1.5 h-1 md:h-1.5 rotate-45 bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,1)]" />
                                <span className="text-sm md:text-xl font-bold text-white tracking-widest uppercase italic">Detailing Interior</span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-1 md:w-1.5 h-1 md:h-1.5 rotate-45 bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,1)]" />
                                <span className="text-sm md:text-xl font-bold text-brand-cyan tracking-widest uppercase italic">
                                    Piezas de Pintura <span className="text-[8px] md:text-xs font-light text-white/50 tracking-normal normal-case not-italic ml-1 md:ml-2">(Máximo 3 piezas)</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="flex justify-between items-end border-t border-white/10 pt-4 md:pt-8 mt-1 md:mt-4 relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent" />

                    <div className="space-y-2 md:space-y-4">
                        <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-sm text-slate-200">
                            <div className="p-1 md:p-2 bg-brand-cyan/10 rounded-lg border border-brand-cyan/20">
                                <FaInstagram className="text-brand-cyan" size={14} />
                            </div>
                            <span className="font-semibold tracking-wide">@victorycars_paintdetailing</span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-sm text-slate-200">
                            <div className="p-1 md:p-2 bg-brand-cyan/10 rounded-lg border border-brand-cyan/20">
                                <FaWhatsapp className="text-brand-cyan" size={14} />
                            </div>
                            <span className="font-semibold tracking-wide">+57 315 774 2419</span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-sm text-slate-200 hover:text-brand-cyan transition-colors group cursor-pointer">
                            <div className="p-1 md:p-2 bg-brand-cyan/10 rounded-lg border border-brand-cyan/20 group-hover:bg-brand-cyan/20 transition-all">
                                <FaGlobe className="text-brand-cyan" size={14} />
                            </div>
                            <span className="font-semibold tracking-wide lowercase opacity-80">victorycarsdetailing.com</span>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-6 opacity-20">
                            <span className="text-[7px] md:text-[10px] font-orbitron font-bold tracking-widest uppercase">Precision</span>
                            <div className="w-[3px] h-[3px] md:w-1 md:h-1 rounded-full bg-brand-cyan" />
                            <span className="text-[7px] md:text-[10px] font-orbitron font-bold tracking-widest uppercase">Excellence</span>
                            <div className="w-[3px] h-[3px] md:w-1 md:h-1 rounded-full bg-brand-cyan" />
                            <span className="text-[7px] md:text-[10px] font-orbitron font-bold tracking-widest uppercase">Victory</span>
                        </div>
                    </div>

                    {/* QR Container */}
                    <div className="flex flex-col items-end gap-1.5 md:gap-3">
                        <div className="bg-white p-1.5 md:p-2.5 rounded-lg md:rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.3)] border border-brand-cyan/20">
                            <div className="relative">
                                <QRCodeSVG
                                    value="https://victorycarsdetailing.com/promociones?source=qr"
                                    size={60}
                                    level="H"
                                    includeMargin={false}
                                    fgColor="#020617"
                                    className="md:w-[95px] md:h-[95px]"
                                />
                                {/* Overlay Logo con fondo oscuro para que resalte */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-[18px] h-[18px] md:w-[34px] md:h-[34px] bg-[#020617] rounded-sm md:rounded-lg shadow-xl flex items-center justify-center p-0.5 md:p-1.5 border border-brand-cyan/30">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={ASSETS.logo}
                                                alt="QR Mini Logo"
                                                fill
                                                className="object-contain filter brightness-0 invert"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-[7px] md:text-[10px] uppercase font-orbitron font-extrabold tracking-[0.1em] text-brand-cyan text-right leading-none">
                            ESCANEA PARA<br />
                            <span className="text-white text-[6px] md:text-[9px] opacity-60">REDIMIR CÓDIGO</span>
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
@keyframes scan {
                    from { transform: translateY(-100 %); opacity: 0; }
    50 % { opacity: 0.5; }
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
