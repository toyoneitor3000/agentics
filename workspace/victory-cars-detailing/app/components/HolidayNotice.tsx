'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Sparkles } from 'lucide-react';
import Image from 'next/image';

const HolidayNotice = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-brand-dark-blue border border-brand-cyan/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-in zoom-in-95 duration-300">

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 bg-brand-dark-blue/50 hover:bg-brand-cyan/20 border border-white/10 rounded-full transition-colors group"
        >
          <X size={20} className="text-white group-hover:text-brand-cyan" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image Side */}
          <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto h-auto md:h-full min-h-[300px]">
            <Image
              src="/holiday-flyer.png"
              alt="Victory Cars Holiday Flyer"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-brand-dark-blue via-transparent to-transparent" />
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 text-brand-cyan font-semibold text-sm tracking-wider uppercase">
                <Sparkles size={16} />
                Temporada 2026
              </span>
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white leading-tight">
                ¡FELIZ <span className="text-brand-cyan">AÑO NUEVO!</span>
              </h2>
            </div>

            <p className="text-brand-slate text-lg leading-relaxed">
              Victor y Cars les desea un próspero 2026. Estamos preparando lo mejor para el cuidado de su vehículo.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-6 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-glow-cyan">
                <div className="p-2 bg-brand-cyan/20 rounded-lg">
                  <Calendar size={24} className="text-brand-cyan" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg">Reapertura Oficial</h4>
                  <p className="text-brand-cyan text-xl font-bold font-orbitron">5 DE ENERO</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full py-4 bg-brand-cyan text-brand-dark-blue font-orbitron font-bold rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
              EXPLORAR SERVICIOS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayNotice;
