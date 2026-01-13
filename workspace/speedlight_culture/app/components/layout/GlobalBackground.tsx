"use client";

import { useBackground } from "@/app/context/BackgroundContext";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function GlobalBackground() {
    const { mode, staticImage, slideshowImages, interval, overlayOpacity, themeColor, brightness, saturation } = useBackground();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Theme Colors
    const colors = {
        coffee: '#0D0805', // Default Dark Coffee
        amber: '#1A1400',  // Dark Amber/Ochre
        emerald: '#001A08', // Dark Racing Green

        crimson: '#1A0000', // Deep Red
        violet: '#10001A', // Deep Purple
    };

    const activeColor = colors[themeColor || 'coffee'];

    // Slideshow Logic
    useEffect(() => {
        if (mode === "slideshow" && slideshowImages.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
            }, interval * 1000);
            return () => clearInterval(timer);
        }
    }, [mode, slideshowImages, interval]);

    // Background Image Source
    const currentImage = mode === "static" ? staticImage : slideshowImages[currentIndex];
    // Fallback if no images are active
    const hasImage = !!currentImage;

    return (
        <div
            className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-all duration-300"
            style={{
                filter: `brightness(${brightness}) saturate(${saturation})`
            }}
        >

            {/* Layer 1: Base CSS Variable Background (Fallback) */}
            <div className="absolute inset-0 bg-[var(--color-bg-primary)] transition-colors duration-1000" style={{ backgroundColor: activeColor }} />

            {/* Layer 2: Image / Slideshow */}
            {hasImage && (
                <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
                    <div
                        key={currentImage}
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
                        style={{
                            backgroundImage: `url('${currentImage}')`,
                        }}
                    />
                    {/* Hard Dark Overlay for Readability */}
                    <div className="absolute inset-0 bg-black/70" />
                </div>
            )}

            {/* Layer 3: Color Overlay (Tint) */}
            <div
                className="absolute inset-0 transition-colors duration-1000"
                style={{
                    backgroundColor: activeColor,
                    opacity: overlayOpacity,
                    mixBlendMode: 'multiply'
                }}
            />

            {/* Layer 4: Floating Ambient Orbs (New) */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#FF9800] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.08] animate-float-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#D32F2F] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.06] animate-float-medium"></div>
            </div>

            {/* Layer 5: Noise Texture (New) */}
            <div className="bg-noise mix-blend-overlay"></div>

            {/* Layer 6: Satin/Glass Finish */}
            <div className="absolute inset-0 backdrop-blur-[2px]" />

            {/* Spotlight / Glow Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50 mix-blend-overlay pointer-events-none" />

            {/* Vignette for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80" />
        </div>
    );
}
