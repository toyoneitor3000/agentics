"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type BackgroundMode = "static" | "slideshow";

interface BackgroundSettings {
    mode: BackgroundMode;
    staticImage: string | null;
    slideshowImages: string[];
    interval: number; // in seconds
    overlayOpacity: number; // 0 to 1
    themeColor: 'coffee' | 'amber' | 'emerald' | 'crimson' | 'violet';
    brightness: number; // 0.5 to 1.5
    saturation: number; // 0 to 2
}

interface BackgroundContextType extends BackgroundSettings {
    updateSettings: (settings: Partial<BackgroundSettings>) => void;
}

const defaultSettings: BackgroundSettings = {
    mode: "static",
    staticImage: null,
    slideshowImages: [],
    interval: 8,
    overlayOpacity: 0.95, // High opacity to make color dominant if there IS an image, but mainly for color
    themeColor: 'coffee',
    brightness: 1,
    saturation: 1
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<BackgroundSettings>(defaultSettings);

    useEffect(() => {
        // Load from localStorage on client mount
        const saved = localStorage.getItem("speedlight_bg_settings");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // MIGRATION: Force static mode with NO images to show only solid color
                // This cleans up any old saved background images (F1, etc)
                setSettings({
                    ...defaultSettings,
                    mode: "static",
                    staticImage: null, // FORCE: No background image
                    slideshowImages: [], // FORCE: No slideshow images
                    themeColor: (parsed.themeColor === 'cobalt') ? 'coffee' : (parsed.themeColor || 'coffee'),
                    brightness: (parsed.brightness && typeof parsed.brightness === 'number') ? parsed.brightness : 1,
                    saturation: (parsed.saturation && typeof parsed.saturation === 'number') ? parsed.saturation : 1,
                    overlayOpacity: parsed.overlayOpacity || 0.95
                });
                // Also update localStorage to remove the old images
                localStorage.setItem("speedlight_bg_settings", JSON.stringify({
                    ...defaultSettings,
                    mode: "static",
                    staticImage: null,
                    slideshowImages: [],
                    themeColor: (parsed.themeColor === 'cobalt') ? 'coffee' : (parsed.themeColor || 'coffee'),
                    brightness: (parsed.brightness && typeof parsed.brightness === 'number') ? parsed.brightness : 1,
                    saturation: (parsed.saturation && typeof parsed.saturation === 'number') ? parsed.saturation : 1
                }));
            } catch (e) {
                console.error("Failed to parse background settings", e);
            }
        }
    }, []);

    const updateSettings = (newSettings: Partial<BackgroundSettings>) => {
        setSettings((prev) => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem("speedlight_bg_settings", JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <BackgroundContext.Provider value={{ ...settings, updateSettings }}>
            {children}
        </BackgroundContext.Provider>
    );
}

export const useBackground = () => {
    const context = useContext(BackgroundContext);
    if (!context) {
        throw new Error("useBackground must be used within a BackgroundProvider");
    }
    return context;
};
