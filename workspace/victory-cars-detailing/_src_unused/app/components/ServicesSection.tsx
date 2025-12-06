import React from 'react';
import ServiceCard from './ServiceCard';

const ServicesSection: React.FC = () => {
  return (
    <section className="py-24 bg-brand-dark-blue relative" id="services">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-brand-mid-blue to-brand-dark-blue -z-10"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">Servicios Premium</h2>
            <div className="h-1 w-24 bg-brand-cyan mx-auto rounded-full shadow-[0_0_15px_#06b6d4]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <ServiceCard
            title="Lavado Premium Aqua Wash"
            imageUrl="/services/aqua-wash.jpg"
            description={
              <ul className="list-disc list-inside space-y-2 marker:text-brand-cyan">
                <li>Espuma activa pH neutro</li>
                <li>Secado sin contacto (Aire)</li>
                <li>Limpieza interior detallada</li>
                <li>Hidratación de neumáticos</li>
              </ul>
            }
          />

           <ServiceCard
            title="Detailing Pro Finish"
            imageUrl="/services/detailing-pro-finish.jpg"
            description={
              <ul className="list-disc list-inside space-y-2 marker:text-brand-cyan">
                <li>Corrección de pintura (1 paso)</li>
                <li>Restauración de plásticos</li>
                <li>Descontaminación férrica</li>
                <li>Sellador sintético (6 meses)</li>
              </ul>
            }
          />

          <ServiceCard
            title="Cerámico 9H Quartz Shield"
            imageUrl="/services/ceramic-coating.jpg"
            description={
              <>
                <ul className="list-disc list-inside space-y-2 mb-4 marker:text-brand-cyan">
                  <li>Garantía certificada (2-5 años)</li>
                  <li>Dureza 9H real</li>
                  <li>Efecto hidrofóbico extremo</li>
                  <li>Protección UV y química</li>
                </ul>
                <div className="flex justify-between items-end border-t border-white/10 pt-4">
                    <span className="text-sm text-brand-slate">Desde</span>
                    <span className="text-xl font-bold text-brand-cyan">$690.000</span>
                </div>
              </>
            }
          />
          
          <ServiceCard
            title="PPF Protection Shield"
            imageUrl="/services/ppf.jpg"
            description={
              <ul className="list-disc list-inside space-y-2 marker:text-brand-cyan">
                <li>Poliuretano termoplástico</li>
                <li>Autorregeneración con calor</li>
                <li>Invisible a simple vista</li>
                <li>Garantía de 10 años</li>
              </ul>
            }
          />

           <ServiceCard
            title="Restauración Interior VIP"
            imageUrl="/services/upholstery.jpg"
            promotion="25% OFF"
            description={
               <>
                <ul className="list-disc list-inside space-y-2 mb-4 marker:text-brand-cyan">
                  <li>Vapor a 140°C (Ductos)</li>
                  <li>Lavado de tapicería profundo</li>
                  <li>Hidratación de cuero</li>
                  <li>Eliminación de olores</li>
                </ul>
                 <div className="flex justify-between items-end border-t border-white/10 pt-4">
                    <span className="text-sm text-brand-slate">Antes $340k</span>
                    <span className="text-xl font-bold text-red-500">$255.000</span>
                </div>
              </>
            }
          />

           <ServiceCard
            title="Polarizado Nano-Cerámico"
            imageUrl="/services/sun-guard.jpg"
            description={
              <ul className="list-disc list-inside space-y-2 marker:text-brand-cyan">
                <li>Rechazo de calor IR hasta 90%</li>
                <li>Protección UV 99%</li>
                <li>Visibilidad nocturna HD</li>
                <li>Tonos permitidos por ley</li>
              </ul>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
