"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/app/lib/auth-client";
import { Lock } from "lucide-react";
import Link from "next/link";
import AppHeader from "./AppHeader";
import BottomNav from "./BottomNav";
import GlobalDebugConsole from "./GlobalDebugConsole";
import InstallPrompt from "../pwa/InstallPrompt";
import OnboardingGuide from "../onboarding/OnboardingGuide";
import { UiProvider, useUi } from "../../context/UiContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isUiVisible, isBottomNavVisible, isSocialMode } = useUi();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const router = useRouter();

    const { data: session, isPending } = useSession();

    // Check if we are on an auth page
    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/auth') || pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');

    // Check local storage for persistent dismissal (optional) or other flags
    // Implement global 1-minute timer for guests
    useEffect(() => {
        if (isAuthPage || isPending) return;

        let timer: NodeJS.Timeout;

        if (!session?.user) {
            // If not logged in, start timer
            console.log("[Global] Guest detected. Starting 30s timer.");
            timer = setTimeout(() => {
                setShowLoginPrompt(true);
            }, 30000); // 30 seconds
        } else {
            console.log("[Global] User logged in:", session.user.email);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [pathname, isAuthPage, isPending, session]);

    if (isAuthPage) {
        return <main className="min-h-screen w-full">{children}</main>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent relative">
            {/* Universal Top Header (Fixed Top) */}
            {/* User Request: Header should NEVER hide, even in Immersive Mode */}
            <div className="opacity-100 z-[250]">
                <AppHeader />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full min-h-screen transition-all duration-300 pt-0 pb-[80px]">
                {children}
            </main>

            {/* Universal Bottom Navigation "Island" (Fixed Bottom) */}
            {/* Fades out globally when idle (5s delay per user request) */}
            <div
                className={`transition-opacity duration-1000 ease-in-out ${isBottomNavVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <BottomNav />
            </div>

            {/* PWA Install Prompt */}
            <InstallPrompt />
            <OnboardingGuide />

            {/* GLOBAL FORCED LOGIN MODAL */}
            {showLoginPrompt && (
                <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-500">
                    <div className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9800] via-red-500 to-[#FF9800]" />

                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <Lock className="w-8 h-8 text-[#FF9800]" />
                        </div>

                        <h2 className="text-2xl font-bold text-white font-oswald uppercase tracking-wide">
                            Únete a la Cultura
                        </h2>

                        <p className="text-white/60 text-sm leading-relaxed">
                            Para seguir disfrutando del contenido exclusivo de Speedlight Culture y conectar con otros entusiastas, necesitas iniciar sesión.
                        </p>

                        <div className="pt-4 space-y-3">
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-black font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase text-xs tracking-wider"
                            >
                                Iniciar Sesión / Registrarse
                            </button>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest">
                                Acceso Requerido
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {/* SYSTEM STATUS / DEBUG CONSOLE (Floating) */}
            <GlobalDebugConsole />
        </div>
    );
}

export default function NavigationLayout({ children }: { children: React.ReactNode }) {
    return (
        <UiProvider>
            <LayoutContent>
                {children}
            </LayoutContent>
        </UiProvider>
    );
}
