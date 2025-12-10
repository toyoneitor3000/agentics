
'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Loader2, ArrowRight, User, Mail, Lock, ShieldCheck } from 'lucide-react'
import { createClient } from '@/app/utils/supabase/client'

interface AuthFormProps {
    initialView?: 'login' | 'register';
}

export default function AuthForm({ initialView = 'login' }: AuthFormProps) {
    const [isLogin, setIsLogin] = useState(initialView === 'login')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    function getURL() {
        let url =
            process.env.NEXT_PUBLIC_SITE_URL ??
            process.env.NEXT_PUBLIC_VERCEL_URL ??
            'http://localhost:3000/'
        url = url.includes('http') ? url : `https://${url}`
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
        return url
    }

    async function handleGoogleLogin() {
        setIsLoading(true)
        const callbackUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:3000/auth/callback'
            : 'https://www.speedlightculture.com/auth/callback'

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: callbackUrl,
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
        <div className="w-full max-w-md mx-auto relative z-10">
            {/* Header Text */}
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-wider text-white mb-3">
                    {isLogin ? 'Bienvenido a Pits' : 'Únete al Crew'}
                </h2>
                <p className="text-gray-400 text-sm md:text-base font-light">
                    {isLogin ? 'Tu garaje digital te espera. Inicia motores.' : 'Empieza tu legado en la cultura automotriz.'}
                </p>
            </div>

            <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
                {/* Subtle Gradient Bloom */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-[#FF9800]/5 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Google Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="relative z-10 w-full bg-white hover:bg-gray-50 text-black font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 mb-8 shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.2)] transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Continuar con Google</span>
                </button>

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest font-medium">
                        <span className="bg-[#101010] px-3 text-gray-500">O usa tu correo</span>
                    </div>
                </div>

                {/* Toggle Tabs */}
                <div className="flex bg-black/40 p-1.5 rounded-xl mb-8 relative border border-white/5">
                    <div
                        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#1F1F1F] border border-white/10 rounded-lg shadow-lg transition-all duration-300 ease-out ${isLogin ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}
                    ></div>
                    <button
                        onClick={() => { setIsLogin(true); setError(null); }}
                        className={`flex-1 relative z-10 text-sm font-bold uppercase tracking-wider py-2.5 text-center transition-colors duration-300 ${isLogin ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Ingresar
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(null); }}
                        className={`flex-1 relative z-10 text-sm font-bold uppercase tracking-wider py-2.5 text-center transition-colors duration-300 ${!isLogin ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Registrarse
                    </button>
                </div>

                <form action={handleSubmit} className="space-y-5">

                    {!isLogin && (
                        <div className="relative group/input">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-[#FF9800] transition-colors duration-300" />
                            <input
                                name="fullName"
                                type="text"
                                placeholder="Nombre Completo / Apodo"
                                required={!isLogin}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FF9800]/50 focus:ring-1 focus:ring-[#FF9800]/50 focus:bg-black/60 transition-all duration-300"
                            />
                        </div>
                    )}

                    <div className="relative group/input">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-[#FF9800] transition-colors duration-300" />
                        <input
                            name="email"
                            type="email"
                            placeholder="tucorreo@ejemplo.com"
                            required
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FF9800]/50 focus:ring-1 focus:ring-[#FF9800]/50 focus:bg-black/60 transition-all duration-300"
                        />
                    </div>

                    <div className="relative group/input">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-[#FF9800] transition-colors duration-300" />
                        <input
                            name="password"
                            type="password"
                            placeholder="contraseña_segura"
                            required
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FF9800]/50 focus:ring-1 focus:ring-[#FF9800]/50 focus:bg-black/60 transition-all duration-300"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#FF9800] to-[#F57C00] hover:from-[#FFA726] hover:to-[#FB8C00] text-black font-bold text-lg py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 shadow-[0_4px_20px_rgba(255,152,0,0.2)] hover:shadow-[0_4px_30px_rgba(255,152,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                {isLogin ? 'ARRANCAR MOTORES' : 'UNIRSE AL CLUB'}
                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/5 pt-6">
                    <p className="text-gray-500 text-xs">
                        Protegido por Speedlight Secure. <br className="md:hidden" />
                        <span className="hidden md:inline"> | </span>
                        Al continuar aceptas nuestros <a href="#" className="underline hover:text-[#FF9800]">Términos</a> y <a href="#" className="underline hover:text-[#FF9800]">Privacidad</a>.
                    </p>
                </div>
            </div>
        </div>
    )
}
