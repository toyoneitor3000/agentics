"use client";

import { useRef, useEffect, useState, startTransition, useTransition } from 'react';
import { Gamepad2, VolumeX, Volume2, Heart, MessageCircle, MoreVertical, Plus, ChevronDown, Monitor, EyeOff, Music, Play, Maximize2 } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { getCinemaFeed, toggleLike } from '@/app/actions/cinema';
import { useUi } from '@/app/context/UiContext';
import { useGamepad } from '@/app/hooks/useGamepad';

// MOCK DATA FOR CATEGORIES
const CATEGORIES = [
    { title: "Tendencias Globales", id: "trending" },
    { title: "Speedlight Originals", id: "originals" },
    { title: "Build Documentaries", id: "builds" },
    { title: "Carreras Callejeras", id: "street" },
    { title: "JDM Legends", id: "jdm" }
];

export default function CinemaSocialPage() {
    const [featuredPost, setFeaturedPost] = useState<any>(null);
    const [categories, setCategories] = useState<any>({});
    const [isMuted, setIsMuted] = useState(false); // Sound ON by default (User Preference)

    // ----------------------------------------------------------------------
    // DUAL MODE ARCHITECTURE
    // ----------------------------------------------------------------------    // State for View Mode ('cinema' or 'social')
    const [viewMode, setViewMode] = useState<'cinema' | 'social'>('social'); // Default: Social (Vertical First)
    const [activeMovie, setActiveMovie] = useState<any>(null); // For Cinema Modal
    const [activeSocialPost, setActiveSocialPost] = useState<any>(null); // For Social Feed Fixed UId Data
    const [isLoading, setIsLoading] = useState(true);

    // GLOBAL UI SYNC (Replaces Local Timer)
    const { isUiVisible, resetIdleTimer, isSocialMode, setIsSocialMode, updateSettings, toggleUiVisibility } = useUi();

    // Sync View Mode with Global Context for Header Hiding
    useEffect(() => {
        setIsSocialMode(viewMode === 'social');
    }, [viewMode, setIsSocialMode]);

    // Load Data
    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true);
            try {
                const feed = await getCinemaFeed() || [];

                // 1. USE REAL DB FORMAT
                const processedFeed = feed;

                // 2. FILTERING
                const horizontalFeed = processedFeed.filter((p: any) => p.format === 'horizontal');
                const verticalFeed = processedFeed.filter((p: any) => p.format === 'vertical');

                console.log("Feed loaded:", processedFeed.length, "items");
                console.log("Horizontal:", horizontalFeed.length, "Vertical:", verticalFeed.length);

                if (verticalFeed.length > 0) {
                    setActiveSocialPost(verticalFeed[0]);
                }

                // "Featured" for Cinema is the top HORIZONTAL trending post
                if (horizontalFeed.length > 0) {
                    setFeaturedPost(horizontalFeed[0]);
                } else {
                    // Fallback if user has ONLY vertical videos
                    setFeaturedPost(processedFeed[0]);
                }

                // Distribute into categories
                setCategories({
                    all: processedFeed,
                    horizontal: horizontalFeed,
                    vertical: verticalFeed,

                    // Classic Categories (Filtered to Horizontal for Cinema Rows)
                    trending: horizontalFeed.slice(0, 5),
                    originals: horizontalFeed.slice(2, 6),
                    builds: horizontalFeed.slice(0, 3)
                });
            } catch (e) {
                console.error("Failed loading cinema feed", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, []);

    // Keyboard Navigation for Social Mode (TikTok Style)
    const socialFeedRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (viewMode !== 'social') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!socialFeedRef.current) return;

            // Arrow Down: Next Video
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                socialFeedRef.current.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
            }
            // Arrow Up: Previous Video
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                socialFeedRef.current.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [viewMode]);

    // ----------------------------------------------------------------------
    // GAMEPAD SUPPORT (8BitDo Ultimate 2C & Others)
    // ----------------------------------------------------------------------
    const { isConnected: isGamepadConnected, gamepadId } = useGamepad({
        onDown: () => {
            if (viewMode === 'social' && socialFeedRef.current) {
                // Scroll down one viewport height (Snap)
                const h = window.innerHeight;
                socialFeedRef.current.scrollBy({ top: h, behavior: 'smooth' });
                resetIdleTimer();
            }
        },
        onUp: () => {
            if (viewMode === 'social' && socialFeedRef.current) {
                // Scroll up one viewport height (Snap)
                const h = window.innerHeight;
                socialFeedRef.current.scrollBy({ top: -h, behavior: 'smooth' });
                resetIdleTimer();
            }
        },
        onSelect: () => {
            // A Button: Toggle Mute for now (or Like?)
            setIsMuted(prev => !prev);
            resetIdleTimer();
        },
        onBack: () => {
            // B Button: Close active movie if open, or switch to Social Mode if in Cinema
            if (activeMovie) {
                setActiveMovie(null);
            } else if (viewMode === 'cinema') {
                setViewMode('social');
            }
            resetIdleTimer();
        }
    });

    return (
        <div className="bg-[#050505] min-h-screen w-full relative font-sans text-white overflow-hidden selection:bg-[#FF9800] selection:text-black">

            {/* INLINE STYLES FOR LOADING ANIMATION (Copied from Preloader) */}


            {/* ----------------------------------------------------------------------
                NEW UI: STICKY SUB-HEADER (Clean, Professional, Doesn't block Logo)
                Assumes Main Navbar is approx 70px tall (h-[70px] in AppHeader). We stick below it.
            ---------------------------------------------------------------------- */}
            <div className={`fixed top-[72px] left-0 right-0 z-[140] flex items-center justify-between px-6 py-4 transition-all duration-500 ease-in-out ${viewMode === 'cinema' ? 'bg-gradient-to-b from-black/90 to-transparent' : 'bg-transparent'} ${isUiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

                {/* CENTERED TOGGLE (Now Integrated) */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <div className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-2xl">
                        <button
                            onClick={() => setViewMode('social')}
                            className={`px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${viewMode === 'social' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            Social
                        </button>
                        <button
                            onClick={() => setViewMode('cinema')}
                            className={`px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${viewMode === 'cinema' ? 'bg-[#FF9800] text-black shadow-lg shadow-[#FF9800]/20' : 'text-white/40 hover:text-white'}`}
                        >
                            Films
                        </button>
                    </div>
                </div>

                {/* RIGHT ACTION */}
                <div className="ml-auto flex items-center gap-4">
                    {/* Gamepad Indicator */}
                    {isGamepadConnected && (
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#FF9800]/20 border border-[#FF9800]/50 rounded-full text-[#FF9800] animate-pulse">
                            <Gamepad2 className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Mando Activo</span>
                        </div>
                    )}

                    <Link href="/cinema/upload" className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-[#FF9800] backdrop-blur-md rounded-full border border-white/10 text-white hover:text-black transition-all shadow-lg group">
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* =================================================================================
                MODE A: CINEMA (Netflix/YouTube Style) - Horizontal Focused, Discovery Rows
               ================================================================================= */}
            {viewMode === 'cinema' && (
                <div className="animate-in fade-in duration-500 pt-[70px]"> {/* Add Padding Top to clear Navbar area */}

                    {/* 1. HERO SECTION - STRICT 16:9 RATIO (No more full height vertical bleeds) */}
                    <div className="w-full max-w-[1800px] mx-auto relative group">
                        {/* Aspect Ratio Container */}
                        <div className="aspect-video w-full max-h-[85vh] relative bg-black overflow-hidden shadow-2xl rounded-b-3xl border-b border-white/5">
                            {featuredPost ? (
                                <AmbientCinemaPlayer
                                    post={featuredPost}
                                    isMuted={isMuted}
                                    toggleMute={() => setIsMuted(!isMuted)}
                                    onOpenFull={() => setActiveMovie(featuredPost)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                                    {/* If Loading, we can show a mini spinner here too if desired, 
                                       but the full page loader handles the initial wait. */}
                                    <div className="w-10 h-10 border-2 border-[#FF9800] border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}

                            {/* Explore Hint */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 opacity-40 animate-pulse">
                                <ChevronDown className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* 2. DISCOVERY ROWS (Only Horizontal) */}
                    <div className="relative z-10 bg-[#050505] pb-24 pt-12 min-h-screen">
                        <div className="px-4 md:px-12 space-y-12">
                            {/* We use specific filtered categories or fallbacks */}
                            <CategoryRow title="Tendencias Globales" posts={categories.trending} onPostClick={setActiveMovie} />
                            <CategoryRow title="Speedlight Originals" posts={categories.originals} onPostClick={setActiveMovie} />
                            <CategoryRow title="Build Documentaries" posts={categories.builds} onPostClick={setActiveMovie} />
                        </div>
                    </div>
                </div>
            )}


            {/* =================================================================================
                MODE B: SOCIAL (TikTok Style) - Vertical Scroll, Fullscreen Feed
               ================================================================================= */}
            {viewMode === 'social' && (
                <div className="fixed inset-0 z-10 bg-black animate-in slide-in-from-bottom-10 duration-500">

                    {/* LOADING STATE - PRELOADER VISUAL */}
                    {isLoading && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050302]">
                            <div className="relative">
                                <div className="absolute -inset-10 bg-[#FF9800]/20 blur-3xl animate-pulse"></div>
                                <Image
                                    src="/logonavbar-new.png"
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
                    )}

                    {/* FIXED OVERLAY UI (Global for Feed) */}
                    {/* Includes Gradient & Auto-Hide Logic */}
                    <div
                        className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-1000 ease-in-out ${isUiVisible ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {/* Gradient: "0 to 100 hacia abajo" - Full vertical gradient subtle */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90" />

                        {/* Safe Area Padding for Navbar */}
                        <div className="w-full h-full pb-24 md:pb-32 relative">
                            {activeSocialPost && (
                                <SocialInterface
                                    post={activeSocialPost}
                                    isMuted={isMuted}
                                    toggleMute={() => setIsMuted(!isMuted)}
                                    duration={0}
                                    toggleUiVisibility={toggleUiVisibility}
                                />
                            )}
                        </div>
                    </div>

                    {/* Feed Container - Handles Interactions to Reset Idle Timer */}
                    <div
                        ref={socialFeedRef}
                        className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar pt-[0px]"
                        onMouseMove={() => resetIdleTimer()}
                        onClick={() => resetIdleTimer()}
                        onTouchStart={() => resetIdleTimer()}
                    >
                        {/* Feed: ONLY VERTICAL POSTS. If none, show a placeholder or mix */}
                        {(categories.vertical && categories.vertical.length > 0 ? categories.vertical : []).map((post: any, i: number) => (
                            <div key={post.id} className="w-full h-[100dvh] snap-start relative border-b border-white/5">
                                <ImmersiveCinemaMode
                                    post={post}
                                    onClose={() => { }} // No close in feed mode
                                    isFeedMode={true}
                                    isMuted={isMuted}
                                    toggleMute={() => setIsMuted(!isMuted)}
                                    onView={() => setActiveSocialPost(post)}
                                />
                            </div>
                        ))}

                        {/* Empty State for Social if no verticals AND NOT loading */}
                        {!isLoading && (!categories.vertical || categories.vertical.length === 0) && (
                            <div className="h-screen flex items-center justify-center text-white/50">
                                <div className="text-center">
                                    <p>No hay contenido social vertical aún.</p>
                                    <Link href="/cinema/upload" className="text-[#FF9800] underline mt-2 block">¡Sube el primero!</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}


            {/* =================================================================================
                GLOBAL: IMMERSIVE PLAYER (For Cinema Mode expansion)
               ================================================================================= */}
            {activeMovie && viewMode === 'cinema' && (
                <ImmersiveCinemaMode
                    post={activeMovie}
                    onClose={() => setActiveMovie(null)}
                    isFeedMode={false}
                    toggleUiVisibility={toggleUiVisibility}
                />
            )}

        </div>
    );
}





// ----------------------------------------------------------------------
// SOCIAL HERO PLAYER (The Core Component)
// ----------------------------------------------------------------------
function SocialHeroPlayer({ post, isMuted, toggleMute, onOpenFull }: any) {
    const youtubeId = getYoutubeId(post.videoUrl);
    const cloudflareId = getCloudflareId(post.videoUrl || '');

    // A. CLOUDFLARE ENGINE (Premium Stream)
    if (cloudflareId) {
        return (
            <CloudflareHeroPlayer
                videoId={cloudflareId}
                post={post}
                isMuted={isMuted}
                toggleMute={toggleMute}
                onOpenFull={onOpenFull}
            />
        );
    }

    // B. YOUTUBE ENGINE (Legacy)
    if (youtubeId) {
        return (
            <YoutubeHeroPlayer
                videoId={youtubeId}
                post={post}
                isMuted={isMuted}
                toggleMute={toggleMute}
                onOpenFull={onOpenFull}
            />
        );
    }

    // C. NATIVE ENGINE (Direct MP4)
    return (
        <NativeHeroPlayer
            src={post.videoUrl}
            poster={post.poster}
            isMuted={isMuted}
            onOpenFull={onOpenFull}
            post={post}
            toggleMute={toggleMute}
        />
    );
}

// ----------------------------------------------------------------------
// ENGINE A: CLOUDFLARE PLAYER (Premium)
// ----------------------------------------------------------------------
function CloudflareHeroPlayer({ videoId, post, isMuted, toggleMute, onOpenFull }: any) {
    const [player, setPlayer] = useState<any>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isIdle, setIsIdle] = useState(false);
    const [duration, setDuration] = useState(0); // Default 0
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Prevent re-render of iframe src when isMuted changes
    const src = `https://iframe.videodelivery.net/${videoId}?autoplay=true&loop=true&muted=true&controls=false&preload=true`;

    // Initialize SDK when script is loaded
    const initPlayer = () => {
        if ((window as any).Stream && iframeRef.current && !player) {
            const streamPlayer = (window as any).Stream(iframeRef.current);
            setPlayer(streamPlayer);
            streamPlayer.muted = isMuted;

            // Get Duration
            streamPlayer.addEventListener('loadedmetadata', () => {
                setDuration(streamPlayer.duration);
            });
            // Also check immediate if already loaded
            if (streamPlayer.duration) setDuration(streamPlayer.duration);
        }
    };

    // Sync Mute State dynamically
    useEffect(() => {
        if (player) {
            player.muted = isMuted;
        }
    }, [isMuted, player]);

    // IDLE DETECTOR (Speedlight UX)
    useEffect(() => {
        const resetTimer = () => {
            setIsIdle(false);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setIsIdle(true), 2500); // 2.5s Idle
        };

        // Attach listeners to window to catch interaction even if over iframe (via bubbles if possible, or surrounding area)
        // Iframe swallows clicks, so we rely on the covering div for clicks, but mousemove works on overlay.
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('touchstart', resetTimer);
        window.addEventListener('keydown', resetTimer);

        resetTimer();

        return () => {
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('touchstart', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div className={`relative w-full h-full group bg-black overflow-hidden ${isIdle ? 'cursor-none' : 'cursor-default'}`}>
            <Script
                src="https://embed.cloudflarestream.com/embed/r4xu.fla9.latest.js"
                onLoad={initPlayer}
            />

            <iframe
                ref={iframeRef}
                src={src}
                className="w-full h-full object-cover scale-[1.02] pointer-events-none" // Pointer off to allow interactions with our overlay
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
            />

            {/* Click layer for Full Mode (Double purpose: detect idle reset AND click action) */}
            <div className="absolute inset-0 z-10 cursor-pointer" onClick={onOpenFull}></div>

            {/* Gradient Overlay - Fades out on Idle for full immersion */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none transition-opacity duration-1000 ${isIdle ? 'opacity-0' : 'opacity-90'}`}></div>

            {/* UI */}
            <SocialInterface
                post={post}
                isMuted={isMuted}
                toggleMute={toggleMute}
                onOpenFull={onOpenFull}
                isIdle={isIdle}
                duration={duration}
            />
        </div>
    );
}

// ----------------------------------------------------------------------
// ENGINE B: NATIVE PLAYER (The Goal)
// ----------------------------------------------------------------------
function NativeHeroPlayer({ src, poster, isMuted, onOpenFull, post, toggleMute }: any) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [duration, setDuration] = useState(0);

    // Sync Mute State
    useEffect(() => {
        if (videoRef.current) videoRef.current.muted = isMuted;
    }, [isMuted]);

    return (
        <div className="relative w-full h-full group bg-black">
            {/* The Raw Video - Pure & Clean */}
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                poster={poster}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onClick={onOpenFull}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            />

            {/* Cinematic Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-90 pointer-events-none"></div>

            {/* Shared Social UI */}
            <SocialInterface
                post={post}
                isMuted={isMuted}
                toggleMute={toggleMute}
                onOpenFull={onOpenFull}
                duration={duration}
            />
        </div>
    );
}

// ----------------------------------------------------------------------
// ENGINE C: YOUTUBE PLAYER (The Fallback)
// ----------------------------------------------------------------------
function YoutubeHeroPlayer({ videoId, post, isMuted, toggleMute, onOpenFull }: any) {
    const [isReady, setIsReady] = useState(false);
    const [forceReveal, setForceReveal] = useState(false);
    const [showManualPlay, setShowManualPlay] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [triggerAutoplay, setTriggerAutoplay] = useState(false);
    const [origin, setOrigin] = useState("");
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        setOrigin(window.location.origin);
        const t = setTimeout(() => setShouldLoad(true), 100);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!shouldLoad || isReady) return;
        const watchdog = setTimeout(() => {
            if (!isReady) setShowManualPlay(true);
        }, 1500);
        return () => clearTimeout(watchdog);
    }, [shouldLoad, isReady]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin.includes('youtube.com')) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.info && data.info.playerState === 1) setIsReady(true);
                } catch (e) { }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleManualPlay = () => {
        setForceReveal(true);
        setShowManualPlay(false);
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
        }
        setTriggerAutoplay(true);
    };

    const isVideoVisible = isReady || forceReveal; // Construct URL
    const start = post.startSeconds || 0;
    const trailerParams = `?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&start=${start}&end=${start + 30}&version=3&loop=1&playlist=${videoId}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1&disablekb=1&fs=0&origin=${origin}`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}${trailerParams}`;

    return (
        <div className="relative w-full h-full group overflow-hidden bg-black">

            {/* --- STUDIO SHORTCUT --- */}
            <div className="absolute top-24 right-4 md:right-8 z-[60] pointer-events-auto animate-in slide-in-from-top-5 delay-500">
                <Link
                    href="/cinema/upload"
                    className="flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-[#FF9800] backdrop-blur-md border border-white/10 hover:border-[#FF9800] rounded-full transition-all group/btn"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest group-hover/btn:text-black hidden md:block">
                        Subir Video
                    </span>
                    <Plus className="w-3 h-3 text-white group-hover/btn:text-black" />
                </Link>
            </div>

            {/* VIDEO LAYER (Always Opacity 100, just covered. Pointer events active if revealed) */}
            <div className={`absolute inset-0 z-0 bg-black`}>
                {shouldLoad && origin && (
                    <iframe
                        ref={iframeRef}
                        src={embedUrl}
                        className={`w-full h-full object-cover scale-[1.35] ${isVideoVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        title={post.title}
                    />
                )}
                {!isVideoVisible && <div className="absolute inset-0 z-10" />}
                {isVideoVisible && <div onClick={onOpenFull} className="absolute inset-0 z-10 cursor-pointer" />}
            </div>

            {!isVideoVisible && (
                <div className="absolute inset-0 z-20 pointer-events-auto">
                    <Image src={post.poster} alt={post.title} fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300">
                        {!showManualPlay ? (
                            <div className="w-12 h-12 border-4 border-white/20 border-t-[#FF9800] rounded-full animate-spin"></div>
                        ) : (
                            <button onClick={handleManualPlay} className="group relative flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer z-50 px-8 py-8">
                                <div className="absolute inset-0 bg-[#FF9800] blur-[40px] opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
                                <div className="relative w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 group-hover:border-[#FF9800] flex items-center justify-center shadow-[0_0_30px_rgba(255,152,0,0.3)] transition-all duration-300">
                                    <Play className="w-10 h-10 text-white fill-white ml-1 filter drop-shadow-lg" />
                                </div>
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white font-oswald uppercase tracking-[0.2em] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap drop-shadow-md">
                                    Iniciar
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 opacity-90 z-10 pointer-events-none"></div>
            {/* YouTube always gets benefit of doubt for now (duration 100) */}
            <SocialInterface
                post={post}
                isMuted={isMuted}
                toggleMute={toggleMute}
                onOpenFull={onOpenFull}
                duration={100}
            />
        </div>
    );
}

// ----------------------------------------------------------------------
// 3. AMBIENT CINEMA PLAYER (The Fix for Vertical Vids in Horizontal Mode)
// ----------------------------------------------------------------------
function AmbientCinemaPlayer({ post, isMuted, toggleMute, onOpenFull }: any) {
    const cloudflareId = getCloudflareId(post.videoUrl || '');
    const posterUrl = post.poster || post.thumbnail_url;

    return (
        <div className="relative w-full h-full overflow-hidden bg-black group">

            {/* LAYER 1: AMBIENT BACKGROUND (Blurred & Zoomed) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {cloudflareId ? (
                    <iframe
                        src={`https://iframe.videodelivery.net/${cloudflareId}?autoplay=true&loop=true&muted=true&controls=false`}
                        className="w-full h-full object-cover scale-150 blur-2xl opacity-40 brightness-50"
                        allow="autoplay; encrypted-media"
                    />
                ) : (
                    <div className="w-full h-full relative">
                        <Image src={posterUrl} alt="bg" fill className="object-cover blur-2xl opacity-40 brightness-50" />
                    </div>
                )}
            </div>

            {/* LAYER 2: MAIN CONTENT (Contained, Never Cropped) */}
            <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                <div className="relative w-full h-full max-w-5xl aspect-video shadow-2xl bg-black rounded-lg overflow-hidden border border-white/10 ring-1 ring-white/5">
                    {cloudflareId ? (
                        <iframe
                            src={`https://iframe.videodelivery.net/${cloudflareId}?autoplay=true&loop=true&muted=${isMuted}&controls=false`}
                            className="w-full h-full object-contain"
                            allow="autoplay; encrypted-media"
                        />
                    ) : (
                        <video
                            src={post.videoUrl}
                            poster={posterUrl}
                            autoPlay
                            loop
                            muted={isMuted}
                            className="w-full h-full object-contain"
                        />
                    )}

                    {/* CLICK TO EXPAND */}
                    <div className="absolute inset-0 z-20 cursor-pointer" onClick={onOpenFull} />
                </div>
            </div>

            {/* LAYER 3: UI OVERLAY */}
            <SocialInterface
                post={post}
                isMuted={isMuted}
                toggleMute={toggleMute}
                onOpenFull={onOpenFull}
                duration={100} // Force full controls
            />
        </div>
    );
}


// ----------------------------------------------------------------------
// CATEGORY ROW (Horizontal 16:9 for Cinema)
// ----------------------------------------------------------------------
function CategoryRow({ title, posts, onPostClick }: any) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="space-y-4 group px-2">
            <h3 className="text-white/90 font-bold text-lg md:text-xl flex items-center gap-2 font-oswald tracking-wide uppercase border-l-4 border-[#FF9800] pl-3">
                {title}
            </h3>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {posts.map((post: any) => (
                    <div
                        key={post.id}
                        onClick={() => onPostClick(post)}
                        // CHANGED: aspect-[9/16] -> aspect-video (16:9)
                        // This makes the thumbnails horizontal rectangles
                        className="flex-none w-[200px] md:w-[320px] aspect-video relative rounded-lg overflow-hidden bg-neutral-900 cursor-pointer transform hover:scale-[1.03] hover:z-10 transition-all duration-300 group/card border border-white/10 hover:border-[#FF9800] shadow-xl"
                    >
                        {/* Image: Cover ensures it fills the 16:9 box nicely */}
                        <Image
                            src={post.poster || "/placeholder-cinema.jpg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />

                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                        {/* Creator Badge (Top Left) */}
                        <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
                            <div className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md flex items-center gap-1 border border-white/5">
                                <span className="text-[9px] font-bold text-white uppercase tracking-wider">{post.creator}</span>
                            </div>
                        </div>

                        {/* Info (Bottom) */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h4 className="text-white font-bold text-sm leading-none mb-1 shadow-black drop-shadow-md truncate">{post.title}</h4>
                            <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                                <span className="flex items-center gap-1"><Play className="w-3 h-3 fill-current" /> Ver ahora</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// IMMERSIVE CINEMA MODE (The "TikTok/Netflix" Hybrid Player)
// ----------------------------------------------------------------------
// IMMERSIVE CINEMA MODE (The "TikTok/Netflix" Hybrid Player)
// ----------------------------------------------------------------------
function ImmersiveCinemaMode({ post, onClose, isFeedMode = false, isMuted = false, toggleMute, onView }: any) {
    const { isUiVisible, setIsSocialMode, resetIdleTimer, toggleUiVisibility } = useUi();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [player, setPlayer] = useState<any>(null);
    const [isReady, setIsReady] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const [showActionIcon, setShowActionIcon] = useState<string | null>(null);

    // Track visibility for keyboard shortcuts
    const [isInView, setIsInView] = useState(!isFeedMode); // Cinema mode starts true

    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const isLongPress = useRef(false);
    const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastTapTime = useRef(0);
    const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cloudflareId = getCloudflareId(post.videoUrl || '');

    // ----------------------------------------------------------------------
    // SMART SCROLL OBSERVER (The "Pause on Scroll" Logic)
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (!isFeedMode || !containerRef.current || !player) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Debug Log to see what's happening
                console.log(`Video ${post.title} visibility: around ${Math.round(entry.intersectionRatio * 100)}% | Intersecting: ${entry.isIntersecting}`);

                setIsInView(entry.isIntersecting);

                if (entry.isIntersecting) {
                    if (onView) onView();

                    const playPromise = player.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {
                            // If unmuted autoplay fails, try mute+play
                            console.log("Autoplay blocked. Retrying muted.");
                            if (player.muted === false) {
                                player.muted = true;
                                player.play().catch((e: any) => console.log("Force mute play failed", e));
                            }
                        });
                    }
                } else {
                    player.pause();
                }
            });
        }, { threshold: 0.5 }); // Lowered to 50% for better mobile detection

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [isFeedMode, player, post.title, onView]);


    // ----------------------------------------------------------------------
    // KEYBOARD CONTROL (Space to Pause)
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (!isInView || !player) return;

        const handleSpace = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Stop page scroll
                if (player.paused) { // Check if currently paused
                    player.play();
                    setShowActionIcon('unmute'); // Or play icon
                    setTimeout(() => setShowActionIcon(null), 600);
                } else {
                    player.pause();
                    setShowActionIcon('pause'); // Show pause icon
                }
            }
        };

        window.addEventListener('keydown', handleSpace);
        return () => window.removeEventListener('keydown', handleSpace);
    }, [isInView, player]);

    // ANALYTICS REF (To avoid re-triggering)
    const analyticsRef = useRef({
        hasStarted: false,
        q25: false,
        q50: false,
        q75: false,
        complete: false,
        lastHeartbeat: 0
    });

    // Setup Cloudflare Player (Standard setup code below...)
    useEffect(() => {
        if (!cloudflareId) return;
        let interval: NodeJS.Timeout;

        const init = () => {
            if (iframeRef.current && (window as any).Stream) {
                if (iframeRef.current.getAttribute('data-init') === 'true') return;
                try {
                    const sp = (window as any).Stream(iframeRef.current);
                    iframeRef.current.setAttribute('data-init', 'true');
                    setPlayer(sp);

                    // Sync Mute State
                    sp.muted = isMuted;

                    if (isFeedMode) sp.loop = true; // Loop social vids
                    else sp.loop = false; // Don't loop cinema movies

                    // --- ANALYTICS ENGINE INJECTION ---
                    // Lazy import to avoid server-side issues inside Client Component context if needed
                    // But we can import actions directly.
                    const { logWatchEvent } = require('@/app/actions/analytics');

                    sp.addEventListener('play', () => {
                        if (!analyticsRef.current.hasStarted) {
                            logWatchEvent(post.id, 'start', 0);
                            analyticsRef.current.hasStarted = true;
                        }
                    });

                    sp.addEventListener('timeupdate', () => {
                        setCurrentTime(sp.currentTime);
                        const t = sp.currentTime;
                        const d = sp.duration;
                        if (!d) return;

                        const pct = (t / d) * 100;

                        // Quartile Tracking
                        if (pct > 25 && !analyticsRef.current.q25) {
                            logWatchEvent(post.id, 'quartile_25', t);
                            analyticsRef.current.q25 = true;
                        }
                        if (pct > 50 && !analyticsRef.current.q50) {
                            logWatchEvent(post.id, 'quartile_50', t);
                            analyticsRef.current.q50 = true;
                        }
                        if (pct > 75 && !analyticsRef.current.q75) {
                            logWatchEvent(post.id, 'quartile_75', t);
                            analyticsRef.current.q75 = true;
                        }

                        // Heartbeat (Every 5 seconds)
                        // Only if playing and actively watching
                        const now = Date.now();
                        if (now - analyticsRef.current.lastHeartbeat > 5000) {
                            logWatchEvent(post.id, 'heartbeat', t);
                            analyticsRef.current.lastHeartbeat = now;
                        }
                    });

                    sp.addEventListener('durationchange', () => setDuration(sp.duration));
                    sp.addEventListener('ended', () => {
                        setIsEnded(true);
                        if (!analyticsRef.current.complete) {
                            logWatchEvent(post.id, 'complete', sp.duration);
                            analyticsRef.current.complete = true;
                        }
                    });

                    // Listen for volume change events from player to sync upstream? 
                    // (Optional, complicated for now, sticky global state is handled by parent prop)

                    // In Feed Mode, we let the Observer handle play/pause.
                    // In Cinema Mode (Modal), we auto-play immediately.
                    if (!isFeedMode) {
                        sp.play().catch(() => {
                            sp.muted = true;
                            sp.play();
                        });
                    }

                    setIsReady(true);
                    clearInterval(interval);
                } catch (e) { }
            }
        };

        if ((window as any).Stream) interval = setInterval(init, 200);
        else {
            const s = document.createElement('script');
            s.src = "https://embed.cloudflarestream.com/embed/r4xu.fla9.latest.js";
            s.onload = () => { interval = setInterval(init, 200); };
            document.body.appendChild(s);
        }
        return () => clearInterval(interval);
    }, [cloudflareId, isFeedMode, isMuted]); // Added isMuted dependency to re-sync?


    // GESTURES
    const togglePlay = () => {
        if (!player) return;
        if (player.paused) {
            player.play();
            setShowActionIcon(null);
        } else {
            player.pause();
            setShowActionIcon('pause');
        }
    };

    const handleTap = (e: any) => {
        e.stopPropagation();

        const doubleTapThreshold = 300;

        // 1. Double Tap Logic
        const now = Date.now();
        if (lastTapTime.current && (now - lastTapTime.current) < doubleTapThreshold) {
            // DOUBLE TAP DETECTED
            if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
            tapTimeoutRef.current = null;

            // Toggle Mute
            toggleMute();
            const newMuted = !isMuted;
            if (player) player.muted = newMuted;

            // Show Icon Feedback
            setShowActionIcon(newMuted ? 'mute' : 'unmute');
            setTimeout(() => setShowActionIcon(null), 800);

            lastTapTime.current = 0; // Reset
            return;
        }

        lastTapTime.current = now;

        // 2. Single Tap Logic (Debounced)
        tapTimeoutRef.current = setTimeout(() => {
            if (toggleUiVisibility) {
                if (!isUiVisible) {
                    // If hidden, just show UI
                    resetIdleTimer();
                    toggleUiVisibility();
                } else {
                    // If visible, Toggle Play/Pause
                    if (player) {
                        if (player.paused) {
                            player.play();
                            setShowActionIcon('play');
                        } else {
                            player.pause();
                            setShowActionIcon('pause');
                        }
                        setTimeout(() => setShowActionIcon(null), 600);
                        resetIdleTimer(); // Keep UI alive
                    }
                }
            }
            tapTimeoutRef.current = null;
        }, doubleTapThreshold);
    };

    // Removed handleDown/handleUp (Hold to pause caused issues)


    // Native Video Ref for fallback
    // ----------------------------------------------------------------------
    // NATIVE VIDEO ADAPTER LOGIC (Moved to top of component really, but for this patch context)
    // ----------------------------------------------------------------------
    const nativeVideoRef = useRef<HTMLVideoElement>(null);

    // Initialize Native Player Adapter
    useEffect(() => {
        if (!cloudflareId && nativeVideoRef.current) {
            const video = nativeVideoRef.current;

            // Sync initial mute state immediately to prevent "unmuted autoplay" blocking
            video.muted = isMuted;

            let playingPromise: Promise<void> | undefined;

            const adapter = {
                play: async () => {
                    try {
                        playingPromise = video.play();
                        await playingPromise;
                        playingPromise = undefined;
                    } catch (e: any) {
                        // Ignore AbortError - this happens when pause() is called while play is pending (e.g. fast scroll)
                        if (e.name === 'AbortError') {
                            playingPromise = undefined;
                            return;
                        }

                        console.warn("Native Play Interrupted/Failed", e);
                        // Auto-recover if it was a permission issue by muting
                        if (!video.muted) {
                            video.muted = true;
                            // Retry play muted
                            try {
                                playingPromise = video.play();
                                await playingPromise;
                            } catch (retryErr) {
                                console.error("Recovery failed", retryErr);
                            }
                            playingPromise = undefined;
                        }
                    }
                },
                pause: () => {
                    if (playingPromise !== undefined) {
                        playingPromise.then(() => {
                            video.pause();
                        }).catch(() => {
                            // If play failed, we don't need to pause really, but let's be safe
                            video.pause()
                        });
                    } else {
                        video.pause();
                    }
                },
                get muted() { return video.muted; },
                set muted(val: boolean) { video.muted = val; },
                get currentTime() { return video.currentTime; },
                get duration() { return video.duration; },
                get paused() { return video.paused; }
            };
            setPlayer(adapter);
        }
    }, [cloudflareId, isMuted]); // Re-run if mute preference changes (to sync ref) OR handle inside. Actually isMuted change should just update video.muted. 
    // Optimization: Don't recreate adapter on isMuted change. Just sync props.

    // SYNC MUTE PROP TO NATIVE REF
    useEffect(() => {
        if (nativeVideoRef.current) {
            nativeVideoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // FORCE READY STATE (Fix for persistent spinner)
    useEffect(() => {
        // If native video exists, we can consider it ready faster
        if (!cloudflareId && nativeVideoRef.current) {
            const t = setTimeout(() => setIsReady(true), 500); // Force ready after 500ms for responsiveness
            return () => clearTimeout(t);
        }
        // Fallback safety
        const safety = setTimeout(() => setIsReady(true), 3000);
        return () => clearTimeout(safety);
    }, [cloudflareId]);

    return (
        <div ref={containerRef} className="w-full h-full bg-black relative overflow-hidden group">

            {/* 1. END SCREEN (Cinema Mode Only) */}
            {isEnded && !isFeedMode && (
                <div className="absolute inset-0 z-[150] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
                    <h3 className="text-2xl font-oswald text-white mb-6 uppercase">A continuación</h3>
                    <div className="flex gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-32 h-48 bg-white/10 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                    <button onClick={onClose} className="mt-8 text-white/50 hover:text-white underline">Volver al Catálogo</button>
                </div>
            )}

            {/* 2. LOADING SPINNER - Show if video is NOT ready and NOT timed out */}
            {!isReady && !player?.paused && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 pointer-events-none">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-[#FF9800] rounded-full animate-spin" />
                </div>
            )}

            {/* MANUAL PLAY TRIGGER - Force Show if Paused (Critical for Mobile/Browser Autoplay Block) */}
            {/* We use a simple boolean flag 'isPaused' synced with state or ref to be 100% sure */}
            {player?.paused && (
                <div
                    className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer bg-black/10 hover:bg-black/30 transition-colors group"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Force Mute on First Play to satisfy Autoplay Policies if needed, 
                        // but normally user interaction (click) allows unmuted.
                        player.play().catch((e: any) => {
                            console.log("Autoplay blocked, trying muted...", e);
                            player.muted = true;
                            player.play();
                        });
                    }}
                >
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                </div>
            )}

            {/* 3. FEEDBACK ICONS */}
            {showActionIcon && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-out duration-500">
                    <div className="bg-black/40 backdrop-blur-md p-4 rounded-full text-white">
                        {showActionIcon === 'pause' && <div className="flex gap-1"><div className="w-2 h-6 bg-white rounded-full" /><div className="w-2 h-6 bg-white rounded-full" /></div>}
                        {showActionIcon === 'mute' && <VolumeX className="w-8 h-8" />}
                        {showActionIcon === 'unmute' && <Volume2 className="w-8 h-8" />}
                    </div>
                </div>
            )}

            <div
                className="w-full h-full select-none"
                onContextMenu={(e) => e.preventDefault()}
                onClick={handleTap}
            >
                {cloudflareId ? (
                    <iframe
                        ref={iframeRef}
                        // Only autoplay in Cinema Mode. In Feed Mode, the Observer handles play/pause.
                        // Pass 'muted' param BUT Cloudflare JS API (sp.muted) takes precedence after load
                        src={`https://iframe.videodelivery.net/${cloudflareId}?autoplay=${!isFeedMode}&loop=${isFeedMode}&muted=${isMuted}&controls=false`}
                        className={`w-full h-full pointer-events-none ${post.format === 'vertical' ? 'object-cover md:object-contain' : 'object-contain'}`}
                    />
                ) : (
                    // NATIVE FALLBACK (For non-Cloudflare URLs)
                    // We use explicit <source> tags to hint the browser about the format, 
                    // which helps when the server (Supabase) returns a generic/wrong Content-Type (like application/octet-stream)
                    // for videos uploaded previously with issues.
                    <video
                        key={post.videoUrl} // Force recreation if URL changes
                        ref={nativeVideoRef}
                        className={`w-full h-full pointer-events-none ${post.format === 'vertical' ? 'object-cover md:object-contain' : 'object-contain'}`}
                        poster={post.poster}
                        preload="auto"
                        // crossOrigin="anonymous" // Removed to prevent strict CORS blocks on Supabase/GCS
                        autoPlay={false} // ALWAYS controlled by Observer in Feed Mode
                        loop={isFeedMode}
                        muted={isMuted}
                        playsInline
                        onTimeUpdate={(e) => {
                            setCurrentTime(e.currentTarget.currentTime);
                            if (e.currentTarget.currentTime > 0.1) setIsReady(true);
                        }}
                        onLoadedMetadata={(e) => {
                            setDuration(e.currentTarget.duration);
                            // Don't set ready here, wait for buffer
                        }}
                        onCanPlay={() => setIsReady(true)} // Better signal
                        onEnded={() => setIsEnded(true)}
                        onError={(e) => {
                            // React bubbles 'error' events from <source> tags, 
                            // but at that point the <video> element itself might not have an error yet (it tries the next source).
                            // We only care if the VIDEO element itself has failed.
                            const target = e.target as HTMLElement;
                            if (target.tagName === 'SOURCE') {
                                return;
                            }
                            if (e.currentTarget.error) {
                                console.error("Native Video Error:", e.currentTarget.error, "URL:", post.videoUrl);
                            }
                        }}
                    >
                        <source src={post.videoUrl} type="video/mp4" />
                        <source src={post.videoUrl} type="video/quicktime" />
                        <source src={post.videoUrl} /> {/* Fallback catch-all */}
                    </video>
                )}
            </div>

            {/* 5. OVERLAYS (Cinema Mode Controls - Only visible if UI is active and NOT feed mode) */}
            {!isFeedMode && (
                <div className={`absolute inset-x-0 bottom-0 p-6 pt-20 bg-gradient-to-t from-black/90 to-transparent pointer-events-none transition-opacity duration-300 ${isUiVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="pointer-events-auto">
                        <h3 className="text-xl font-bold font-oswald uppercase text-white mb-1">{post.title}</h3>
                        <p className="text-white/70 text-xs line-clamp-2 max-w-md mb-4">{post.description}</p>

                        {/* Progress Bar only for direct control mode */}
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-[#FF9800]" style={{ width: `${(currentTime / duration) * 100}%` }} />
                        </div>
                    </div>
                </div>
            )}



        </div >
    );
}

// ----------------------------------------------------------------------
// 2. SOCIAL INTERFACE (Overlay UI for TikTok/Reels style)
// ----------------------------------------------------------------------

function SocialInterface({ post, isMuted, toggleMute, onOpenFull, duration, toggleUiVisibility }: any) {
    const [liked, setLiked] = useState(post.liked_by_user || false);
    const [saved, setSaved] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);

    const [following, setFollowing] = useState(post.isFollowing || false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setLiked(post.liked_by_user);
        setLikeCount(post.likes);
        setFollowing(post.isFollowing);
    }, [post.liked_by_user, post.likes, post.isFollowing]);

    const handleFollow = (e: any) => {
        e.stopPropagation();
        if (!post.creatorId) return;

        const newState = !following;
        setFollowing(newState); // Optimistic

        startTransition(async () => {
            try {
                const { toggleFollow } = await import('@/app/actions/social');
                await toggleFollow(post.creatorId);
            } catch (err) {
                console.error("Follow failed", err);
                setFollowing(!newState); // Revert
            }
        });
    };

    const handleLike = async (e: any) => {
        e.stopPropagation();

        // Optimistic
        const failState = { liked, likeCount };
        const newLiked = !liked;
        setLiked(newLiked);
        setLikeCount((prev: number) => newLiked ? prev + 1 : prev - 1);

        try {
            const res = await toggleLike(post.id);
            if (res?.error) {
                // Revert
                setLiked(failState.liked);
                setLikeCount(failState.likeCount);
            }
        } catch (err) {
            setLiked(failState.liked);
            setLikeCount(failState.likeCount);
        }
    };

    const handleSave = (e: any) => {
        e.stopPropagation();
        setSaved(!saved);
    };

    const handleShare = async (e: any) => {
        e.stopPropagation();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: `Mira este video increíble en Speedlight: ${post.title}`,
                    url: window.location.href
                });
            } catch (err) { console.log('Share error:', err); }
        } else {
            alert('Enlace copiado al portapapeles');
        }
    };

    return (
        <div className="w-full h-full pointer-events-none z-20 flex flex-col justify-between">

            {/* TOP BAR: Transparent */}
            <div className="w-full p-4 flex justify-end items-start"> {/* INCREASED TOP PADDING TO CLEAR GLOBAL HEADER */}
                {/* Mute button moved to bottom right */}
            </div>

            {/* BOTTOM AREA: Actions & Info */}
            <div className={`w-full flex items-end justify-between px-4 pb-4`}> {/* Raised PB to clear Nav */}

                {/* LEFT: INFO */}
                <div className="flex-1 mr-12 pointer-events-auto text-shadow-sm">
                    <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-white overflow-hidden relative mr-2 shrink-0">
                            {post.avatar ? <Image src={post.avatar} alt="u" fill className="object-cover" /> : null}
                        </div>
                        <span className="font-bold text-sm text-white drop-shadow-md truncate max-w-[120px] mr-3">
                            {post.creator || 'SpeedlightUser'}
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleFollow}
                                disabled={isPending}
                                className={`px-3 py-1 rounded text-[10px] font-bold uppercase border transition-all ${following
                                    ? 'bg-white text-black border-white hover:bg-white/90'
                                    : 'bg-transparent text-white border-white/40 hover:bg-white/10 hover:border-white'
                                    }`}
                            >
                                {following ? 'Siguiendo' : 'Seguir'}
                            </button>

                            {/* HIDE UI BUTTON (YouTube Style) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); if (toggleUiVisibility) toggleUiVisibility(); }}
                                className="w-8 h-6 border border-white/40 rounded flex items-center justify-center hover:bg-white/10 hover:border-white transition-colors"
                                title="Modo Inmersivo"
                            >
                                <Maximize2 className="w-3.5 h-3.5 text-white rotate-90" />
                            </button>
                        </div>
                    </div>
                    <h2 className="text-white font-bold text-base leading-tight mb-2 drop-shadow-lg line-clamp-2">{post.title}</h2>
                    <p className="text-white/80 text-xs line-clamp-2 drop-shadow-md mb-2">{post.description}</p>

                    {/* Tags / Music ticker */}
                    <div className="flex items-center gap-2 text-[10px] text-white/70">
                        <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm max-w-[200px]">
                            <span className="animate-pulse flex-shrink-0">♫</span>
                            <div className="overflow-hidden min-w-0">
                                <span className={`whitespace-nowrap ${post.music_metadata ? 'animate-marquee' : ''} inline-block`}>
                                    {post.music_metadata
                                        ? `${post.music_metadata.name} - ${post.music_metadata.artist} `
                                        : `Sonido Original - ${post.creator || 'Speedlight'}`
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: ACTIONS SIDEBAR */}
                <div className="flex flex-col items-center gap-4 pointer-events-auto">

                    {/* ... (Existing Like, Comment, Save, Share, Hide UI) ... */}

                    {/* LIKE */}
                    <button onClick={handleLike} className="flex flex-col items-center gap-1 group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${liked ? 'bg-red-500/20 text-red-500 scale-110' : 'bg-black/20 text-white hover:bg-black/40'}`}>
                            <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
                        </div>
                        <span className="text-[10px] font-bold text-white drop-shadow-md">{formatNumber(likeCount)}</span>
                    </button>

                    {/* COMMENT */}
                    <button className="flex flex-col items-center gap-1 group">
                        <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-all">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-white drop-shadow-md">{formatNumber(post.comments || 0)}</span>
                    </button>

                    {/* SAVE / BOOKMARK */}
                    <button onClick={handleSave} className="flex flex-col items-center gap-1 group">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${saved ? 'bg-[#FF9800]/20 text-[#FF9800]' : 'bg-black/20 hover:bg-black/40'}`}>
                            {saved ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                            )}
                        </div>
                        <span className="text-[10px] font-bold text-white drop-shadow-md">{saved ? 'Guardado' : 'Guardar'}</span>
                    </button>

                    {/* SHARE */}
                    <button onClick={handleShare} className="flex flex-col items-center gap-1 group">
                        <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                        </div>
                        <span className="text-[10px] font-bold text-white drop-shadow-md">Compartir</span>
                    </button>





                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// UTILITIES
// ----------------------------------------------------------------------

function formatTime(seconds: number) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

const getCloudflareId = (url: string) => {
    if (!url) return null;
    const regExp = /(?:cloudflarestream\.com|videodelivery\.net)\/([a-zA-Z0-9]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
}
