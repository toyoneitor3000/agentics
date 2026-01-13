"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PageHeroProps {
    title: string;
    subtitle: string;
    description?: string;
    image: string;
    action?: {
        label: string;
        href: string;
        icon?: React.ElementType;
    };
    overlayOpacity?: number;
}

export default function PageHero({
    title,
    subtitle,
    description,
    image,
    action,
    overlayOpacity = 0.5
}: PageHeroProps) {
    return (
        <div className="relative w-full h-[60vh] md:h-[70vh] group overflow-hidden border-b border-white/10">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={image}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    alt={title}
                    priority
                />

                {/* Cinematic Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#050302]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent"></div>
            </div>

            {/* Content Content - Bottom Left */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20 pb-16 flex flex-col items-start gap-4">
                <div className="animate-in fade-in slide-in-from-left-10 duration-700">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-[#FF9800] text-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                            Speedlight
                        </span>
                        <h2 className="text-[#FF9800] text-xs font-bold uppercase tracking-[0.2em] drop-shadow-lg">
                            {subtitle}
                        </h2>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-oswald font-bold uppercase leading-[0.9] text-white drop-shadow-2xl mb-4">
                        {title}
                    </h1>

                    {description && (
                        <p className="text-white/80 text-base md:text-lg font-light mb-6 max-w-xl leading-relaxed drop-shadow-md">
                            {description}
                        </p>
                    )}

                    {action && (
                        <Link href={action.href}>
                            <button className="bg-white text-black hover:bg-[#FF9800] px-8 py-3 rounded-md font-bold text-sm uppercase tracking-widest transition-colors flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                {action.icon && <action.icon className="w-5 h-5" />}
                                {action.label}
                                {!action.icon && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
