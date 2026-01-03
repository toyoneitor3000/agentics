"use client";

import { useRef, useEffect, useState, Suspense } from 'react';
import { Plus, Gamepad2, ChevronDown, Play } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getCinemaFeed } from '@/app/actions/cinema';
import { useUi } from '@/app/context/UiContext';
import { useGamepad } from '@/app/hooks/useGamepad';
import { VideoPlayer } from './components/VideoPlayer';
import { SocialInterface } from './components/SocialInterface';

// ----------------------------------------------------------------------
// PAGE COMPONENT
// ----------------------------------------------------------------------
function CinemaSocialContent() {
    const searchParams = useSearchParams();
    const videoIdParam = searchParams.get('video');
    const [featuredPost, setFeaturedPost] = useState<any>(null);
    const [categories, setCategories] = useState<any>({});
    const [isMuted, setIsMuted] = useState(true);

    // State for View Mode ('cinema' or 'social')
    const [viewMode, setViewMode] = useState<'cinema' | 'social'>('social');
    const [activeMovie, setActiveMovie] = useState<any>(null); // For Cinema Modal
    const [activeSocialPost, setActiveSocialPost] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Context
    const { isUiVisible, resetIdleTimer, setIsSocialMode, toggleUiVisibility } = useUi();

    // Sync View Mode
    useEffect(() => {
        setIsSocialMode(viewMode === 'social');
    }, [viewMode, setIsSocialMode]);

    // Load Data
    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true);
            try {
                const feed = await getCinemaFeed() || [];

                // 2. FILTERING (With Smart Fallback)
                const processedFeed = feed; // Use 'feed' as the base for processing
                const horizontalFeed = processedFeed.filter((p: any) => p.format === 'horizontal');
                let verticalFeed = processedFeed.filter((p: any) => p.format === 'vertical');

                // FALLBACK: If no vertical videos exist (e.g. data migration issue), show EVERYTHING in social feed
                // preventing the "Black Screen / No Content" error.
                if (verticalFeed.length === 0 && processedFeed.length > 0) {
                    console.log("No vertical content found. Fallback to mixed feed.");
                    verticalFeed = processedFeed;
                }

                // Initial State Priority: Url Param -> Feed Content
                if (videoIdParam) {
                    const target = processedFeed.find((p: any) => p.id === videoIdParam);
                    if (target) {
                        if (target.format === 'vertical') {
                            setViewMode('social');
                            setActiveSocialPost(target);
                        } else {
                            setViewMode('cinema');
                            setActiveMovie(target);
                        }
                    } else if (verticalFeed.length > 0) setActiveSocialPost(verticalFeed[0]);
                } else if (verticalFeed.length > 0) {
                    setActiveSocialPost(verticalFeed[0]);
                }

                // Featured for Cinema Mode
                if (horizontalFeed.length > 0) setFeaturedPost(horizontalFeed[0]);
                else setFeaturedPost(feed[0]);

                setCategories({
                    trending: horizontalFeed.slice(0, 5),
                    originals: horizontalFeed.slice(2, 6),
                    builds: horizontalFeed.slice(0, 3),
                    vertical: verticalFeed
                });

            } catch (e) {
                console.error("Failed loading feed", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, []);

    // Scroll to Video (Deep Link)
    useEffect(() => {
        if (videoIdParam && viewMode === 'social' && !isLoading) {
            setTimeout(() => {
                const el = document.getElementById(`video-${videoIdParam}`);
                if (el) el.scrollIntoView({ behavior: 'auto' });
            }, 500);
        }
    }, [videoIdParam, viewMode, isLoading]);

    // Update URL on Scroll matches activeSocialPost
    useEffect(() => {
        if (activeSocialPost && viewMode === 'social') {
            const newUrl = `?video=${activeSocialPost.id}`;
            window.history.replaceState(null, '', newUrl);
        }
    }, [activeSocialPost, viewMode]);

    // GLOBAL INTERSECTION OBSERVER (Fixes iOS flickering)
    useEffect(() => {
        if (viewMode !== 'social') return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('data-video-id');
                    const post = categories.vertical?.find((p: any) => p.id === id);
                    if (post) setActiveSocialPost(post);
                }
            });
        }, { threshold: 0.6 });

        const items = document.querySelectorAll('.cinema-feed-item');
        items.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [viewMode, categories.vertical]);

    // Keyboard & Gamepad
    const socialFeedRef = useRef<HTMLDivElement>(null);
    const { isConnected: isGamepadConnected } = useGamepad({
        onDown: () => socialFeedRef.current?.scrollBy({ top: window.innerHeight, behavior: 'smooth' }),
        onUp: () => socialFeedRef.current?.scrollBy({ top: -window.innerHeight, behavior: 'smooth' }),
        onSelect: () => setIsMuted(p => !p),
        onBack: () => activeMovie ? setActiveMovie(null) : setViewMode('social')
    });

    useEffect(() => {
        if (viewMode !== 'social') return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') socialFeedRef.current?.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
            if (e.key === 'ArrowUp') socialFeedRef.current?.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [viewMode]);


    return (
        <div className="bg-[#050505] min-h-screen w-full relative font-sans text-white overflow-hidden selection:bg-[#FF9800] selection:text-black">

            {/* HEADER TOGGLE */}
            <div className={`fixed top-[50px] left-0 right-0 z-[140] transition-all duration-500 ${viewMode === 'cinema' ? 'bg-gradient-to-b from-black/90' : ''} ${isUiVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-full px-4 flex items-center justify-between py-2 relative">
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <div className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-[3px] shadow-2xl">
                            <button onClick={() => setViewMode('social')} className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase ${viewMode === 'social' ? 'bg-white text-black' : 'text-white/40'}`}>Social</button>
                            <button onClick={() => setViewMode('cinema')} className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase ${viewMode === 'cinema' ? 'bg-[#FF9800] text-black' : 'text-white/40'}`}>Films</button>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        {isGamepadConnected && <Gamepad2 className="w-4 h-4 text-[#FF9800] animate-pulse" />}
                        <Link href="/cinema/upload" className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-full hover:bg-[#FF9800] transition-colors"><Plus className="w-4 h-4" /></Link>
                    </div>
                </div>
            </div>

            {/* CINEMA MODE */}
            {viewMode === 'cinema' && (
                <div className="animate-in fade-in duration-500 pt-[70px]">
                    <div className="w-full max-w-[1800px] mx-auto relative group aspect-video max-h-[85vh] bg-black shadow-2xl rounded-b-3xl overflow-hidden border-b border-white/5">
                        {featuredPost && (
                            <AmbientCinemaPlayer
                                post={featuredPost}
                                isMuted={isMuted}
                                toggleMute={() => setIsMuted(!isMuted)}
                                onOpenFull={() => setActiveMovie(featuredPost)}
                            />
                        )}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 opacity-40 animate-pulse"><ChevronDown className="w-6 h-6 text-white" /></div>
                    </div>
                    <div className="relative z-10 bg-[#050505] pb-20 pt-12 min-h-screen px-4 md:px-12 space-y-12">
                        <CategoryRow title="Tendencias Globales" posts={categories.trending} onPostClick={setActiveMovie} />
                        <CategoryRow title="Speedlight Originals" posts={categories.originals} onPostClick={setActiveMovie} />
                        <CategoryRow title="Build Documentaries" posts={categories.builds} onPostClick={setActiveMovie} />
                    </div>
                </div>
            )}

            {/* SOCIAL MODE */}
            {viewMode === 'social' && (
                <div className="fixed inset-0 z-10 bg-black animate-in slide-in-from-bottom-10 duration-500">
                    {/* Fixed UI Overlay Wrapper */}
                    <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-1000 ${isUiVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90" />
                    </div>

                    {/* GLOBAL SOCIAL INTERFACE (FIXED OVERLAY) */}
                    {activeSocialPost && (
                        <div className={`absolute inset-0 z-30 pointer-events-none transition-opacity duration-300 pb-14 md:pb-16 ${isUiVisible ? 'opacity-100' : 'opacity-0'}`}>
                            <SocialInterface
                                post={activeSocialPost}
                                isMuted={isMuted}
                                toggleMute={() => setIsMuted(!isMuted)}
                                onOpenFull={() => { }}
                                toggleUiVisibility={toggleUiVisibility}
                            />
                        </div>
                    )}

                    <div
                        ref={socialFeedRef}
                        className="h-full w-full overflow-y-scroll snap-y snap-mandatory snap-always overscroll-contain no-scrollbar pt-[0px]"
                        onMouseMove={resetIdleTimer} onTouchStart={resetIdleTimer} onClick={resetIdleTimer}
                    >
                        {(categories.vertical || []).map((post: any) => (
                            <div
                                key={post.id}
                                id={`video-${post.id}`}
                                data-video-id={post.id}
                                className="cinema-feed-item w-full h-full snap-start snap-always relative border-b border-white/5"
                            >
                                <VideoPlayer
                                    post={post}
                                    isFeedMode={true}
                                    isActive={activeSocialPost?.id === post.id}
                                    isMuted={isMuted}
                                    toggleMute={() => setIsMuted(!isMuted)}
                                />
                            </div>
                        ))}

                        {!isLoading && (!categories.vertical || categories.vertical.length === 0) && (
                            <div className="h-screen flex items-center justify-center text-white/50">No hay contenido vertical aún.</div>
                        )}
                    </div>
                </div>
            )}
            {/* IMMERSIVE MODAL (For Cinema Mode Clicks) */}
            {activeMovie && viewMode === 'cinema' && (
                <div className="fixed inset-0 z-[200] bg-black">
                    <button className="absolute top-4 right-4 z-50 text-white" onClick={() => setActiveMovie(null)}>Close</button>
                    <VideoPlayer
                        post={activeMovie}
                        isFeedMode={false}
                        isMuted={isMuted}
                        toggleMute={() => setIsMuted(!isMuted)}
                    />
                </div>
            )}

            <DebugConsole />

        </div>
    );
}

// ----------------------------------------------------------------------
// DEBUG COMPONENT
// ----------------------------------------------------------------------
function DebugConsole() {
    const [logs, setLogs] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const hook = (method: 'log' | 'warn' | 'error', args: any[]) => {
            const msg = args.map(a => {
                if (typeof a === 'string') return a;
                if (a instanceof Error) return a.message;
                try { return JSON.stringify(a).substring(0, 500); } catch { return '[Obj]'; }
            }).join(' ');
            setLogs(prev => [...prev.slice(-50), `[${method.toUpperCase()}] ${msg}`]);
        };

        const oldLog = console.log;
        const oldWarn = console.warn;
        const oldError = console.error;

        console.log = (...args) => { hook('log', args); oldLog(...args); };
        console.warn = (...args) => { hook('warn', args); oldWarn(...args); };
        console.error = (...args) => { hook('error', args); oldError(...args); };

        window.onerror = (msg) => { hook('error', [String(msg)]); return false; };

        return () => {
            console.log = oldLog;
            console.warn = oldWarn;
            console.error = oldError;
        }
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(logs.join('\n'));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            // Fallback for iOS
            const textArea = document.createElement('textarea');
            textArea.value = logs.join('\n');
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 w-full h-48 bg-black/95 z-[10000] text-[#00ff00] text-[10px] font-mono p-2 overflow-y-auto border-t border-green-500/30">
            <div className="flex justify-between items-center mb-1 sticky top-0 bg-black/90 z-10">
                <span className="text-white bg-green-900/50 px-1">DEBUG CONSOLE</span>
                <button
                    onClick={handleCopy}
                    className="pointer-events-auto bg-green-600 text-black px-3 py-1 rounded text-[11px] font-bold active:bg-green-400"
                >
                    {copied ? '✓ Copiado!' : '📋 Copiar'}
                </button>
            </div>
            {logs.map((l, i) => <div key={i} className="border-b border-white/5 py-0.5 break-all">{l}</div>)}
        </div>
    );
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

function AmbientCinemaPlayer({ post, isMuted, toggleMute, onOpenFull }: any) {
    // Ambient Blur Layer only
    return (
        <div className="relative w-full h-full overflow-hidden bg-black group">
            {/* Background Blur */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40 blur-2xl scale-110">
                <Image src={post.poster || post.thumbnail_url} alt="bg" fill className="object-cover" />
            </div>
            {/* Content */}
            <div className="absolute inset-0 z-10 p-4 flex items-center justify-center">
                <div className="w-full h-full max-w-5xl shadow-2xl rounded-lg overflow-hidden border border-white/10 relative">
                    <VideoPlayer
                        post={post}
                        isFeedMode={false} // Force contain
                        isMuted={isMuted}
                        toggleMute={toggleMute}
                    />
                    <div className="absolute inset-0 z-20 cursor-pointer" onClick={onOpenFull} />
                </div>
            </div>
        </div>
    )
}


function CategoryRow({ title, posts, onPostClick }: any) {
    if (!posts?.length) return null;
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
                        className="flex-none w-[200px] md:w-[320px] aspect-video relative rounded-lg overflow-hidden bg-neutral-900 cursor-pointer transform hover:scale-[1.03] hover:z-10 transition-all duration-300 border border-white/10 hover:border-[#FF9800] shadow-xl"
                    >
                        <Image src={post.poster || "/placeholder-cinema.jpg"} alt={post.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h4 className="text-white font-bold text-sm leading-none mb-1 truncate">{post.title}</h4>
                            <span className="flex items-center gap-1 text-[10px] text-zinc-400"><Play className="w-3 h-3 fill-current" /> Ver ahora</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function CinemaSocialPage() {
    return (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black flex items-center justify-center"><div className="w-10 h-10 border-2 border-[#FF9800] rounded-full animate-spin" /></div>}>
            <CinemaSocialContent />
        </Suspense>
    );
}












