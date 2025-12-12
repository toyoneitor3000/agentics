"use client";

import Link from "next/link";
import Image from "next/image";
import { AdHeroSponsor } from "./AdBanners";
import { getAdByType } from "@/app/data/ads";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Footer() {
    const heroAd = getAdByType('hero_sponsor');
    const { language } = useLanguage();

    const t_footer = {
        es: {
            plans: "Planes",
            advertising: "Publicidad",
            designedBy: "Diseñado y Desarrollado por",
            in: "en Bogotá, Colombia"
        },
        en: {
            plans: "Plans",
            advertising: "Advertising",
            designedBy: "Designed and Developed by",
            in: "in Bogota, Colombia"
        }
    };

    const text = t_footer[language];

    return (
        <footer className="border-t border-[#FF9800]/10 bg-[#1A0F08]/90 backdrop-blur-lg py-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FF9800]/5 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                    <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                        <Image
                            src="/logonavbar.png"
                            alt="Speedlight Culture"
                            width={120}
                            height={40}
                            className="h-8 w-auto opacity-80"
                        />
                        <span className="text-xs tracking-[0.2em] uppercase text-[#BCAAA4]">© 2025</span>
                    </div>

                    <div className="flex gap-8">
                        <Link
                            href="https://facebook.com/speedlightautostudio"
                            className="text-xs uppercase tracking-[0.2em] text-[#BCAAA4] hover:text-[#FF9800] transition-colors relative group"
                        >
                            Facebook
                            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#FF9800] group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link
                            href="https://instagram.com/speedlight.culture"
                            className="text-xs uppercase tracking-[0.2em] text-[#BCAAA4] hover:text-[#FF9800] transition-colors relative group"
                        >
                            Instagram
                            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#FF9800] group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link
                            href="https://tiktok.com/@speedlight.culture"
                            className="text-xs uppercase tracking-[0.2em] text-[#BCAAA4] hover:text-[#FF9800] transition-colors relative group"
                        >
                            TikTok
                            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#FF9800] group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link
                            href="mailto:speedlightculture@gmail.com"
                            className="text-xs uppercase tracking-[0.2em] text-[#BCAAA4] hover:text-[#FF9800] transition-colors relative group"
                        >
                            Email
                            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#FF9800] group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link
                            href="https://wa.me/573102957754"
                            className="text-xs uppercase tracking-[0.2em] text-[#BCAAA4] hover:text-[#FF9800] transition-colors relative group"
                        >
                            WhatsApp
                            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#FF9800] group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-xs uppercase tracking-[0.2em] text-[#BCAAA4] hover:text-[#FF9800] transition-colors relative group"
                        >
                            {text.plans}
                            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#FF9800] group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link
                            href="/admin/ads"
                            className="text-xs uppercase tracking-[0.2em] text-[#BCAAA4] hover:text-[#FF9800] transition-colors relative group"
                        >
                            {text.advertising}
                            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#FF9800] group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </div>
                </div>

                <div className="border-t border-[#FF9800]/10 pt-8 flex flex-col items-center gap-4">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#BCAAA4]/60 text-center">
                        {text.designedBy} <a href="https://purrpurr.dev" target="_blank" rel="noopener noreferrer" className="text-[#FF9800] hover:text-[#FFB74D] transition-colors">purrpurr.dev</a> {text.in}.
                    </p>
                    <div className="mt-4 opacity-50 hover:opacity-100 transition-opacity">
                        <AdHeroSponsor data={heroAd} />
                    </div>
                </div>
            </div>
        </footer>
    );
}
