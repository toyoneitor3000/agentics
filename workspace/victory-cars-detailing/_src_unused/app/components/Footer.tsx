import React from 'react';
import { Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-brand-slate/60 py-16 border-t border-white/10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        <div className="col-span-1 md:col-span-1">
           <h3 className="text-2xl font-orbitron text-white mb-6 tracking-wide">VICTORY <span className="text-brand-cyan">CARS</span></h3>
           <p className="text-sm leading-relaxed mb-6 font-light">
             Elevando el estándar del cuidado automotriz en Bogotá. Pasión, tecnología y perfección en cada detalle.
           </p>
           <div className="flex space-x-4">
            <a href="#" className="hover:text-brand-cyan transition-colors"><Instagram size={24}/></a>
            <a href="#" className="hover:text-brand-cyan transition-colors"><Facebook size={24}/></a>
            <a href="#" className="hover:text-brand-cyan transition-colors"><Twitter size={24}/></a>
           </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-xs font-orbitron">Servicios</h4>
          <ul className="space-y-3 text-sm font-light">
            <li><a href="#" className="hover:text-brand-cyan transition-colors">Cerámico 9H</a></li>
            <li><a href="#" className="hover:text-brand-cyan transition-colors">PPF Protection</a></li>
            <li><a href="#" className="hover:text-brand-cyan transition-colors">Detailing Interior</a></li>
            <li><a href="#" className="hover:text-brand-cyan transition-colors">Corrección de Pintura</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-xs font-orbitron">Empresa</h4>
          <ul className="space-y-3 text-sm font-light">
            <li><a href="#" className="hover:text-brand-cyan transition-colors">Nosotros</a></li>
            <li><a href="#" className="hover:text-brand-cyan transition-colors">Portafolio</a></li>
            <li><a href="#" className="hover:text-brand-cyan transition-colors">Contacto</a></li>
            <li><a href="#" className="hover:text-brand-cyan transition-colors">Política de Privacidad</a></li>
          </ul>
        </div>

        <div>
           <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-xs font-orbitron">Boletín VIP</h4>
           <p className="text-xs mb-4 font-light">Reciba ofertas exclusivas y consejos de mantenimiento.</p>
           <div className="flex">
               <input type="email" placeholder="Su email" className="bg-brand-mid-blue border border-white/10 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:border-brand-cyan w-full text-sm placeholder-white/20"/>
               <button className="bg-brand-cyan text-brand-dark-blue px-4 py-2 rounded-r-lg hover:bg-white transition-colors">
                   <ArrowRight size={18}/>
               </button>
           </div>
        </div>

      </div>
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center text-xs text-brand-slate/40">
        &copy; {new Date().getFullYear()} Victory Cars S.A.S. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
