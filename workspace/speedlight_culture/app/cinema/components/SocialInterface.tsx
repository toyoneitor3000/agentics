"use client";

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import {
    Heart, MessageCircle, Share2, MoreHorizontal, Gift,
    Volume2, VolumeX, Maximize2, Bookmark, Send,
    Pencil, Archive, Trash2, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from '@/app/lib/auth-client';
import { toggleLike, archiveVideo, deleteVideo, updateVideoMetadata } from '@/app/actions/cinema';
import { CommentsSection } from "@/app/components/CommentsSection";
import { GiftingSystem } from "@/app/components/GiftingSystem";
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { toast } from 'sonner';

// Helper
const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
}

export function SocialInterface({ post, isMuted, toggleMute, onOpenFull, duration, toggleUiVisibility }: any) {
    const [liked, setLiked] = useState(post.liked_by_user || false);
    const [saved, setSaved] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [commentCount, setCommentCount] = useState(post.comments || 0);

    const [following, setFollowing] = useState(post.isFollowing || false);
    const [isPending, startTransition] = useTransition();

    // NEW: Comments & Gifting State
    const [showComments, setShowComments] = useState(false);
    const [showGifting, setShowGifting] = useState(false);

    // NEW: Text Expansion State
    const [expanded, setExpanded] = useState(false);
    const isLongDescription = post.description && post.description.length > 100;

    // NEW: Sync Real Comment Count on Mount
    useEffect(() => {
        const fetchRealCount = async () => {
            const { createClient } = await import('@/app/utils/supabase/client');
            const supabase = createClient();
            const { count, error } = await supabase
                .from('comments')
                .select('*', { count: 'exact', head: true })
                .eq('target_id', post.id);

            if (!error && count !== null) {
                setCommentCount(count);
            }
        };
        fetchRealCount();
    }, [post.id]);

    // EXISTING LIKES SYNC
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
        <div className="w-full h-full pointer-events-none z-20 pl-2 md:pl-4 pr-0 flex flex-col justify-between">

            {/* TOP BAR: Transparent */}
            <div className="w-full pt-4 flex justify-end items-start">
                {/* Mute button moved to bottom right */}
            </div>

            {/* BOTTOM AREA: Actions & Info */}
            <div className={`w-full flex items-end justify-between pb-2`}>

                {/* LEFT: INFO */}
                <div className="flex-1 mr-12 pointer-events-auto text-shadow-sm">
                    <div className="flex items-center mb-1">
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

                    <div className="mb-1 relative">
                        <p
                            className="text-white/80 text-xs drop-shadow-md transition-all duration-300"
                            onClick={() => { if (isLongDescription) setExpanded(!expanded); }}
                        >
                            {expanded || !isLongDescription ? (
                                <>
                                    {post.description}
                                    {expanded && (
                                        <span
                                            onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
                                            className="text-white/50 font-bold text-xs ml-2 hover:text-white cursor-pointer"
                                        >
                                            Ver menos
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    {post.description?.slice(0, 130)}...
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
                                        className="font-bold text-white text-xs hover:text-[#FF9800] ml-1"
                                    >
                                        Ver más
                                    </button>
                                </>
                            )}
                        </p>
                    </div>

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
                <div className="flex flex-col items-center gap-4 pointer-events-auto pr-1">

                    {/* MUTE TOGGLE (Added for Visibility) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                        className="flex flex-col items-center gap-1 group mb-2"
                    >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border border-white/10 ${isMuted ? 'bg-black/40 text-white/70' : 'bg-white/20 text-white backdrop-blur-md'}`}>
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] font-bold text-white drop-shadow-md">{isMuted ? 'Audio Off' : 'Audio On'}</span>
                    </button>

                    {/* LIKE */}
                    <button onClick={handleLike} className="flex flex-col items-center gap-1 group">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${liked ? 'bg-red-500/20 text-red-500 scale-110' : 'bg-black/20 text-white hover:bg-black/40'}`}>
                            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                        </div>
                        <span className="text-[10px] font-bold text-white drop-shadow-md">{formatNumber(likeCount)}</span>
                    </button>

                    {/* COMMENT (UPDATED WITH CLICK HANDLER) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowComments(true); }}
                        className="flex flex-col items-center gap-1 group"
                    >
                        <div className="w-9 h-9 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-all">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-white drop-shadow-md">{formatNumber(commentCount)}</span>
                    </button>

                    {/* GIFT (NEW - FUNCTIONAL) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowGifting(true); }}
                        className="flex flex-col items-center gap-1 group"
                    >
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#FF9800] bg-black/20 hover:bg-[#FF9800]/20 transition-all">
                            <Gift className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-white drop-shadow-md">Regalar</span>
                    </button>



                    {/* MORE ACTIONS (MENU) */}
                    <VideoActionsMenu
                        post={post}
                        saved={saved}
                        onSave={handleSave}
                        onShare={handleShare}
                    />

                </div>
            </div>

            {/* COMMENTS DRAWER (TIKTOK STYLE - LIQUID GLASS) */}
            <AnimatePresence>
                {showComments && (
                    <div
                        className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/50 backdrop-blur-sm pointer-events-auto"
                        onClick={(e) => { e.stopPropagation(); setShowComments(false); }}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="w-full h-[70vh] bg-[#050505]/85 backdrop-blur-2xl rounded-t-[32px] overflow-hidden relative border-t border-white/10 shadow-[0_-10px_50px_rgba(0,0,0,0.8)] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glass Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                            {/* Handle */}
                            <div className="w-full flex justify-center pt-5 pb-3 shrink-0 cursor-pointer relative z-10" onClick={() => setShowComments(false)}>
                                <div className="w-12 h-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors" />
                            </div>

                            {/* Content Container (Scrollable) */}
                            <div className="flex-1 overflow-y-auto px-4 pb-12 relative z-10 scrollbar-hide">
                                <div className="-mt-8"> {/* Negative margin to pull headline up if needed, or just let it sit */}
                                    <CommentsSection
                                        targetId={post.id}
                                        targetType="post"
                                        onCommentAdded={() => setCommentCount((prev: number) => prev + 1)}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* GIFTING DRAWER (TIKTOK STYLE - LIQUID GLASS) */}
            <AnimatePresence>
                {showGifting && (
                    <div
                        className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/50 backdrop-blur-sm pointer-events-auto"
                        onClick={(e) => { e.stopPropagation(); setShowGifting(false); }}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="w-full h-[70vh] bg-[#050505]/90 backdrop-blur-3xl rounded-t-[32px] overflow-hidden relative border-t border-[#FF9800]/20 shadow-[0_-10px_50px_rgba(255,152,0,0.1)] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glass Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF9800]/5 to-transparent pointer-events-none" />

                            {/* Handle */}
                            <div className="w-full flex justify-center pt-5 pb-3 shrink-0 cursor-pointer relative z-10" onClick={() => setShowGifting(false)}>
                                <div className="w-12 h-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors" />
                            </div>

                            {/* Content Container (Scrollable) */}
                            <div className="flex-1 overflow-y-auto px-4 pb-12 relative z-10 scrollbar-hide">
                                <div className="mt-2">
                                    <GiftingSystem projectTitle={post.title} />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div >
    );
}

function VideoActionsMenu({ post, saved, onSave, onShare }: { post: any, saved: boolean, onSave: (e: any) => void, onShare: (e: any) => void }) {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [confirmArchive, setConfirmArchive] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const isOwner = session?.user?.id === post.creatorId;

    const handleArchive = async () => {
        try {
            await archiveVideo(post.id);
            toast.success('Video archivado correctamente');
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            toast.error('Error al archivar');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteVideo(post.id);
            toast.success('Video eliminado');
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            toast.error('Error al eliminar');
        }
    };

    return (
        <div className="relative">
            <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="flex flex-col items-center gap-1 group"
            >
                <div className="w-9 h-9 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: 20 }}
                            className="absolute bottom-full right-0 mb-2 w-48 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50 py-1"
                        >
                            <button
                                onClick={onSave}
                                className="w-full px-4 py-3 text-left text-sm font-bold text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                            >
                                <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#FF9800] text-[#FF9800]' : 'text-white'}`} />
                                {saved ? 'Guardado' : 'Guardar'}
                            </button>
                            <button
                                onClick={onShare}
                                className="w-full px-4 py-3 text-left text-sm font-bold text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                            >
                                <Share2 className="w-4 h-4 text-white" /> Compartir
                            </button>

                            {isOwner && (
                                <>
                                    <div className="h-px bg-white/10 my-1" />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowEditModal(true); setIsOpen(false); }}
                                        className="w-full px-4 py-3 text-left text-sm font-bold text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                    >
                                        <Pencil className="w-4 h-4 text-blue-400" /> Editar Info
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmArchive(true); setIsOpen(false); }}
                                        className="w-full px-4 py-3 text-left text-sm font-bold text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                    >
                                        <Archive className="w-4 h-4 text-yellow-400" /> Archivar
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); setIsOpen(false); }}
                                        className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors border-t border-white/5"
                                    >
                                        <Trash2 className="w-4 h-4" /> Eliminar
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* CONFIRMATION MODALS */}
            <ConfirmModal
                isOpen={confirmArchive}
                onClose={() => setConfirmArchive(false)}
                onConfirm={handleArchive}
                title="Archivar Video"
                message="¿Seguro que quieres archivar este video? Se ocultará del feed principal."
                confirmText="Archivar"
                variant="info"
            />

            <ConfirmModal
                isOpen={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                title="Eliminar Video"
                message="¿ESTÁS SEGURO? Esta acción enviará el video a la papelera. Se podrá recuperar desde ajustes."
                confirmText="Mover a papelera"
                variant="danger"
            />

            {/* EDIT MODAL */}
            <AnimatePresence>
                {showEditModal && (
                    <EditMetadataModal
                        post={post}
                        onClose={() => setShowEditModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function EditMetadataModal({ post, onClose }: { post: any, onClose: () => void }) {
    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!title.trim()) return;
        setIsSaving(true);
        try {
            await updateVideoMetadata(post.id, { title, description });
            window.location.reload();
        } catch (err) {
            alert('Error al guardar cambios');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white">
                    <X className="w-6 h-6" />
                </button>

                <h3 className="text-xl font-black font-oswald uppercase text-white mb-6">Editar Publicación</h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#FF9800] uppercase tracking-widest pl-1">Título</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#FF9800] uppercase tracking-widest pl-1">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF9800] transition-colors resize-none text-sm"
                        />
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 py-3 rounded-xl bg-[#FF9800] text-black font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
