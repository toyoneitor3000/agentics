"use client";

import { usePathname } from "next/navigation";
import AppHeader from "./AppHeader";
import BottomNav from "./BottomNav";
import InstallPrompt from "../pwa/InstallPrompt";
import OnboardingGuide from "../onboarding/OnboardingGuide";
import { UiProvider, useUi } from "../../context/UiContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isUiVisible, isBottomNavVisible, isSocialMode } = useUi();

    // Check if we are on an auth page
    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/auth') || pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');

    if (isAuthPage) {
        return <main className="min-h-screen w-full">{children}</main>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent relative">
            {/* Universal Top Header (Fixed Top) */}
            {/* User Request: Header should NEVER hide, even in Immersive Mode */}
            <div className="opacity-100 z-[60]">
                <AppHeader />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full min-h-screen transition-all duration-300 pt-0 pb-[100px]">
                {children}
            </main>

            {/* Universal Bottom Navigation "Island" (Fixed Bottom) */}
            {/* Fades out globally when idle (5s delay per user request) */}
            <div
                className={`transition-opacity duration-1000 ease-in-out ${isBottomNavVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <BottomNav />
            </div>

            {/* PWA Install Prompt */}
            <InstallPrompt />
            <OnboardingGuide />
        </div>
    );
}

export default function NavigationLayout({ children }: { children: React.ReactNode }) {
    return (
        <UiProvider>
            <LayoutContent>
                {children}
            </LayoutContent>
        </UiProvider>
    );
}
