'use client';

import React from 'react';
import PromoFlyer from '../components/PromoFlyer';
import Header from '../components/Header';
import Footer from '../components/Footer';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export default function PromocionesPage() {
    const downloadPDF = async () => {
        const element = document.getElementById('flyer-content');
        if (!element) return;

        try {
            // Small delay to ensure all assets are rendered
            await new Promise(r => setTimeout(r, 100));

            const dataUrl = await toPng(element, {
                quality: 1,
                pixelRatio: 2,
                skipFonts: false,
            });

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [element.offsetWidth, element.offsetHeight]
            });

            pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
            pdf.save('Bono-VictoryCars-20.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error al generar el PDF. Por favor intenta de nuevo.');
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col">
            <Header />

            <main className="flex-grow pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-orbitron font-black text-white mb-4 uppercase tracking-tighter">
                        Campañas <span className="text-brand-cyan text-glow">Exclusivas</span>
                    </h1>
                    <p className="text-slate-400 font-inter max-w-2xl mx-auto">
                        Hemos diseñado este bono especial para nuestros clientes. Puedes capturar esta imagen para compartirla en redes sociales o presentarla en nuestro centro de estética para redimir tu beneficio.
                    </p>
                </div>

                <section className="flex flex-col items-center gap-8">
                    <div className="relative group">
                        {/* Decorative elements behind the flyer */}
                        <div className="absolute -inset-4 bg-brand-cyan/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />

                        <PromoFlyer />

                        <div className="mt-8 flex flex-col items-center gap-4">
                            <div className="bg-brand-mid-blue/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl text-center shadow-xl">
                                <p className="text-sm text-slate-300 font-inter mb-4">
                                    Obtén el bono en alta resolución listo para imprimir o compartir.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={downloadPDF}
                                        className="bg-brand-cyan text-brand-dark-blue font-orbitron font-bold py-3 px-8 rounded-full hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                    >
                                        DESCARGAR PDF
                                    </button>
                                    <button
                                        onClick={() => window.print()}
                                        className="bg-transparent border border-white/20 text-white font-orbitron font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                                    >
                                        IMPRIMIR RÁPIDO
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-brand-mid-blue/30 backdrop-blur-md border border-white/5 p-6 rounded-2xl">
                        <h3 className="text-brand-cyan font-orbitron text-lg mb-2 uppercase">20% Descuento</h3>
                        <p className="text-slate-400 text-sm">Aplicable en servicios de PDR (Paintless Dent Repair) y cualquier tratamiento cerámico de nuestra línea 2025.</p>
                    </div>
                    <div className="bg-brand-mid-blue/30 backdrop-blur-md border border-white/5 p-6 rounded-2xl">
                        <h3 className="text-brand-cyan font-orbitron text-lg mb-2 uppercase">Vigencia</h3>
                        <p className="text-slate-400 text-sm">Válido para agendamientos realizados durante el mes en curso. No acumulable con otras promociones.</p>
                    </div>
                    <div className="bg-brand-mid-blue/30 backdrop-blur-md border border-white/5 p-6 rounded-2xl">
                        <h3 className="text-brand-cyan font-orbitron text-lg mb-2 uppercase">Marcas Aliadas</h3>
                        <p className="text-slate-400 text-sm">Trabajamos exclusivamente con Sylex, Gtechniq e IGL Coatings para garantizar resultados de nivel mundial.</p>
                    </div>
                </section>
            </main>

            <Footer />

            <style jsx global>{`
        .text-glow {
          text-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
        }
        @media print {
          header, footer, button, .bg-brand-mid-blue\/50, section:last-of-type, h1, p {
            display: none !important;
          }
          main {
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .PromoFlyer {
            box-shadow: none !important;
            border: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
        </div>
    );
}
