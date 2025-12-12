"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type BackgroundMode = "static" | "slideshow";

interface BackgroundSettings {
    mode: BackgroundMode;
    staticImage: string | null;
    slideshowImages: string[];
    interval: number; // in seconds
    overlayOpacity: number; // 0 to 1
}

interface BackgroundContextType extends BackgroundSettings {
    updateSettings: (settings: Partial<BackgroundSettings>) => void;
}

const defaultSettings: BackgroundSettings = {
    mode: "slideshow",
    staticImage: null,
    slideshowImages: [
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1493238792015-fa0c63404288?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611565133618-9e5b978c4309?q=80&w=2000&auto=format&fit=crop"
    ], // Default automotive vibes
    interval: 8,
    overlayOpacity: 0.65, // More transparent so image shows, but still tinted
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<BackgroundSettings>(defaultSettings);

    useEffect(() => {
        // Load from localStorage on client mount
        const saved = localStorage.getItem("speedlight_bg_settings");
        if (saved) {
            try {
                setSettings({ ...defaultSettings, ...JSON.parse(saved) });
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
