"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Prevent scrolling while loading
        if (loading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = '';
        };
    }, [loading]);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050302] overflow-hidden transition-opacity duration-1000">
            {/* Starfield / Warp Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#FF9800] to-transparent w-1/2 origin-right"
                        style={{
                            transform: `rotate(${i * (360 / 20)}deg) translateX(100px)`,
                            animation: `warp 1.5s linear infinite`,
                            animationDelay: `${(i * 0.1) * -1}s`,
                            opacity: 0
                        }}
                    >
                    </div>
                ))}
            </div>

            {/* Burst From Center */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[1px] h-[1px] shadow-[0_0_100px_100px_rgba(255,152,0,0.1)] rounded-full animate-pulse"></div>
            </div>


            {/* Logo Wrapper */}
            <div className="relative z-10 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-1000">
                <div className="relative">
                    <div className="absolute -inset-10 bg-[#FF9800]/20 blur-3xl animate-pulse"></div>
                    <Image
                        src="/logonavbar.png"
                        alt="Speedlight Culture"
                        width={300}
                        height={100}
                        className="w-48 md:w-64 h-auto relative z-10"
                        priority
                    />
                </div>

                {/* Loading Bar */}
                <div className="w-48 h-[2px] bg-[#333] rounded-full overflow-hidden mt-8 relative">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-[#FF9800] to-transparent animate-shimmer"></div>
                </div>
            </div>

            <style jsx>{`
                @keyframes warp {
                    0% {
                        transform: rotate(var(--tw-rotate)) translateX(0px) scaleX(0.1);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.8;
                    }
                    100% {
                        transform: rotate(var(--tw-rotate)) translateX(100vw) scaleX(2);
                        opacity: 0;
                    }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 1s infinite linear;
                }
            `}</style>
        </div>
    );
}
