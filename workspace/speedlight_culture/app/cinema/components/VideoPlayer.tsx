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
export function VideoPlayer({ post, isFeedMode, isActive, isMuted, toggleMute, onVideoEnd }: any) {
    const { toggleUiVisibility, resetIdleTimer, isUiVisible, autoScrollEnabled } = useUi();

    // === STATE ===
    // `hasActuallyPlayed` is THE KEY: Only true when video.currentTime > 0.1
    // This guarantees we're showing actual video frames, not a black screen.
    const [hasActuallyPlayed, setHasActuallyPlayed] = useState(false);

    // `isBlocked` means autoplay was blocked and user MUST tap to play
    const [isBlocked, setIsBlocked] = useState(false);

    // `isAttemptingPlay` converted to Ref to prevent re-render loops during play attempts
    const isAttemptingPlayRef = useRef(false);

    const [showActionIcon, setShowActionIcon] = useState<string | null>(null);
    // Use isActive prop if available (Feed Mode), otherwise default to true (Cinema Mode)
    const isInView = isFeedMode ? isActive : true;
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
    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isLongPressRef = useRef(false);
    const touchStartTimeRef = useRef(0);

    // === DERIVED ===
    const cloudflareId = getCloudflareId(post.videoUrl || '');
    const youtubeId = getYoutubeId(post.videoUrl || '');
    const posterUrl = post.poster || post.thumbnail_url || null;
    const isNativeVideo = !cloudflareId && !youtubeId;



    // Log video info on first render
    useEffect(() => {
        console.log('[VideoPlayer] Init:', {
            videoUrl: post.videoUrl,
            cloudflareId,
            youtubeId,
            isNativeVideo,
            postId: post.id,
            title: post.title?.substring(0, 30)
        });
    }, []);

    // ----------------------------------------------------------------------
    // 1. SAFE PLAY CONTROLLER (Prevents AbortError race conditions)
    // ----------------------------------------------------------------------
    const attemptPlay = useCallback(async (videoElement: HTMLVideoElement) => {
        // Prevent concurrent .play() calls which cause AbortError
        if (isAttemptingPlayRef.current) {
            console.log('[VideoPlayer] Play already in progress, skipping');
            return;
        }

        if (!videoElement.paused) {
            console.log('[VideoPlayer] Already playing');
            return;
        }

        isAttemptingPlayRef.current = true;

        try {
            // Always ensure muted for autoplay compliance initially
            videoElement.muted = true;

            playPromiseRef.current = videoElement.play();
            await playPromiseRef.current;

            console.log('[VideoPlayer] Play succeeded');
            setIsBlocked(false);

            // Immediately try to sync valid mute state
            if (!isMuted) {
                videoElement.muted = false;
            }

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
            isAttemptingPlayRef.current = false;
            playPromiseRef.current = null;
        }
    }, [isMuted]);

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
                if (!isMuted) player.muted = false; // Attempt unmute
            } catch (e: any) {
                console.warn('[VideoPlayer] SDK play failed:', e);
            }
        }
    }, [player, isNativeVideo, attemptPlay, isMuted]);

    // ----------------------------------------------------------------------
    // 3. VISIBILITY OBSERVER
    // ----------------------------------------------------------------------
    // ----------------------------------------------------------------------
    // 3. VISIBILITY OBSERVER (REMOVED - Controlled by Parent)
    // ----------------------------------------------------------------------
    // Internal observer removed to prevent iOS scroll snap flicker race conditions.
    // Parent components now determine `isActive` via global observer.

    // ----------------------------------------------------------------------
    // 4. MASTER EFFECT: Visibility -> Playback
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (!isInView) return;
        if (isUserPaused.current) return;

        // Immediate play attempt when scrolling into view
        // Relying on native autoPlay isn't enough on some devices
        if (nativeVideoRef.current && nativeVideoRef.current.paused) {
            // Defer slightly to ensure not scrolling too fast
            const timer = setTimeout(() => {
                if (isInView && !isUserPaused.current) {
                    console.log('[VideoPlayer] In view, ensuring playback');
                    managePlayback(true);
                }
            }, 50);
            return () => clearTimeout(timer);
        }

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
    // 6. INTERACTION HANDLERS (Tap, Double Tap, Long Press)
    // ----------------------------------------------------------------------
    const handleTouchStart = () => {
        isLongPressRef.current = false;
        touchStartTimeRef.current = Date.now();
        longPressTimerRef.current = setTimeout(() => {
            // LONG PRESS DETECTED
            isLongPressRef.current = true;
            toggleUiVisibility();
            // Provide haptic feedback if possible
            if (navigator.vibrate) navigator.vibrate(50);
        }, 600); // 600ms threshold
    };

    const handleTouchEnd = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    const handleTap = (e: any) => {
        // Prevent action if it was a long press
        if (isLongPressRef.current) {
            isLongPressRef.current = false;
            return;
        }

        e.stopPropagation();

        // If blocked, the manual play button handles interaction
        if (isBlocked) return;

        const now = Date.now();
        const doubleTapThreshold = 300;

        if (lastTapTime.current && (now - lastTapTime.current) < doubleTapThreshold) {
            // === DOUBLE TAP -> Toggle Play/Pause ===
            if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
            tapTimeoutRef.current = null;

            const target = nativeVideoRef.current || player;
            if (target) {
                const isPaused = target.paused || (target.get && target.get('paused'));
                if (isPaused) {
                    managePlayback(true);
                    isUserPaused.current = false;
                    setShowActionIcon('play');
                    setTimeout(() => setShowActionIcon(null), 600);
                } else {
                    managePlayback(false);
                    isUserPaused.current = true;
                    setShowActionIcon('pause');
                    setTimeout(() => setShowActionIcon(null), 600);
                }
            }
            return;
        }

        lastTapTime.current = now;

        // === SINGLE TAP ===
        // User requested that single tap does NOT exit fullscreen (show UI).
        // It stays immersive. Only Long Press brings UI back.
        // We can use single tap for Mute toggle if preferred, OR just do nothing to keep it "clean".
        // Given previous instruction "Tap or click desmutes and disappears", we keep that logic ONLY if muted?
        // Let's implement Mute Toggle on single tap for consistency with "Tap desmutes".

        tapTimeoutRef.current = setTimeout(() => {
            // Only toggle mute if we want interaction. 
            // If the user wants "Meter el video", arguably just watching is fine.
            // But let's allow Mute toggle since the button disappears.
            toggleMute();
            setShowActionIcon(isMuted ? 'unmute' : 'mute');
            setTimeout(() => setShowActionIcon(null), 600);
        }, doubleTapThreshold);
    };

    // ----------------------------------------------------------------------
    // 7. CLOUDFLARE SETUP
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (!cloudflareId) return;

        console.log('[VideoPlayer] Cloudflare video detected, ID:', cloudflareId);

        const init = () => {
            const streamSdk = (window as any).Stream;

            if (iframeRef.current && streamSdk) {
                console.log('[VideoPlayer] Stream SDK found, initializing...');

                try {
                    const sp = streamSdk(iframeRef.current);
                    sp.muted = true;
                    sp.loop = isFeedMode && !autoScrollEnabled;
                    setPlayer(sp);

                    console.log('[VideoPlayer] Stream player created');

                    sp.addEventListener('playing', () => {
                        console.log('[VideoPlayer] Cloudflare video is playing');
                        setIframeReady(true);
                        setIsBlocked(false);
                    });

                    sp.addEventListener('error', (e: any) => {
                        console.error('[VideoPlayer] Cloudflare Stream error:', e);
                        setIsBlocked(true);
                    });

                    sp.addEventListener('ended', () => {
                        setIsEnded(true);
                        if (autoScrollEnabled && onVideoEnd) onVideoEnd();
                    });
                    sp.addEventListener('play', () => setIsEnded(false));

                    sp.addEventListener('loadstart', () => {
                        console.log('[VideoPlayer] Cloudflare loadstart');
                    });

                    sp.addEventListener('canplay', () => {
                        console.log('[VideoPlayer] Cloudflare canplay');
                    });

                    return true;
                } catch (e) {
                    console.error('[VideoPlayer] Failed to init Stream SDK:', e);
                    return false;
                }
            }
            return false;
        };

        const interval = setInterval(() => {
            const success = init();
            if (success) {
                clearInterval(interval);
            } else {
                initAttempts.current += 1;
                console.log('[VideoPlayer] Waiting for Stream SDK...', initAttempts.current);
                if (initAttempts.current > 25) { // ~5 seconds
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
    // ----------------------------------------------------------------------
    // 8. SYNC MUTE STATE
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (nativeVideoRef.current && isNativeVideo) {
            // Relaxed check: if video is not blocked and we have an intention to sync
            if (!isBlocked) {
                nativeVideoRef.current.muted = isMuted;
            }
        }
        if (player) {
            player.muted = isMuted;
        }
    }, [isMuted, player, isNativeVideo, isBlocked]);

    // ----------------------------------------------------------------------
    // RENDER
    // ----------------------------------------------------------------------
    return (
        <div
            ref={containerRef}
            className="w-full h-full bg-black relative overflow-hidden group select-none"
            onClick={handleTap}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* === VIDEO LAYER === */}
            {isInView && (
                <>
                    {cloudflareId ? (
                        <>
                            <Script src="https://embed.cloudflarestream.com/embed/r4xu.fla9.latest.js" />
                            <iframe
                                ref={iframeRef}
                                src={`https://iframe.videodelivery.net/${cloudflareId}?autoplay=true&loop=${isFeedMode && !autoScrollEnabled}&muted=true&controls=${useNativeControls}&playsinline=true&preload=auto`}
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
                            // Keep native poster as backup, but our custom layer does the real job
                            poster={posterUrl}
                            className={`w-full h-full pointer-events-none ${post.format === 'vertical' ? 'object-cover md:object-contain' : 'object-contain'}`}
                            autoPlay
                            loop={isFeedMode && !autoScrollEnabled}
                            muted
                            playsInline
                            webkit-playsinline="true"
                            preload="auto"
                            onLoadedData={() => {
                                console.log('[VideoPlayer] loadeddata - video ready');
                            }}
                            onPlay={() => {
                                console.log('[VideoPlayer] play event fired');
                                setHasActuallyPlayed(true);
                                setIsBlocked(false);
                            }}
                            onTimeUpdate={(e) => {
                                // Backup check: if currentTime > 0.1, video is definitely playing
                                if (e.currentTarget.currentTime > 0.1 && !hasActuallyPlayed) {
                                    console.log('[VideoPlayer] confirmed playing via timeupdate');
                                    setHasActuallyPlayed(true);
                                    setIsBlocked(false);
                                }
                            }}
                            onWaiting={() => {
                                console.log('[VideoPlayer] waiting (buffering)');
                            }}
                            onStalled={() => {
                                console.log('[VideoPlayer] stalled');
                            }}
                            onError={(e) => {
                                console.error('[VideoPlayer] error:', e.currentTarget.error?.message);
                                setIsBlocked(true);
                            }}
                            onEnded={() => {
                                setIsEnded(true);
                                if (autoScrollEnabled && onVideoEnd) onVideoEnd();
                            }}
                        />
                    )}
                </>
            )}

            {/* === BLOCKED/MANUAL PLAY BUTTON (iOS Low Power Mode) === */}
            {isBlocked && isInView && (
                <div
                    className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
                    onClick={handleManualPlay}
                >
                    <div className="w-20 h-20 bg-black/40 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl hover:scale-110 active:scale-95 transition-transform animate-in zoom-in-75 duration-300">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                    <div className="absolute bottom-[28%] opacity-60 animate-pulse">
                        <Image
                            src="/logonavbar.png"
                            alt="Speedlight"
                            width={120}
                            height={40}
                            className="object-contain"
                        />
                    </div>
                </div>
            )}

            {/* === CENTER MUTE BUTTON (Visible Initially) === */}
            {isMuted && !isBlocked && isInView && (
                <div
                    className="absolute inset-0 flex items-center justify-center z-30 cursor-pointer animate-in fade-in duration-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                        // Optional: Show immediate feedback or just let the button disappear
                        setShowActionIcon('unmute');
                        setTimeout(() => setShowActionIcon(null), 600);
                    }}
                >
                    <div className="w-20 h-20 bg-black/40 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-all">
                        <VolumeX className="w-8 h-8 text-white" />
                    </div>
                </div>
            )}

            {/* === FEEDBACK ICONS === */}
            {showActionIcon && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-out duration-500">
                    <div className="w-20 h-20 bg-black/40 backdrop-blur-xl rounded-3xl flex items-center justify-center text-white border border-white/10 shadow-2xl">
                        {showActionIcon === 'pause' && (
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-8 bg-white rounded-full shadow-sm" />
                                <div className="w-2.5 h-8 bg-white rounded-full shadow-sm" />
                            </div>
                        )}
                        {showActionIcon === 'mute' && <VolumeX className="w-8 h-8" />}
                        {showActionIcon === 'unmute' && <Volume2 className="w-8 h-8" />}
                        {showActionIcon === 'play' && (
                            <Play className="w-8 h-8 fill-white ml-1" />
                        )}
                    </div>
                </div>
            )}

            {/* === OVERLAY GRADIENT === */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-[6]" />
        </div>
    );
}
