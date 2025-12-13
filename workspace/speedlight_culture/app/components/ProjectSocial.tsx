'use client';

import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { Star, Gift, Send, Trash2, Edit2, X, Check, Heart, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { postComment, updateComment, deleteComment, toggleCommentLike, sendGift } from '@/app/actions/social';

interface UserProfile {
    id: string;
    name: string;
    avatar_url: string;
}

interface Comment {
    id: string;
    content: string;
    rating: number;
    created_at: string;
    user_id: string;
    parent_id?: string;
    likes?: number; // Add likes
    isLiked?: boolean; // Add isLiked
    profiles?: {
        name: string;
        avatar_url: string;
    };
}

interface GiftType {
    id: string;
    name: string;
    price: number;
    icon: string;
}

interface ProjectSocialProps {
    projectId: string;
    comments: Comment[];
    gifts: GiftType[];
    user: any; // Current user
}

export default function ProjectSocial({ projectId, comments, gifts, user }: ProjectSocialProps) {
    const [rating, setRating] = useState(5);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Editing State
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    const supabase = createClient();
    const router = useRouter();

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/login');
            return;
        }
        if (!commentText.trim()) return;

        setIsSubmitting(true);
        try {
            await postComment(projectId, commentText, rating);
            setCommentText('');
            setRating(5);
            // Wait a moment for server revalidation or simply refresh
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error al publicar comentario. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendGift = async (giftId: string, giftName: string, price: number) => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (!confirm(`¿Deseas donar "${giftName}" por $${price}? (Simulación)`)) return;

        try {
            await sendGift(projectId, giftId);
            alert(`¡Gracias por donar ${giftName}!`);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error al enviar regalo.');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('¿Estás seguro de eliminar este comentario?')) return;

        try {
            const success = await deleteComment(commentId);
            if (success) {
                router.refresh();
            } else {
                alert('No se pudo eliminar el comentario.');
            }
        } catch (error) {
            console.error(error);
            alert('Error al eliminar');
        }
    };

    const startEditing = (comment: any) => {
        setEditingCommentId(comment.id);
        setEditContent(comment.content);
    };

    const saveEdit = async (commentId: string) => {
        if (!editContent.trim()) return;

        try {
            const success = await updateComment(commentId, editContent);
            if (success) {
                setEditingCommentId(null);
                router.refresh();
            } else {
                alert('No se pudo actualizar.');
            }
        } catch (error) {
            console.error(error);
            alert('Error al actualizar');
        }
    };

    // Reply State
    const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
        e.preventDefault();
        if (!user) {
            router.push('/login');
            return;
        }
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            await postComment(projectId, replyContent, 0, parentId); // Rating 0 for replies? Or hidden.
            setReplyContent('');
            setReplyingToCommentId(null);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error al responder.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const topLevelComments = comments.filter(c => !c.parent_id);
    const getReplies = (commentId: string) => comments.filter(c => c.parent_id === commentId);

    const handleCommentLike = async (commentId: string) => {
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            await toggleCommentLike(commentId);
            router.refresh();
        } catch (error) {
            console.error('Like error', error);
        }
    };

    return (
        <section className="space-y-16">

            {/* 1. GIFTS / DONATIONS */}
            <div>
                <h2 className="text-2xl font-oswald font-bold uppercase mb-6 flex items-center gap-3">
                    <span className="w-8 h-1 bg-[#FF9800]"></span>
                    Apoya el Proyecto
                </h2>
                <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
                    <p className="text-white/60 mb-8 text-sm max-w-2xl">
                        Ayuda a construir este proyecto donando repuestos viruales. Cada donación motiva al creador a seguir mejorando.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {gifts.map((gift) => (
                            <button
                                key={gift.id}
                                onClick={() => handleSendGift(gift.id, gift.name, gift.price)}
                                className="group relative bg-[#0a0a0a] border border-[#333] hover:border-[#FF9800] rounded-xl p-4 flex flex-col items-center gap-3 transition-all hover:-translate-y-1"
                            >
                                <div className="text-4xl group-hover:scale-110 transition-transform">
                                    {gift.icon}
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-white text-sm">{gift.name}</div>
                                    <div className="text-[#FF9800] text-xs font-bold">${gift.price}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. REVIEWS & COMMENTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Review Form */}
                <div className="lg:col-span-1">
                    <div className="bg-[#111] border border-[#222] rounded-2xl p-6 sticky top-24">
                        <h3 className="text-lg font-bold text-white mb-4">Calificar Proyecto</h3>
                        <form onSubmit={handleSubmitComment} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase font-bold text-white/40 mb-2">Tu Calificación</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`w-6 h-6 ${star <= rating ? 'fill-[#FF9800] text-[#FF9800]' : 'text-white/20'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase font-bold text-white/40 mb-2">Comentario</label>
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="¿Qué opinas de este build?"
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF9800] transition-colors min-h-[100px]"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-[#FF9800] transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Publicando...' : 'Publicar Opinión'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Comments List */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Comentarios <span className="text-[#FF9800] text-sm">({comments.length})</span>
                    </h3>

                    {comments.length === 0 ? (
                        <p className="text-white/40 italic">Sé el primero en opinar sobre este proyecto.</p>
                    ) : (
                        <div className="space-y-6">
                            {topLevelComments.map((comment) => (
                                <div key={comment.id} className="flex flex-col gap-4">
                                    {/* Parent Comment */}
                                    <div className="bg-[#111] border border-[#222] p-6 rounded-2xl flex gap-4">
                                        <div className="flex-shrink-0">
                                            <Link href={`/profile/${comment.user_id}`} className="block w-10 h-10 rounded-full bg-[#222] overflow-hidden border-2 border-white/10 relative hover:border-[#FF9800] transition-colors">
                                                {comment.profiles?.avatar_url ? (
                                                    <Image src={comment.profiles.avatar_url} alt="User" fill className="object-cover" />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-white/40 font-bold bg-[#1a1a1a]">
                                                        {comment.profiles?.name?.charAt(0) || '?'}
                                                    </div>
                                                )}
                                            </Link>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <Link href={`/profile/${comment.user_id}`} className="font-bold text-white text-sm hover:text-[#FF9800] transition-colors">
                                                    {comment.profiles?.name || 'Usuario'}
                                                </Link>
                                                <div className="flex items-center gap-4">
                                                    {/* Like Button */}
                                                    <button
                                                        onClick={() => handleCommentLike(comment.id)}
                                                        className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${comment.isLiked ? 'text-red-500' : 'text-white/40 hover:text-white'}`}
                                                        title={comment.isLiked ? 'Ya no me gusta' : 'Me gusta'}
                                                    >
                                                        <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`} />
                                                        <span>{comment.likes || 0}</span>
                                                    </button>

                                                    {/* Reply Button */}
                                                    <button
                                                        onClick={() => setReplyingToCommentId(replyingToCommentId === comment.id ? null : comment.id)}
                                                        className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${replyingToCommentId === comment.id ? 'text-[#FF9800]' : 'text-white/40 hover:text-white'}`}
                                                        title="Responder"
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                        <span>Responder</span>
                                                    </button>

                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3 h-3 ${i < (comment.rating || 0) ? 'fill-[#FF9800] text-[#FF9800]' : 'text-white/10'}`}
                                                            />
                                                        ))}
                                                    </div>

                                                    {/* Edit/Delete Controls */}
                                                    {user && user.id === comment.user_id && (
                                                        <div className="flex gap-1 ml-2 border-l border-white/10 pl-2">
                                                            <button
                                                                onClick={() => startEditing(comment)}
                                                                className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Edit2 className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                                className="p-1 hover:bg-red-500/10 rounded text-white/40 hover:text-red-500 transition-colors"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {editingCommentId === comment.id ? (
                                                <div className="flex gap-2 items-start mt-2">
                                                    <textarea
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800]"
                                                        rows={2}
                                                    />
                                                    <div className="flex flex-col gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.preventDefault(); saveEdit(comment.id); }}
                                                            className="p-1.5 bg-[#FF9800] text-black rounded-lg hover:bg-[#FF9800]/80"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.preventDefault(); setEditingCommentId(null); }}
                                                            className="p-1.5 bg-[#222] text-white rounded-lg hover:bg-[#333]"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-white/80 text-sm leading-relaxed">{comment.content}</p>
                                                    <div className="mt-3 text-xs text-white/30">
                                                        {new Date(comment.created_at).toLocaleDateString()}
                                                    </div>
                                                </>
                                            )}

                                            {/* Reply Form */}
                                            {replyingToCommentId === comment.id && (
                                                <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                                                    <div className="w-8 h-8 rounded-full bg-[#222] overflow-hidden border border-white/10 flex-shrink-0">
                                                        {user?.image ? (
                                                            <Image src={user.image} alt="Me" width={32} height={32} className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white/30">{user?.name?.charAt(0)}</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={replyContent}
                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                            placeholder={`Responder a ${comment.profiles?.name || 'usuario'}...`}
                                                            className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800]"
                                                            autoFocus
                                                        />
                                                        <button type="submit" disabled={isSubmitting} className="bg-[#FF9800] text-black p-2 rounded-lg hover:bg-[#e68a00] transition-colors">
                                                            <Send className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    </div>

                                    {/* Replies List */}
                                    {getReplies(comment.id).length > 0 && (
                                        <div className="ml-12 space-y-4 border-l-2 border-white/5 pl-4">
                                            {getReplies(comment.id).map(reply => (
                                                <div key={reply.id} className="bg-[#111]/50 border border-[#222] p-4 rounded-xl flex gap-3">
                                                    <div className="flex-shrink-0">
                                                        <Link href={`/profile/${reply.user_id}`} className="block w-8 h-8 rounded-full bg-[#222] overflow-hidden border border-white/10 relative hover:border-[#FF9800] transition-colors">
                                                            {reply.profiles?.avatar_url ? (
                                                                <Image src={reply.profiles.avatar_url} alt="User" fill className="object-cover" />
                                                            ) : (
                                                                <div className="absolute inset-0 flex items-center justify-center text-white/40 font-bold text-xs bg-[#1a1a1a]">
                                                                    {reply.profiles?.name?.charAt(0) || '?'}
                                                                </div>
                                                            )}
                                                        </Link>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <Link href={`/profile/${reply.user_id}`} className="font-bold text-white text-xs hover:text-[#FF9800] transition-colors">
                                                                {reply.profiles?.name || 'Usuario'}
                                                            </Link>
                                                            <div className="flex items-center gap-3">
                                                                <button
                                                                    onClick={() => handleCommentLike(reply.id)}
                                                                    className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${reply.isLiked ? 'text-red-500' : 'text-white/40 hover:text-white'}`}
                                                                >
                                                                    <Heart className={`w-3 h-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                                                                    <span>{reply.likes || 0}</span>
                                                                </button>
                                                                {user && user.id === reply.user_id && (
                                                                    <div className="flex gap-1 ml-1 pl-1 border-l border-white/10">
                                                                        <button onClick={() => handleDeleteComment(reply.id)} className="text-white/30 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-white/70 text-sm">{reply.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
