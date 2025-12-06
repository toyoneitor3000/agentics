import React from 'react';
import Carousel from './Carousel';

const HeroSection: React.FC = () => {
  const heroImages = [
    '/carrusel/IMG_0547.webp',
    '/carrusel/IMG_0587.webp',
    '/carrusel/IMG_0556.webp',
    '/carrusel/IMG_5419.webp',
    '/carrusel/IMG_0561%202.webp',
    '/carrusel/IMG_5438.webp',
    '/carrusel/IMG_0583.webp',
    '/carrusel/IMG_5440.webp',
    '/carrusel/IMG_0584%202.webp'
  ];

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-brand-dark-blue">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Carousel images={heroImages} interval={4000} />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark-blue/80 via-transparent to-brand-dark-blue z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-accent-blue/20 via-brand-dark-blue/50 to-brand-dark-blue z-0 pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white font-orbitron tracking-normal md:tracking-widest">
          PERFECCIÓN <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-blue-500 text-glow">PARA TU VEHÍCULO</span>
        </h1>
        <p className="text-xl md:text-2xl text-brand-slate mb-10 max-w-3xl mx-auto font-light leading-relaxed px-4">
          El centro de detallado automotriz más exclusivo de Bogotá.
          <span className="block mt-2 text-brand-cyan font-medium font-orbitron text-sm md:text-base tracking-normal md:tracking-[0.2em]">CERÁMICOS 9H • PPF • RESTAURACIÓN PREMIUM</span>
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <button className="btn-primary">
            Agendar Cita VIP
          </button>
          <button className="bg-transparent border border-brand-slate/30 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-white/5 hover:border-brand-cyan hover:text-brand-cyan transition-all duration-300 backdrop-blur-sm">
            Explorar Servicios
          </button>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-4 md:gap-12 text-xs md:text-sm text-brand-slate/60 font-medium tracking-normal md:tracking-widest uppercase font-orbitron">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full shadow-[0_0_10px_#06b6d4]"></span> Bogotá, Col
          </div>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full shadow-[0_0_10px_#06b6d4]"></span> Certificado IGL
          </div>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full shadow-[0_0_10px_#06b6d4]"></span> Garantía Real
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
