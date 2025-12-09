
'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Loader2, ArrowRight, User, Mail, Lock, ShieldCheck } from 'lucide-react'
import { createClient } from '@/app/utils/supabase/client'

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    async function handleGoogleLogin() {
        setIsLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })

        if (error) {
            setError(error.message)
            setIsLoading(false)
        }
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        try {
            const action = isLogin ? login : signup
            const result = await action(formData)

            if (result?.error) {
                setError(result.error)
                setIsLoading(false)
            }
        } catch (e) {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md bg-[#111111] border border-[#333] rounded-2xl overflow-hidden shadow-2xl relative">
            {/* Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#FF9800] blur-[4px]"></div>

            <div className="p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-oswald font-bold uppercase tracking-wide text-white mb-2">
                        {isLogin ? 'Bienvenido a Pits' : 'Únete al Crew'}
                    </h2>
                    <p className="text-white/60 text-sm font-roboto-mono">
                        {isLogin ? 'Accede a tu Speedlight ID' : 'Crea tu Speedlight ID universal'}
                    </p>
                </div>

                {/* Google Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-white text-black font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3 mb-6 hover:bg-gray-100 disabled:opacity-50"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continuar con Google
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#333]"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#111111] px-2 text-white/40">O usa tu correo</span>
                    </div>
                </div>

                {/* Toggle */}
                <div className="flex bg-[#0A0A0A] p-1 rounded-lg mb-8 relative">
                    <div
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#1F1F1F] border border-[#333] rounded-md transition-all duration-300 ease-out ${isLogin ? 'left-1' : 'left-[calc(50%+0px)]'}`}
                    ></div>
                    <button
                        onClick={() => { setIsLogin(true); setError(null); }}
                        className={`flex-1 relative z-10 text-sm font-medium py-2 text-center transition-colors ${isLogin ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
                    >
                        Ingresar
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(null); }}
                        className={`flex-1 relative z-10 text-sm font-medium py-2 text-center transition-colors ${!isLogin ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
                    >
                        Registrarse
                    </button>
                </div>

                <form action={handleSubmit} className="space-y-4">

                    {!isLogin && (
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#FF9800] transition-colors" />
                            <input
                                name="fullName"
                                type="text"
                                placeholder="Nombre Completo / Apodo"
                                required={!isLogin}
                                className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#FF9800] focus:ring-1 focus:ring-[#FF9800] transition-all"
                            />
                        </div>
                    )}

                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#FF9800] transition-colors" />
                        <input
                            name="email"
                            type="email"
                            placeholder="Correo Electrónico"
                            required
                            className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#FF9800] focus:ring-1 focus:ring-[#FF9800] transition-all"
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#FF9800] transition-colors" />
                        <input
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            required
                            className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#FF9800] focus:ring-1 focus:ring-[#FF9800] transition-all"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {isLogin ? 'Arrancar Motores' : 'Unirse al Club'}
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-white/30 text-xs">
                        Protegido por Speedlight Secure. Al continuar aceptas nuestros términos.
                    </p>
                </div>
            </div>
        </div>
    )
}
