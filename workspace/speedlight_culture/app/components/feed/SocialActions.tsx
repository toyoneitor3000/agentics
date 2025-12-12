"use client";

import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Heart, MessageCircle, Share2, Send, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SocialActionsProps {
    entityId: string;
    entityType: 'project' | 'gallery' | 'marketplace';
    initialLikes: number;
    initialComments: number;
    initialIsLiked: boolean;
    currentUserId?: string;
}

export default function SocialActions({
    entityId,
    entityType,
    initialLikes,
    initialComments,
    initialIsLiked,
    currentUserId
}: SocialActionsProps) {
    const supabase = createClient();
    const [liked, setLiked] = useState(initialIsLiked);
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [commentsCount, setCommentsCount] = useState(initialComments);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState<any[]>([]); // We would fetch these real-time ideally
    const [loadingComments, setLoadingComments] = useState(false);

    const handleLike = async () => {
        if (!currentUserId) return; // Prompt login ideally

        // Optimistic Update
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

        try {
            if (newLiked) {
                const { error } = await supabase
                    .from('likes')
                    .insert({
                        user_id: currentUserId,
                        target_id: entityId,
                        target_type: entityType
                    });
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('likes')
                    .delete()
                    .match({
                        user_id: currentUserId,
                        target_id: entityId,
                        target_type: entityType
                    });
                if (error) throw error;
            }
        } catch (err) {
            console.error("Error toggling like:", err);
            // Revert
            setLiked(!newLiked);
            setLikesCount(prev => !newLiked ? prev + 1 : prev - 1);
        }
    };

    const fetchComments = async () => {
        setLoadingComments(true);
        const { data, error } = await supabase
            .from('comments')
            .select(`
                id, content, created_at,
                profiles (id, full_name, avatar_url)
            `)
            .eq('target_id', entityId)
            .eq('target_type', entityType)
            .order('created_at', { ascending: true });

        if (!error && data) {
            setComments(data);
        }
        setLoadingComments(false);
    };

    const toggleComments = () => {
        if (!isCommentsOpen) {
            fetchComments();
        }
        setIsCommentsOpen(!isCommentsOpen);
    };

    const handlePostComment = async () => {
        if (!commentText.trim() || !currentUserId) return;

        const tempId = Math.random().toString();
        const newComment = {
            id: tempId,
            content: commentText,
            created_at: new Date().toISOString(),
            profiles: {
                id: currentUserId,
                full_name: 'Yo', // We should pass real user data or fetch it
                avatar_url: null
            }
        };

        // Optimistic
        setComments([...comments, newComment]);
        setCommentText("");
        setCommentsCount(prev => prev + 1);

        try {
            const { error } = await supabase
                .from('comments')
                .insert({
                    user_id: currentUserId,
                    content: newComment.content,
                    target_id: entityId,
                    target_type: entityType
                });

            if (error) throw error;
            // Refetch to get real ID and data
            fetchComments();
        } catch (err) {
            console.error("Error posting comment:", err);
            setComments(comments.filter(c => c.id !== tempId));
            setCommentsCount(prev => prev - 1);
        }
    };

    return (
        <>
            <div className="px-6 py-4 bg-transparent flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-2 group"
                    >
                        <Heart
                            className={`w-5 h-5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-white/60 group-hover:text-red-500'}`}
                        />
                        <span className={`text-xs font-bold group-hover:text-white ${liked ? 'text-white' : 'text-white/60'}`}>
                            {likesCount}
                        </span>
                    </button>

                    <button
                        onClick={toggleComments}
                        className="flex items-center gap-2 group"
                    >
                        <MessageCircle className="w-5 h-5 text-white/60 group-hover:text-[#FF9800] transition-colors" />
                        <span className="text-xs font-bold text-white/60 group-hover:text-white">{commentsCount}</span>
                    </button>
                </div>
                <button className="text-white/40 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Comments Overlay (TikTok Style) */}
            {isCommentsOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity"
                        onClick={() => setIsCommentsOpen(false)}
                    />

                    {/* Bottom Sheet Drawer */}
                    <div className="fixed bottom-0 left-0 right-0 z-[70] bg-[#111] border-t border-white/10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] flex flex-col max-h-[75vh] animate-in slide-in-from-bottom duration-300">

                        {/* Drawer Handle / Header */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div className="w-10"></div> {/* Spacer */}
                            <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
                            <button
                                onClick={() => setIsCommentsOpen(false)}
                                className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white bg-white/5 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Comments List (Scrollable) */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {loadingComments && comments.length === 0 ? (
                                <div className="py-10 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-[#FF9800] mx-auto mb-2" />
                                    <p className="text-xs text-white/30">Cargando comentarios...</p>
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="py-20 text-center flex flex-col items-center">
                                    <MessageCircle className="w-12 h-12 text-white/10 mb-4" />
                                    <p className="text-white/40 font-bold text-sm">Aún no hay comentarios</p>
                                    <p className="text-white/20 text-xs">Sé el primero en opinar.</p>
                                </div>
                            ) : (
                                comments.map((comment: any) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex-shrink-0 overflow-hidden relative border border-white/10">
                                            {comment.profiles?.avatar_url ? (
                                                <Image src={comment.profiles.avatar_url} alt="User" fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-white/50 font-bold">
                                                    {comment.profiles?.full_name?.charAt(0) || '?'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 px-4">
                                                <p className="text-xs font-bold text-white mb-1">{comment.profiles?.full_name || 'Usuario'}</p>
                                                <p className="text-sm text-white/80 font-light leading-relaxed">{comment.content}</p>
                                            </div>
                                            <p className="text-[10px] text-white/30 mt-1 ml-2">Justo ahora</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input Area (Fixed at bottom of drawer) */}
                        <div className="p-4 border-t border-white/5 bg-[#111] shrink-0 pb-8 md:pb-4">
                            <div className="flex gap-3 items-center">
                                <div className="w-8 h-8 rounded-full bg-neutral-800 overflow-hidden relative border border-white/10 shrink-0">
                                    {/* Current User Avatar Placeholder */}
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-white/50">You</div>
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                                        placeholder={currentUserId ? "Añade un comentario..." : "Inicia sesión..."}
                                        disabled={!currentUserId}
                                        className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF9800]/50 transition-all font-light"
                                        autoFocus={isCommentsOpen}
                                    />
                                    <button
                                        onClick={handlePostComment}
                                        disabled={!commentText.trim() || !currentUserId}
                                        className="absolute right-1 top-1Bottom-1 bottom-1 aspect-square bg-[#FF9800] text-black rounded-full hover:bg-[#ffad33] disabled:opacity-0 disabled:scale-90 transition-all flex items-center justify-center w-8 h-8 my-auto top-0 mt-1 mr-1"
                                    >
                                        <Send className="w-4 h-4 ml-0.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
