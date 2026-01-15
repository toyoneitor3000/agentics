'use client';

import React, { useState } from 'react';
import { MessageCircle, Share2, X, Calendar, Shield, MapPin, Star, Hammer, Palette } from 'lucide-react';
import { usePathname } from 'next/navigation';

const WhatsAppFloatingButton: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // No mostrar el botón en la página de promociones para evitar solapamiento con el flyer
  if (pathname === '/promociones') return null;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const whatsappNumber = '573157742419';

  const menuOptions = [
    {
      label: 'Agendar Cita',
      icon: <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-2" />,
      message: 'Hola, quisiera agendar una cita para mi vehículo.',
      description: 'Reserva tu espacio'
    },
    {
      label: 'Cotizar Cerámico/PPF',
      icon: <Shield className="h-4 w-4 md:h-5 md:w-5 mr-2" />,
      message: 'Hola, estoy interesado en proteger mi vehículo con Cerámico o PPF. ¿Me pueden asesorar?',
      description: 'Protección Premium'
    },
    {
      label: 'Cotizar Sacatocos/PDR',
      icon: <Hammer className="h-4 w-4 md:h-5 md:w-5 mr-2" />,
      message: 'Hola, tengo un golpe en mi vehículo y quisiera cotizar el servicio de PDR (Sacatocos).',
      description: 'Cero Masilla'
    },
    {
      label: 'Cotizar Pintura',
      icon: <Palette className="h-4 w-4 md:h-5 md:w-5 mr-2" />,
      message: 'Hola, necesito pintar una pieza o renovar la pintura de mi auto. ¿Me ayudan con una cotización?',
      description: 'Acabado Original'
    },
    {
      label: 'Lavado y Detailing',
      icon: <Star className="h-4 w-4 md:h-5 md:w-5 mr-2" />,
      message: 'Hola, quiero información sobre sus servicios de lavado y detailing interior.',
      description: 'Limpieza profunda'
    },
    {
      label: 'Ubicación',
      icon: <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2" />,
      message: 'Hola, ¿podrían enviarme su ubicación exacta para visitarlos?',
      description: 'Visítanos'
    }
  ];

  const handleOptionClick = (message: string) => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleWhatsAppShare = () => {
    const shareUrl = window.location.href;
    const text = 'Descubre los mejores servicios de detailing para tu vehículo en Victory Cars';
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + shareUrl)}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Menú desplegable */}
      {isOpen && (
        <div className="mb-4 flex flex-col items-end space-y-3 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2">

          {menuOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option.message)}
              className="flex items-center justify-end group"
            >
              <div className="mr-3 bg-white text-brand-black px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden md:block">
                <span className="text-xs font-bold font-orbitron">{option.description}</span>
              </div>
              <div className="flex items-center justify-center bg-white text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-full px-5 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-[#25D366]">
                {option.icon}
                <span className="text-xs md:text-sm font-bold whitespace-nowrap font-orbitron">{option.label}</span>
              </div>
            </button>
          ))}

          {/* Opción: Compartir */}
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center bg-brand-dark-blue text-white/80 hover:text-white rounded-full px-4 py-2 shadow-lg hover:bg-brand-mid-blue transition-all duration-300 transform hover:scale-105 mt-2"
          >
            <Share2 className="h-4 w-4 mr-2" />
            <span className="text-xs font-semibold whitespace-nowrap">Compartir</span>
          </button>
        </div>
      )}

      {/* Botón principal */}
      <button
        onClick={toggleMenu}
        aria-label="Menú de WhatsApp"
        className={`
          flex items-center justify-center p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.6)] 
          transition-all duration-300 hover:scale-110 
          ${isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-[#25D366] hover:bg-[#128C7E] animate-pulse'}
        `}
      >
        {isOpen ? (
          <X className="h-8 w-8 text-white" />
        ) : (
          <MessageCircle className="h-8 w-8 text-white" />
        )}
      </button>
    </div>
  );
};

export default WhatsAppFloatingButton;
