import Link from 'next/link';

export default function PricingPage() {
    const plans = [
        {
            name: "Spectator",
            price: "Gratis",
            period: "Para siempre",
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
            color: "border-gray-600",
            buttonVariant: "outline"
        },
        {
            name: "Rookie",
            price: "$9.99",
            period: "/ mes",
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
            popular: true,
            color: "border-[var(--secondary)]",
            buttonVariant: "primary"
        },
        {
            name: "Builder",
            price: "$12.99",
            period: "/ mes",
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
            popular: false,
            color: "border-orange-500",
            buttonVariant: "outline"
        },
        {
            name: "Elite Racer",
            price: "$19.99",
            period: "/ mes",
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
            color: "border-[var(--primary)]",
            buttonVariant: "outline" // Or special style
        },
        {
            name: "Sponsor",
            price: "$49.99+",
            period: "/ mes",
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
            color: "border-red-600",
            buttonVariant: "outline"
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="pt-20 pb-20 px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif text-[var(--primary)] drop-shadow-lg">
                    Invierte en tu Pasión
                </h1>
                <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl">
                    Accede a educación de clase mundial, competiciones exclusivas y herramientas profesionales.
                </p>
            </div>

            <div className="container mx-auto px-4 -mt-10 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`
                                relative flex flex-col h-full p-6 rounded-xl border-t-4 transition-transform hover:-translate-y-2 duration-300
                                ${plan.popular ? 'bg-gradient-to-b from-[rgba(0,119,190,0.2)] to-[rgba(2,11,20,0.8)] border-[var(--secondary)]' : 'bg-[rgba(2,11,20,0.6)] backdrop-blur-md border-[rgba(255,255,255,0.1)]'}
                                ${plan.color}
                            `}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/4 bg-[var(--secondary)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg">
                                    Recomendado
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline mb-4">
                                <span className="text-3xl font-bold text-[var(--foreground)]">{plan.price}</span>
                                <span className="text-gray-400 text-sm ml-1">{plan.period}</span>
                            </div>

                            <p className="text-gray-300 text-sm mb-6 min-h-[60px]">{plan.description}</p>

                            <div className="flex-grow">
                                <p className="text-xs font-bold text-[var(--primary)] uppercase tracking-wide mb-3 opacity-80">Incluye:</p>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start text-sm text-gray-300">
                                            <svg className="w-5 h-5 text-[var(--primary)] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                href={plan.ctaLink}
                                className={`
                                    w-full block text-center py-3 rounded-lg font-bold transition-all uppercase tracking-wider text-sm
                                    ${plan.popular
                                        ? 'bg-[var(--secondary)] text-white hover:bg-[#005f99] shadow-[0_0_15px_rgba(0,119,190,0.4)]'
                                        : 'bg-transparent border border-gray-600 text-white hover:border-[var(--primary)] hover:text-[var(--primary)]'
                                    }
                                `}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
