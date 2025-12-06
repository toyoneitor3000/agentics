import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string | JSX.Element;
  imageUrl: string;
  price?: string;
  promotion?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, imageUrl, price, promotion }) => {
  return (
    <div className="group relative bg-brand-mid-blue border border-white/5 rounded-2xl overflow-hidden hover:border-brand-cyan/50 transition-all duration-500 h-full w-full flex flex-col hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      <div className="relative h-64 w-full overflow-hidden bg-brand-dark-blue">
        {/* Fallback visual for missing images */}
        <div className="absolute inset-0 flex items-center justify-center text-brand-slate/20 font-orbitron text-xl">
          VICTORY CARS
        </div>
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-mid-blue via-transparent to-transparent opacity-90"></div>
        {promotion && (
          <div className="absolute top-4 right-4 bg-brand-cyan/90 backdrop-blur-md text-brand-dark-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg border border-cyan-400/30 font-orbitron">
            {promotion}
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-grow relative -mt-12 z-10">
        <h3 className="text-2xl font-orbitron text-white mb-4 group-hover:text-brand-cyan transition-colors duration-300">{title}</h3>

        <div className="text-brand-slate text-sm mb-8 flex-grow leading-relaxed space-y-2 font-light">
          {typeof description === 'string' ? <p>{description}</p> : description}
        </div>

        {price && (
          <div className="mb-6 pt-4 border-t border-white/5">
            <p className="text-[10px] text-brand-cyan uppercase tracking-widest mb-1 font-orbitron">Inversión desde</p>
            <p className="text-2xl font-bold text-white">{price}</p>
          </div>
        )}

        <a
          href={`https://wa.me/573124730909?text=Hola,%20deseo%20información%20VIP%20sobre%20${title.replace(/ /g, '%20')}.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-white/5 hover:bg-brand-cyan hover:text-brand-dark-blue text-white border border-white/10 font-bold py-4 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] font-orbitron tracking-wide"
        >
          <span className="mr-2 text-sm uppercase">Cotizar Experiencia</span>
          <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
};

export default ServiceCard;
