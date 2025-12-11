"use client";

import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, MoreVertical } from 'lucide-react';
import Image from 'next/image';

// MOCK DATA FOR REELS (CINEMA QUALITY)
const REELS_DATA = [
    {
        id: 'reel_1',
        title: "Midnight Run: GT3 RS",
        creator: "Speedlight Originals",
        avatar: "",
        videoUrl: "https://d2n9ha3hrkss16.cloudfront.net/uploads/stage/stage_video/58634/optimized_large_thumb_stage_video_0a574676-e13d-4c3e-8367-160133c914da.mp4", // Placeholder for demo, ideally real video
        poster: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop",
        likes: 1240,
        comments: 45,
        description: "Probando los límites en la autopista C-47. 4K Cinemático."
    },
    {
        id: 'reel_2',
        title: "Japanese Soul: R34 GTR",
        creator: "JDM Legends",
        avatar: "",
        videoUrl: "",
        poster: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?q=80&w=2072&auto=format&fit=crop",
        likes: 890,
        comments: 120,
        description: "Puro sonido. Sin música. Solo la bondad del RB26DETT."
    },
    {
        id: 'reel_3',
        title: "Drift Day Highlights",
        creator: "Track Junkies",
        avatar: "",
        videoUrl: "",
        poster: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop",
        likes: 3500,
        comments: 210,
        description: "Quema llanta, no tu alma. Los mejores ángulos del domingo."
    }
];

export default function ReelsPage() {
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle Scroll Snap Logic
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const index = Math.round(container.scrollTop / container.clientHeight);
            if (index !== currentReelIndex) {
                setCurrentReelIndex(index);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [currentReelIndex]);


    return (
        <div className="bg-black h-[100dvh] w-full overflow-hidden relative">

            {/* Header Overlay - Reference Style */}
            <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
                <div className="flex flex-col items-start gap-2 animate-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-2">
                        <span className="bg-[#FF9800] text-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                            Cinema
                        </span>
                        <span className="text-[#FF9800] text-[10px] font-bold uppercase tracking-[0.2em] drop-shadow-lg">
                            The Collection
                        </span>
                    </div>
                </div>

                <button onClick={() => setIsMuted(!isMuted)} className="text-white/80 hover:text-white pointer-events-auto mt-2 bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/10">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
            </div>

            {/* Scroll Container */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            >
                {REELS_DATA.map((reel, index) => (
                    <div key={reel.id} className="h-full w-full snap-center relative flex items-center justify-center bg-[#111]">

                        {/* Video Layer (Placeholder Image for now) */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={reel.poster}
                                alt={reel.title}
                                fill
                                className="object-cover opacity-60"
                                priority={index === 0}
                            />
                            {/* Cinematic Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>

                            {/* Play Button Center (Simulated Paused State) */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 animate-pulse">
                                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                                </div>
                            </div>
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-20 left-4 right-16 z-20">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF9800] to-yellow-500 p-[1px]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white">
                                        {reel.creator.charAt(0)}
                                    </div>
                                </div>
                                <span className="text-white font-bold text-sm shadow-black drop-shadow-md">{reel.creator}</span>
                                <button className="px-2 py-0.5 border border-white/30 rounded text-[10px] text-white font-bold uppercase backdrop-blur-md">Seguir</button>
                            </div>
                            <h2 className="text-white font-oswald text-2xl font-bold mb-1 drop-shadow-lg">{reel.title}</h2>
                            <p className="text-white/80 text-sm font-light leading-snug drop-shadow-md">{reel.description}</p>

                            {/* Music/Audio Track Mockup */}
                            <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                                <div className="w-3 h-3 bg-white/20"></div> {/* Music Note Icon */}
                                <span className="marquee">Audio Original - {reel.creator}</span>
                            </div>
                        </div>

                        {/* Right Actions Sidebar */}
                        <div className="absolute bottom-24 right-2 z-30 flex flex-col gap-6 items-center">
                            <div className="flex flex-col items-center gap-1">
                                <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-red-500 hover:bg-white/10 transition-all">
                                    <Heart className="w-6 h-6" />
                                </button>
                                <span className="text-xs text-white font-bold">{reel.likes}</span>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-[#FF9800] hover:bg-white/10 transition-all">
                                    <MessageCircle className="w-6 h-6" />
                                </button>
                                <span className="text-xs text-white font-bold">{reel.comments}</span>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                    <Share2 className="w-6 h-6" />
                                </button>
                                <span className="text-xs text-white font-bold">Compartir</span>
                            </div>

                            <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-all mt-2">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            {/* Bottom Nav Placeholder (If needed, typically handled by Layout but immersive overlaps it) */}
        </div>
    );
}
