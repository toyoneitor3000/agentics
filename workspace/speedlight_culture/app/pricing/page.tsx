import Link from 'next/link';
import { Check, Star, Zap, Trophy, Briefcase, Info, AlertCircle } from 'lucide-react';
import { createClient } from "@/app/utils/supabase/server";

export default async function PricingPage() {
    const supabase = await createClient();

    // Fetch REAL user count to be 100% honest
    const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    // Calculate remaining spots for the "Founding Member" strategy
    // If count fails (null), we assume 0 users to be safe.
    const currentUsers = count || 0;
    const totalSpots = 500;
    const remainingSpots = Math.max(0, totalSpots - currentUsers);

    // Format number to always show 3 digits (e.g. 005) for aesthetic consistency
    const formattedRemaining = remainingSpots.toString().padStart(3, '0');

    const plans = [
        {
            name: "Spectator",
            price: "$0",
            period: "/ mes",
            standardPrice: "$0",
            icon: <Star className="w-8 h-8 text-gray-400" />,
            description: "El punto de entrada al mundo Speedlight. Mira, aprende e inspírate.",
            features: [
                "Acceso de lectura a Foros y Galería",
                "Compras en Marketplace",
                "Perfil básico (Avatar + Bio)",
                "Incluye publicidad",
                "Voto único en concursos"
            ],
            cta: "Registrarse Gratis",
            ctaLink: "/auth/register",
            popular: false,
            color: "border-gray-700",
            savings: null
        },
        {
            name: "Rookie",
            price: "$4.99",
            copPrice: "~20k COP",
            standardPrice: "$9.99",
            period: "/ mes",
            icon: <Briefcase className="w-8 h-8 text-blue-500" />,
            description: "Enfocado en el aprendizaje. Ideal para estudiantes de la Academia.",
            features: [
                "Cursos Base (Foto, Edición, Mecánica)",
                "Certificados digitales",
                "1 Entry gratis a concursos/mes",
                "Badge de 'Estudiante'",
                "5% descuento en Merch oficial"
            ],
            cta: "Empezar Carrera",
            ctaLink: "/auth/register?plan=rookie",
            popular: false,
            color: "border-blue-900",
            savings: "50%"
        },
        {
            name: "Builder",
            price: "$6.99",
            copPrice: "~28k COP",
            standardPrice: "$12.99",
            period: "/ mes",
            icon: <Zap className="w-8 h-8 text-[#FF9800]" />,
            description: "Para quien vive en el garaje. Vende, muestra y destaca.",
            features: [
                "Ventas Ilimitadas en Marketplace",
                "2 Boosts de visibilidad/mes",
                "Galería 4K (Sin compresión)",
                "Badge de 'Builder Pro'",
                "Biblioteca DIY (Hazlo tú mismo)"
            ],
            cta: "Potenciar Perfil",
            ctaLink: "/auth/register?plan=builder",
            popular: true,
            color: "border-[#FF9800]",
            savings: "46%"
        },
        {
            name: "Elite Racer",
            price: "$9.99",
            copPrice: "~40k COP",
            standardPrice: "$19.99",
            period: "/ mes",
            icon: <Trophy className="w-8 h-8 text-[#FFEB3B]" />,
            description: "La experiencia definitiva. Acceso total a todo el ecosistema.",
            features: [
                "TODO incluido (Rookie + Builder)",
                "Masterclasses exclusivas",
                "Navegación SIN PUBLICIDAD",
                "Fast Pass en Eventos Presenciales",
                "Welcome Kit (Tras 3 meses)"
            ],
            cta: "Obtener Todo",
            ctaLink: "/auth/register?plan=elite",
            popular: false,
            color: "border-[#FFEB3B]",
            savings: "50%"
        },
        {
            name: "Sponsor",
            price: "$29.99+",
            copPrice: "~120k COP",
            standardPrice: "$49.99+",
            period: "/ mes",
            icon: <Star className="w-8 h-8 text-[#D32F2F]" />,
            description: "Para empresas y talleres que buscan visibilidad real.",
            features: [
                "Ubicación Verificada en Mapa",
                "Analytics de clientes",
                "Reclutamiento de talento",
                "Creación de Curso Patrocinado",
                "Soporte Prioritario B2B"
            ],
            cta: "Gestionar Ads (Demo)",
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
                            <h3 className="text-white font-bold text-lg font-display">ESTATUS DE MIEMBRO FUNDADOR ACTIVO</h3>
                            <p className="text-gray-300 text-sm">
                                Los primeros 500 usuarios bloquean el <span className="text-[#FF9800] font-bold">PRECIO DE LANZAMIENTO DE POR VIDA</span>.
                                <br />
                                <span className="text-xs text-gray-500">*La oferta termina al llegar al usuario #500 o en 6 meses.</span>
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white font-mono">{formattedRemaining}<span className="text-gray-600">/{totalSpots}</span></div>
                        <div className="text-xs text-[#FF9800] uppercase tracking-wider">Cupos Restantes</div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display uppercase italic tracking-wider">
                        Elige tu <span className="text-[#D32F2F]">Motor</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Precios de lanzamiento exclusivos para la comunidad inicial de Speedlight.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-20">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-[#1A1A1A] rounded-xl p-6 border-t-4 ${plan.color} flex flex-col h-full hover:transform hover:-translate-y-2 transition-all duration-300 group`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 -mt-3 mr-4 bg-[#FF9800] text-black text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg shadow-orange-500/20">
                                    Recomendado
                                </div>
                            )}

                            {plan.savings && (
                                <div className="absolute top-4 right-4 text-xs font-bold text-[#66cc33] bg-[#66cc33]/10 px-2 py-1 rounded">
                                    AHORRAS {plan.savings}
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
                                    Estándar: {plan.standardPrice}
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
                        <h3 className="text-xl font-bold text-white font-display uppercase">¿Por qué estos precios?</h3>
                    </div>

                    <div className="bg-[#111] rounded-xl overflow-hidden border border-white/5">
                        <div className="grid grid-cols-4 bg-white/5 p-4 text-sm font-bold text-gray-300 uppercase tracking-wider hidden md:grid">
                            <div className="col-span-1">Vertical</div>
                            <div className="col-span-1">Competencia</div>
                            <div className="col-span-1">Precio Mercado</div>
                            <div className="col-span-1 text-[#FF9800]">Speedlight</div>
                        </div>

                        {/* Mobile View / Table Rows */}
                        <div className="divide-y divide-white/5">
                            {[
                                { area: "Educación", comp: "HP Academy / Domestika", market: "$20-30 USD / curso", vs: "$9.99 USD / todo" },
                                { area: "Ventas (Autos)", comp: "Tucarro / MercadoLibre", market: "$90k - $360k COP / 1 aviso", vs: "$55k COP / ilimitado" },
                                { area: "Entretenimiento", comp: "Netflix / Spotify", market: "$30k - $45k COP / mes", vs: "$40k COP / mes" },
                            ].map((row, i) => (
                                <div key={i} className="grid grid-cols-1 md:grid-cols-4 p-4 text-sm gap-2">
                                    <div className="col-span-1 font-bold text-white">{row.area}</div>
                                    <div className="col-span-1 text-gray-400"><span className="md:hidden text-xs text-gray-600 mr-2">COMPETENCIA:</span>{row.comp}</div>
                                    <div className="col-span-1 text-gray-400"><span className="md:hidden text-xs text-gray-600 mr-2">MERCADO Estimado:</span>{row.market}</div>
                                    <div className="col-span-1 font-bold text-[#FF9800]"><span className="md:hidden text-xs text-gray-600 mr-2">NOSOTROS:</span>{row.vs}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-center text-gray-500 text-xs mt-4 italic">
                        *Precios de mercado basados en referencias públicas de 2024-2025. Los precios de Speedlight incluyen IVA donde aplique.
                    </p>
                </div>

                <div className="mt-16 text-center bg-[#1A1A1A] rounded-xl p-8 border border-white/5 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold mb-4 font-display">¿Buscas algo más personalizado?</h3>
                    <p className="text-gray-400 mb-6">
                        Si eres una marca internacional o necesitas una integración especial con nuestra API, hablemos.
                    </p>
                    <Link href="/contact" className="text-[#FF9800] font-bold hover:underline">
                        Contactar equipo Enterprise →
                    </Link>
                </div>
            </div>
        </div>
    );
}
