"use client"; // <--- LA LLAVE MAESTRA 

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PIGMENTO_DATA } from "@/lib/pigmento-content";
import { ArrowRight, Check, Scissors, Palette, StickyNote, Shield } from "lucide-react";
import { FadeIn, ScaleOnHover } from "@/components/ui/motion";
import { motion } from "framer-motion";
import * as React from "react";

export default function Home() {
  const getIcon = (id: string) => {
    switch(id) {
      case 'plotter': return <Scissors className="w-8 h-8" />;
      case 'design': return <Palette className="w-8 h-8" />;
      case 'cubreplacas': return <Shield className="w-8 h-8" />;
      default: return <StickyNote className="w-8 h-8" />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO SECTION */}
      <section className="relative bg-brand-black text-brand-white py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFD600_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="max-w-4xl">
              <span className="text-brand-yellow font-bold tracking-widest uppercase mb-6 block">Soluciones Visuales Premium</span>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                TU VISIÓN, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-200">NUESTRA TINTA.</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 mb-12 font-medium max-w-2xl leading-relaxed">
                Desde stickers de colección hasta branding corporativo completo. Calidad 8K, vinilos importados y cortes de precisión.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <ScaleOnHover>
                  <a 
                    href={PIGMENTO_DATA.contact.whatsappUrl}
                    target="_blank"
                    className="inline-flex items-center justify-center bg-brand-yellow text-brand-black hover:bg-white font-black text-lg px-10 py-5 rounded-full transition-all uppercase tracking-wide shadow-lg shadow-yellow-500/20"
                  >
                    Cotizar Proyecto <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </ScaleOnHover>
                <ScaleOnHover>
                  <Link 
                    href="/packs"
                    className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md border-2 border-white/20 text-white hover:bg-white hover:text-black font-black text-lg px-10 py-5 rounded-full transition-all uppercase tracking-wide"
                  >
                    Ver Packs
                  </Link>
                </ScaleOnHover>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-32 container mx-auto px-4">
        <FadeIn delay={0.2}>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-brand-black mb-6 tracking-tight">NUESTROS SERVICIOS</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Cubrimos todas las etapas de tu proyecto visual. Desde la idea hasta la impresión final.</p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PIGMENTO_DATA.services.map((service, idx) => (
            <FadeIn key={service.id} delay={idx * 0.1} className="h-full">
              <div className="h-full bg-white p-8 rounded-3xl border border-gray-100 hover:border-brand-yellow/50 hover:shadow-2xl transition-all duration-500 group flex flex-col">
                <div className="bg-brand-gray w-20 h-20 rounded-2xl flex items-center justify-center text-brand-black mb-8 group-hover:bg-brand-yellow group-hover:scale-110 transition-all duration-300">
                  {getIcon(service.id)}
                </div>
                <h3 className="text-2xl font-black text-brand-black mb-4">{service.title}</h3>
                <p className="text-gray-500 font-medium mb-8 flex-1 leading-relaxed">{service.description}</p>
                <div className="pt-6 border-t border-gray-100 mt-auto">
                  <span className="text-xs text-gray-400 uppercase font-bold block mb-1 tracking-wider">Desde</span>
                  <span className="text-xl font-black text-brand-black">{service.priceStart}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* DESIGN TEASER */}
      <section id="design" className="py-24 container mx-auto px-4">
        <FadeIn>
          <div className="bg-brand-yellow rounded-[3rem] p-10 md:p-20 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-20 rounded-full blur-3xl"></div>
            
            <div className="flex-1 z-10">
              <h2 className="text-4xl md:text-6xl font-black text-brand-black mb-8 leading-none">¿NECESITAS <br/>DISEÑO?</h2>
              <p className="text-brand-black/80 text-xl font-medium mb-10 max-w-lg">
                Desde digitalizar tu logo hasta crear la identidad completa de tu marca. No imprimas mediocridad.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-4 font-bold text-brand-black text-lg">
                  <div className="bg-brand-black text-brand-yellow p-2 rounded-full"><Check size={16} /></div> Vectorización de Logos
                </li>
                <li className="flex items-center gap-4 font-bold text-brand-black text-lg">
                  <div className="bg-brand-black text-brand-yellow p-2 rounded-full"><Check size={16} /></div> Identidad Visual & Branding
                </li>
                <li className="flex items-center gap-4 font-bold text-brand-black text-lg">
                  <div className="bg-brand-black text-brand-yellow p-2 rounded-full"><Check size={16} /></div> Merchandising Corporativo
                </li>
              </ul>
              <ScaleOnHover>
                <Button className="bg-brand-black text-white hover:bg-gray-900 h-16 px-10 text-xl font-bold rounded-2xl shadow-xl">
                  Ver Planes de Diseño
                </Button>
              </ScaleOnHover>
            </div>
            
            <div className="flex-1 flex justify-center z-10">
               <motion.div 
                 whileHover={{ rotate: 0, scale: 1.05 }}
                 className="bg-white p-8 rounded-3xl shadow-2xl rotate-6 transition-all duration-500 max-w-sm w-full border-4 border-black"
               >
                  <div className="aspect-square bg-gray-50 rounded-2xl mb-6 flex items-center justify-center border-2 border-dashed border-gray-200">
                     <Palette className="w-24 h-24 text-gray-300" />
                  </div>
                  <div className="h-6 bg-gray-100 rounded-full w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-100 rounded-full w-1/2"></div>
               </motion.div>
            </div>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}