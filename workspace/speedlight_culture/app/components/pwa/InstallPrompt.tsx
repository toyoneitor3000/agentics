"use client";

import { useState, useEffect } from "react";
import { X, Share, Monitor } from "lucide-react";
import Image from "next/image";

export default function InstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [platform, setPlatform] = useState<'ios' | 'mac-safari' | 'native' | null>(null);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        if (isStandalone) return;

        // Check dismissal
        const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
        if (hasDismissed) return;

        const ua = window.navigator.userAgent.toLowerCase();

        // Detection Logic
        // iPad often masquerades as Mac, check touch points to distinguish
        const isIOS = /iphone|ipad|ipod/.test(ua) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
        const isMac = /macintosh|mac os x/i.test(ua) && !isIOS;
        const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

        if (isIOS) {
            setPlatform('ios');
            setShowPrompt(true);
        } else if (isMac && isSafari) {
            setPlatform('mac-safari');
            setShowPrompt(true);
        } else {
            // Android, Chrome (Mac/Windows), Edge, etc.
            const handleBeforeInstallPrompt = (e: any) => {
                e.preventDefault();
                setDeferredPrompt(e);
                setPlatform('native');
                setShowPrompt(true);
            };

            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        }
    }, []);

    const handleInstallClick = async () => {
        if (platform === 'native' && deferredPrompt) {
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

                {/* Background Gradient */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FF9800]/20 rounded-full blur-2xl" />

                <div className="relative flex items-start gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0 relative w-12 h-12 rounded-lg overflow-hidden shadow-lg border border-white/10">
                        <Image
                            src="/logo-192.png"
                            alt="Speedlight App"
                            width={48}
                            height={48}
                            className="object-cover"
                        />
                    </div>

                    <div className="flex-1 pt-1">
                        <h3 className="font-oswald font-bold text-white text-lg leading-none mb-1">
                            Instala Speedlight
                        </h3>

                        <p className="text-sm text-gray-400 leading-snug mb-3">
                            {platform === 'ios' && "Instala la app en tu iPhone para la mejor experiencia."}
                            {platform === 'mac-safari' && "Añade la app a tu Dock para acceder rápido."}
                            {platform === 'native' && "Instala la app para mejor rendimiento y notificaciones."}
                        </p>

                        {/* Actions based on Platform */}

                        {/* iOS Instructions */}
                        {platform === 'ios' && (
                            <div className="flex items-center gap-2 text-xs text-[#FF9800] font-mono border border-[#FF9800]/30 rounded px-2 py-1 bg-[#FF9800]/5 w-fit">
                                <Share size={12} />
                                <span>Compartir &gt; Agregar a Inicio</span>
                            </div>
                        )}

                        {/* Mac Safari Instructions */}
                        {platform === 'mac-safari' && (
                            <div className="flex items-center gap-2 text-xs text-[#FF9800] font-mono border border-[#FF9800]/30 rounded px-2 py-1 bg-[#FF9800]/5 w-fit">
                                <Monitor size={12} />
                                <span>Archivo &gt; Agregar al Dock</span>
                            </div>
                        )}

                        {/* Native Install Button */}
                        {platform === 'native' && (
                            <button
                                onClick={handleInstallClick}
                                className="px-4 py-1.5 bg-white text-black text-sm font-bold font-oswald uppercase tracking-wide rounded hover:bg-gray-200 transition-colors"
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
