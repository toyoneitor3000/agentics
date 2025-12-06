import React from 'react';
import Image from 'next/image';

const AboutUsSection: React.FC = () => {
  return (
    <section className="py-24 bg-brand-dark-blue relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-accent-blue/5 blur-3xl"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="md:w-1/2 relative">
            <div className="absolute -inset-4 bg-brand-cyan/20 rounded-xl blur-2xl -z-10"></div>
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Placeholder image since we know images are missing, adding a colored div as fallback */}
              <div className="absolute inset-0 bg-brand-mid-blue flex items-center justify-center text-brand-slate">
                [Imagen Taller / Equipo]
              </div>
              <div className="relative w-full h-full">
                <Image
                  src="/about-us.jpg"
                  alt="Victory Cars S.A.S. Taller"
                  fill
                  className="object-cover opacity-80"
                />
              </div>
            </div>
          </div>
          <div className="md:w-1/2 text-brand-slate">
            <h2 className="text-4xl font-bold text-white mb-6 font-orbitron">Artesanos de la <span className="text-brand-cyan">Perfección</span></h2>
            <p className="text-lg leading-relaxed mb-6 font-light">
              En <span className="font-orbitron text-white">VICTORY CARS</span> no solo lavamos autos; <span className="text-white font-medium">restauramos obras de ingeniería</span>. Somos un centro especializado en protección y personalización automotriz de alto calibre.
            </p>
            <p className="text-lg leading-relaxed mb-8 font-light">
              Combinamos tecnología de vanguardia, técnicas de corrección milimétrica y productos premium como <span className="text-brand-cyan font-bold">IGL Coatings</span> para garantizar que su inversión mantenga su valor y estética por años.
            </p>
            <button className="text-brand-cyan border-b border-brand-cyan pb-1 hover:text-white hover:border-white transition-all duration-300 text-sm tracking-widest uppercase font-bold font-orbitron">
              Nuestra Historia
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
