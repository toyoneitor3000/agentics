'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let hasReachedHundred = false;

    // Simular progreso de carga
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          hasReachedHundred = true;
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Esperar a que todas las imágenes se carguen Y que el progreso llegue a 100
    const handleLoad = () => {
      // Esperar a que el progreso llegue a 100 antes de ocultar
      const checkProgress = setInterval(() => {
        if (hasReachedHundred) {
          clearInterval(checkProgress);
          setTimeout(() => {
            setIsLoading(false);
          }, 800);
        }
      }, 100);
    };

    // Verificar si el documento ya está completamente cargado
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
      clearInterval(progressInterval);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-brand-petroleum via-brand-black to-brand-dark-blue">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-light-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Contenido del preloader */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo con animación */}
        <div className="relative w-80 h-24 md:w-96 md:h-28 animate-fade-in">
          <Image
            src="/logo.png"
            alt="Victory Cars Detailing"
            fill
            sizes="(max-width: 768px) 320px, 384px"
            style={{ objectFit: "contain" }}
            className="drop-shadow-[0_0_30px_rgba(76,201,240,0.5)]"
            priority
          />
        </div>

        {/* Barra de progreso */}
        <div className="w-64 md:w-80">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-brand-cyan via-brand-light-blue to-brand-cyan rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(6,182,212,0.6)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-brand-cyan text-sm font-orbitron mt-3 tracking-wider">
            {progress}%
          </p>
        </div>

        {/* Texto animado */}
        <div className="text-center space-y-2 animate-fade-in-delay">
          <p className="text-white/60 text-xs md:text-sm font-orbitron tracking-widest uppercase">
            Cargando experiencia premium
          </p>
          <div className="flex gap-1 justify-center">
            <span className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce delay-100"></span>
            <span className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce delay-200"></span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          0%, 30% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1.2s ease-out;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Preloader;
