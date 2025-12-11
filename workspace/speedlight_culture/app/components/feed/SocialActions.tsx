"use client";

import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Heart, MessageCircle, Share2, Send, X } from "lucide-react";
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

    // Map entityType to DB column
    const getColumnName = () => {
        switch (entityType) {
            case 'project': return 'project_id';
            case 'gallery': return 'album_id';
            case 'marketplace': return 'listing_id';
            default: return null;
        }
    };

    const handleLike = async () => {
        if (!currentUserId) return; // Prompt login ideally

        const column = getColumnName();
        if (!column) return;

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
                        [column]: entityId
                    });
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('likes')
                    .delete()
                    .match({
                        user_id: currentUserId,
                        [column]: entityId
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
        const column = getColumnName();
        if (!column) return;

        setLoadingComments(true);
        const { data, error } = await supabase
            .from('comments')
            .select(`
                id, content, created_at,
                profiles (id, full_name, avatar_url)
            `)
            .eq(column, entityId)
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

        const column = getColumnName();
        if (!column) return;

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
                    [column]: entityId
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
            <div className="px-4 py-3 bg-white/5 border-t border-white/5 flex items-center justify-between">
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

            {/* Comments Section */}
            {isCommentsOpen && (
                <div className="bg-[#050505] border-t border-white/5 p-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-4 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                        {loadingComments && comments.length === 0 ? (
                            <p className="text-xs text-white/30 text-center">Cargando comentarios...</p>
                        ) : comments.length === 0 ? (
                            <p className="text-xs text-white/30 text-center">Sé el primero en comentar.</p>
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
                                            <p className="text-sm text-white/80 font-light">{comment.content}</p>
                                        </div>
                                        <p className="text-[10px] text-white/30 mt-1 ml-2">Justo ahora</p>
                                        {/* Timestamp handling omitted for brevity but can be added */}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input */}
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                            placeholder={currentUserId ? "Añade un comentario..." : "Inicia sesión para comentar"}
                            disabled={!currentUserId}
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF9800]/50"
                        />
                        <button
                            onClick={handlePostComment}
                            disabled={!commentText.trim() || !currentUserId}
                            className="bg-[#FF9800] text-black p-2 rounded-full hover:bg-[#ffad33] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
