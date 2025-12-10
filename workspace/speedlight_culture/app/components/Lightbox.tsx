'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
    images: string[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export const Lightbox = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }: LightboxProps) => {

    const [showControls, setShowControls] = useState(true);
    let controlsTimeout: NodeJS.Timeout;

    // Handle Close / Exit Fullscreen
    const handleClose = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
        onClose();
    };

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;
        if (e.key === 'Escape') handleClose();
        if (e.key === 'ArrowRight') onNext();
        if (e.key === 'ArrowLeft') onPrev();
    }, [isOpen, handleClose, onNext, onPrev]); // Added handleClose to dependencies

    // Auto-hide controls effect
    const resetControlsTimer = useCallback(() => { // Made useCallback
        setShowControls(true);
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => setShowControls(false), 2000);
    }, []); // No dependencies needed for controlsTimeout as it's a local variable

    useEffect(() => {
        // Trigger fullscreen on open
        if (isOpen) {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch((err) => {
                    console.log(`Error attempting to enable fullscreen: ${err.message}`);
                });
            }
            document.body.style.overflow = 'hidden';
            resetControlsTimer();
        } else {
            document.body.style.overflow = 'auto';
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousemove', resetControlsTimer);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousemove', resetControlsTimer);
            document.body.style.overflow = 'auto';
            clearTimeout(controlsTimeout);
        };
    }, [isOpen, handleKeyDown, resetControlsTimer]); // Added resetControlsTimer to dependencies

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center">

            {/* Image Layer */}
            <div className="absolute inset-0 z-10 transition-all duration-500 ease-out">
                <Image
                    src={images[currentIndex]}
                    alt="Full Screen View"
                    fill
                    className="object-contain"
                    quality={100}
                    priority
                />
                <div className="absolute inset-0 -z-10 opacity-30 blur-3xl scale-110">
                    <Image src={images[currentIndex]} alt="blur-bg" fill className="object-cover" />
                </div>
            </div>

            {/* UI Layer */}
            <div
                className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}
            >
                {/* Top Bar - Glassmorphism Pill */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-auto animate-in slide-in-from-top-4 duration-500">
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full flex items-center gap-4 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                        <span className="text-white/80 font-medium text-sm tracking-wide font-sans">
                            {currentIndex + 1} <span className="text-white/30 mx-1">/</span> {images.length}
                        </span>
                        <div className="w-[1px] h-4 bg-white/10"></div>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleClose(); }}
                            className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Nav Buttons - VisionOS Style */}
                <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-center pointer-events-auto group" onClick={(e) => { e.stopPropagation(); onPrev(); }}>
                    <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:scale-110 group-hover:bg-white/10 transition-all cursor-pointer shadow-lg">
                        <ChevronLeft className="w-6 h-6 ml-[-2px]" />
                    </div>
                </div>

                <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-center pointer-events-auto group" onClick={(e) => { e.stopPropagation(); onNext(); }}>
                    <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:scale-110 group-hover:bg-white/10 transition-all cursor-pointer shadow-lg">
                        <ChevronRight className="w-6 h-6 mr-[-2px]" />
                    </div>
                </div>
            </div>

        </div>
    );
};
