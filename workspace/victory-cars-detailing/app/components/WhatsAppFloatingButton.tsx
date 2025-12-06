'use client';

import React, { useState } from 'react';
import { MessageCircle, Share2, X } from 'lucide-react';

const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleWhatsAppChat = () => {
    window.open('https://wa.me/573124730909?text=Hola,%20deseo%20información%20sobre%20sus%20servicios%20de%20detailing.', '_blank');
  };

  const handleWhatsAppShare = () => {
    const shareUrl = window.location.href;
    const text = 'Descubre los mejores servicios de detailing para tu vehículo en Victory Cars';
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + shareUrl)}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-4 flex flex-col items-end space-y-3 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2">
          {/* Opción: Compartir por WhatsApp */}
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center bg-[#25D366] text-white rounded-full px-4 py-3 shadow-lg hover:bg-[#128C7E] transition-all duration-300 transform hover:scale-105"
          >
            <Share2 className="h-5 w-5 mr-2" />
            <span className="text-sm font-semibold whitespace-nowrap">Compartir por WhatsApp</span>
          </button>
          {/* Opción: Escribir por WhatsApp */}
          <button
            onClick={handleWhatsAppChat}
            className="flex items-center justify-center bg-[#25D366] text-white rounded-full px-4 py-3 shadow-lg hover:bg-[#128C7E] transition-all duration-300 transform hover:scale-105"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            <span className="text-sm font-semibold whitespace-nowrap">Escribir por WhatsApp</span>
          </button>
        </div>
      )}

      {/* Botón principal */}
      <button
        onClick={toggleMenu}
        aria-label="Menú de WhatsApp"
        className="bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:scale-110 hover:bg-[#128C7E] transition-all duration-300 animate-pulse flex items-center justify-center"
      >
        {isOpen ? (
          <X className="h-8 w-8" />
        ) : (
          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.32 4.94L2 22l5.27-1.38c1.41.81 3.02 1.29 4.77 1.29h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zM9.53 8.3c.24-.24.58-.25.82-.25.22 0 .42.02.61.27.19.25.63 1.53.63 1.66 0 .13-.08.25-.16.33-.08.08-.19.1-.33.2-.14.1-.33.18-.48.28-.15.1-.3.23-.43.38-.13.15-.27.33-.11.62s.51.93.99 1.4c.66.66 1.2 1.03 1.35 1.15.15.12.24.1.38-.05.14-.15.63-.73.8-1s.17-.22.28-.13c.11.09 1 .48 1.18.56.18.08.3.13.35.19.05.06.03.93-.16 1.15-.19.22-1.18 1.11-1.36 1.13-.18.02-.38.03-.58.03-.2 0-1.03-.1-1.95-.58-.92-.48-1.78-1.24-2.52-2.14s-1.2-1.9-1.38-2.22c-.18-.32-.38-.68-.38-1.03 0-.35.2-.68.44-.92z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default WhatsAppFloatingButton;
