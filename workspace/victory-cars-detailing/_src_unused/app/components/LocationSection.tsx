import React from 'react';
import { MapPin, Clock, Navigation } from 'lucide-react';

const LocationSection: React.FC = () => {
  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.273183424164!2d-74.0537330852382!3d4.71701989659091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9b2d2f7a0b2d%3A0x6e2f4f2b2c2d2e2f!2sCalle%20128%20%2347-36%2C%20Bogot%C3%A1%2C%20Cundinamarca%2C%20Colombia!5e0!3m2!1sen!2sus!4v1678888888888!5m2!1sen!2sus"; 
  const googleMapsDirectionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Calle+128+%2347-36,+Bogot%C3%A1";

  return (
    <section className="py-24 bg-brand-dark-blue relative border-t border-white/5">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-16 font-orbitron">Visítenos en el Norte de Bogotá</h2>
        
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 w-full h-80 md:h-96 bg-brand-mid-blue rounded-xl overflow-hidden shadow-2xl border border-white/10 relative group">
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} // Dark mode map hack
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Victory Cars S.A.S."
              className="opacity-70 group-hover:opacity-100 transition-opacity duration-500"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none border-4 border-brand-mid-blue/50 rounded-xl"></div>
          </div>
          
          <div className="md:w-1/2 text-brand-slate">
            <div className="space-y-8">
                <div className="flex items-start group">
                    <div className="p-3 bg-brand-mid-blue rounded-lg mr-4 border border-white/5 group-hover:border-brand-cyan/50 transition-colors">
                        <MapPin className="text-brand-cyan" size={28} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-lg mb-1 font-orbitron">VICTORY CARS CENTER</h4>
                        <p className="text-brand-slate text-lg font-light">Calle 128 #47-36</p>
                        <p className="text-brand-slate/60 text-sm">Prado Veraniego, Bogotá</p>
                    </div>
                </div>

                <div className="flex items-start group">
                    <div className="p-3 bg-brand-mid-blue rounded-lg mr-4 border border-white/5 group-hover:border-brand-cyan/50 transition-colors">
                        <Clock className="text-brand-cyan" size={28} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-lg mb-1 font-orbitron">HORARIO EXTENDIDO</h4>
                        <p className="text-brand-slate font-light">Lunes a Sábado</p>
                        <p className="text-brand-cyan font-bold">8:00 AM – 6:00 PM</p>
                    </div>
                </div>
            </div>

            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-10 bg-white text-brand-dark-blue font-bold py-4 px-8 rounded-full text-lg hover:bg-brand-cyan hover:text-white transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] font-orbitron tracking-wide"
            >
              <Navigation className="mr-2" size={20} />
              TRAZAR RUTA
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
