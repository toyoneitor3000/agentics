"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalInit() {
    useEffect(() => {
        const runOneSignal = async () => {
            // Avoid initialization on server or if already initialized
            if (typeof window === "undefined") return;

            // Prevent init on unsupported domains (e.g. LAN IP, non-prod deploys) to avoid SDK errors
            const isProd = window.location.hostname === 'www.speedlightculture.com' || window.location.hostname === 'speedlightculture.com';

            if (!isProd) {
                console.log("OneSignal disabled in development/local");
                return;
            }

            try {
                await OneSignal.init({
                    appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "YOUR_ONESIGNAL_APP_ID_HERE",
                    // Point OneSignal to our next-pwa generated worker (which imports the OneSignal logic)
                    serviceWorkerPath: "sw.js",
                    serviceWorkerParam: { scope: "/" },
                    allowLocalhostAsSecureOrigin: true, // Helpful for local dev testing
                });

                // Automatically show prompt on first visit (optional - usually better to trigger manually)
                // OneSignal.Slidedown.promptPush(); 
            } catch (error) {
                console.error("OneSignal init error:", error);
            }
        };

        runOneSignal();
    }, []);

    return null;
}
