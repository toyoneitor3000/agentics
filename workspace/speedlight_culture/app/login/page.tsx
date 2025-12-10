
import type { Metadata } from 'next'
import AuthForm from './auth-form'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Acceso - Speedlight ID',
    description: 'Inicia sesión para acceder a todo el ecosistema de Speedlight.',
}

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full bg-[#050302] lg:grid lg:grid-cols-2 relative">

            {/* Left Panel: Immersive Image (Desktop Only) */}
            <div className="hidden lg:block relative overflow-hidden h-full">
                <Image
                    src="https://images.unsplash.com/photo-1611566026373-c6c85447dbdc?q=80&w=2600&auto=format&fit=crop"
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
                        Tu Legado <br /><span className="text-[#FF9800]">Empieza Aquí.</span>
                    </h1>
                    <p className="text-gray-300 text-lg font-light">
                        Únete a la comunidad de constructores, pilotos y fotógrafos más exclusiva de Latinoamérica.
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

                {/* Navbar Placeholder / Logo Link */}
                <div className="absolute top-8 left-0 w-full flex justify-center lg:justify-end lg:pr-12 z-20">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <span className="text-xl font-display font-bold text-white tracking-widest flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[#FF9800] flex items-center justify-center text-black font-bold italic">S</span>
                            SPEEDLIGHT
                        </span>
                    </Link>
                </div>

                <AuthForm />

            </div>
        </div>
    )
}
