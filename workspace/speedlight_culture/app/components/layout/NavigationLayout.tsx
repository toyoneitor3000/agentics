"use client";

import { usePathname } from "next/navigation";
import AppHeader from "./AppHeader";
import BottomNav from "./BottomNav";
import InstallPrompt from "../pwa/InstallPrompt";

export default function NavigationLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Check if we are on an auth page
    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/auth') || pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');

    if (isAuthPage) {
        return <main className="min-h-screen w-full">{children}</main>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent relative">
            {/* Universal Top Header (Fixed Top) */}
            <AppHeader />

            {/* Main Content Area */}
            <main className="flex-1 w-full min-h-screen transition-all duration-300 pt-0 pb-[100px]">
                {children}
            </main>

            {/* Universal Bottom Navigation "Island" (Fixed Bottom) */}
            <BottomNav />

            {/* PWA Install Prompt */}
            <InstallPrompt />
        </div>
    );
}
