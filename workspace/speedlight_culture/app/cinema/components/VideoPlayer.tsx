"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import { VolumeX, Volume2 } from "lucide-react";
import { useUi } from '@/app/context/UiContext';


// --- UTILITIES ---
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

// --- COMPONENT ---
export function VideoPlayer({ post, isFeedMode, isMuted, toggleMute, onView }: any) {
    const { toggleUiVisibility, resetIdleTimer, isUiVisible } = useUi();

    // State
    const [isReady, setIsReady] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const [showActionIcon, setShowActionIcon] = useState<string | null>(null);
    const [isInView, setIsInView] = useState(!isFeedMode); // Default true if not feed
    const [player, setPlayer] = useState<any>(null); // Adapter for SDKs

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const nativeVideoRef = useRef<HTMLVideoElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const isUserPaused = useRef(false);
    const lastTapTime = useRef(0);
    const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Derived
    const cloudflareId = getCloudflareId(post.videoUrl || '');
    const youtubeId = getYoutubeId(post.videoUrl || '');

    // ----------------------------------------------------------------------
    // 1. UNIFIED PLAYBACK CONTROLLER
    // ----------------------------------------------------------------------
    const managePlayback = useCallback(async (shouldPlay: boolean) => {
        if (!shouldPlay) {
            // PAUSE
            if (nativeVideoRef.current) nativeVideoRef.current.pause();
            else if (player && typeof player.pause === 'function') player.pause();
            return;
        }

        // PLAY (Priority: Native DOM)
        if (nativeVideoRef.current && !cloudflareId && !youtubeId) {
            const v = nativeVideoRef.current;
            if (v.paused) {
                try {
                    await v.play();
                } catch (e) {
                    console.warn("Native Play Blocked", e);
                    if (!v.muted) {
                        v.muted = true;
                        try { await v.play(); } catch (err) { }
                    }
                }
            }
            return;
        }

        // PLAY (Adapter: Cloudflare/Youtube)
        if (player && typeof player.play === 'function') {
            try {
                await player.play();
            } catch (e) {
                if (player.muted === false) {
                    player.muted = true;
                    try { await player.play(); } catch (err) { }
                }
            }
        }
    }, [player, cloudflareId, youtubeId]);

    // ----------------------------------------------------------------------
    // 2. VISIBILITY OBSERVER
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (!isFeedMode || !containerRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const isVisible = entry.isIntersecting;
                setIsInView(isVisible);
                if (isVisible && onView) onView();
            });
        }, { threshold: 0.5 });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [isFeedMode, onView]);

    // ----------------------------------------------------------------------
    // 3. MASTER EFFECT (State -> Action)
    // ----------------------------------------------------------------------
    useEffect(() => {
        // Direct DOM Force for "De Una" loading
        if (isInView && nativeVideoRef.current && !cloudflareId && !youtubeId) {
            const v = nativeVideoRef.current;
            if (v.paused) v.play().catch(() => { });
        }

        const shouldPlay = isInView && !isUserPaused.current;
        managePlayback(shouldPlay);

    }, [isInView, managePlayback, cloudflareId, youtubeId]);


    // ----------------------------------------------------------------------
    // 4. INTERACTION HANDLERS (Tap, Double Tap)
    // ----------------------------------------------------------------------
    const handleTap = (e: any) => {
        e.stopPropagation();
        const now = Date.now();
        const doubleTapThreshold = 300;

        if (lastTapTime.current && (now - lastTapTime.current) < doubleTapThreshold) {
            // DOUBLE TAP -> Mute
            if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
            tapTimeoutRef.current = null;
            toggleMute();
            setShowActionIcon(!isMuted ? 'mute' : 'unmute'); // Logic inverted because toggle hasn't propogated yet? No, use current prop.
            // Actually toggleMute updates parent state. We show icon based on *intended* state. 
            // Let's simplified: 
            setShowActionIcon(isMuted ? 'unmute' : 'mute'); // If currently muted, we are unmuting.
            setTimeout(() => setShowActionIcon(null), 800);
            return;
        }

        lastTapTime.current = now;

        // SINGLE TAP -> Play/Pause
        tapTimeoutRef.current = setTimeout(() => {
            if (!isUiVisible) {
                toggleUiVisibility();
                resetIdleTimer();
            } else {
                // Toggle Play/Pause
                const target = nativeVideoRef.current || player;
                if (target) {
                    if (target.paused || (target.get && target.get('paused'))) { // YT/CF might differ, but unified logic mostly play/pause
                        managePlayback(true);
                        isUserPaused.current = false;
                        setShowActionIcon('play');
                    } else {
                        managePlayback(false);
                        isUserPaused.current = true;
                        setShowActionIcon('pause');
                    }
                    setTimeout(() => setShowActionIcon(null), 600);
                }
            }
        }, doubleTapThreshold);
    };

    // ----------------------------------------------------------------------
    // 5. CLOUDFLARE SETUP
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (!cloudflareId) return;

        // Polling to find Stream object
        const init = () => {
            if (iframeRef.current && (window as any).Stream) {
                const sp = (window as any).Stream(iframeRef.current);
                sp.muted = isMuted;
                sp.loop = isFeedMode;
                setPlayer(sp);
                setIsReady(true);

                // Sync events
                sp.addEventListener('ended', () => setIsEnded(true));
                sp.addEventListener('play', () => setIsEnded(false));
            }
        };
        const interval = setInterval(init, 500);
        return () => clearInterval(interval);
    }, [cloudflareId, isFeedMode, isMuted]);

    // ----------------------------------------------------------------------
    // RENDER
    // ----------------------------------------------------------------------
    return (
        <div
            ref={containerRef}
            className="w-full h-full bg-black relative overflow-hidden group select-none"
            onClick={handleTap}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* VIDEO LAYER */}
            {isInView && (
                <>
                    {cloudflareId ? (
                        <>
                            <Script src="https://embed.cloudflarestream.com/embed/r4xu.fla9.latest.js" />
                            <iframe
                                ref={iframeRef}
                                src={`https://iframe.videodelivery.net/${cloudflareId}?autoplay=true&loop=${isFeedMode}&muted=true&controls=false&playsinline=true&preload=true`}
                                className={`w-full h-full pointer-events-none ${post.format === 'vertical' ? 'object-cover md:object-contain' : 'object-contain'}`}
                                allow="autoplay; encrypted-media"
                            />
                        </>
                    ) : youtubeId ? (
                        <iframe
                            ref={iframeRef}
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&enablejsapi=1&playsinline=1`}
                            className="w-full h-full pointer-events-none object-cover"
                            allow="autoplay; encrypted-media"
                        />
                    ) : (
                        <video
                            ref={nativeVideoRef}
                            src={post.videoUrl}
                            poster={post.poster}
                            className={`w-full h-full pointer-events-none ${post.format === 'vertical' ? 'object-cover md:object-contain' : 'object-contain'}`}
                            autoPlay
                            loop={isFeedMode}
                            muted={isMuted}
                            playsInline
                            preload="auto"
                            onLoadedData={(e) => {
                                setIsReady(true);
                                if (isInView) e.currentTarget.play().catch(() => { });
                            }}
                            onPause={() => {
                                // Auto-resume if system paused it
                                if (isInView && !isUserPaused.current) managePlayback(true);
                            }}
                            onEnded={() => setIsEnded(true)}
                        />
                    )}
                </>
            )}

            {/* FEEDBACK ICONS */}
            {showActionIcon && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-out duration-500">
                    <div className="bg-black/40 backdrop-blur-md p-4 rounded-full text-white">
                        {showActionIcon === 'pause' && <div className="flex gap-1"><div className="w-2 h-6 bg-white rounded-full" /><div className="w-2 h-6 bg-white rounded-full" /></div>}
                        {showActionIcon === 'mute' && <VolumeX className="w-8 h-8" />}
                        {showActionIcon === 'unmute' && <Volume2 className="w-8 h-8" />}
                        {showActionIcon === 'play' && <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1" />}
                    </div>
                </div>
            )}

            {/* LOADING SPINNER (Failsafe for stalled vids) */}
            {!isReady && isInView && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 pointer-events-none">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-[#FF9800] rounded-full animate-spin" />
                </div>
            )}

            {/* UI OVERLAY MOVED TO PAGE LEVEL FOR GLOBAL ALIGNMENT */}

            {/* OVERLAY GRADIENT */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        </div>
    );
}
