'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/app/utils/supabase/client';

export const HeroBackground = () => {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const supabase = createClient();

    useEffect(() => {
        const fetchTopPhotos = async () => {
            // 1. Try to get top liked photos
            const { data: likesData } = await supabase
                .from('photo_likes')
                .select('photo_url')
                .limit(20); // Get a pool of liked photos

            // Count occurrences to emulate the View (since we can't query views directly via client easily sometimes without setup)
            // Or just fetch random recent gallery photos as fallback

            // FALLBACK STRATEGY (Until likes populate): Fetch recent gallery photos
            const { data: albumPhotos } = await supabase
                .from('gallery_photos')
                .select('url')
                .limit(5);

            const { data: projectPhotos } = await supabase
                .from('projects')
                .select('cover_image')
                .not('cover_image', 'is', null)
                .limit(5);

            // Combine and Shuffle
            const pool = [
                ...(albumPhotos?.map(p => p.url) || []),
                ...(projectPhotos?.map(p => p.cover_image) || []),
                'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2694', // Default 1
                'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2670'  // Default 2
            ];

            // Filter duplicates and valid strings
            const uniqueImages = Array.from(new Set(pool.filter(Boolean)));
            setImages(uniqueImages);
        };

        fetchTopPhotos();
    }, []);

    // Rotation Timer
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 6000); // Change every 6 seconds

        return () => clearInterval(interval);
    }, [images]);

    if (images.length === 0) return null;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {images.map((img, idx) => (
                <div
                    key={img}
                    className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${idx === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <Image
                        src={img}
                        alt="Hero Background"
                        fill
                        className={`object-cover ${idx === currentIndex ? 'scale-110' : 'scale-100'} transition-transform duration-[6000ms] ease-out`}
                        priority={idx === 0}
                    />
                    {/* Cinematic Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
                </div>
            ))}
        </div>
    );
};
