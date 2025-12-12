"use client";

import { useBackground } from "@/app/context/BackgroundContext";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function GlobalBackground() {
    const { mode, staticImage, slideshowImages, interval, overlayOpacity } = useBackground();
    const [currentIndex, setCurrentIndex] = useState(0);

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
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">

            {/* Layer 1: Base Dark Coffee Background (Fallback) */}
            <div className="absolute inset-0 bg-[#1A0F08]" />

            {/* Layer 2: Image / Slideshow */}
            {hasImage && (
                <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
                    {/* We use key-based rendering for cross-fading or just a single image with CSS transition */}
                    {/* For a true crossfade, we might render two images, but for MVP opacity transition on single node is tricky without double buffering. 
               Let's simply render the image. For smoother slideshows, we'd need a more complex carousel component. 
               For now, simple switching. */}
                    <div
                        key={currentImage} // Key change triggers animation if we used animation, but here we just want content update. 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
                        style={{
                            backgroundImage: `url('${currentImage}')`,
                        }}
                    />
                </div>
            )}

            {/* Layer 3: Coffee Overlay (The "Liquid Glass" base tint) */}
            <div
                className="absolute inset-0 bg-[#4A2C1A]" // Lighter Coffee Color (Card/Medium Brown) for visibility
                style={{ opacity: overlayOpacity, mixBlendMode: 'multiply' }} // Multiply blends color into image better
            />

            {/* Layer 4: Satin/Glass Finish (Noise/Blur optional, but user asked for "Liquid Glass") */}
            {/* This layer provides the frosted feel over the background image before the content sits on top */}
            <div className="absolute inset-0 backdrop-blur-[2px]" />

            {/* Optional: Vignette for depth */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40" />
        </div>
    );
}
