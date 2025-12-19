"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Play, FileText, ShoppingBag, Camera, Wrench } from "lucide-react";
import SocialActions from "./SocialActions";

const FeedPostHeader = ({ user, time, action, type }: { user: any, time: string, action?: string, type: string }) => (
    <div className="absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-[#1A0F08]/95 via-[#1A0F08]/50 to-transparent flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
            <div className="w-10 h-10 rounded-full bg-[#1A0F08] border border-[#F5E6D3]/10 relative overflow-hidden shadow-[0_0_15px_rgba(255,152,0,0.15)] ring-1 ring-white/5">
                {user.avatar ? (
                    <Image src={user.avatar} alt={user.name} fill sizes="40px" className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-white/50 font-bold font-oswald">{user.name?.charAt(0)}</div>
                )}
            </div>
            <div>
                <Link href={user.id ? `/profile/${user.id}` : '#'} className="text-sm font-bold text-white hover:text-[#FF9800] transition-colors drop-shadow-md font-oswald tracking-wide flex items-center gap-1">
                    {user.name}
                </Link>
                <div className="flex items-center gap-2 text-[9px] text-[#F5E6D3]/60 font-roboto-mono tracking-widest uppercase">
                    <span>{time}</span>
                    <span className="w-1 h-1 bg-[#FF9800] rounded-full shadow-[0_0_5px_#FF9800]"></span>
                    <span className="text-[#FF9800]">{action}</span>
                </div>
            </div>
        </div>
        <button className="text-[#F5E6D3]/60 hover:text-white transition-colors bg-[#1A0F08]/40 backdrop-blur-md p-2 rounded-full pointer-events-auto border border-white/5 hover:border-[#FF9800]/30 hover:shadow-[0_0_15px_rgba(255,152,0,0.1)]">
            <MoreHorizontal className="w-5 h-5" />
        </button>
    </div>
);

interface FeedCardProps {
    item: any;
    labels: any;
    currentUserId?: string;
    timeAgo: (date: Date) => string;
}

