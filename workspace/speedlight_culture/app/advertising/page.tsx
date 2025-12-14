"use client";

import Navbar from "../components/Navbar";
import { UserBadge } from "../components/UserBadge";
import { AdFeedCard, AdWorkshopBadge } from "../components/AdBanners";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function AdvertisingPage() {
    return (
        <main className="min-h-screen bg-[#050302] selection:bg-[#FF9800] selection:text-black">
            <Navbar />

            {/* HERO SECTION */}
            <header className="relative pt-48 pb-32 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF9800]/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 border border-[#FF9800]/30 rounded-full bg-[#FF9800]/5 text-[#FF9800] text-xs font-bold uppercase tracking-widest mb-6">
                        Speedlight Business
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
                        Su público automotriz está aquí. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9800] to-orange-600">
                            No en un baile de TikTok.
                        </span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Conecte su marca con la comunidad de entusiastas más exigente de la región.
                        Publicidad nativa, sin interrupciones, diseñada para generar valor y ventas.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="https://wa.me/573000000000?text=Hola,%20quiero%20información%20sobre%20publicidad%20en%20Speedlight."
                            target="_blank"
                            className="px-8 py-4 bg-[#FF9800] hover:bg-orange-600 text-black font-bold text-lg rounded-xl transition-all flex items-center gap-2 hover:scale-105"
                        >
                            Contactar Ventas
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/auth/register?type=business"
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-lg rounded-xl border border-white/10 transition-all"
                        >
                            Crear Cuenta de Negocio
                        </Link>
                    </div>
                </div>
            </header>

            {/* VALUE PROPOSITION GRID */}
            <section className="py-20 bg-[#0A0604] border-y border-white/5">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

                    {/* Visual Demo: The "Official" Look */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-[60px] opacity-50"></div>
                        <div className="relative bg-[#110C0A] p-8 rounded-2xl border border-white/10 shadow-2xl">
                            <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-6">
                                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                                    {/* Logo Placeholder */}
                                    <span className="text-black font-black text-xs">LOGO</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-white">Su Marca Oficial</h3>
                                        <UserBadge role="official_business" size="md" />
                                    </div>
                                    <p className="text-cyan-400 text-sm font-medium mt-1">@su_empresa • Repuestos High Performance</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-2 items-start">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                                    <p className="text-neutral-300 text-sm">Insignia de Verificación Oficial (Check Cian)</p>
                                </div>
                                <div className="flex gap-2 items-start">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                                    <p className="text-neutral-300 text-sm">Panel de Publicidad & Analíticas</p>
                                </div>
                                <div className="flex gap-2 items-start">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                                    <p className="text-neutral-300 text-sm">Soporte Prioritario B2B</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Copy */}
                    <div>
                        <h2 className="text-3xl font-black text-white mb-6">Eleve su Estatus Comercial</h2>
                        <p className="text-neutral-400 mb-6 leading-relaxed">
                            En Speedlight, diferenciamos claramente a los entusiastas de las empresas profesionales.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs font-bold">1</span>
                                <span className="text-neutral-300">Cree su <strong>Perfil de Negocio</strong> independiente.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs font-bold">2</span>
                                <span className="text-neutral-300">Solicite la verificación subiendo su RUT/Cámara de Comercio.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs font-bold">3</span>
                                <span className="text-neutral-300">Obtenga la insignia <span className="text-cyan-400 font-bold">Official Business</span> y destaque sobre la competencia informal.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* AD FORMATS SHOWCASE */}
            <section className="py-32 container mx-auto px-6">
                <header className="text-center mb-20">
                    <h2 className="text-4xl font-black text-white mb-4">Formatos Diseñados para Vender</h2>
                    <p className="text-neutral-400">Publicidad que no parece publicidad. Integrada, elegante y efectiva.</p>
                </header>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Format 1: Native Feed Card */}
                    <div className="space-y-6">
                        <div className="bg-[#0F0A08] p-8 rounded-2xl border border-white/5 flex justify-center min-h-[400px]">
                            <AdFeedCard data={{
                                id: 'demo',
                                type: 'feed',
                                content: {
                                    brandName: "Brembo Official",
                                    title: "Sistema de Frenos GT | Serie Especial",
                                    description: "Máximo rendimiento de frenado para track days. Disponible ahora con instalación incluida en talleres certificados.",
                                    ctaText: "Cotizar Ahora",
                                    ctaLink: "#",
                                    imageUrl: "https://images.unsplash.com/photo-1600706432502-77c0e7887346?q=80&w=2000&auto=format&fit=crop",
                                    badgeText: "Partner Oficial"
                                }
                            }} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Native Feed Card</h3>
                            <p className="text-neutral-500 text-sm">
                                Aparece orgánicamente en el feed de los usuarios. Soporta carrusel de productos y botón de llamado a acción directo a WhatsApp o Web.
                            </p>
                        </div>
                    </div>

                    {/* Format 2: Workshop Badge */}
                    <div className="space-y-6">
                        <div className="bg-[#0F0A08] p-8 rounded-2xl border border-white/5 flex flex-col justify-center items-center min-h-[400px] gap-8">
                            <div className="w-full max-w-sm">
                                <AdWorkshopBadge data={{
                                    id: 'demo-badge',
                                    type: 'workshop_badge',
                                    content: {
                                        brandName: "Taller 7 de Agosto",
                                        badgeText: "Verificado",
                                        description: "Especialistas en Suspensión y Frenos. Garantía de 1 año.",
                                        ctaLink: "#"
                                    }
                                }} />
                            </div>
                            <p className="text-xs text-center text-neutral-600 font-mono mt-4">
                                *Aparece destacado en mapas y búsquedas de servicios.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Workshop Trusted Badge</h3>
                            <p className="text-neutral-500 text-sm">
                                Certifique su taller ante la comunidad. Genera confianza inmediata y posiciona su negocio como la opción segura y profesional.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-32 bg-gradient-to-b from-[#0A0604] to-black border-t border-white/5">
                <div className="container mx-auto px-6 text-center max-w-3xl">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
                        ¿Listo para dominar el mercado?
                    </h2>
                    <p className="text-xl text-neutral-400 mb-12">
                        Speedlight Culture no es para todos. Es para las marcas que entienden que la calidad y la pasión mueven este mercado.
                    </p>
                    <Link
                        href="https://wa.me/573000000000"
                        target="_blank"
                        className="inline-flex px-10 py-5 bg-[#FF9800] hover:bg-orange-600 text-black font-black text-xl rounded-full transition-all shadow-[0_0_40px_rgba(255,152,0,0.3)] hover:shadow-[0_0_60px_rgba(255,152,0,0.5)] hover:scale-105"
                    >
                        Hablar con un Asesor
                    </Link>
                    <p className="mt-8 text-neutral-600 text-sm">
                        Planes para emprendedores desde $500.000 COP
                    </p>
                </div>
            </section>
        </main>
    );
}
