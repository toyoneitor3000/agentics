import React from 'react';
import TestimonialCard from './TestimonialCard';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 bg-brand-dark-blue border-t border-white/5 relative">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center text-white mb-16 font-orbitron">Voces de la Excelencia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            rating={5}
            quote="La atención al detalle es obsesiva. Mi BMW quedó mejor que cuando salió del concesionario."
            author="Ricardo M."
          />
          <TestimonialCard
            rating={5}
            quote="Instalaron PPF en mi camioneta y es invisible. Vale cada peso por la tranquilidad que brinda."
            author="Diana S."
          />
          <TestimonialCard
            rating={5}
            quote="Profesionalismo puro. Cumplieron con los tiempos y el acabado del cerámico es un espejo."
            author="Felipe T."
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
