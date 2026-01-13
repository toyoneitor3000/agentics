"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ collapsed = false }: { collapsed?: boolean }) {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all group ${collapsed ? 'justify-center w-full' : 'w-full'}`}
            title={language === 'es' ? "Switch to English" : "Cambiar a Español"}
        >
            <Globe className={`w-5 h-5 ${language === 'en' ? 'text-[#FF9800]' : 'text-white/50 group-hover:text-white'}`} />

            {!collapsed && (
                <div className="flex items-center justify-between flex-1">
                    <span className="text-sm font-medium text-white/80">
                        {language === 'es' ? 'Idioma' : 'Language'}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-[#FF9800] uppercase">
                        {language}
                    </span>
                </div>
            )}
        </button>
    );
}
