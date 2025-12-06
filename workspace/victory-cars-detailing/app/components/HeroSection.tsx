'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Carousel from './Carousel';

const HeroSection: React.FC = () => {
  const [logoOpacity, setLogoOpacity] = useState(1);

  const heroImages = [
    '/carrusel/IMG_0547.webp',
    '/carrusel/IMG_0556.webp',
    '/carrusel/IMG_5419.webp',
    '/carrusel/IMG_0561%202.webp',
    '/carrusel/IMG_0583.webp',
    '/carrusel/IMG_5440.webp',
    '/carrusel/IMG_0584%202.webp'
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Desvanecer el logo gradualmente al hacer scroll
      const newOpacity = Math.max(0, 1 - (currentScrollY / 300));
      setLogoOpacity(newOpacity);
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return (
    <section className="relative h-screen min-h-[100vh] flex items-center justify-center overflow-hidden bg-brand-dark-blue">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Carousel images={heroImages} interval={4000} />
      </div>

      {/* Overlays con degradados solicitados */}
      {/* Degradado negro superior: 100% arriba → 0% a la mitad del logo */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent z-[1] pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0) 50%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0) 50%)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-petroleum via-brand-black to-brand-dark-blue z-0 pointer-events-none opacity-80"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-light-blue/30 to-brand-dark-blue/70 z-0 pointer-events-none opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-brand-light-blue/20 via-brand-black/50 to-brand-dark-blue z-0 pointer-events-none opacity-70"></div>

      {/* Efecto de partículas sutil */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
        {/* Logo de Victory Cars - visible arriba, se desvanece con scroll */}
        <div
          className="flex justify-center mb-8 md:mb-1 pt-[30px] md:pt-0 transition-opacity duration-500"
          style={{ opacity: logoOpacity }}
        >
          <Link href="/" className="block">
            <div className="relative h-24 w-80 md:h-[0px] md:w-96 lg:h-[90px] lg:w-[461px] animate-slide-down">
              <Image
                src="/logo.png"
                alt="Victory Cars Detailing"
                fill
                sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                style={{ objectFit: "contain" }}
                className="drop-shadow-[0_0_20px_rgba(76,201,240,0.4)]"
                priority
              />
            </div>
          </Link>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight text-white font-orbitron tracking-normal md:tracking-wider animate-slide-up">
          PERFECCIÓN <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-light-blue to-blue-400 animate-pulse-glow">
            PARA TU VEHÍCULO
          </span>
        </h1>
        <p className="text-lg md:text-2xl lg:text-3xl text-brand-slate mb-8 md:mb-10 max-w-3xl mx-auto font-light leading-relaxed px-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          El centro de detallado automotriz más exclusivo de Bogotá.
          <span className="block mt-3 md:mt-4 text-brand-cyan font-medium font-orbitron text-base md:text-lg tracking-normal md:tracking-[0.2em]">
            CERÁMICOS 9H • PPF • RESTAURACIÓN PREMIUM
          </span>
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <a href="https://wa.me/573124730909?text=Hola,%20deseo%20agendar%20una%20cita%20VIP%20para%20mi%20vehículo." target="_blank" rel="noopener noreferrer" className="btn-primary text-base md:text-lg py-3 md:py-4 px-8 md:px-10">
            Agendar Cita VIP
          </a>
          <a href="#services" className="btn-secondary text-base md:text-lg py-3 md:py-4 px-8 md:px-10">
            Explorar Servicios
          </a>
        </div>

        <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-brand-slate/70 font-medium tracking-normal md:tracking-widest uppercase font-orbitron animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-2 glass-dark py-2 px-4 md:py-3 md:px-6 rounded-full">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand-cyan rounded-full shadow-[0_0_10px_#06b6d4] animate-pulse"></span> Bogotá, Colombia
          </div>
          <div className="flex items-center gap-2 glass-dark py-2 px-4 md:py-3 md:px-6 rounded-full">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand-light-blue rounded-full shadow-[0_0_10px_#4cc9f0] animate-pulse" style={{ animationDelay: '0.5s' }}></span> Certificado IGL
          </div>
          <div className="flex items-center gap-2 glass-dark py-2 px-4 md:py-3 md:px-6 rounded-full">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand-cyan rounded-full shadow-[0_0_10px_#06b6d4] animate-pulse" style={{ animationDelay: '1s' }}></span> Garantía Real
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
