'use client';

import { useEffect } from 'react';

const VisualEffects = () => {
  useEffect(() => {
    // Detectar si es dispositivo móvil o tablet
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
             window.innerWidth <= 768 ||
             ('ontouchstart' in window);
    };
    
    // No aplicar efectos en móvil/tablet
    if (checkMobile()) {
      return;
    }

    // Efecto de cursor con partículas
    const handleMouseMove = (e: MouseEvent) => {
      const cursor = document.querySelector('.cursor-effect') as HTMLElement;
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
      
      // Crear partículas en el cursor
      if (Math.random() > 0.7) {
        createParticle(e.clientX, e.clientY);
      }
    };
    
    const createParticle = (x: number, y: number) => {
      const particle = document.createElement('div');
      particle.className = 'cursor-particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.width = Math.random() * 4 + 2 + 'px';
      particle.style.height = particle.style.width;
      particle.style.backgroundColor = `rgba(76, 201, 240, ${Math.random() * 0.3})`;
      particle.style.position = 'fixed';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      
      document.body.appendChild(particle);
      
      // Animación
      const animation = particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(0)`, opacity: 0 }
      ], {
        duration: 1000 + Math.random() * 500,
        easing: 'cubic-bezier(0.2, 0, 0.8, 1)'
      });
      
      animation.onfinish = () => {
        document.body.removeChild(particle);
      };
    };
    
    // Agregar cursor personalizado
    const cursor = document.createElement('div');
    cursor.className = 'cursor-effect';
    cursor.style.position = 'fixed';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = 'rgba(76, 201, 240, 0.1)';
    cursor.style.border = '1px solid rgba(76, 201, 240, 0.3)';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'width 0.2s, height 0.2s, background-color 0.2s';
    document.body.appendChild(cursor);
    
    // Efecto al hacer hover en enlaces y botones
    const handleMouseEnter = () => {
      cursor.style.width = '40px';
      cursor.style.height = '40px';
      cursor.style.backgroundColor = 'rgba(76, 201, 240, 0.2)';
    };
    
    const handleMouseLeave = () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.backgroundColor = 'rgba(76, 201, 240, 0.1)';
    };
    
    // Agregar event listeners
    document.addEventListener('mousemove', handleMouseMove);
    
    const interactiveElements = document.querySelectorAll('a, button, .btn-primary, .btn-secondary');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      if (cursor.parentNode) {
        cursor.parentNode.removeChild(cursor);
      }
    };
  }, []);

  return null;
};

export default VisualEffects;
