'use client';

import { useEffect } from 'react';

const ScrollReveal = () => {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const revealPoint = 150;
      
      revealElements.forEach(element => {
        const revealTop = element.getBoundingClientRect().top;
        
        if (revealTop < windowHeight - revealPoint) {
          element.classList.add('active');
        } else {
          element.classList.remove('active');
        }
      });
    };
    
    // Revelar elementos al cargar
    revealOnScroll();
    
    // Agregar event listener para scroll
    window.addEventListener('scroll', revealOnScroll);
    
    // Limpiar event listener
    return () => {
      window.removeEventListener('scroll', revealOnScroll);
    };
  }, []);

  return null;
};

export default ScrollReveal;
