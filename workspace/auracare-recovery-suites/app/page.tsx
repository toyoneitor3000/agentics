'use client';

import { useState, useEffect } from 'react';
import WhatsAppWidget from './components/WhatsAppWidget';
import ContactForm from './components/ContactForm';
import Gallery from './components/Gallery';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [lang, setLang] = useState<'es' | 'en'>('es');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const content = {
    es: {
      hero: {
        description: 'Tu recuperación post-operatoria en manos expertas.',
        subdescription: 'Cuidados profesionales, hospedaje y acompañamiento en Bogotá',
        cta1: 'Conoce Nuestros Servicios',
        cta2: 'Consulta Gratuita',
        stats: ['Atención Continua', 'Profesional', 'Seguidores', 'Colombia']
      },
      services: {
        title: 'Experiencia Premium',
        subtitle: 'Cada detalle diseñado para tu bienestar absoluto',
        items: [
          { title: 'Cuidados Médicos', desc: 'Enfermería 24/7 y monitoreo constante.' },
          { title: 'Hospedaje de Lujo', desc: 'Suites adaptadas para tu máxima comodidad.' },
          { title: 'Chef Privado', desc: 'Nutrición especializada para tu recuperación.' },
          { title: 'Acompañamiento', desc: 'Asistencia personal en cada paso.' }
        ]
      },
      gallery: {
        title: 'Nuestras Instalaciones',
        subtitle: 'Un santuario de paz y recuperación'
      },
      contact: {
        title: 'Reserva tu Estadía',
        subtitle: 'Comienza tu proceso de recuperación hoy mismo.'
      }
    },
    en: {
      hero: {
        description: 'Your post-operative recovery in expert hands.',
        subdescription: 'Professional care, accommodation, and support in Bogotá',
        cta1: 'View Our Services',
        cta2: 'Free Consultation',
        stats: ['24/7 Care', 'Professional', 'Followers', 'Colombia']
      },
      services: {
        title: 'Premium Experience',
        subtitle: 'Every detail designed for your absolute well-being',
        items: [
          { title: 'Medical Care', desc: '24/7 nursing and constant monitoring.' },
          { title: 'Luxury Stay', desc: 'Suites adapted for your maximum comfort.' },
          { title: 'Private Chef', desc: 'Specialized nutrition for your recovery.' },
          { title: 'Support', desc: 'Personal assistance at every step.' }
        ]
      },
      gallery: {
        title: 'Our Facilities',
        subtitle: 'A sanctuary of peace and recovery'
      },
      contact: {
        title: 'Book Your Stay',
        subtitle: 'Start your recovery process today.'
      }
    }
  };

  const t = content[lang];

  return (
    <main className="min-h-screen relative overflow-hidden font-sans text-gray-800">
      {/* Animated Background Mesh */}
      <div className="bg-mesh-animated" />

      {/* Language Switcher */}
      <div className="fixed top-8 right-8 z-50">
        <div className="glass-panel p-1 flex gap-1 rounded-full">
          <button
            onClick={() => setLang('es')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${lang === 'es' ? 'bg-white/20 text-purple-900 shadow-sm' : 'text-gray-600 hover:bg-white/10'}`}
          >
            ES
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${lang === 'en' ? 'bg-white/20 text-purple-900 shadow-sm' : 'text-gray-600 hover:bg-white/10'}`}
          >
            EN
          </button>
        </div>
      </div>

      <WhatsAppWidget />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Logo - Massive & Clean */}
          <div className="mb-16 relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full animate-pulse-glow" />
            <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto animate-float-slow">
              <img
                src="/logo.png"
                alt="Beauty & Comfort Logo"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Minimalist Text Content */}
          <div className="glass-panel p-8 md:p-12 mb-12 max-w-3xl mx-auto backdrop-blur-xl bg-white/10 border-white/20">
            <h2 className="text-2xl md:text-4xl font-light text-gray-800 mb-6 leading-relaxed">
              {t.hero.description}
            </h2>
            <p className="text-xl md:text-2xl text-gradient-premium font-medium">
              {t.hero.subdescription}
            </p>
          </div>

          {/* Glass Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <a href="#servicios" className="btn-primary-glow px-10 py-4 rounded-full text-lg font-semibold tracking-wide hover:scale-105 transition-transform">
              {t.hero.cta1}
            </a>
            <a href="#contacto" className="btn-glass px-10 py-4 rounded-full text-lg font-medium hover:bg-white/30 border border-white/40">
              {t.hero.cta2}
            </a>
          </div>

          {/* Stats - Glass Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
            {t.hero.stats.map((stat, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-900/80 mb-2">
                  {i === 0 ? '24/7' : i === 1 ? '100%' : i === 2 ? '2.7k+' : 'BOG'}
                </div>
                <div className="text-xs md:text-sm font-medium text-gray-600 uppercase tracking-widest">
                  {stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Ultra Glass Grid */}
      <section id="servicios" className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-light mb-6 text-gray-900">{t.services.title}</h2>
            <p className="text-xl text-gray-600 font-light">{t.services.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.services.items.map((item, index) => (
              <div key={index} className="glass-card p-8 flex flex-col items-center text-center group hover:bg-white/20 border-white/30">
                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-purple-100/50 to-teal-100/50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500 shadow-inner border border-white/50">
                  {index === 0 ? '🩺' : index === 1 ? '✨' : index === 2 ? '🥗' : '🤝'}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - Full Width Glass */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="glass-panel p-8 md:p-12 bg-white/5 border-white/10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-4">{t.gallery.title}</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-teal-400 mx-auto rounded-full opacity-50" />
            </div>
            <Gallery />
          </div>
        </div>
      </section>

      {/* Testimonials - Floating Cards */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-4xl font-light mb-20">Experiencias Reales</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="glass-card p-8 relative mt-8">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl font-serif shadow-lg">
                  "
                </div>
                <p className="text-gray-600 italic mb-6 pt-4 leading-relaxed">
                  {i === 0 ? "La mejor decisión para mi recuperación. El personal es increíblemente atento." :
                    i === 1 ? "Me sentí como en un hotel de lujo, pero con todos los cuidados médicos necesarios." :
                      "Gracias por hacerme sentir tan segura y acompañada en este proceso."}
                </p>
                <div className="flex items-center gap-4 border-t border-gray-200/30 pt-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-teal-400" />
                  <div>
                    <div className="font-bold text-sm text-gray-800">Paciente Feliz</div>
                    <div className="text-xs text-gray-500">Recuperación Exitosa</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Minimalist */}
      <section id="contacto" className="py-32 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="glass-panel p-8 md:p-16 bg-white/20 border-white/40 shadow-2xl backdrop-blur-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-light mb-4">{t.contact.title}</h2>
              <p className="text-gray-600">{t.contact.subtitle}</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer - Glass */}
      <footer className="py-12 relative z-10 border-t border-white/20 bg-white/5 backdrop-blur-lg">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-8 mb-8">
            <a href="https://www.instagram.com/beautyandcomfortbogota/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-600 transition-colors font-medium hover:scale-110 transform duration-300">Instagram</a>
            <a href="https://wa.me/573223524103" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-600 transition-colors font-medium hover:scale-110 transform duration-300">WhatsApp</a>
            <a href="https://www.tiktok.com/@beautyandcomfortco" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-600 transition-colors font-medium hover:scale-110 transform duration-300">TikTok</a>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            © 2024 Beauty & Comfort Recovery House. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-xs font-medium tracking-wide">
            Diseñado y desarrollado por <a href="https://purrpurr.dev" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 transition-colors font-bold">purrpurr.dev</a>
          </p>
        </div>
      </footer>
    </main>
  );
}