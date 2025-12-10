'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, User } from 'lucide-react';

interface GalleryRowProps {
    title: string;
    items?: { id: string; image: string; title: string; subtitle?: string; author?: string; link?: string }[];
    isPoster?: boolean;
}

export default function GalleryRow({ title, items = [], isPoster = false }: GalleryRowProps) {
    if (!items || items.length === 0) return null;

    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="mb-12 relative group/row">
            <h3 className="text-white text-xl md:text-2xl font-bold mb-4 px-6 md:px-12 flex items-center gap-2 group-hover/row:text-[#FF9800] transition-colors cursor-pointer">
                {title} <ChevronRight className="w-5 h-5 opacity-0 group-hover/row:opacity-100 transition-opacity" />
            </h3>

            <div className="relative group">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-0 bottom-0 w-12 bg-black/50 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 text-white"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-0 bottom-0 w-12 bg-black/50 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 text-white"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 px-6 md:px-12 scrollbar-hide pb-8 snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item) => (
                        <Link key={item.id} href={item.link} className="flex-none snap-start">
                            <div
                                className={`
                                    relative transition-all duration-300 ease-out hover:scale-105 hover:z-10 origin-center
                                    ${isPoster ? 'w-[200px] aspect-[2/3]' : 'w-[300px] md:w-[400px] aspect-video'}
                                    rounded-lg overflow-hidden bg-[#222] shadow-lg group/card
                                `}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>

                                <div className="absolute bottom-0 left-0 p-4 w-full">
                                    <h4 className="text-white font-bold truncate drop-shadow-md text-sm md:text-base">{item.title}</h4>

                                    <div className="flex items-center gap-2 mt-1 text-white/60 text-xs">
                                        <User className="w-3 h-3 text-[#FF9800]" />
                                        <span className="truncate font-medium uppercase tracking-wider">{item.author}</span>
                                    </div>

                                    {item.subtitle && (
                                        <p className="text-white/40 text-[10px] mt-1 truncate">{item.subtitle}</p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
