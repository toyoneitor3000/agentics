'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PromoFlyer from '../components/PromoFlyer';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Quoter from '../components/Quoter';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { FaTicketAlt, FaCopy, FaCheck, FaInfoCircle } from 'react-icons/fa';

function PromotionsContent() {
    const searchParams = useSearchParams();
    const [couponCode, setCouponCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // Check if user came from QR or already has a code
        const savedCode = localStorage.getItem('victory_coupon');
        if (savedCode) {
            setCouponCode(savedCode);
        } else if (searchParams.get('source') === 'qr') {
            generateCode();
        }
    }, [searchParams]);

    const generateCode = () => {
        setIsGenerating(true);
        // Simulate a small delay for "generation" effect
        setTimeout(() => {
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();
            const newCode = `VICTORY20-${random}`;
            setCouponCode(newCode);
            localStorage.setItem('victory_coupon', newCode);
            setIsGenerating(false);
        }, 1000);
    };

    const copyToClipboard = () => {
        if (!couponCode) return;
        navigator.clipboard.writeText(couponCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadPDF = async () => {
        const element = document.getElementById('flyer-content');
        if (!element) return;

        try {
            // First, ensure all images and fonts are loaded
            await new Promise(r => setTimeout(r, 800));

            // Generate high-quality PNG
            const dataUrl = await toPng(element, {
                quality: 1,
                pixelRatio: 3, // Higher pixel ratio for printing quality
                skipFonts: false,
                cacheBust: true,
                backgroundColor: '#020617', // Match theme background
            });

            // Calculate PDF dimensions based on element aspect ratio
            const width = element.offsetWidth;
            const height = element.offsetHeight;
            const orientation = width > height ? 'l' : 'p';

            const pdf = new jsPDF({
                orientation,
                unit: 'px',
                format: [width, height],
                hotfixes: ['px_scaling'],
            });

            pdf.addImage(dataUrl, 'PNG', 0, 0, width, height, undefined, 'SLOW');
            pdf.save(`Bono-VictoryCars-${couponCode || '2025'}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error al generar el PDF. Por favor intenta de nuevo.');
        }
    };

    return (
        <main className="flex-grow pt-24 pb-12 px-4">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-orbitron font-black text-white mb-6 uppercase tracking-tighter">
                    Campañas <span className="text-brand-cyan text-glow">Exclusivas</span>
                </h1>
                <p className="text-slate-400 font-inter max-w-2xl mx-auto text-lg">
                    Activa tus beneficios exclusivos escaneando nuestros códigos o participando en nuestras campañas.
                </p>
            </div>

            {/* Coupon Section */}
            <section className="max-w-4xl mx-auto mb-20">
                <div className="relative group p-1 rounded-[2.5rem] bg-gradient-to-r from-brand-cyan/20 to-blue-500/20 backdrop-blur-2xl">
                    <div className="absolute -inset-4 bg-brand-cyan/10 blur-3xl opacity-50" />

                    {!couponCode ? (
                        <div className="relative bg-brand-dark-blue/80 rounded-[2.2rem] p-10 text-center border border-white/10">
                            <div className="w-20 h-20 bg-brand-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-cyan">
                                <FaTicketAlt size={36} />
                            </div>
                            <h2 className="text-2xl font-orbitron font-bold text-white mb-4 uppercase">¿Tienes un código de regalo?</h2>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto">Haz clic abajo para generar tu código único de 20% de descuento en servicios seleccionados.</p>
                            <button
                                onClick={generateCode}
                                disabled={isGenerating}
                                className="bg-brand-cyan text-brand-dark-blue font-orbitron font-bold py-4 px-10 rounded-full hover:bg-white transition-all duration-300 disabled:opacity-50 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                            >
                                {isGenerating ? 'GENERANDO...' : 'RECLAMAR MI BONO'}
                            </button>
                        </div>
                    ) : (
                        <div className="relative bg-brand-dark-blue/80 rounded-[2.2rem] p-10 border border-white/10 overflow-hidden">
                            <div className="grid md:grid-cols-2 gap-10 items-center">
                                <div>
                                    <div className="flex items-center gap-3 text-brand-cyan mb-4">
                                        <FaCheck className="animate-pulse" />
                                        <span className="text-xs font-orbitron uppercase tracking-widest">Bono Activado</span>
                                    </div>
                                    <h2 className="text-3xl font-orbitron font-bold text-white mb-4 uppercase leading-tight">
                                        Tu código de <span className="text-brand-cyan">Descuento</span>
                                    </h2>
                                    <div className="flex gap-2 mb-6">
                                        <div className="flex-grow bg-black/50 border border-brand-cyan/30 rounded-xl p-4 flex items-center justify-between">
                                            <span className="text-2xl font-mono font-bold text-brand-cyan tracking-widest">{couponCode}</span>
                                            <button
                                                onClick={copyToClipboard}
                                                className="text-slate-500 hover:text-brand-cyan transition-colors"
                                            >
                                                {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <FaInfoCircle className="text-brand-cyan mt-1 shrink-0" />
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            Presenta este código al momento de tu peritaje en nuestras instalaciones para redimir tu 20% de descuento.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="scale-75 md:scale-90 origin-center">
                                        <div id="flyer-content">
                                            <PromoFlyer />
                                        </div>
                                    </div>
                                    <button
                                        onClick={downloadPDF}
                                        className="w-full bg-white/10 hover:bg-white text-white hover:text-brand-dark-blue border border-white/10 font-orbitron font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        DESCARGAR PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Quoter Section */}
            <section className="mb-20">
                <div className="text-center mb-12">
                    <span className="text-brand-cyan font-orbitron text-xs uppercase tracking-[0.3em] mb-4 block">Calcula tu presupuesto</span>
                    <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white uppercase tracking-tighter italic">
                        Cotizador Online
                    </h2>
                </div>
                <Quoter hasDiscount={!!couponCode} discountCode={couponCode || undefined} />
            </section>

            {/* Conditions Section */}
            <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-brand-mid-blue/30 backdrop-blur-md border border-white/5 p-8 rounded-2xl group hover:border-brand-cyan/30 transition-all">
                    <h3 className="text-brand-cyan font-orbitron text-lg mb-4 uppercase tracking-tighter">20% Descuento</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Aplicable en servicios de PDR (Paintless Dent Repair) y cualquier tratamiento cerámico de nuestra línea 2025.</p>
                </div>
                <div className="bg-brand-mid-blue/30 backdrop-blur-md border border-white/5 p-8 rounded-2xl group hover:border-brand-cyan/30 transition-all text-center border-b-2 border-b-brand-cyan/50">
                    <h3 className="text-brand-cyan font-orbitron text-lg mb-4 uppercase tracking-tighter">Vigencia 2025</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Válido para agendamientos realizados durante el mes en curso. No acumulable con otras promociones.</p>
                </div>
                <div className="bg-brand-mid-blue/30 backdrop-blur-md border border-white/5 p-8 rounded-2xl group hover:border-brand-cyan/30 transition-all text-right">
                    <h3 className="text-brand-cyan font-orbitron text-lg mb-4 uppercase tracking-tighter">Marcas Aliadas</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Trabajamos exclusivamente con Sylex, Gtechniq e IGL Coatings para garantizar resultados de nivel mundial.</p>
                </div>
            </section>
        </main>
    );
}

export default function PromocionesPage() {
    return (
        <div className="min-h-screen bg-[#020617] flex flex-col">
            <Header />
            <Suspense fallback={<div className="flex-grow flex items-center justify-center text-white font-orbitron">Cargando beneficios...</div>}>
                <PromotionsContent />
            </Suspense>
            <Footer />
            <style jsx global>{`
                .text-glow {
                    text-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
                }
            `}</style>
        </div>
    );
}
