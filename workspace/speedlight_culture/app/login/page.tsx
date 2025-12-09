
import type { Metadata } from 'next'
import AuthForm from './auth-form'

export const metadata: Metadata = {
    title: 'Acceso - Speedlight ID',
    description: 'Inicia sesión para acceder a todo el ecosistema de Speedlight.',
}

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full bg-[#050302] flex flex-col items-center justify-center p-4 relative overflow-hidden pt-32 pb-20">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF9800]/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#FF9800]/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 w-full flex justify-center">
                <AuthForm />
            </div>
        </div>
    )
}
