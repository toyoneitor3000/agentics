"use client";

import { useState, useEffect } from "react";
import { Download, Share, X } from "lucide-react";

export default function InstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return;

        // Check if already in standalone mode (installed)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        if (isStandalone) return;

        // Check if previously dismissed (optional: remove this check if you want it to always appear until installed)
        const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
        if (hasDismissed) return;

        const userAgent = window.navigator.userAgent.toLowerCase();
        const ios = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(ios);

        if (ios) {
            // For iOS, show prompts (maybe after a small delay)
            setShowPrompt(true);
        } else {
            // For Android/Chrome
            const handleBeforeInstallPrompt = (e: any) => {
                e.preventDefault();
                setDeferredPrompt(e);
                setShowPrompt(true);
            };

            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

            return () => {
                window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            };
        }
    }, []);

    const handleInstallClick = async () => {
        if (!isIOS && deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa_prompt_dismissed', 'true');
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-[90px] left-4 right-4 z-50 md:bottom-8 md:right-8 md:left-auto md:w-96 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#050302]/90 p-4 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">

                {/* Background Gradient Effect */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FF9800]/20 rounded-full blur-2xl" />

                <div className="relative flex items-start gap-4">
                    {/* Icon Placeholder or App Logo */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF9800] to-[#FF5722] flex items-center justify-center text-white shadow-lg">
                        <Download size={24} />
                    </div>

                    <div className="flex-1 pt-1">
                        <h3 className="font-oswald font-bold text-white text-lg leading-none mb-1">
                            Instala la App
                        </h3>
                        <p className="text-sm text-gray-400 leading-snug">
                            {isIOS
                                ? "Para instalar, toca compartir y selecciona 'Agregar a Inicio'."
                                : "Añade Speedlight a tu inicio para una mejor experiencia."}
                        </p>

                        {isIOS ? (
                            <div className="mt-3 flex items-center gap-2 text-xs text-[#FF9800] font-mono border border-[#FF9800]/30 rounded px-2 py-1 bg-[#FF9800]/5 w-fit">
                                <Share size={12} />
                                <span>Compartir &gt; Agregar a Inicio</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleInstallClick}
                                className="mt-3 px-4 py-1.5 bg-white text-black text-sm font-bold font-oswald uppercase tracking-wide rounded hover:bg-gray-200 transition-colors"
                            >
                                Instalar Ahora
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="text-gray-500 hover:text-white transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
