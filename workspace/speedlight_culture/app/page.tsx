"use client";

import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050302] text-[#FFF8F0] selection:bg-[#FF9800]/30">
      <Navbar />

      {/* Hero Section - Galactic Speed */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Speedlight Culture Hero"
            fill
            className="object-cover opacity-40 scale-105 animate-pulse-slow"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050302] via-transparent to-[#050302]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050302_100%)] opacity-80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
          <div className="mb-12 relative group">
            <div className="absolute -inset-10 bg-gradient-to-r from-[#D32F2F]/20 via-[#FF9800]/20 to-[#FFEB3B]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <Image
              src="/logo.png"
              alt="Speedlight Culture"
              width={800}
              height={300}
              className="w-full max-w-4xl h-auto drop-shadow-2xl"
              priority
            />
          </div>

          <p className="text-[#F5E6D3] text-lg md:text-xl font-light tracking-[0.3em] uppercase mb-12 max-w-2xl mx-auto opacity-80">
            El garaje digital para la cultura automotriz
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <button className="group relative px-10 py-4 overflow-hidden rounded-full bg-[#FF9800] text-black font-bold tracking-widest uppercase text-sm hover:scale-105 transition-transform duration-300">
              <span className="relative z-10">Explorar</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            <button className="group relative px-10 py-4 overflow-hidden rounded-full bg-transparent border border-[#F5E6D3]/20 text-[#F5E6D3] font-bold tracking-widest uppercase text-sm hover:border-[#FF9800]/50 transition-colors duration-300">
              <span className="relative z-10">Ver Demo</span>
              <div className="absolute inset-0 bg-[#FF9800]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#FF9800] to-transparent"></div>
        </div>
      </section>

      {/* Stats Ticker - Glass Strip */}
      <div className="relative z-20 border-y border-[#FF9800]/10 bg-[#0A0604]/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-[#FF9800]/10">
            {[
              { label: "Miembros", value: "500+" },
              { label: "Productos", value: "1K+" },
              { label: "Talleres", value: "50+" },
              { label: "Comunidad", value: "24/7" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center group cursor-default">
                <span className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF9800] to-[#FFEB3B] group-hover:scale-110 transition-transform duration-500">
                  {stat.value}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#BCAAA4] mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features - The Grid */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-24">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F5E6D3] via-[#FF9800] to-[#F5E6D3]">
                ECOSISTEMA DIGITAL
              </span>
            </h2>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#FF9800] to-transparent"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Marketplace", desc: "Compra y venta segura de partes y accesorios.", icon: "M" },
              { title: "Foro", desc: "Debate y conocimiento compartido.", icon: "F" },
              { title: "Galería HD", desc: "Fotografía automotriz de alto nivel.", icon: "G" },
              { title: "Talleres", desc: "Directorio curado de especialistas.", icon: "T" },
              { title: "Video", desc: "Contenido exclusivo y reviews.", icon: "V" },
              { title: "AI Agents", desc: "Asistencia inteligente personalizada.", icon: "AI" },
            ].map((feature, i) => (
              <div 
                key={i}
                className="group relative p-8 rounded-2xl bg-[#0A0604] border border-[#FF9800]/5 hover:border-[#FF9800]/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF9800]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 mb-6 rounded-lg bg-[#FF9800]/10 flex items-center justify-center text-[#FF9800] font-bold border border-[#FF9800]/20 group-hover:scale-110 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#F5E6D3] mb-3 group-hover:text-[#FF9800] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[#BCAAA4] text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Speed of Light */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#FF9800]/5"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-[#FF9800]/20 to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter text-[#F5E6D3]">
              ÚNETE A LA <span className="text-[#FF9800]">VELOCIDAD</span>
            </h2>
            <p className="text-[#BCAAA4] text-lg mb-12 font-light tracking-wide">
              Acceso anticipado para fundadores. Sé parte de la historia.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative">
              <input
                type="email"
                placeholder="CORREO ELECTRÓNICO"
                className="flex-grow bg-[#0A0604] border border-[#FF9800]/20 rounded-full px-8 py-4 text-[#F5E6D3] placeholder-[#BCAAA4]/50 focus:outline-none focus:border-[#FF9800] transition-colors text-sm tracking-wider text-center sm:text-left"
              />
              <button className="bg-[#FF9800] text-black font-bold rounded-full px-8 py-4 uppercase tracking-wider text-sm hover:bg-[#FFB74D] transition-colors shadow-[0_0_20px_rgba(255,152,0,0.3)] hover:shadow-[0_0_30px_rgba(255,152,0,0.5)]">
                Unirse
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-[#FF9800]/10 bg-[#050302] py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
            <Image
              src="/logo.png"
              alt="Speedlight Culture"
              width={40}
              height={40}
              className="w-10 h-auto opacity-80"
            />
            <span className="text-xs tracking-[0.2em] uppercase">Speedlight Culture © 2025</span>
          </div>
          
          <div className="flex gap-8">
            {["Twitter", "Instagram", "Discord"].map((social) => (
              <a 
                key={social} 
                href="#" 
                className="text-xs uppercase tracking-[0.2em] text-[#BCAAA4] hover:text-[#FF9800] transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
