"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string, customDict?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>('es');

    useEffect(() => {
        // Persist preference
        const saved = localStorage.getItem('language') as Language;
        if (saved) setLanguage(saved);
    }, []);

    const toggleLanguage = () => {
        const newLang = language === 'es' ? 'en' : 'es';
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
        // Dispatch custom event for non-react components if needed, or just force re-render via state
    };

    /**
     * Simple translation helper.
     * @param input The text key or generic 'es' text.
     * @param customDict Optional dictionary directly passed by component { es: "Hola", en: "Hello" }
     */
    const t = (input: string, customDict?: Record<string, string>) => {
        if (customDict) {
            return customDict[language] || customDict['es'] || input;
        }
        // Fallback or global dictionary could go here
        return input;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
