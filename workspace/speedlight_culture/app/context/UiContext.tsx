"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface UiContextType {
    isUiVisible: boolean;
    isBottomNavVisible: boolean;
    isSocialMode: boolean;
    setIsSocialMode: (value: boolean) => void;
    resetIdleTimer: () => void;
}

const UiContext = createContext<UiContextType | undefined>(undefined);

export function UiProvider({ children }: { children: React.ReactNode }) {
    const [isUiVisible, setIsUiVisible] = useState(true);
    const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
    const [isSocialMode, setIsSocialMode] = useState(false);

    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const navTimerRef = useRef<NodeJS.Timeout | null>(null);

    const pathname = usePathname();

    const resetIdleTimer = () => {
        setIsUiVisible(true);
        setIsBottomNavVisible(true);

        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (navTimerRef.current) clearTimeout(navTimerRef.current);

        // General UI (Cinema Overlay, Top Header in Cinema) - 4 Seconds
        idleTimerRef.current = setTimeout(() => {
            setIsUiVisible(false);
        }, 4000);

        // Bottom Navbar - 4 Seconds
        navTimerRef.current = setTimeout(() => {
            setIsBottomNavVisible(false);
        }, 4000);
    };

    useEffect(() => {
        // Events to detect activity
        const events = ['mousemove', 'click', 'touchstart', 'keydown', 'scroll'];
        const handleActivity = () => resetIdleTimer();

        events.forEach(e => window.addEventListener(e, handleActivity));
        resetIdleTimer(); // Init

        return () => {
            events.forEach(e => window.removeEventListener(e, handleActivity));
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            if (navTimerRef.current) clearTimeout(navTimerRef.current);
        };
    }, []);

    // Always ensure UI is visible on route change
    // Also reset SocialMode to false on route change (navigation away from cinema)
    useEffect(() => {
        setIsUiVisible(true);
        setIsBottomNavVisible(true);
        setIsSocialMode(false);
        resetIdleTimer();
    }, [pathname]);

    return (
        <UiContext.Provider value={{ isUiVisible, isBottomNavVisible, isSocialMode, setIsSocialMode, resetIdleTimer }}>
            {children}
        </UiContext.Provider>
    );
}

export function useUi() {
    const context = useContext(UiContext);
    if (context === undefined) {
        throw new Error("useUi must be used within a UiProvider");
    }
    return context;
}
