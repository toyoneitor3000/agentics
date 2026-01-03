"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import { VolumeX, Volume2, Play } from "lucide-react";
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

    // === STATE ===
    // `hasActuallyPlayed` is THE KEY: Only true when video.currentTime > 0.1
    // This guarantees we're showing actual video frames, not a black screen.
    const [hasActuallyPlayed, setHasActuallyPlayed] = useState(false);

    // `isBlocked` means autoplay was blocked and user MUST tap to play
    const [isBlocked, setIsBlocked] = useState(false);

    // `isAttemptingPlay` prevents race conditions from multiple .play() calls
    const [isAttemptingPlay, setIsAttemptingPlay] = useState(false);

    const [showActionIcon, setShowActionIcon] = useState<string | null>(null);
    const [isInView, setIsInView] = useState(!isFeedMode);
    const [isEnded, setIsEnded] = useState(false);

    // Cloudflare/YouTube SDK state
    const [player, setPlayer] = useState<any>(null);
    const [useNativeControls, setUseNativeControls] = useState(false);
    const [iframeReady, setIframeReady] = useState(false);
    const initAttempts = useRef(0);

    // === REFS ===
    const containerRef = useRef<HTMLDivElement>(null);
    const nativeVideoRef = useRef<HTMLVideoElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const isUserPaused = useRef(false);
    const lastTapTime = useRef(0);
    const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const playPromiseRef = useRef<Promise<void> | null>(null);

    // === DERIVED ===
    const cloudflareId = getCloudflareId(post.videoUrl || '');
    const youtubeId = getYoutubeId(post.videoUrl || '');
    const posterUrl = post.poster || post.thumbnail_url || null;
    const isNativeVideo = !cloudflareId && !youtubeId;

    // === SHOW POSTER LOGIC ===
    // Poster is visible UNTIL we have confirmed video playback
    // For Cloudflare/YouTube, we trust iframe handles this, so poster hides on iframeReady
    // For native video, poster hides only when hasActuallyPlayed is true
    const shouldShowPoster = isNativeVideo
        ? (!hasActuallyPlayed || isBlocked)
        : (!iframeReady);

    // ----------------------------------------------------------------------
    // 1. SAFE PLAY CONTROLLER (Prevents AbortError race conditions)
    // ----------------------------------------------------------------------
    const attemptPlay = useCallback(async (videoElement: HTMLVideoElement) => {
        // Prevent concurrent .play() calls which cause AbortError
        if (isAttemptingPlay) {
            console.log('[VideoPlayer] Play already in progress, skipping');
            return;
        }

        if (!videoElement.paused) {
            console.log('[VideoPlayer] Already playing');
            return;
        }

        setIsAttemptingPlay(true);

        try {
            // Always ensure muted for autoplay compliance
            videoElement.muted = true;

            playPromiseRef.current = videoElement.play();
            await playPromiseRef.current;

            console.log('[VideoPlayer] Play succeeded');
            setIsBlocked(false);

        } catch (error: any) {
            if (error.name === 'AbortError') {
                // AbortError means a new play() was called before this finished
                // This is fine, the new call will handle it
                console.log('[VideoPlayer] Play aborted (race condition, safe to ignore)');
            } else if (error.name === 'NotAllowedError') {
                // iOS Low Power Mode or strict autoplay policy
                console.warn('[VideoPlayer] Autoplay blocked by browser policy');
                setIsBlocked(true);
            } else {
                console.error('[VideoPlayer] Play failed:', error);
                setIsBlocked(true);
            }
        } finally {
            setIsAttemptingPlay(false);
            playPromiseRef.current = null;
        }
    }, [isAttemptingPlay]);

    // ----------------------------------------------------------------------
    // 2. UNIFIED PLAYBACK CONTROLLER
    // ----------------------------------------------------------------------
    const managePlayback = useCallback(async (shouldPlay: boolean) => {
        if (!shouldPlay) {
            // === PAUSE ===
            if (nativeVideoRef.current) {
                nativeVideoRef.current.pause();
            } else if (player && typeof player.pause === 'function') {
                player.pause();
            }
            return;
        }

        // === PLAY (Native Video) ===
        if (nativeVideoRef.current && isNativeVideo) {
            await attemptPlay(nativeVideoRef.current);
            return;
        }

        // === PLAY (Cloudflare/YouTube SDK) ===
        if (player && typeof player.play === 'function') {
            try {
                player.muted = true; // Always muted for autoplay
                await player.play();
            } catch (e: any) {
                console.warn('[VideoPlayer] SDK play failed:', e);
            }
        }
    }, [player, isNativeVideo, attemptPlay]);

    // ----------------------------------------------------------------------
    // 3. VISIBILITY OBSERVER
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (!isFeedMode || !containerRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const isVisible = entry.isIntersecting;
                setIsInView(isVisible);

                if (isVisible) {
                    if (onView) onView();
                } else {
                    // Reset states when scrolling away so poster shows again on return
                    setHasActuallyPlayed(false);
                    setIsBlocked(false);
                }
            });
        }, { threshold: 0.6 }); // Slightly higher threshold for better UX

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [isFeedMode, onView]);

    // ----------------------------------------------------------------------
    // 4. MASTER EFFECT: Visibility -> Playback
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (!isInView) return;
        if (isUserPaused.current) return;

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            managePlayback(true);
        }, 100);

        return () => clearTimeout(timer);
    }, [isInView, managePlayback]);

    // ----------------------------------------------------------------------
    // 5. HANDLE MANUAL PLAY (When blocked)
    // ----------------------------------------------------------------------
    const handleManualPlay = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (nativeVideoRef.current) {
            setIsBlocked(false);
            isUserPaused.current = false;

            try {
                // User interaction allows unmuted playback
                nativeVideoRef.current.muted = isMuted;
                await nativeVideoRef.current.play();
                console.log('[VideoPlayer] Manual play succeeded');
            } catch (error) {
                console.error('[VideoPlayer] Manual play failed:', error);
                // Last resort: force muted
                nativeVideoRef.current.muted = true;
                try {
                    await nativeVideoRef.current.play();
                } catch (e) {
                    setIsBlocked(true);
                }
            }
        }
    }, [isMuted]);

    // ----------------------------------------------------------------------
    // 6. INTERACTION HANDLERS (Tap, Double Tap)
    // ----------------------------------------------------------------------
    const handleTap = (e: any) => {
        e.stopPropagation();

        // If blocked, the manual play button handles interaction
        if (isBlocked) return;

        const now = Date.now();
        const doubleTapThreshold = 300;

        if (lastTapTime.current && (now - lastTapTime.current) < doubleTapThreshold) {
            // === DOUBLE TAP -> Toggle Mute ===
            if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
            tapTimeoutRef.current = null;
            toggleMute();
            setShowActionIcon(isMuted ? 'unmute' : 'mute');
            setTimeout(() => setShowActionIcon(null), 800);
            return;
        }

        lastTapTime.current = now;

        // === SINGLE TAP -> Toggle Play/Pause or Show UI ===
        tapTimeoutRef.current = setTimeout(() => {
            if (!isUiVisible) {
                toggleUiVisibility();
                resetIdleTimer();
            } else {
                const target = nativeVideoRef.current || player;
                if (target) {
                    const isPaused = target.paused || (target.get && target.get('paused'));
                    if (isPaused) {
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
    // 7. CLOUDFLARE SETUP
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (!cloudflareId) return;

        const init = () => {
            if (iframeRef.current && (window as any).Stream) {
                const sp = (window as any).Stream(iframeRef.current);
                sp.muted = true; // Always start muted for autoplay
                sp.loop = isFeedMode;
                setPlayer(sp);

                sp.addEventListener('playing', () => {
                    setIframeReady(true);
                    setIsBlocked(false);
                });
                sp.addEventListener('ended', () => setIsEnded(true));
                sp.addEventListener('play', () => setIsEnded(false));

                return true;
            }
            return false;
        };

        const interval = setInterval(() => {
            const success = init();
            if (success) {
                clearInterval(interval);
            } else {
                initAttempts.current += 1;
                if (initAttempts.current > 20) { // ~4 seconds
                    clearInterval(interval);
                    console.warn("[VideoPlayer] Cloudflare SDK timeout, enabling native controls");
                    setUseNativeControls(true);
                    setIframeReady(true);
                }
            }
        }, 200);

        return () => clearInterval(interval);
    }, [cloudflareId, isFeedMode]);

    // ----------------------------------------------------------------------
    // 8. SYNC MUTE STATE
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (nativeVideoRef.current && isNativeVideo) {
            // Only apply mute state if video has actually started (user interacted)
            if (hasActuallyPlayed && !isBlocked) {
                nativeVideoRef.current.muted = isMuted;
            }
        }
        if (player) {
            player.muted = isMuted;
        }
    }, [isMuted, player, isNativeVideo, hasActuallyPlayed, isBlocked]);

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
            {/* === POSTER LAYER (Always visible until video plays) === */}
            {posterUrl && (
                <div
                    className={`absolute inset-0 z-[5] transition-opacity duration-500 ${shouldShowPoster ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    <Image
                        src={posterUrl}
                        alt={post.title || 'Video thumbnail'}
                        fill
                        className={`${post.format === 'vertical' ? 'object-cover md:object-contain' : 'object-contain'}`}
                        priority={isFeedMode}
                        sizes="100vw"
                    />
                </div>
            )}

            {/* === VIDEO LAYER === */}
            {isInView && (
                <>
                    {cloudflareId ? (
                        <>
                            <Script src="https://embed.cloudflarestream.com/embed/r4xu.fla9.latest.js" />
                            <iframe
                                ref={iframeRef}
                                src={`https://iframe.videodelivery.net/${cloudflareId}?autoplay=true&loop=${isFeedMode}&muted=true&controls=${useNativeControls}&playsinline=true&preload=auto&poster=${encodeURIComponent(posterUrl || '')}`}
                                className={`w-full h-full ${useNativeControls ? 'pointer-events-auto' : 'pointer-events-none'} ${post.format === 'vertical' ? 'object-cover md:object-contain' : 'object-contain'}`}
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                            />
                        </>
                    ) : youtubeId ? (
                        <iframe
                            ref={iframeRef}
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&enablejsapi=1&playsinline=1`}
                            className="w-full h-full pointer-events-none object-cover"
                            allow="autoplay; encrypted-media"
                            onLoad={() => setIframeReady(true)}
                        />
                    ) : (
                        <video
                            ref={nativeVideoRef}
                            src={post.videoUrl}
                            className={`w-full h-full pointer-events-none ${post.format === 'vertical' ? 'object-cover md:object-contain' : 'object-contain'}`}
                            autoPlay
                            loop={isFeedMode}
                            muted // Always start muted for autoplay compliance
                            playsInline
                            webkit-playsinline="true"
                            preload="auto"
                            onCanPlay={() => {
                                // Video can play, but hasn't necessarily started
                                console.log('[VideoPlayer] canplay event');
                                if (isInView && !isUserPaused.current && !isBlocked) {
                                    managePlayback(true);
                                }
                            }}
                            onTimeUpdate={(e) => {
                                // THIS IS THE KEY: Only hide poster when video is ACTUALLY playing
                                const currentTime = e.currentTarget.currentTime;
                                if (currentTime > 0.1 && !hasActuallyPlayed) {
                                    console.log('[VideoPlayer] Video confirmed playing at', currentTime);
                                    setHasActuallyPlayed(true);
                                    setIsBlocked(false);
                                }
                            }}
                            onPause={(e) => {
                                // Auto-resume only if not user-initiated and in view
                                if (isInView && !isUserPaused.current && !e.currentTarget.seeking && hasActuallyPlayed) {
                                    // Debounce to avoid rapid pause/play cycles
                                    setTimeout(() => {
                                        if (!isUserPaused.current && isInView) {
                                            managePlayback(true);
                                        }
                                    }, 100);
                                }
                            }}
                            onEnded={() => setIsEnded(true)}
                            onError={(e) => {
                                console.error('[VideoPlayer] Video error:', e);
                                setIsBlocked(true);
                            }}
                        />
                    )}
                </>
            )}

            {/* === LOADING SPINNER (Only when no poster and loading) === */}
            {isInView && !hasActuallyPlayed && !isBlocked && !posterUrl && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 pointer-events-none">
                    <div className="w-10 h-10 border-3 border-white/20 border-t-[#FF9800] rounded-full animate-spin" />
                </div>
            )}

            {/* === BLOCKED/MANUAL PLAY BUTTON (iOS Low Power Mode) === */}
            {isBlocked && isInView && (
                <div
                    className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
                    onClick={handleManualPlay}
                >
                    <div className="w-20 h-20 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-2xl hover:scale-110 active:scale-95 transition-transform animate-in zoom-in-75 duration-300">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                    <div className="absolute bottom-[30%] text-white/60 text-xs font-medium">
                        Toca para reproducir
                    </div>
                </div>
            )}

            {/* === FEEDBACK ICONS === */}
            {showActionIcon && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-out duration-500">
                    <div className="bg-black/40 backdrop-blur-md p-4 rounded-full text-white">
                        {showActionIcon === 'pause' && (
                            <div className="flex gap-1">
                                <div className="w-2 h-6 bg-white rounded-full" />
                                <div className="w-2 h-6 bg-white rounded-full" />
                            </div>
                        )}
                        {showActionIcon === 'mute' && <VolumeX className="w-8 h-8" />}
                        {showActionIcon === 'unmute' && <Volume2 className="w-8 h-8" />}
                        {showActionIcon === 'play' && (
                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                        )}
                    </div>
                </div>
            )}

            {/* === OVERLAY GRADIENT === */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-[6]" />
        </div>
    );
}
