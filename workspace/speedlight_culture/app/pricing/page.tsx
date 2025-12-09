import Link from 'next/link';
import { Check, Star, Zap, Trophy, Briefcase } from 'lucide-react';

export default function PricingPage() {
    const plans = [
        {
            name: "Spectator",
            price: "Gratis",
            period: "Para siempre",
            icon: <Star className="w-8 h-8 text-gray-400" />,
            description: "El punto de entrada al mundo Speedlight. Mira, aprende e inspírate.",
            features: [
                "Acceso de lectura a Foros y Galería",
                "Compras en Marketplace",
                "Perfil básico de usuario",
                "Acceso a cursos introductorios (Academy)",
                "Ver ganadores de concursos"
            ],
            cta: "Registrarse Gratis",
            ctaLink: "/auth/register",
            popular: false,
            color: "border-gray-700"
        },
        {
            name: "Rookie",
            price: "$9.99",
            period: "/ mes",
            icon: <Briefcase className="w-8 h-8 text-blue-500" />,
            description: "Enfocado en el aprendizaje. Ideal para estudiantes de la Academia.",
            features: [
                "Todo lo del plan Spectator",
                "Acceso Total a cursos estándar",
                "Derecho a Postular en concursos",
                "Badge de 'Estudiante'",
                "5% descuento en Merch oficial"
            ],
            cta: "Empezar Carrera",
            ctaLink: "/auth/register?plan=rookie",
            popular: false,
            color: "border-blue-900"
        },
        {
            name: "Builder",
            price: "$12.99",
            period: "/ mes",
            icon: <Zap className="w-8 h-8 text-[#FF9800]" />,
            description: "Para quien vive en el garaje. Vende, muestra y destaca.",
            features: [
                "Todo lo del plan Spectator",
                "Ventas Ilimitadas en Marketplace",
                "Publicación destacada en Foro",
                "Subida de fotos 4K en Galería",
                "Badge de 'Builder Pro'",
                "Descuento en talleres"
            ],
            cta: "Potenciar Perfil",
            ctaLink: "/auth/register?plan=builder",
            popular: true,
            color: "border-[#FF9800]"
        },
        {
            name: "Elite Racer",
            price: "$19.99",
            period: "/ mes",
            icon: <Trophy className="w-8 h-8 text-[#FFEB3B]" />,
            description: "La experiencia definitiva. Acceso total a todo el ecosistema.",
            features: [
                "TODO de Rookie + TODO de Builder",
                "Acceso a concursos 'Prize Money'",
                "Early Access a drops y eventos",
                "Insignia Dorada/Elite",
                "Voto doble en concursos"
            ],
            cta: "Obtener Todo",
            ctaLink: "/auth/register?plan=elite",
            popular: false,
            color: "border-[#FFEB3B]"
        },
        {
            name: "Sponsor",
            price: "$49.99+",
            period: "/ mes",
            icon: <Star className="w-8 h-8 text-[#D32F2F]" />,
            description: "Para empresas y talleres que buscan visibilidad real.",
            features: [
                "Perfil de Empresa Verificada",
                "Analytics de visitas",
                "Posts promocionados",
                "Patrocinio de concursos",
                "Bolsa de empleo exclusiva"
            ],
            cta: "Contactar Ventas",
            ctaLink: "/contact",
            popular: false,
            color: "border-[#D32F2F]"
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#050302]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display uppercase italic tracking-wider">
                        Elige tu <span className="text-[#D32F2F]">Motor</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Desde espectadores hasta leyendas. Tenemos un plan diseñado para acelerar tu presencia en la cultura automotriz.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-[#1A1A1A] rounded-xl p-6 border-t-4 ${plan.color} flex flex-col h-full hover:transform hover:-translate-y-2 transition-all duration-300 group`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 -mt-3 mr-4 bg-[#FF9800] text-black text-xs font-bold px-3 py-1 rounded-full uppercase">
                                    Más Popular
                                </div>
                            )}

                            <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit group-hover:bg-white/10 transition-colors">
                                {plan.icon}
                            </div>

                            <h3 className="text-xl font-bold mb-2 font-display">{plan.name}</h3>
                            <div className="flex items-baseline mb-4">
                                <span className="text-3xl font-bold">{plan.price}</span>
                                <span className="text-gray-500 text-sm ml-1">{plan.period}</span>
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
                                        ? 'bg-gradient-to-r from-[#D32F2F] to-[#FF9800] text-white hover:opacity-90'
                                        : 'bg-white/5 hover:bg-white/10 text-white'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
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
