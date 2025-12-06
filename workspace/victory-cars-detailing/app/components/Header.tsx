'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/#about', label: 'About Us' },
  { href: '/#services', label: 'Servicios' },
  { href: '/#contact', label: 'Contacto' },
];

const Header = () => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // LÓGICA: Navbar oculto al inicio
      // Aparece al hacer scroll hacia abajo (más de 80px)
      // Desaparece SOLO cuando vuelves al top (menos de 50px)
      if (currentScrollY > 80) {
        setIsNavbarVisible(true);
      } else if (currentScrollY < 50) {
        setIsNavbarVisible(false);
      }
    };

    // Optimización con requestAnimationFrame
    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  // Cerrar menú móvil al hacer clic en un enlace
  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* ===== NAVBAR PRINCIPAL (Oculto al inicio, aparece con scroll) ===== */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${isNavbarVisible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0'
          }`}
      >
        {/* Contenedor con gradiente y desenfoque */}
        <div className="relative">
          {/* Gradiente de oscuridad: 100% arriba → 0% abajo */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-transparent"
            style={{
              height: '120%' // Extender el gradiente para que sea más suave
            }}
          />

          {/* Capa de desenfoque con máscara de gradiente: 100% arriba → 0% abajo */}
          <div
            className="absolute inset-0 backdrop-blur-xl"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)',
              height: '120%'
            }}
          />

          {/* Contenido del navbar */}
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-5 relative">

            {/* ===== VERSIÓN MÓVIL Y TABLET (< 1024px) ===== */}
            <div className="lg:hidden flex items-center justify-between">
              {/* Espaciador invisible (para centrar el logo) */}
              <div className="w-10" />

              {/* Logo centrado */}
              <Link href="/" className="flex-shrink-0">
                <div className="relative h-12 w-48 sm:h-14 sm:w-56">
                  <Image
                    src="/logo.png"
                    alt="Victory Cars Detailing"
                    fill
                    sizes="(max-width: 640px) 192px, 224px"
                    style={{ objectFit: "contain" }}
                    className="drop-shadow-[0_0_15px_rgba(76,201,240,0.3)]"
                    priority
                  />
                </div>
              </Link>

              {/* Botón hamburguesa a la derecha */}
              <button
                className="text-white hover:text-brand-light-blue transition-all duration-300 p-2.5 bg-gradient-to-br from-brand-cyan/20 to-brand-light-blue/10 backdrop-blur-md rounded-lg hover:from-brand-cyan/30 hover:to-brand-light-blue/20 border border-brand-cyan/30 hover:border-brand-light-blue/50 shadow-lg hover:shadow-brand-cyan/30"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                type="button"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" strokeWidth={2.5} />
                ) : (
                  <Menu className="h-6 w-6" strokeWidth={2.5} />
                )}
              </button>
            </div>

            {/* ===== VERSIÓN ESCRITORIO (>= 1024px) ===== */}
            <div className="hidden lg:flex items-center justify-between">
              {/* Páginas a la IZQUIERDA */}
              <nav className="flex items-center gap-10">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-bold tracking-widest uppercase text-white/90 hover:text-brand-light-blue transition-all duration-300 hover:scale-105 font-orbitron relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-cyan to-brand-light-blue transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </nav>

              {/* Logo CENTRADO */}
              <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
                <div className="relative h-14 w-56">
                  <Image
                    src="/logo.png"
                    alt="Victory Cars Detailing"
                    fill
                    sizes="224px"
                    style={{ objectFit: "contain" }}
                    className="drop-shadow-[0_0_15px_rgba(76,201,240,0.3)]"
                  />
                </div>
              </Link>

              {/* Botón de CONTACTO a la DERECHA */}
              <a
                href="https://wa.me/573124730909"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-brand-cyan to-brand-light-blue text-white font-bold py-3 px-8 rounded-full hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] font-orbitron tracking-wide hover:scale-105 flex items-center gap-2 uppercase text-sm"
              >
                <span>Contacto</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MENÚ MÓVIL FULLSCREEN ===== */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-all duration-500 ease-in-out ${isMobileMenuOpen
          ? 'opacity-100 visible'
          : 'opacity-0 invisible'
          }`}
      >
        {/* Overlay translúcido con desenfoque */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-brand-dark-blue/65 to-black/70 backdrop-blur-2xl" />

        {/* Contenido del menú */}
        <div className="relative h-full overflow-y-auto px-6 py-8 flex flex-col">
          {/* Header del menú con logo y botón cerrar */}
          <div className="relative flex items-center justify-center mb-12">
            {/* Logo en el menú móvil - CENTRADO */}
            <Link href="/" onClick={handleNavLinkClick}>
              <div className="relative h-16 w-64 sm:h-20 sm:w-80">
                <Image
                  src="/logo.png"
                  alt="Victory Cars Detailing"
                  fill
                  sizes="(max-width: 640px) 256px, 320px"
                  style={{ objectFit: "contain" }}
                  className="drop-shadow-[0_0_25px_rgba(76,201,240,0.6)]"
                />
              </div>
            </Link>

            {/* Botón X para cerrar - POSICIÓN ABSOLUTA A LA DERECHA */}
            <button
              className="absolute right-0 text-white hover:text-brand-light-blue transition-all duration-300 p-3 bg-gradient-to-br from-brand-cyan/20 to-brand-light-blue/10 backdrop-blur-md rounded-xl hover:from-brand-cyan/30 hover:to-brand-light-blue/20 border border-brand-cyan/40 hover:border-brand-light-blue/60 shadow-lg hover:shadow-brand-cyan/40 hover:scale-110"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Cerrar menú"
              type="button"
            >
              <X className="h-7 w-7" strokeWidth={2.5} />
            </button>
          </div>

          {/* Contenido central del menú */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              {/* Enlaces del menú */}
              <nav className="flex flex-col space-y-5">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavLinkClick}
                    className="group"
                    style={{
                      animation: isMobileMenuOpen ? `fadeInUp 0.5s ease-out ${index * 0.1}s both` : 'none'
                    }}
                  >
                    <div className="relative bg-gradient-to-r from-brand-cyan/10 to-brand-light-blue/5 backdrop-blur-lg border border-brand-cyan/20 rounded-xl px-8 py-5 hover:from-brand-cyan/25 hover:to-brand-light-blue/15 hover:border-brand-light-blue/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(76,201,240,0.4)]">
                      <span className="text-xl font-bold tracking-widest uppercase text-white group-hover:text-brand-light-blue transition-colors duration-300 font-orbitron block text-center">
                        {link.label}
                      </span>
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Botón de contacto en móvil */}
              <div
                className="pt-4"
                style={{
                  animation: isMobileMenuOpen ? 'fadeInUp 0.5s ease-out 0.4s both' : 'none'
                }}
              >
                <a
                  href="https://wa.me/573124730909"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleNavLinkClick}
                  className="w-full bg-gradient-to-r from-brand-cyan to-brand-light-blue text-white font-bold py-5 px-8 rounded-xl hover:shadow-[0_0_40px_rgba(76,201,240,0.8)] transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] font-orbitron tracking-widest hover:scale-[1.02] flex items-center justify-center gap-3 group uppercase text-base"
                >
                  <span>Contáctanos</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Footer del menú con crédito */}
          <div className="absolute bottom-6 left-0 right-0 px-6">
            <p className="text-center text-xs text-brand-slate/50 font-light tracking-wide">
              Diseñado y Desarrollado por{' '}
              <a
                href="https://purrpurr.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-cyan/70 hover:text-brand-light-blue transition-colors duration-300 font-medium"
              >
                Purrpurr.dev
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
