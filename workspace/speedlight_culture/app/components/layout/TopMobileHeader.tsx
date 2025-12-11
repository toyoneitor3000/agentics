"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Heart } from "lucide-react";

export default function TopMobileHeader() {
    return (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#050302]/80 backdrop-blur-xl border-b border-[#FF9800]/10 px-4 py-3 flex justify-between items-center">
            <Link href="/">
                <Image
                    src="/logonavbar.png"
                    alt="Speedlight"
                    width={120}
                    height={30}
                    className="w-auto h-7 object-contain"
                />
            </Link>

            <div className="flex items-center gap-4">
                <Link href="/notifications" className="text-[#F5E6D3] hover:text-[#FF9800]">
                    <Heart className="w-6 h-6" />
                </Link>
                <Link href="/messages" className="text-[#F5E6D3] hover:text-[#FF9800]">
                    <MessageCircle className="w-6 h-6" />
                </Link>
            </div>
        </div>
    );
}
