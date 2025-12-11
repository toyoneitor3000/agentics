"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Heart } from "lucide-react";

export default function TopMobileHeader() {
    return (
        <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-center items-start pt-3 pointer-events-none">
            {/* Cinematic Deep Fade Gradient */}
            <div className="absolute inset-0 h-40 bg-gradient-to-b from-black via-black/60 to-transparent z-[-1] transition-opacity duration-300" />

            {/* Logo Central Gigante (Brand Hero) */}
            <Link href="/" className="pointer-events-auto opacity-100 hover:scale-105 transition-transform duration-300 drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
                <Image
                    src="/logonavbar.png"
                    alt="Speedlight Culture"
                    width={180}
                    height={60}
                    className="w-40 h-auto object-contain filter drop-shadow-xl"
                    priority
                />
            </Link>
        </header>
    );
}
