"use client";

import AuthForm from './auth-form'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from "@/app/context/LanguageContext";

export default function LoginPage() {
    const { language } = useLanguage();

    const t_auth = {
        es: {
            legacy: "Tu Legado",
            startsHere: "Empieza Aquí.",
            desc: "Únete a la comunidad de constructores, pilotos y fotógrafos más exclusiva de Latinoamérica."
        },
        en: {
            legacy: "Your Legacy",
            startsHere: "Starts Here.",
            desc: "Join the most exclusive community of builders, drivers, and photographers in Latin America."
        }
    };

    const content = t_auth[language];

    return (
        <div className="min-h-screen w-full bg-[#050302] lg:grid lg:grid-cols-2 relative">

            {/* Brand Logo - Top Left (Global) */}
            <div className="absolute top-6 left-6 lg:top-10 lg:left-12 z-50">
                <Link href="/" className="hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(255,152,0,0.3)] block">
                    <Image
                        src="/logonavbar.png"
                        alt="Speedlight Culture"
                        width={200}
                        height={60}
                        className="w-32 md:w-48 h-auto object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* Left Panel: Immersive Image (Desktop Only) */}
            <div className="hidden lg:block relative overflow-hidden h-full">
                <Image
                    src="/hero-bg.png"
                    alt="Speedlight Garage"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-[#050302] mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050302] via-transparent to-transparent"></div>

                {/* Motivational Quote or Branding */}
                <div className="absolute bottom-20 left-12 z-20 max-w-lg">
                    <h1 className="text-5xl font-display font-bold uppercase italic text-white mb-4 leading-none">
                        {content.legacy} <br /><span className="text-[#FF9800]">{content.startsHere}</span>
                    </h1>
                    <p className="text-gray-300 text-lg font-light">
                        {content.desc}
                    </p>
                </div>
            </div>

            {/* Right Panel: Auth Form */}
            <div className="relative flex flex-col items-center justify-center p-6 lg:p-12 min-h-screen">

                {/* Mobile Background Fallback */}
                <div className="absolute inset-0 lg:hidden pointer-events-none z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1611566026373-c6c85447dbdc?q=80&w=1000&auto=format&fit=crop"
                        alt="Background"
                        fill
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050302] via-[#050302]/90 to-[#050302]"></div>
                </div>

                {/* Navbar Placeholder / Logo Link - REMOVED (Moved to Global Top Left) */}

                <AuthForm />

            </div>
        </div>
    )
}
