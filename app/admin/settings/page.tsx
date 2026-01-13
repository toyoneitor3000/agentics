"use client";

import { useUi } from "@/app/context/UiContext";
import { Terminal, Shield, Monitor } from "lucide-react";

export default function AdminSettingsPage() {
    const { showDebugConsole, toggleDebugConsole } = useUi();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-4xl font-oswald font-black text-white uppercase italic tracking-tighter mb-2">Configuración</h1>
                <p className="text-white/50 font-mono text-sm">Ajustes globales de la interfaz y sistema.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">

                {/* System Debug Widget */}
                <div className="bg-[#0F0A08] border border-white/10 rounded-2xl p-8 hover:border-[#FF9800]/30 transition-colors group">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#FF9800]/10 flex items-center justify-center border border-[#FF9800]/20 group-hover:bg-[#FF9800] group-hover:text-black transition-all">
                                <Terminal className="w-6 h-6 text-[#FF9800] group-hover:text-black transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 font-oswald uppercase italic">Consola de Depuración</h3>
                                <p className="text-white/60 text-sm max-w-md font-sans leading-relaxed">
                                    Controla la visibilidad del widget de "System Status" en el pie de página.
                                    Útil para verificar latencia y estado de servicios en tiempo real.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleDebugConsole(!showDebugConsole)}
                            className={`w-14 h-8 rounded-full transition-all relative border ${showDebugConsole ? 'bg-[#FF9800] border-[#FF9800]' : 'bg-transparent border-white/20'}`}
                        >
                            <span className="sr-only">Toggle Debug Console</span>
                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform shadow-lg ${showDebugConsole ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-4 text-xs font-mono text-white/30">
                        <span className="flex items-center gap-2">
                            <Shield className="w-3 h-3" />
                            Security: Admin Only
                        </span>
                        <span className="flex items-center gap-2">
                            <Monitor className="w-3 h-3" />
                            Client-side Preference
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}
