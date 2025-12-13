"use client";

import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, MoreVertical, Plus, Maximize, Minimize } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { getCinemaFeed } from '@/app/actions/cinema';

export default function ReelsPage() {
    const [reels, setReels] = useState<any[]>([]);
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial Data Fetch
    useEffect(() => {
        const loadReels = async () => {
            const fetchedReels = await getCinemaFeed();
            if (fetchedReels && fetchedReels.length > 0) {
                setReels(fetchedReels);
            } else {
                // Fallback to mock data if no db data
                setReels([
                    {
                        id: 'reel_1',
                        title: "Midnight Run: GT3 RS",
                        creator: "Speedlight Originals",
                        avatar: "",
                        videoUrl: "https://d2n9ha3hrkss16.cloudfront.net/uploads/stage/stage_video/58634/optimized_large_thumb_stage_video_0a574676-e13d-4c3e-8367-160133c914da.mp4",
                        poster: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop",
                        likes: 1240,
                        comments: 45,
                        description: "Probando los límites en la autopista C-47. 4K Cinemático."
                    }
                ]);
            }
        };
        loadReels();
    }, []);

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

            {/* Header Overlay - Adjusted Spacing */}
            <div className="absolute top-14 left-0 right-0 z-50 px-6 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col items-start gap-2 animate-in slide-in-from-top-4 duration-700 pointer-events-auto">
                    <div className="flex items-center gap-3">
                        {/* Title */}
                        <div className="flex flex-col">
                            <span className="bg-[#FF9800] text-black w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm mb-1">
                                Cinema
                            </span>
                            <span className="text-white text-lg font-oswald font-bold uppercase tracking-wide drop-shadow-lg leading-none">
                                Speedlight TV
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pointer-events-auto">
                    {/* Upload Button */}
                    <Link href="/cinema/upload" className="flex items-center gap-2 bg-[#FF9800] text-black px-4 py-2 rounded-full font-bold text-xs uppercase hover:bg-white transition-colors shadow-lg">
                        <Plus className="w-4 h-4" />
                        <span>Subir</span>
                    </Link>

                    <button onClick={() => setIsMuted(!isMuted)} className="text-white/80 hover:text-white bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10">
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Scroll Container */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            >
                {reels.map((reel, index) => (
                    <CinemaReel
                        key={reel.id}
                        reel={reel}
                        isActive={index === currentReelIndex}
                        isGlobalMuted={isMuted}
                    />
                ))}
            </div>
        </div>
    );
}

