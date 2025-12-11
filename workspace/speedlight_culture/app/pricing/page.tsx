"use client";

import Link from 'next/link';
import { Check, Star, Zap, Trophy, Briefcase, Info, AlertCircle } from 'lucide-react';
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from 'react';
import { useLanguage } from "@/app/context/LanguageContext";

export default function PricingPage() {
    const supabase = createClient();
    const { language } = useLanguage();
    const [currentUsers, setCurrentUsers] = useState(0);

    useEffect(() => {
        async function getCount() {
            const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            if (count) setCurrentUsers(count);
        }
        getCount();
    }, []);

    const totalSpots = 500;
    const remainingSpots = Math.max(0, totalSpots - currentUsers);
    const formattedRemaining = remainingSpots.toString().padStart(3, '0');

    const t_pricing = {
        es: {
            title: "Elige tu",
            engine: "Motor",
            subtitle: "Precios de lanzamiento exclusivos para la comunidad inicial de Speedlight.",
            status: "ESTATUS DE MIEMBRO FUNDADOR ACTIVO",
            statusDesc: "Los primeros 500 usuarios bloquean el ",
            statusHighlight: "PRECIO DE LANZAMIENTO DE POR VIDA",
            statusNote: "*La oferta termina al llegar al usuario #500 o en 6 meses.",
            spots: "Cupos Restantes",
            standard: "Estándar:",
            month: "/ mes",
            savings: "AHORRAS",
            recommended: "Recomendado",
            why: "¿Por qué estos precios?",
            table: {
                vertical: "Vertical",
                comp: "Competencia",
                market: "Precio Mercado",
                us: "Speedlight",
                edu: "Educación",
                sales: "Ventas (Autos)",
                ent: "Entretenimiento",
                eduComp: "HP Academy / Domestika",
                eduMarket: "$20-30 USD / curso",
                eduUs: "$9.99 USD / todo",
                salesComp: "Tucarro / MercadoLibre",
                salesMarket: "$90k - $360k COP / 1 aviso",
                salesUs: "$55k COP / ilimitado",
                entComp: "Netflix / Spotify",
                entMarket: "$30k - $45k COP / mes",
                entUs: "$40k COP / mes"
            },
            disclaimer: "*Precios de mercado basados en referencias públicas de 2024-2025. Los precios de Speedlight incluyen IVA donde aplique.",
            custom: "¿Buscas algo más personalizado?",
            customDesc: "Si eres una marca internacional o necesitas una integración especial con nuestra API, hablemos.",
            contact: "Contactar equipo Enterprise →",
            plans: [
                {
                    name: "Spectator",
                    desc: "El punto de entrada al mundo Speedlight. Mira, aprende e inspírate.",
                    features: ["Acceso de lectura a Foros y Galería", "Compras en Marketplace", "Perfil básico (Avatar + Bio)", "Incluye publicidad", "Voto único en concursos"],
                    cta: "Registrarse Gratis"
                },
                {
                    name: "Rookie",
                    desc: "Enfocado en el aprendizaje. Ideal para estudiantes de la Academia.",
                    features: ["Cursos Base (Foto, Edición, Mecánica)", "Certificados digitales", "1 Entry gratis a concursos/mes", "Badge de 'Estudiante'", "5% descuento en Merch oficial"],
                    cta: "Empezar Carrera"
                },
                {
                    name: "Builder",
                    desc: "Para quien vive en el garaje. Vende, muestra y destaca.",
                    features: ["Ventas Ilimitadas en Marketplace", "2 Boosts de visibilidad/mes", "Galería 4K (Sin compresión)", "Badge de 'Builder Pro'", "Biblioteca DIY (Hazlo tú mismo)"],
                    cta: "Potenciar Perfil"
                },
                {
                    name: "Elite Racer",
                    desc: "La experiencia definitiva. Acceso total a todo el ecosistema.",
                    features: ["TODO incluido (Rookie + Builder)", "Masterclasses exclusivas", "Navegación SIN PUBLICIDAD", "Fast Pass en Eventos Presenciales", "Welcome Kit (Tras 3 meses)"],
                    cta: "Obtener Todo"
                },
                {
                    name: "Sponsor",
                    desc: "Para empresas y talleres que buscan visibilidad real.",
                    features: ["Ubicación Verificada en Mapa", "Analytics de clientes", "Reclutamiento de talento", "Creación de Curso Patrocinado", "Soporte Prioritario B2B"],
                    cta: "Gestionar Ads (Demo)"
                }
            ]
        },
        en: {
            title: "Choose your",
            engine: "Engine",
            subtitle: "Exclusive launch pricing for the initial Speedlight community.",
            status: "FOUNDING MEMBER STATUS ACTIVE",
            statusDesc: "First 500 users lock in ",
            statusHighlight: "LIFETIME LAUNCH PRICING",
            statusNote: "*Offer ends at user #500 or in 6 months.",
            spots: "Spots Remaining",
            standard: "Standard:",
            month: "/ month",
            savings: "SAVE",
            recommended: "Recommended",
            why: "Why these prices?",
            table: {
                vertical: "Vertical",
                comp: "Competition",
                market: "Market Price",
                us: "Speedlight",
                edu: "Education",
                sales: "Sales (Cars)",
                ent: "Entertainment",
                eduComp: "HP Academy / Domestika",
                eduMarket: "$20-30 USD / course",
                eduUs: "$9.99 USD / all",
                salesComp: "Tucarro / MercadoLibre",
                salesMarket: "$90k - $360k COP / 1 ad",
                salesUs: "$55k COP / unlimited",
                entComp: "Netflix / Spotify",
                entMarket: "$30k - $45k COP / month",
                entUs: "$40k COP / month"
            },
            disclaimer: "*Market prices based on public references 2024-2025. Speedlight prices include VAT where applicable.",
            custom: "Looking for something custom?",
            customDesc: "If you are an international brand or need special API integration, let's talk.",
            contact: "Contact Enterprise Team →",
            plans: [
                {
                    name: "Spectator",
                    desc: "Entry point to the Speedlight world. Watch, learn, and be inspired.",
                    features: ["Read access to Forums & Gallery", "Marketplace purchases", "Basic Profile (Avatar + Bio)", "Includes ads", "Single vote in contests"],
                    cta: "Register Free"
                },
                {
                    name: "Rookie",
                    desc: "Focused on learning. Ideal for Academy students.",
                    features: ["Base Courses (Photo, Edit, Mech)", "Digital Certificates", "1 Free contest entry/mo", "'Student' Badge", "5% off Official Merch"],
                    cta: "Start Career"
                },
                {
                    name: "Builder",
                    desc: "For those who live in the garage. Sell, showcase, and stand out.",
                    features: ["Unlimited Marketplace Sales", "2 Visibility Boosts/mo", "4K Gallery (No compression)", "'Builder Pro' Badge", "DIY Library"],
                    cta: "Boost Profile"
                },
                {
                    name: "Elite Racer",
                    desc: "The ultimate experience. Full access to the ecosystem.",
                    features: ["EVERYTHING included (Rookie + Builder)", "Exclusive Masterclasses", "AD-FREE Navigation", "Fast Pass at In-Person Events", "Welcome Kit (After 3 mos)"],
                    cta: "Get Everything"
                },
                {
                    name: "Sponsor",
                    desc: "For businesses and workshops seeking real visibility.",
                    features: ["Verified Map Location", "Customer Analytics", "Talent Recruitment", "Sponsored Course Creation", "Priority B2B Support"],
                    cta: "Manage Ads (Demo)"
                }
            ]
        }
    };

    const text = t_pricing[language];
    const p = text.plans;

    const planData = [
        {
            name: p[0].name,
            price: "$0",
            period: text.month,
            standardPrice: "$0",
            icon: <Star className="w-8 h-8 text-gray-400" />,
            description: p[0].desc,
            features: p[0].features,
            cta: p[0].cta,
            ctaLink: "/auth/register",
            popular: false,
            color: "border-gray-700",
            savings: null
        },
        {
            name: p[1].name,
            price: "$4.99",
            copPrice: "~20k COP",
            standardPrice: "$9.99",
            period: text.month,
            icon: <Briefcase className="w-8 h-8 text-blue-500" />,
            description: p[1].desc,
            features: p[1].features,
            cta: p[1].cta,
            ctaLink: "/auth/register?plan=rookie",
            popular: false,
            color: "border-blue-900",
            savings: "50%"
        },
        {
            name: p[2].name,
            price: "$6.99",
            copPrice: "~28k COP",
            standardPrice: "$12.99",
            period: text.month,
            icon: <Zap className="w-8 h-8 text-[#FF9800]" />,
            description: p[2].desc,
            features: p[2].features,
            cta: p[2].cta,
            ctaLink: "/auth/register?plan=builder",
            popular: true,
            color: "border-[#FF9800]",
            savings: "46%"
        },
        {
            name: p[3].name,
            price: "$9.99",
            copPrice: "~40k COP",
            standardPrice: "$19.99",
            period: text.month,
            icon: <Trophy className="w-8 h-8 text-[#FFEB3B]" />,
            description: p[3].desc,
            features: p[3].features,
            cta: p[3].cta,
            ctaLink: "/auth/register?plan=elite",
            popular: false,
            color: "border-[#FFEB3B]",
            savings: "50%"
        },
        {
            name: p[4].name,
            price: "$29.99+",
            copPrice: "~120k COP",
            standardPrice: "$49.99+",
            period: text.month,
            icon: <Star className="w-8 h-8 text-[#D32F2F]" />,
            description: p[4].desc,
            features: p[4].features,
            cta: p[4].cta,
            ctaLink: "/admin/ads",
            popular: false,
            color: "border-[#D32F2F]",
            savings: "40%"
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#050302]">
            {/* Banner Operation Cold Start */}
            <div className="container mx-auto px-4 mb-8">
                <div className="bg-gradient-to-r from-[#D32F2F]/20 to-[#FF9800]/20 border border-[#D32F2F] rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#D32F2F] p-2 rounded-full animate-pulse">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg font-display">{text.status}</h3>
                            <p className="text-gray-300 text-sm">
                                {text.statusDesc}<span className="text-[#FF9800] font-bold">{text.statusHighlight}</span>.
                                <br />
                                <span className="text-xs text-gray-500">{text.statusNote}</span>
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white font-mono">{formattedRemaining}<span className="text-gray-600">/{totalSpots}</span></div>
                        <div className="text-xs text-[#FF9800] uppercase tracking-wider">{text.spots}</div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display uppercase italic tracking-wider">
                        {text.title} <span className="text-[#D32F2F]">{text.engine}</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        {text.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-20">
                    {planData.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-[#1A1A1A] rounded-xl p-6 border-t-4 ${plan.color} flex flex-col h-full hover:transform hover:-translate-y-2 transition-all duration-300 group`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 -mt-3 mr-4 bg-[#FF9800] text-black text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg shadow-orange-500/20">
                                    {text.recommended}
                                </div>
                            )}

                            {plan.savings && (
                                <div className="absolute top-4 right-4 text-xs font-bold text-[#66cc33] bg-[#66cc33]/10 px-2 py-1 rounded">
                                    {text.savings} {plan.savings}
                                </div>
                            )}

                            <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit group-hover:bg-white/10 transition-colors">
                                {plan.icon}
                            </div>

                            <h3 className="text-xl font-bold mb-1 font-display">{plan.name}</h3>
                            <div className="flex flex-col mb-4">
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                                    <span className="text-gray-500 text-sm ml-1">{plan.period}</span>
                                </div>
                                {plan.copPrice && (
                                    <span className="text-xs text-gray-500 font-mono">{plan.copPrice}</span>
                                )}
                                <div className="mt-1 text-xs text-gray-600 line-through">
                                    {text.standard} {plan.standardPrice}
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm mb-6 min-h-[40px]">{plan.description}</p>

                            <ul className="space-y-3 mb-8 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start text-sm text-gray-300">
                                        <Check className="w-4 h-4 text-[#66cc33] mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.ctaLink}
                                className={`w-full block text-center py-3 rounded-lg font-bold transition-all ${plan.popular
                                    ? 'bg-gradient-to-r from-[#D32F2F] to-[#FF9800] text-white hover:opacity-90 shadow-lg shadow-orange-500/20'
                                    : 'bg-white/5 hover:bg-white/10 text-white'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Justificación de Precios (Transparencia) */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="flex items-center gap-2 mb-6 justify-center">
                        <Info className="w-5 h-5 text-gray-400" />
                        <h3 className="text-xl font-bold text-white font-display uppercase">{text.why}</h3>
                    </div>

                    <div className="bg-[#111] rounded-xl overflow-hidden border border-white/5">
                        <div className="grid grid-cols-4 bg-white/5 p-4 text-sm font-bold text-gray-300 uppercase tracking-wider hidden md:grid">
                            <div className="col-span-1">{text.table.vertical}</div>
                            <div className="col-span-1">{text.table.comp}</div>
                            <div className="col-span-1">{text.table.market}</div>
                            <div className="col-span-1 text-[#FF9800]">{text.table.us}</div>
                        </div>

                        {/* Mobile View / Table Rows */}
                        <div className="divide-y divide-white/5">
                            {[
                                { area: text.table.edu, comp: text.table.eduComp, market: text.table.eduMarket, vs: text.table.eduUs },
                                { area: text.table.sales, comp: text.table.salesComp, market: text.table.salesMarket, vs: text.table.salesUs },
                                { area: text.table.ent, comp: text.table.entComp, market: text.table.entMarket, vs: text.table.entUs },
                            ].map((row, i) => (
                                <div key={i} className="grid grid-cols-1 md:grid-cols-4 p-4 text-sm gap-2">
                                    <div className="col-span-1 font-bold text-white">{row.area}</div>
                                    <div className="col-span-1 text-gray-400"><span className="md:hidden text-xs text-gray-600 mr-2">COMP:</span>{row.comp}</div>
                                    <div className="col-span-1 text-gray-400"><span className="md:hidden text-xs text-gray-600 mr-2">MKT:</span>{row.market}</div>
                                    <div className="col-span-1 font-bold text-[#FF9800]"><span className="md:hidden text-xs text-gray-600 mr-2">US:</span>{row.vs}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-center text-gray-500 text-xs mt-4 italic">
                        {text.disclaimer}
                    </p>
                </div>

                <div className="mt-16 text-center bg-[#1A1A1A] rounded-xl p-8 border border-white/5 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold mb-4 font-display">{text.custom}</h3>
                    <p className="text-gray-400 mb-6">
                        {text.customDesc}
                    </p>
                    <Link href="/contact" className="text-[#FF9800] font-bold hover:underline">
                        {text.contact}
                    </Link>
                </div>
            </div>
        </div>
    );
}
