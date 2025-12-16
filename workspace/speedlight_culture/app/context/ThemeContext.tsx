
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type BackgroundTheme = 'default' | 'coffee' | 'amber' | 'emerald';

interface ThemeContextType {
    theme: BackgroundTheme;
    setTheme: (theme: BackgroundTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<BackgroundTheme>('default');

    useEffect(() => {
        const saved = localStorage.getItem('background_theme') as BackgroundTheme;
        if (saved) {
            setThemeState(saved);
        }
    }, []);

    const setTheme = (newTheme: BackgroundTheme) => {
        setThemeState(newTheme);
        localStorage.setItem('background_theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
