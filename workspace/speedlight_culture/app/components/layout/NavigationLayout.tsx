"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileNav from "./MobileNav";
import TopMobileHeader from "./TopMobileHeader";
import InstallPrompt from "../pwa/InstallPrompt";

export default function NavigationLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Check if we are on an auth page
    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/auth') || pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');

    if (isAuthPage) {
        return <main className="min-h-screen w-full">{children}</main>;
    }

    return (
        <div className="flex min-h-screen bg-[#050302]">
            {/* Desktop Sidebar (Fixed Left) */}
            <DesktopSidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

            {/* Mobile Top Header (Fixed Top) */}
            <TopMobileHeader />

            {/* Main Content Area */}
            <main className={`flex-1 w-full min-h-screen transition-all duration-300
                ${isCollapsed ? 'md:pl-[80px]' : 'md:pl-[244px]'}
                pt-[60px] pb-[80px] md:pt-0 md:pb-0`}
            >
                {children}
            </main>

            {/* Mobile Bottom Navigation (Fixed Bottom) */}
            <MobileNav />

            {/* PWA Install Prompt */}
            <InstallPrompt />
        </div>
    );
}
