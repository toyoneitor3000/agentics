"use client";

import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, Plus, Star, X, Info, Maximize, Minimize, ChevronDown, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { getCinemaFeed } from '@/app/actions/cinema';

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
    const [activeMovie, setActiveMovie] = useState<any>(null); // Full movie player state
    const [isMuted, setIsMuted] = useState(true); // Sound OFF by default (Autoplay compliance)

    // Load Data
    useEffect(() => {
        const loadContent = async () => {
            const feed = await getCinemaFeed() || [];

            // "Featured" is actually just the top trending USER POST
            if (feed.length > 0) setFeaturedPost(feed[0]);

            // Distribute mock feed into categories
            setCategories({
                trending: feed.slice(0, 5),
                originals: feed.slice(2, 6),
                builds: feed.slice(0, 3),
                street: feed.slice(1, 4),
                jdm: feed.slice(0, 4)
            });
        };
        loadContent();
    }, []);

    return (
        <div className="bg-[#050505] min-h-screen w-full relative font-sans text-white overflow-x-hidden selection:bg-[#FF9800] selection:text-black">

            {/* 1. HERO SECTION: THE ACTUAL VIDEO POST (Not a Banner) */}
            <div className="relative h-[100dvh] w-full bg-black z-20 shadow-2xl">
                {featuredPost && (
                    <SocialHeroPlayer
                        post={featuredPost}
                        isMuted={isMuted}
                        toggleMute={() => setIsMuted(!isMuted)}
                        onOpenFull={() => setActiveMovie(featuredPost)}
                    />
                )}

                {/* Scroll indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-30 opacity-50 pointer-events-none">
                    <ChevronDown className="w-8 h-8 text-white" />
                </div>
            </div>

            {/* 2. DISCOVERY SECTION: USER CONTENT LIBRARY */}
            <div className="relative z-10 bg-[#050505] pb-24 pt-12">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent -mt-32 pointer-events-none"></div>

                <div className="px-4 md:px-12 space-y-12">
                    {/* Section Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2 font-oswald uppercase tracking-wide">Explora Cinema</h2>
                        <div className="h-1 w-20 bg-[#FF9800] rounded-full"></div>
                    </div>

                    {CATEGORIES.map((cat) => (
                        <CategoryRow
                            key={cat.id}
                            title={cat.title}
                            posts={categories[cat.id] || []}
                            onPostClick={(post: any) => setActiveMovie(post)}
                        />
                    ))}
                </div>
            </div>

            {/* 3. IMMERSIVE PLAYER OVERLAY (Cinema Mode) */}
            {activeMovie && (
                <ImmersiveCinemaMode
                    post={activeMovie}
                    onClose={() => setActiveMovie(null)}
                />
            )}

            {/* Header Actions (Floating always visible) */}
            <div className="fixed top-6 right-6 z-50 flex gap-4">
                <Link href="/cinema/upload" className="w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-white hover:text-[#FF9800] hover:bg-white/10 transition-colors shadow-lg group">
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                </Link>
            </div>
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
// SHARED UI COMPONENT
// ----------------------------------------------------------------------
function SocialInterface({ post, isMuted, toggleMute, onOpenFull, isIdle = false, duration = 0 }: any) {
    const showFullMovieButton = duration > 15;

    return (
        <>
            <div className={`absolute bottom-0 left-0 p-6 md:p-12 z-30 max-w-[80%] md:max-w-2xl pointer-events-none transition-all duration-700 ease-in-out ${isIdle ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}>
                <div className="space-y-4 animate-in slide-in-from-bottom-10 duration-700">
                    <div className="flex items-center gap-3 pointer-events-auto w-fit">
                        <div className="relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#FF9800] to-yellow-400">
                            <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-black">
                                <Image src={post.avatar} alt={post.creator} fill className="object-cover" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-white font-bold text-lg leading-none shadow-black drop-shadow-md">{post.creator}</h3>
                            <button className="text-[#FF9800] text-xs font-bold uppercase tracking-wider hover:text-white transition-colors text-left">
                                + Seguir
                            </button>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white font-oswald uppercase leading-tight shadow-black drop-shadow-lg mb-2">
                            {post.title}
                        </h1>
                        <p className="text-white/80 text-sm md:text-base font-light line-clamp-2 shadow-black drop-shadow-md">
                            {post.description}
                        </p>
                    </div>

                    {/* ONLY SHOW IF DURATION > 15s */}
                    {showFullMovieButton && (
                        <div className="pt-4 pointer-events-auto">
                            <button
                                onClick={onOpenFull}
                                className="group relative pl-3 pr-8 py-3 bg-white/10 hover:bg-[#FF9800] backdrop-blur-xl border border-white/20 hover:border-[#FF9800] rounded-2xl flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                                <div className="relative z-10 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    <Play className="w-4 h-4 fill-black translate-x-0.5" />
                                </div>
                                <div className="relative z-10 text-left text-white group-hover:text-black transition-colors duration-300">
                                    <span className="block text-[9px] font-black tracking-[0.2em] uppercase opacity-80 mb-0.5 group-hover:text-black/70">PELÍCULA +15s</span>
                                    <span className="block text-base font-bold leading-none uppercase tracking-wide">Ver Completa</span>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={`absolute bottom-24 right-4 md:right-8 z-30 flex flex-col gap-6 items-center pointer-events-auto transition-all duration-700 ease-in-out ${isIdle ? 'translate-x-20 opacity-0' : 'translate-x-0 opacity-100'}`}>
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:border-red-500 group-hover:text-red-500 transition-all shadow-lg">
                        <Heart className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold shadow-black drop-shadow-md">{formatNumber(post.likes)}</span>
                </div>
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:border-[#FF9800] group-hover:text-[#FF9800] transition-all shadow-lg">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold shadow-black drop-shadow-md">{post.comments}</span>
                </div>
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:bg-white/20 transition-all shadow-lg">
                        <Share2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold shadow-black drop-shadow-md">Share</span>
                </div>
                <div className="mt-4">
                    <button onClick={toggleMute} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 border border-white/10 hover:bg-white/20 transition-all">
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </>
    );
}

// ----------------------------------------------------------------------
// CATEGORY ROW (Clean, Speedlight Style)
// ----------------------------------------------------------------------
function CategoryRow({ title, posts, onPostClick }: any) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="space-y-4 group">
            <h3 className="text-white/90 font-bold text-lg md:text-xl flex items-center gap-2 font-oswald tracking-wide uppercase">
                {title}
            </h3>

            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
                {posts.map((post: any) => (
                    <div
                        key={post.id}
                        onClick={() => onPostClick(post)}
                        className="flex-none w-[200px] md:w-[260px] aspect-[9/16] relative rounded-xl overflow-hidden bg-neutral-900 cursor-pointer transform hover:scale-[1.02] hover:z-10 transition-all duration-300 group/card border border-white/5 hover:border-[#FF9800]/50 shadow-lg"
                    >
                        <Image
                            src={post.poster || "/placeholder-cinema.jpg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                        {/* Creator Overlay */}
                        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                            <div className="w-6 h-6 rounded-full bg-black/50 border border-white/20 overflow-hidden relative">
                                {post.avatar ? <Image src={post.avatar} alt="user" fill className="object-cover" /> : null}
                            </div>
                            <span className="text-[10px] font-bold text-white shadow-black drop-shadow-md">{post.creator}</span>
                        </div>

                        {/* Info Gradient */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/50 to-transparent">
                            <h4 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">{post.title}</h4>
                            <div className="flex items-center gap-3 text-[10px] text-white/60">
                                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {formatNumber(post.likes)}</span>
                                <span className="flex items-center gap-1"><Play className="w-3 h-3" /> Ver</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// IMMERSIVE CINEMA MODE (The "Full Movie" Player)
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// IMMERSIVE CINEMA MODE (The "Full Movie" Player)
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// IMMERSIVE CINEMA MODE (The "Full Movie" Player)
// ----------------------------------------------------------------------
function ImmersiveCinemaMode({ post, onClose }: any) {
    const [isIdle, setIsIdle] = useState(false);
    const [player, setPlayer] = useState<any>(null);
    const [isReady, setIsReady] = useState(false); // New explicit ready state

    // Player State
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Feedback State
    const [showActionIcon, setShowActionIcon] = useState<'play' | 'pause' | 'forward' | 'rewind' | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const youtubeId = getYoutubeId(post.videoUrl);
    const cloudflareId = getCloudflareId(post.videoUrl || '');
    const isYoutube = !!youtubeId;
    const isCloudflare = !!cloudflareId;

    // Idle Logic
    useEffect(() => {
        const resetTimer = () => {
            setIsIdle(false);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setIsIdle(true), 3000);
        };
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('keydown', resetTimer);
        resetTimer();
        return () => {
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    // ⚡️ ROBUST MANUAL SCRIPT INJECTION & INIT ⚡️
    useEffect(() => {
        if (!isCloudflare) return;

        let pollInterval: NodeJS.Timeout;

        const initSDK = () => {
            if (iframeRef.current && (window as any).Stream) {
                // Prevent Double Init
                if (iframeRef.current.getAttribute('data-init') === 'true') return;

                try {
                    console.log("⚡️ Cloudflare SDK Found. Initializing...");
                    const streamPlayer = (window as any).Stream(iframeRef.current);

                    iframeRef.current.setAttribute('data-init', 'true');
                    setPlayer(streamPlayer);

                    // Robust Listeners
                    const onTime = () => setCurrentTime(streamPlayer.currentTime);
                    const onDur = () => setDuration(streamPlayer.duration);
                    const onPlayState = () => setIsPlaying(!streamPlayer.paused);

                    streamPlayer.addEventListener('timeupdate', onTime);
                    streamPlayer.addEventListener('durationchange', onDur);
                    streamPlayer.addEventListener('loadedmetadata', onDur);
                    streamPlayer.addEventListener('play', onPlayState);
                    streamPlayer.addEventListener('pause', onPlayState);

                    // Bootup
                    if (streamPlayer.duration) setDuration(streamPlayer.duration);
                    streamPlayer.muted = false;
                    streamPlayer.play().catch((e: any) => console.log("Auto-Play Blocked via SDK:", e));

                    setIsReady(true);
                    clearInterval(pollInterval); // Init complete
                } catch (e) {
                    console.error("SDK Init Failed", e);
                }
            }
        };

        // 1. Check if script exists, if not inject it
        if (!(window as any).Stream) {
            const script = document.createElement('script');
            script.src = "https://embed.cloudflarestream.com/embed/r4xu.fla9.latest.js";
            script.async = true;
            script.onload = () => {
                // Script loaded, start polling for iframe readiness
                pollInterval = setInterval(initSDK, 200);
            };
            document.body.appendChild(script);
        } else {
            // Script already there, just poll
            pollInterval = setInterval(initSDK, 200);
        }

        // Failsafe timeout
        const failsafe = setTimeout(() => clearInterval(pollInterval), 8000);

        return () => {
            clearInterval(pollInterval);
            clearTimeout(failsafe);
        };
    }, [isCloudflare]);


    /* --- MODERN INTERACTION HANDLER --- */
    const handleSmartClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // If player isn't ready, ignore interactions to prevent frustration bugs
        if (!player && isCloudflare) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const third = width / 3;

        // DOUBLE CLICK DETECTED
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;

            // Interaction Zones
            if (x < third) {
                handleRewind();
            } else if (x > width - third) {
                handleForward();
            } else {
                // CENTER DOUBLE TAP: Just ensure playing
                togglePlay();
            }
        } else {
            // SINGLE CLICK WAIT
            clickTimeoutRef.current = setTimeout(() => {
                clickTimeoutRef.current = null;
                togglePlay(); // SINGLE -> PLAY/PAUSE
            }, 250);
        }
    };

    const triggerFeedback = (type: 'play' | 'pause' | 'forward' | 'rewind') => {
        setShowActionIcon(type);
        setTimeout(() => setShowActionIcon(null), 600);
    };

    const togglePlay = () => {
        if (!player) return;
        if (player.paused) {
            player.play();
            setIsPlaying(true); // Optimistic
            triggerFeedback('play');
        } else {
            player.pause();
            setIsPlaying(false); // Optimistic
            triggerFeedback('pause');
        }
    };

    const handleForward = () => {
        if (!player) return;
        player.currentTime = Math.min(player.currentTime + 10, duration);
        triggerFeedback('forward');
    };

    const handleRewind = () => {
        if (!player) return;
        player.currentTime = Math.max(player.currentTime - 10, 0);
        triggerFeedback('rewind');
    };

    const handleSeek = (e: any) => {
        e.stopPropagation();
        if (!player) return;
        const time = parseFloat(e.target.value);
        player.currentTime = time;
        setCurrentTime(time);
        setIsIdle(false);
    };

    // Calculate progress
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Params
    const playerParams = `?autoplay=1&mute=0&controls=0&version=3&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1&fs=0`;
    const cfSrc = `https://iframe.videodelivery.net/${cloudflareId}?autoplay=true&loop=false&muted=false&controls=false&preload=true`;

    return (
        <div ref={containerRef} className={`fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-500 ${isIdle ? 'cursor-none' : 'cursor-default'}`}>

            {/* LOADING STATE - VISIBLE UNTIL READY */}
            {isCloudflare && !isReady && (
                <div className="absolute inset-0 flex items-center justify-center z-[110] bg-black/80">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-[#FF9800] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[#FF9800] text-xs font-bold tracking-widest uppercase animate-pulse">Cargando...</span>
                    </div>
                </div>
            )}

            {/* ACTION FEEDBACK OVERLAY (Centered) */}
            {showActionIcon && (
                <div className="absolute inset-0 z-[130] flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-out duration-500">
                    <div className="w-20 h-20 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/90">
                        {showActionIcon === 'play' && <Play className="w-10 h-10 fill-current" />}
                        {showActionIcon === 'pause' && <div className="flex gap-2"><div className="w-3 h-8 bg-white rounded-sm" /><div className="w-3 h-8 bg-white rounded-sm" /></div>}
                        {showActionIcon === 'forward' && <div className="flex flex-col items-center"><div className="flex"><Play className="w-6 h-6 fill-current" /><Play className="w-6 h-6 fill-current -ml-3" /></div><span className="text-[10px] font-bold">+10s</span></div>}
                        {showActionIcon === 'rewind' && <div className="flex flex-col items-center"><div className="flex"><Play className="w-6 h-6 fill-current rotate-180" /><Play className="w-6 h-6 fill-current rotate-180 -ml-3" /></div><span className="text-[10px] font-bold">-10s</span></div>}
                    </div>
                </div>
            )}

            {/* BACK BUTTON */}
            <div className={`absolute top-6 left-6 z-[120] transition-all duration-700 ${isIdle ? '-translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                <button
                    onClick={onClose}
                    className="group flex items-center gap-3 text-white hover:text-[#FF9800] transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 hover:bg-black/40"
                >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    <span className="font-bold text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0 delay-100 block w-0 group-hover:w-auto overflow-hidden">Cerrar</span>
                </button>
            </div>

            {/* VIDEO PLAYER ENGINE + GESTURE LAYER */}
            <div className="w-full h-full relative group" onClick={handleSmartClick}>
                {/* A. CLOUDFLARE ENGINE */}
                {isCloudflare ? (
                    <iframe
                        ref={iframeRef}
                        src={cfSrc}
                        className="w-full h-full object-contain pointer-events-none" // Events handled by parent div
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen
                    />
                ) : isYoutube ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}${playerParams}`}
                        className="w-full h-full object-contain pointer-events-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video
                        src={post.videoUrl}
                        className="w-full h-full object-contain pointer-events-none"
                        autoPlay
                        loop
                    />
                )}
            </div>

            {/* MODERN PROGRESS BAR (Bottom Floating) */}
            {isCloudflare && (
                <div
                    className={`absolute bottom-8 left-8 right-8 z-[120] transition-all duration-500 ${isIdle && isPlaying ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}
                    onClick={(e) => e.stopPropagation()} // Prevent play toggle when scrubbing
                >
                    <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[10px] font-bold font-mono text-white/80">{formatTime(currentTime)}</span>
                        <span className="text-[10px] font-bold font-mono text-white/50">{formatTime(duration)}</span>
                    </div>

                    <div className="group/progress relative w-full h-1 bg-white/20 rounded-full cursor-pointer hover:h-2 transition-all duration-300">
                        <div
                            className="absolute left-0 top-0 h-full bg-[#FF9800] rounded-full relative transition-all duration-100 ease-linear" // Linear ease for smooth progress
                            style={{ width: `${progressPercent}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform" />
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function formatTime(seconds: number) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// UTILS
const getCloudflareId = (url: string) => {
    if (!url) return null;
    // Handle "watch" URLs or direct ID
    // Logic: Look for 'cloudflarestream.com/' OR 'videodelivery.net/' followed by ID
    // Example: https://watch.cloudflarestream.com/6b446a...
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