function CinemaReel({ reel, isActive, isGlobalMuted }: { reel: any, isActive: boolean, isGlobalMuted: boolean }) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const [isVideoReady, setIsVideoReady] = useState(false);
    const [showFullMovie, setShowFullMovie] = useState(false);
    const [imgError, setImgError] = useState(false);

    // Extract ID
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYoutubeId(reel.videoUrl);

    // Params for "Netflix-like" automated experience
    // - enablejsapi=1: Required to control quality via PostMessage
    const trailerParams = `?autoplay=1&mute=${isGlobalMuted ? 1 : 0}&controls=0&start=0&end=15&version=3&loop=1&playlist=${videoId}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`;

    const fullMovieParams = `?autoplay=1&mute=${isGlobalMuted ? 1 : 0}&controls=1&version=3&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`;

    const embedUrl = `https://www.youtube.com/embed/${videoId}${showFullMovie ? fullMovieParams : trailerParams}`;

    // Reset state when sliding away
    useEffect(() => {
        if (!isActive) {
            setShowFullMovie(false);
            setIsVideoReady(false);
        }
    }, [isActive]);

    // Handle Fullscreen Events
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFs = !!document.fullscreenElement;
            setIsFullscreen(isFs);
            // Hide controls by default when entering FS, show when exiting
            setShowControls(!isFs);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Force 4K via YouTube JS API
    const forceQuality = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            console.log("Attempting to force 4K...");
            iframeRef.current.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'setPlaybackQualityRange',
                args: ['hd2160', 'hd2160']
            }), '*');
            iframeRef.current.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'setPlaybackQuality',
                args: ['hd2160']
            }), '*');
        }
        // Delay ready state slightly to allow quality switch
        setTimeout(() => setIsVideoReady(true), 1500);
    };

    const toggleControls = () => {
        if (isFullscreen) {
            setShowControls(prev => !prev);
        }
    };

    return (
        <div
            className="h-full w-full snap-center relative flex items-center justify-center bg-black overflow-hidden"
            onClick={toggleControls}
        >

            {/* 1. LAYER: POSTER / THUMBNAIL (Always visible until video is ready) */}
            <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isVideoReady ? 'opacity-0' : 'opacity-100'}`}>
                <Image
                    src={reel.poster}
                    alt={reel.title}
                    fill
                    className="object-cover"
                    priority={isActive}
                    onError={() => setImgError(true)}
                />
                {!isVideoReady && isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 border-4 border-[#FF9800] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[#FF9800] text-[10px] font-bold uppercase tracking-widest animate-pulse">Cargando 4K...</span>
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
            </div>

            {/* 2. LAYER: YOUTUBE PLAYER (Only Load if Active) */}
            {isActive && videoId && (
                <div className={`absolute inset-0 z-10 transition-opacity duration-1000 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Overlay to block Youtube Clicks/Pause in Trailer Mode to keep "Cinema" feel */}
                    {!showFullMovie && (
                        <div
                            className="absolute inset-0 z-20 bg-transparent cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowFullMovie(true);
                            }}
                        ></div>
                    )}

                    <iframe
                        ref={iframeRef}
                        src={embedUrl}
                        className="w-full h-full object-cover scale-[1.35] pointer-events-auto" // Scale nicely covers YT black bars
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={forceQuality}
                    />
                </div>
            )}

            {/* 3. LAYER: UI OVERLAY */}
            <div className={`absolute bottom-20 left-4 right-16 z-30 transition-all duration-500 pointer-events-none 
                ${showFullMovie ? 'opacity-0 translate-y-10' : ''} 
                ${isFullscreen && !showControls ? 'opacity-0 translate-y-10' : 'opacity-100'}`
            }>
                {/* ... Metadata ... */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF9800] to-yellow-500 p-[1px]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white overflow-hidden relative">
                            {reel.avatar ? (
                                <Image src={reel.avatar} alt={reel.creator} fill className="object-cover" />
                            ) : (
                                reel.creator.charAt(0)
                            )}
                        </div>
                    </div>
                    <span className="text-white font-bold text-sm shadow-black drop-shadow-md">{reel.creator}</span>
                </div>
                <h2 className="text-white font-oswald text-2xl font-bold mb-1 drop-shadow-lg">{reel.title}</h2>
                <p className="text-white/80 text-sm font-light leading-snug drop-shadow-md line-clamp-2">{reel.description}</p>

                {/* CALL TO ACTION: WATCH FULL */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowFullMovie(true);
                    }}
                    className="mt-6 pointer-events-auto bg-white/10 hover:bg-[#FF9800] hover:text-black border border-white/20 text-white px-6 py-2.5 rounded-lg flex items-center gap-3 backdrop-blur-md transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-black translate-x-0.5" />
                    </div>
                    <div className="text-left">
                        <span className="block text-[10px] uppercase font-bold tracking-widest opacity-70">Trailer Preview</span>
                        <span className="block text-sm font-bold leading-none">Ver Película Completa</span>
                    </div>
                </button>
            </div>

            {/* Right Actions Sidebar */}
            <div className={`absolute bottom-24 right-2 z-30 flex flex-col gap-6 items-center transition-all 
                ${showFullMovie ? 'opacity-0 translate-x-10' : ''}
                ${isFullscreen && !showControls ? 'opacity-0 translate-x-10' : 'opacity-100'}`
            }>
                {/* Likes */}
                <div className="flex flex-col items-center gap-1 pointer-events-auto">
                    <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-red-500 hover:bg-white/10 transition-all">
                        <Heart className="w-6 h-6" />
                    </button>
                    <span className="text-xs text-white font-bold">{reel.likes}</span>
                </div>
                {/* Comments */}
                <div className="flex flex-col items-center gap-1 pointer-events-auto">
                    <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-[#FF9800] hover:bg-white/10 transition-all">
                        <MessageCircle className="w-6 h-6" />
                    </button>
                    <span className="text-xs text-white font-bold">{reel.comments}</span>
                </div>
                {/* Share */}
                <div className="flex flex-col items-center gap-1 pointer-events-auto">
                    <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-all">
                        <Share2 className="w-6 h-6" />
                    </button>
                    <span className="text-xs text-white font-bold">Share</span>
                </div>
                {/* Fullscreen Toggle */}
                <div className="flex flex-col items-center gap-1 pointer-events-auto">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!document.fullscreenElement) {
                                document.documentElement.requestFullscreen();
                            } else {
                                if (document.exitFullscreen) {
                                    document.exitFullscreen();
                                }
                            }
                        }}
                        className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-all"
                    >
                        {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                    </button>
                    <span className="text-xs text-white font-bold">{isFullscreen ? 'Exit' : 'Full'}</span>
                </div>
            </div>

            {/* Back Button for Full Movie Mode */}
            {showFullMovie && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowFullMovie(false);
                    }}
                    className={`absolute top-24 left-6 z-40 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold uppercase border border-white/10 hover:bg-white hover:text-black transition-colors pointer-events-auto
                    ${isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'}`}
                >
                    Volver al Feed
                </button>
            )}

            {/* Bottom Nav Placeholder (If needed, typically handled by Layout but immersive overlaps it) */}
        </div>
    );
}
