'use client';

import React from 'react';
import ComparisonSlider from './InteractiveComparisonSlider';

const BeforeAfterGallery: React.FC = () => {
  return (
    <section className="py-24 bg-brand-dark-blue relative overflow-hidden">
       {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-mid-blue via-brand-dark-blue to-brand-dark-blue opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">Evidencia Real</h2>
          <div className="h-1 w-24 bg-brand-cyan mx-auto rounded-full shadow-[0_0_15px_#06b6d4]"></div>
          <p className="mt-6 text-brand-slate max-w-2xl mx-auto text-lg font-light">
            Desliza para descubrir la verdadera transformación que logramos en cada vehículo.
          </p>
        </div>

        <div className="space-y-24 max-w-5xl mx-auto">
          <ComparisonSlider 
            label="Corrección de Micro-rayones (Swirl Marks)"
            beforeImage="/gallery/swirl-marks-before.jpg" 
            afterImage="/gallery/swirl-marks-after.jpg" 
          />
          <ComparisonSlider 
            label="Detailing Interior Profundo"
            beforeImage="/gallery/interior-before.jpg" 
            afterImage="/gallery/interior-after.jpg" 
          />
           <ComparisonSlider 
            label="Restauración Completa de Pintura"
            beforeImage="/gallery/paint-before.jpg" 
            afterImage="/gallery/paint-after.jpg" 
          />
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterGallery;
