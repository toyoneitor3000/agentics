
'use client'

import { useState, useEffect } from 'react'
import { signIn, signUp } from '@/app/lib/auth-client'
import { Loader2, ArrowRight, User, Mail, Lock, ShieldCheck, AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/app/context/LanguageContext'
import { isInAppBrowser } from '@/app/utils/detect-in-app'

interface AuthFormProps {
    initialView?: 'login' | 'register';
}

export default function AuthForm({ initialView = 'login' }: AuthFormProps) {
    const { language } = useLanguage();
    const [isLogin, setIsLogin] = useState(initialView === 'login')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isMounted, setIsMounted] = useState(false)
    const [isRestrictedBrowser, setIsRestrictedBrowser] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        setIsRestrictedBrowser(isInAppBrowser())
    }, [])

    if (!isMounted) {
        return (
            <div className="w-full max-w-md mx-auto flex justify-center p-12">
                <Loader2 className="w-8 h-8 text-[#FF9800] animate-spin" />
            </div>
        )
    }

    const t_form = {
        es: {
            welcome: "Bienvenido a Pits",
            join: "Únete al Crew",
            welcomeDesc: "Tu garaje digital te espera. Inicia motores.",
            joinDesc: "Empieza tu legado en la cultura automotriz.",
            google: "Continuar con Google",
            instagram: "Continuar con Instagram",
            orEmail: "O usa tu correo",
            login: "Ingresar",
            register: "Registrarse",
            nameHolder: "Nombre Completo / Apodo",
            emailHolder: "tucorreo@ejemplo.com",
            passHolder: "contraseña_segura",
            startEngines: "ARRANCAR MOTORES",
            joinClub: "UNIRSE AL CLUB",
            protected: "Protegido por Speedlight Secure.",
            terms: "Términos",
            privacy: "Privacidad",
            accept: "Al continuar aceptas nuestros",
            browserWarning: "Google no permite iniciar sesión desde esta app. Por favor abre el enlace en tu navegador (Safari o Chrome).",
            changeAccount: "CAMBIAR DE CUENTA",
            changeAccountDesc: "¿Quieres usar otra cuenta?"
        },
        en: {
            welcome: "Welcome to the Pits",
            join: "Join the Crew",
            welcomeDesc: "Your digital garage awaits. Start your engines.",
            joinDesc: "Start your legacy in automotive culture.",
            google: "Continue with Google",
            instagram: "Continue with Instagram",
            orEmail: "Or use your email",
            login: "Login",
            register: "Register",
            nameHolder: "Full Name / Nickname",
            emailHolder: "youremail@example.com",
            passHolder: "secure_password",
            startEngines: "START ENGINES",
            joinClub: "JOIN THE CLUB",
            protected: "Protected by Speedlight Secure.",
            terms: "Terms",
            privacy: "Privacy",
            accept: "By continuing you accept our",
            browserWarning: "Google does not allow signing in from this app. Please open the link in your system browser (Safari or Chrome).",
            changeAccount: "CHANGE ACCOUNT",
            changeAccountDesc: "Want to use another account?"
        }
    };

    const strings = t_form[language || 'es']; // Fallback

    // ... existing functions (getURL, handleGoogleLogin, handleSubmit) ...

    function getURL() {
        let url =
            process.env.NEXT_PUBLIC_SITE_URL ??
            process.env.NEXT_PUBLIC_VERCEL_URL ??
            'http://localhost:3000/'
        url = url.includes('http') ? url : `https://${url}`
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
        return url
    }

    async function handleInstagramLogin(e: any) {
        e.preventDefault();
        setIsLoading(true)
        try {
            const res = await signIn.social({
                provider: "instagram",
                callbackURL: "/profile",
            });
            if (res && !res.error) {
                // BetterAuth handles redirect
            }
        } catch (err: any) {
            setError(err.message || "Error starting Instagram Login");
            setIsLoading(false);
        }
    }

    async function handleGoogleLogin(e: any) {
        e.preventDefault(); // Prevent button default submit if inside form
        setIsLoading(true)
        try {
            const res = await signIn.social({
                provider: "google",
                callbackURL: "/profile",
            });
            // If the code reaches here without throwing, but no redirect happened automatically (which can happen in SPA mode sometimes), force it.
            if (res && !res.error) {
                // BetterAuth handles the redirect to Google automatically.
                // Do NOT manually redirect to /profile here.
            }
        } catch (err: any) {
            setError(err.message || "Error starting Google Login");
            setIsLoading(false);
        }
    }



    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const name = formData.get('fullName') as string

        try {
            if (isLogin) {
                await signIn.email({
                    email,
                    password,
                    callbackURL: "/profile",
                }, {
                    onError: (ctx) => {
                        setError(ctx.error.message)
                        setIsLoading(false)
                    },
                    onSuccess: () => {
                        // Redirect handled by callbackURL
                    }
                })
            } else {
                await signUp.email({
                    email,
                    password,
                    name,
                    callbackURL: "/profile",
                }, {
                    onError: (ctx) => {
                        setError(ctx.error.message)
                        setIsLoading(false)
                    },
                    onSuccess: () => {
                        // Redirect handled by callbackURL
                    }
                })
            }
        } catch (e: any) {
            setError(e.message || "An error occurred")
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto relative z-10">
            {/* Header Text */}
            <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-wider text-white mb-3 drop-shadow-[0_0_15px_rgba(255,152,0,0.4)]">
                    {isLogin ? strings.welcome : strings.join}
                </h2>
                <p className="text-gray-400 text-sm md:text-base font-light">
                    {isLogin ? strings.welcomeDesc : strings.joinDesc}
                </p>
            </div>

            <div className="bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group animate-in fade-in zoom-in-95 duration-500">

                {/* ... Gradient Bloom ... */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-[#FF9800]/10 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* In-App Browser Warning */}
                {isRestrictedBrowser && (
                    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-200/90 font-medium">
                            {strings.browserWarning}
                        </p>
                    </div>
                )}

                {/* Google Login Button */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="relative z-10 w-full bg-white hover:bg-gray-50 border border-gray-200 text-black font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 mb-4 shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.2)] transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>{strings.google}</span>
                </button>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full text-xs text-gray-400 hover:text-[#FF9800] transition-colors py-2 flex items-center justify-center gap-2 group/change mb-4"
                >
                    <User className="w-3 h-3 group-hover/change:scale-110 transition-transform" />
                    <span className="font-medium tracking-wider uppercase opacity-70 group-hover:opacity-100">{strings.changeAccount}</span>
                </button>



                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2 mb-6 animate-in fade-in slide-in-from-top-1">
                        <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <div className="mt-8 text-center border-t border-white/5 pt-6">
                    <p className="text-gray-500 text-xs">
                        {strings.protected} <br className="md:hidden" />
                        <span className="hidden md:inline"> | </span>
                        {strings.accept} <a href="#" className="underline hover:text-[#FF9800]">{strings.terms}</a> y <a href="#" className="underline hover:text-[#FF9800]">{strings.privacy}</a>.
                    </p>
                </div>
            </div>
        </div>
    )
}
