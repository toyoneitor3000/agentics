"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface UiContextType {
    isUiVisible: boolean;
    isBottomNavVisible: boolean;
    isSocialMode: boolean;
    setIsSocialMode: (value: boolean) => void;
    showDebugConsole: boolean;
    toggleDebugConsole: (value: boolean) => void;
    resetIdleTimer: () => void;
    toggleUiVisibility: () => void;
    autoHideMode: 'always' | 'cinema-only' | 'never';
    autoHideDuration: number;
    updateSettings: (mode: 'always' | 'cinema-only' | 'never', duration: number) => void;
    autoScrollEnabled: boolean;
    toggleAutoScroll: (value: boolean) => void;
}

const UiContext = createContext<UiContextType | undefined>(undefined);

export function UiProvider({ children }: { children: React.ReactNode }) {
    const [isUiVisible, setIsUiVisible] = useState(true);
    const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
    const [isSocialMode, setIsSocialMode] = useState(false);
    const [showDebugConsole, setShowDebugConsole] = useState(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);

    const [isManuallyHidden, setIsManuallyHidden] = useState(false);
    const isManuallyHiddenRef = useRef(false); // Ref to access current value in event listeners

    // Settings
    const [autoHideMode, setAutoHideMode] = useState<'always' | 'cinema-only' | 'never'>('never');
    const [autoHideDuration, setAutoHideDuration] = useState(10000);

    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const navTimerRef = useRef<NodeJS.Timeout | null>(null);

    const pathname = usePathname();
    const isCinema = pathname?.startsWith('/cinema');

    // Load Settings
    useEffect(() => {
        const savedMode = localStorage.getItem('autoHideMode');
        const savedDuration = localStorage.getItem('autoHideDuration');
        const savedDebug = localStorage.getItem('showDebugConsole');

        if (savedMode) setAutoHideMode(savedMode as any);
        if (savedDuration) setAutoHideDuration(parseInt(savedDuration));
        if (savedDebug) {
            setShowDebugConsole(savedDebug === 'true');
        } else {
            setShowDebugConsole(false);
        }

        const savedAutoScroll = localStorage.getItem('autoScrollEnabled');
        if (savedAutoScroll) setAutoScrollEnabled(savedAutoScroll === 'true');

    }, []);

    const updateSettings = (mode: 'always' | 'cinema-only' | 'never', duration: number) => {
        setAutoHideMode(mode);
        setAutoHideDuration(duration);
        localStorage.setItem('autoHideMode', mode);
        localStorage.setItem('autoHideDuration', duration.toString());
        resetIdleTimer();
    };

    const toggleDebugConsole = (value: boolean) => {
        setShowDebugConsole(value);
        localStorage.setItem('showDebugConsole', String(value));
    };

    const toggleAutoScroll = (value: boolean) => {
        setAutoScrollEnabled(value);
        localStorage.setItem('autoScrollEnabled', String(value));
    };

    const toggleUiVisibility = () => {
        setIsUiVisible(prev => {
            const newState = !prev;
            // If we are hiding it manually, set lock. If showing, clear lock.
            setIsManuallyHidden(!newState);
            isManuallyHiddenRef.current = !newState; // Sync Ref
            return newState;
        });
        setIsBottomNavVisible(prev => !prev);
    };

    const resetIdleTimer = () => {
        // If manually hidden, DO NOT show on activity (Check Ref for fresh value)
        if (isManuallyHiddenRef.current) return;

        // Always SHOW UI on activity (restore if hidden automatically)
        setIsUiVisible(true);
        setIsBottomNavVisible(true);

        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (navTimerRef.current) clearTimeout(navTimerRef.current);

        // If mode is NEVER, we stop here (don't schedule auto-hide)
        if (autoHideMode === 'never') return;

        // Determine if we should hide based on Mode and Route
        let shouldHide = false;
        if (autoHideMode === 'always') shouldHide = true;
        if (autoHideMode === 'cinema-only' && isCinema) shouldHide = true;

        if (shouldHide) {
            // General UI
            idleTimerRef.current = setTimeout(() => {
                setIsUiVisible(false);
            }, autoHideDuration);

            // Bottom Navbar
            navTimerRef.current = setTimeout(() => {
                setIsBottomNavVisible(false);
            }, autoHideDuration);
        }
    };

    // Re-run timer logic if route or settings change
    useEffect(() => {
        resetIdleTimer();
    }, [pathname, autoHideMode, autoHideDuration, isCinema]);

    useEffect(() => {
        // Removed 'scroll' so UI doesn't reappear on scroll (keeps immersive mode)
        const events = ['mousemove', 'click', 'touchstart', 'keydown'];
        const handleActivity = () => resetIdleTimer();
        events.forEach(e => window.addEventListener(e, handleActivity));
        return () => {
            events.forEach(e => window.removeEventListener(e, handleActivity));
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            if (navTimerRef.current) clearTimeout(navTimerRef.current);
        };
    }, [autoHideMode, autoHideDuration, isCinema]); // Dependencies for event listener closure

    // Reset SocialMode on navigation away from cinema
    useEffect(() => {
        if (!isCinema) setIsSocialMode(false);
    }, [pathname, isCinema]);

    return (
        <UiContext.Provider value={{
            isUiVisible,
            isBottomNavVisible,
            isSocialMode,
            setIsSocialMode,
            resetIdleTimer,
            toggleUiVisibility,
            autoHideMode,
            autoHideDuration,
            updateSettings,
            showDebugConsole,
            toggleDebugConsole,
            autoScrollEnabled,
            toggleAutoScroll
        }}>
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
