import React from 'react';
import { Phone, MapPin, Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const ContactSection: React.FC = () => {
  return (
    <section className="py-24 bg-brand-mid-blue relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-cyan/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* Info Side */}
          <div className="lg:w-1/3 space-y-8">
            <h2 className="text-4xl font-bold text-white mb-8 font-orbitron">Inicie su <span className="text-brand-cyan">Transformación</span></h2>
            <p className="text-brand-slate font-light text-lg">
              Estamos listos para llevar su vehículo al siguiente nivel. Agende su cita o visítenos para una evaluación personalizada.
            </p>

            <div className="space-y-6 mt-8">
              <div className="flex items-start group">
                <div className="p-3 bg-brand-dark-blue rounded-lg mr-4 border border-white/5 group-hover:border-brand-cyan/50 transition-colors">
                  <MapPin className="text-brand-cyan" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold font-orbitron tracking-wider text-sm">UBICACIÓN</h4>
                  <p className="text-brand-slate">Calle 128 #47-36, Bogotá</p>
                </div>
              </div>
              <div className="flex items-start group">
                <div className="p-3 bg-brand-dark-blue rounded-lg mr-4 border border-white/5 group-hover:border-brand-cyan/50 transition-colors">
                  <Phone className="text-brand-cyan" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold font-orbitron tracking-wider text-sm">LÍNEA DIRECTA</h4>
                  <p className="text-brand-slate">+57 315 7742419</p>
                </div>
              </div>
              <div className="flex items-start group">
                <div className="p-3 bg-brand-dark-blue rounded-lg mr-4 border border-white/5 group-hover:border-brand-cyan/50 transition-colors">
                  <Mail className="text-brand-cyan" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold font-orbitron tracking-wider text-sm">EMAIL</h4>
                  <p className="text-brand-slate">contacto@victorycars.com</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h4 className="text-white font-bold mb-4 font-orbitron text-sm tracking-wider">HORARIO DE ATENCIÓN</h4>
              <div className="flex justify-between text-brand-slate border-b border-white/5 py-2 text-sm">
                <span>Lunes - Viernes</span>
                <span className="text-white">8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between text-brand-slate border-b border-white/5 py-2 text-sm">
                <span>Sábados</span>
                <span className="text-white">9:00 AM - 4:00 PM</span>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-2/3 bg-brand-dark-blue p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl relative">
            <div className="absolute top-4 right-4 md:top-8 md:right-8 w-24 h-24 md:w-32 md:h-32 opacity-10">
              <div className="relative w-full h-full">
                <Image src="/logo.png" alt="Logo Watermark" fill sizes="(max-width: 800px) 100vw, 800px" style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <form className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-brand-slate/60 text-xs font-bold mb-2 uppercase tracking-widest font-orbitron">Nombre Completo</label>
                  <input type="text" className="w-full bg-brand-mid-blue border border-white/5 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all placeholder-white/10" placeholder="Su nombre" />
                </div>
                <div>
                  <label className="block text-brand-slate/60 text-xs font-bold mb-2 uppercase tracking-widest font-orbitron">Teléfono</label>
                  <input type="tel" className="w-full bg-brand-mid-blue border border-white/5 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all placeholder-white/10" placeholder="+57 ..." />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-brand-slate/60 text-xs font-bold mb-2 uppercase tracking-widest font-orbitron">Vehículo</label>
                  <input type="text" className="w-full bg-brand-mid-blue border border-white/5 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all placeholder-white/10" placeholder="Marca y Modelo" />
                </div>
                <div>
                  <label className="block text-brand-slate/60 text-xs font-bold mb-2 uppercase tracking-widest font-orbitron">Servicio de Interés</label>
                  <select className="w-full bg-brand-mid-blue border border-white/5 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all">
                    <option className="bg-brand-dark-blue">Seleccionar...</option>
                    <option className="bg-brand-dark-blue">Cerámico 9H</option>
                    <option className="bg-brand-dark-blue">PPF</option>
                    <option className="bg-brand-dark-blue">Detailing Interior</option>
                    <option className="bg-brand-dark-blue">Polarizado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-brand-slate/60 text-xs font-bold mb-2 uppercase tracking-widest font-orbitron">Mensaje</label>
                <textarea rows={4} className="w-full bg-brand-mid-blue border border-white/5 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all placeholder-white/10" placeholder="¿Cómo podemos ayudarle?"></textarea>
              </div>

              <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 group">
                <span>Enviar Solicitud VIP</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
