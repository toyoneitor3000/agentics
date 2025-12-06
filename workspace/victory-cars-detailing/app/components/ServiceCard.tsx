import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string | JSX.Element;
  imageUrl: string;
  price?: string;
  promotion?: string;
  benefits?: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, imageUrl, price, promotion, benefits }) => {
  return (
    <div className="group relative bg-gradient-to-br from-brand-mid-blue to-brand-dark-blue border border-white/10 rounded-2xl overflow-hidden hover:border-brand-cyan/50 transition-all duration-500 h-full flex flex-col hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] hover:-translate-y-1">
      {/* Image Section with Enhanced Overlay */}
      <div className="relative h-72 w-full overflow-hidden bg-brand-dark-blue">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/20 via-transparent to-brand-accent-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>

        {/* Fallback visual for missing images */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-slate/30 font-orbitron">
          <Sparkles className="w-16 h-16 mb-4 text-brand-cyan/40" />
          <span className="text-2xl font-bold">VICTORY CARS</span>
          <span className="text-sm mt-2">Premium Service</span>
        </div>

        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />

        {/* Bottom gradient for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-mid-blue via-brand-mid-blue/50 to-transparent"></div>

        {/* Promotion Badge */}
        {promotion && (
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-gradient-to-r from-brand-cyan to-blue-500 text-brand-dark-blue text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg border-2 border-white/20 font-orbitron backdrop-blur-sm animate-pulse">
              ✨ {promotion}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow relative">
        {/* Title with icon */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-2 h-2 bg-brand-cyan rounded-full mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          <h3 className="text-xl md:text-2xl font-orbitron font-bold text-white group-hover:text-brand-cyan transition-colors duration-300 leading-tight">
            {title}
          </h3>
        </div>

        {/* Benefits Section - Highlighted */}
        {benefits && benefits.length > 0 && (
          <div className="mb-6 bg-brand-dark-blue/50 rounded-xl p-4 border border-brand-cyan/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              <span className="text-xs font-orbitron text-brand-cyan uppercase tracking-wider font-bold">
                Beneficios Incluidos
              </span>
            </div>
            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-brand-slate font-light leading-snug">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="text-brand-slate text-sm mb-6 flex-grow leading-relaxed">
          {typeof description === 'string' ? <p className="font-light">{description}</p> : description}
        </div>

        {/* Price Section */}
        {price && (
          <div className="mb-6 pt-4 border-t border-white/10">
            <p className="text-[10px] text-brand-cyan uppercase tracking-widest mb-1 font-orbitron font-bold">
              Inversión desde
            </p>
            <p className="text-3xl font-bold text-white font-orbitron">{price}</p>
          </div>
        )}

        {/* CTA Button - Enhanced */}
        <a
          href={`https://wa.me/573124730909?text=Hola,%20estoy%20interesado%20en%20cotizar%20${title.replace(/ /g, '%20')}%20para%20mi%20vehículo.`}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn w-full bg-gradient-to-r from-brand-cyan/10 to-blue-500/10 hover:from-brand-cyan hover:to-blue-500 text-white border-2 border-brand-cyan/30 hover:border-brand-cyan font-bold py-4 rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] font-orbitron tracking-wide relative overflow-hidden"
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>

          <span className="mr-2 text-sm uppercase relative z-10 group-hover/btn:text-brand-dark-blue transition-colors">
            Cotizar Experiencia
          </span>
          <ArrowUpRight size={18} className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform group-hover/btn:text-brand-dark-blue" />
        </a>
      </div>
    </div>
  );
};

export default ServiceCard;