export default function FeedCard({ item, labels, currentUserId, timeAgo }: FeedCardProps) {

    // Determine the type label and logic
    let typeLabel = labels.untitled;
    let AspectRatioClass = "aspect-[3/4]"; // Default for Projects/Gallery/Market

    switch (item.type) {
        case 'project': typeLabel = labels.project; break;
        case 'gallery': typeLabel = labels.gallery; break;
        case 'marketplace': typeLabel = labels.marketplace; break;
        case 'cinema': typeLabel = "CINEMA"; AspectRatioClass = "aspect-video"; break;
        case 'social': typeLabel = "SOCIAL"; AspectRatioClass = "aspect-[9/16]"; break;
        case 'article': typeLabel = "BLOG"; AspectRatioClass = "aspect-[4/3]"; break;
        case 'event': typeLabel = "EVENTO"; AspectRatioClass = "aspect-video"; break;
        case 'workshop': typeLabel = "TALLER"; AspectRatioClass = "aspect-square"; break;
    }

    // Special Workshop Render
    if (item.type === 'workshop') {
        return (
            <div className="glass-premium rounded-3xl overflow-hidden p-6 flex items-center gap-5 transition-all duration-500 hover:scale-[1.01] animate-in fade-in slide-in-from-bottom-4">
                <div className="w-16 h-16 rounded-full bg-black/40 overflow-hidden relative border border-[#FF9800]/20 shrink-0 shadow-[0_0_20px_rgba(255,152,0,0.1)]">
                    {item.user.avatar ? <Image src={item.user.avatar} alt={item.user.name} fill className="object-cover" /> : <Wrench className="w-8 h-8 m-4 text-[#FF9800]" />}
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-oswald font-bold text-lg tracking-wide">{item.content.title}</h3>
                    <p className="text-[#FF9800] text-[10px] uppercase font-bold tracking-[0.2em] mb-1 font-roboto-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#FF9800] rounded-full animate-pulse"></span>
                        Taller Verificado
                    </p>
                    <p className="text-[#F5E6D3]/60 text-sm line-clamp-2">{item.content.text}</p>
                </div>
                <Link href={`/profile/${item.user.id}`} className="px-5 py-2 bg-[#FF9800] hover:bg-[#FFB74D] text-black rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,152,0,0.3)] hover:shadow-[0_0_25px_rgba(255,152,0,0.5)]">
                    Ver
                </Link>
            </div>
        )
    }

    // Article Specific Render
    if (item.type === 'article') {
        return (
            <div className="glass-premium rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.01] group animate-in fade-in slide-in-from-bottom-4">
                <div className="relative aspect-video w-full overflow-hidden">
                    <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-[#FF9800]/30 flex items-center gap-2 shadow-lg">
                        <FileText className="w-3 h-3 text-[#FF9800]" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest font-roboto-mono">Artículo</span>
                    </div>
                    {item.content.image ? (
                        <Image
                            src={item.content.image}
                            alt={item.content.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1e1e1e] to-black" />
                    )}
                </div>
                <div className="p-6">
                    <h3 className="text-2xl font-bold font-oswald text-white mb-2 leading-none uppercase tracking-tight group-hover:text-[#FF9800] transition-colors drop-shadow-lg">
                        {item.content.title}
                    </h3>
                    <p className="text-[#F5E6D3]/70 text-sm line-clamp-3 mb-4 leading-relaxed font-light font-roboto-mono text-xs">
                        {item.content.text}
                    </p>
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/10 relative overflow-hidden ring-1 ring-[#FF9800]/20">
                                {item.user.avatar && <Image src={item.user.avatar} alt="Author" fill className="object-cover" />}
                            </div>
                            <span className="text-[10px] text-[#F5E6D3]/50 uppercase tracking-widest font-bold">{item.user.name}</span>
                        </div>
                        <span className="text-[10px] text-[#FF9800] font-bold uppercase tracking-[0.2em] group-hover:underline decoration-[#FF9800] underline-offset-4 decoration-2 transition-all">Leer Más</span>
                    </div>
                </div>
            </div>
        );
    }

    // Standard & Video Render
    return (
        <div className={`glass-premium rounded-3xl overflow-hidden transition-all duration-500 group relative animate-in fade-in slide-in-from-bottom-4 hover:scale-[1.005]`}>

            <FeedPostHeader
                user={item.user}
                time={timeAgo(item.date)}
                action={typeLabel}
                type={item.type}
            />

            {/* Visual Content */}
            <div className={`relative w-full ${AspectRatioClass} bg-[#050505] overflow-hidden`}>
                {/* Video Indicator */}
                {(item.type === 'cinema' || item.type === 'social') && (
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-[#FF9800]/20 backdrop-blur-md rounded-full flex items-center justify-center border border-[#FF9800]/50 shadow-[0_0_30px_rgba(255,152,0,0.3)] transition-all duration-500 ${item.content?.video ? 'opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-110' : 'group-hover:scale-110 animate-pulse'}`}>
                        <Play className="w-6 h-6 text-[#FF9800] ml-1 fill-[#FF9800]" />
                    </div>
                )}

                {(item.type === 'cinema' || item.type === 'social') && item.content?.video ? (
                    <SafeVideoPlayer
                        src={item.content.video}
                        poster={item.content.image || item.content.video_poster}
                    />
                ) : (item.content?.image || item.content?.video_poster) ? (
                    <Image
                        src={item.content.image || item.content.video_poster}
                        alt="Content"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col justify-end p-8 bg-black/20 backdrop-blur-md">
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#FF9800]/5 to-transparent"></div>
                    </div>
                )}

                {/* Info Overlay (Standard for Project/Gallery/Market) */}
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#1A0F08] via-[#1A0F08]/60 to-transparent flex flex-col justify-end p-6 pb-24">
                    <h3 className="font-oswald font-bold text-3xl md:text-4xl text-white leading-[0.9] mb-3 drop-shadow-lg uppercase tracking-tight">
                        {item.content.title}
                    </h3>
                    {item.content.text && (
                        <p className="text-[#F5E6D3]/80 text-sm md:text-base font-light line-clamp-2 drop-shadow-md max-w-lg mb-2 leading-relaxed">
                            {item.content.text}
                            {item.type === 'event' && item.content.description && <span className="block mt-2 text-[#FF9800] text-xs font-roboto-mono uppercase tracking-wider border-l-2 border-[#FF9800] pl-2">{item.content.description}</span>}
                        </p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="absolute bottom-0 inset-x-0 bg-[#1A0F08]/80 backdrop-blur-xl border-t border-white/5">
                {/* Note: We cast entityType because SocialActions only knew about 3 types, but usually strings are compatible if DB allows */}
                <SocialActions
                    entityId={item.id}
                    entityType={item.type as any}
                    initialLikes={item.stats.likes}
                    initialComments={item.stats.comments}
                    initialIsLiked={item.stats.isLiked}
                    currentUserId={currentUserId}
                />
            </div>
        </div>
    );
}

const SafeVideoPlayer = ({ src, poster }: { src: string, poster?: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Try to play
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch((error: any) => {
                if (error.name === 'AbortError') {
                    // Ignore abort errors
                } else if (error.name === 'NotSupportedError') {
                    // console.warn("Video format not supported:", src);
                    // This usually happens if src is empty or invalid format.
                } else {
                    console.error("Video play error:", error);
                }
            });
        }
    }, [src]);

    if (!src) return null; // Double safety

    return (
        <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
            playsInline
            loop
            muted
            onContextMenu={(e) => e.preventDefault()}
        />
    );
};
