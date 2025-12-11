"use client";


import Image from "next/image";
import { HeroBackground } from "@/app/components/HeroBackground";
import {
  AdHeroSponsor,
  AdFeedCard,
  AdWorkshopBadge,
  AdAcademyIntro,
  AdSidebarSpec
} from "@/app/components/AdBanners";
import { getAdByType } from "@/app/data/ads";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Camera, Wrench, Play } from "lucide-react";

export default function Home() {
  // Fetch 'Real' Ads
  // In a real app, this might be a server component fetching from a DB, or a client hook.
  // For now, we simulate the "Database" call with getAdByType.
  const heroAd = getAdByType('hero_sponsor');
  const feedAd = getAdByType('feed_card');
  const academyAd = getAdByType('academy_intro');
  const workshopAd = getAdByType('workshop_badge');
  const specAd = getAdByType('sidebar_spec');

  return (
    <main className="min-h-screen bg-[#050505] text-[#F5E6D3]">

      {/* Hero Section - Galactic Speed */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        {/* Dynamic Background */}
        <HeroBackground />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none"></div>



        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
          <div className="mb-8 relative group">
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

          <p className="text-[#F5E6D3] text-lg md:text-2xl font-light tracking-[0.3em] uppercase mb-10 max-w-3xl mx-auto opacity-80 leading-relaxed">
            El garaje digital para la <span className="text-[#FF9800] font-bold">cultura automotriz</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-center w-full justify-center">
            <Link href="/gallery" className="group relative px-10 py-4 overflow-hidden rounded-full bg-[#FF9800] text-black font-bold tracking-widest uppercase text-sm hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,152,0,0.4)]">
              <span className="relative z-10 flex items-center gap-2">
                Explorar Galería <ArrowRight className="w-4 h-4" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            <Link href="/pricing" className="group relative px-10 py-4 overflow-hidden rounded-full bg-transparent border border-[#F5E6D3]/20 text-[#F5E6D3] font-bold tracking-widest uppercase text-sm hover:border-[#FF9800]/50 transition-colors duration-300 backdrop-blur-sm">
              <span className="relative z-10">Unirse Ahora</span>
              <div className="absolute inset-0 bg-[#FF9800]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce cursor-pointer">
          <span className="text-[10px] uppercase tracking-[0.2em] hover:text-[#FF9800] transition-colors">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#FF9800] to-transparent"></div>
        </div>
      </section>

      {/* NEW SECTION: Academy Teaser (Powered by AdAcademyIntro) */}
      <section className="relative py-20 bg-[#0A0604] border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#F5E6D3]">MASTER THE <span className="text-[#FF9800]">MACHINE</span></h2>
              <p className="text-[#BCAAA4] font-light">Cursos exclusivos, tutoriales mecánicos y masterclasses de conducción.</p>
            </div>
            <Link href="/academy" className="text-[#FF9800] uppercase text-xs font-bold tracking-widest hover:underline decoration-[#FF9800] underline-offset-4">
              Ver Todos los Cursos
            </Link>
          </div>

          {/* Native Ad Integration as Hero Content for Section */}
          <div className="w-full max-w-5xl mx-auto shadow-2xl shadow-orange-900/10 rounded-xl overflow-hidden">
            <AdAcademyIntro data={academyAd} />
          </div>
        </div>
      </section>

      {/* Features - The Grid: Bento Layout */}
      <section className="py-24 relative bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F5E6D3] via-[#FF9800] to-[#F5E6D3]">
                ECOSISTEMA DIGITAL
              </span>
            </h2>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#FF9800] to-transparent"></div>
            <p className="mt-4 text-[#BCAAA4] text-center max-w-2xl">
              Todo lo que necesitas para tu proyecto automotriz en un solo lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">

            {/* 1. Galería HD - Large Featured Tile */}
            <Link href="/gallery" className="group relative md:col-span-6 lg:col-span-2 row-span-2 rounded-3xl overflow-hidden border border-white/10 bg-[#0A0604]">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493238792015-80984815433f?q=80&w=2670')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"></div>
              <div className="relative z-20 p-8 h-full flex flex-col justify-end">
                <div className="w-12 h-12 mb-4 rounded-xl bg-[#FF9800]/20 backdrop-blur-md flex items-center justify-center text-[#FF9800] border border-[#FF9800]/30">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Galería HD</h3>
                <p className="text-[#BCAAA4] text-sm max-w-sm">Fotografía automotriz de alto nivel. Inspírate con los mejores builds y sube tu álbum.</p>
              </div>
            </Link>

            {/* 2. Marketplace - Wide Tile */}
            <Link href="/marketplace" className="group relative md:col-span-3 lg:col-span-2 row-span-1 rounded-3xl overflow-hidden border border-white/10 bg-[#0F0A08] hover:border-[#FF9800]/30 transition-colors">
              <div className="absolute top-0 right-0 p-32 bg-[#FF9800]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FF9800]/10 transition-colors"></div>
              <div className="p-8 h-full flex flex-col justify-center relative z-10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 rounded-lg bg-[#FF9800]/10 text-[#FF9800]"><Zap className="w-5 h-5" /></div>
                  <h3 className="text-xl font-bold text-[#F5E6D3]">Marketplace</h3>
                </div>
                <p className="text-[#BCAAA4] text-sm">Compra y venta segura de partes y accesorios verified.</p>
              </div>
            </Link>

            {/* 3. Foro Técnico - Standard Tile */}
            <Link href="/forum" className="group relative md:col-span-3 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden border border-white/10 bg-[#0F0A08] hover:border-[#FF9800]/30 transition-colors">
              <div className="p-6 h-full flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4"><Shield className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-lg font-bold text-[#F5E6D3] mb-1">Foro Técnico</h3>
                  <p className="text-xs text-[#BCAAA4]">Debate y conocimiento experto.</p>
                </div>
              </div>
            </Link>

            {/* 4. Native Ad Integration - Fits naturally into grid */}
            <div className="md:col-span-3 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-lg border border-white/5">
              <div className="h-full w-full transform hover:scale-[1.02] transition-transform duration-500">
                <AdFeedCard data={feedAd} />
              </div>
            </div>

            {/* 5. Talleres - Standard Tile */}
            <Link href="/workshops" className="group relative md:col-span-3 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden border border-white/10 bg-[#0F0A08] hover:border-[#FF9800]/30 transition-colors">
              <div className="p-6 h-full flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center mb-4"><Wrench className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-lg font-bold text-[#F5E6D3] mb-1">Talleres</h3>
                  <p className="text-xs text-[#BCAAA4]">Especialistas certificados.</p>
                </div>
              </div>
            </Link>

            {/* 6. Project Builds - Standard Tile */}
            <Link href="/projects" className="group relative md:col-span-3 lg:col-span-1 row-span-1 rounded-3xl overflow-hidden border border-white/10 bg-[#0F0A08] hover:border-[#FF9800]/30 transition-colors">
              <div className="p-6 h-full flex flex-col justify-between">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4"><Play className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-lg font-bold text-[#F5E6D3] mb-1">Builds</h3>
                  <p className="text-xs text-[#BCAAA4]">Documenta tu transformación.</p>
                </div>
              </div>
            </Link>

            {/* 7. Partner Spotlight - Wide Tile features AdWorkshopBadge */}
            <div className="md:col-span-6 lg:col-span-2 row-span-1 rounded-3xl overflow-hidden border border-white/5 bg-[#0A0604] p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <span className="text-[10px] uppercase tracking-widest text-[#FF9800]/70 font-bold mb-2 block">Partner Destacado</span>
                <h3 className="text-lg font-bold text-white max-w-[150px]">Calidad Certificada</h3>
              </div>
              <div className="flex-grow w-full">
                <AdWorkshopBadge data={workshopAd} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Technical Corner - Showing off the Tech Spec component */}
      <section className="py-20 bg-[#080504] border-y border-white/5">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-[#FF9800] font-bold uppercase tracking-widest text-sm mb-2">Recomendación Técnica</h3>
            <h2 className="text-3xl font-bold text-white mb-6">OPTIMIZA TU RENDIMIENTO</h2>
            <p className="text-[#BCAAA4] mb-8 leading-relaxed">
              En Speedlight no solo mostramos autos, analizamos la ingeniería detrás de ellos. Descubre nuestras fichas técnicas interactivas y recomendaciones de expertos basadas en data real.
            </p>
            <Link href="/forum" className="inline-flex items-center gap-2 text-white border-b border-[#FF9800] pb-1 hover:text-[#FF9800] transition-colors">
              Ir al Foro Técnico <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <AdSidebarSpec data={specAd} />
          </div>
        </div>
      </section>

      {/* CTA - Speed of Light */}
      <section className="py-32 relative overflow-hidden bg-black">
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


    </main>
  );
}
