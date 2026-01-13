'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { Send, MessageSquare, Heart, Reply, Gift } from 'lucide-react';
import { useSession } from '@/app/lib/auth-client';
import Link from 'next/link';
import Image from "next/image";
import { toast } from 'sonner';

interface Comment {
    id: string;
    content: string;
    created_at: string;
    profiles: {
        username: string;
        avatar_url: string;
        full_name: string;
    };
}

export const CommentsSection = ({ targetId, targetType, onCommentAdded }: { targetId: string, targetType: 'project' | 'lesson' | 'post', onCommentAdded?: () => void }) => {
    console.log("CommentsSection mounted for:", { targetId, targetType });
    const supabase = createClient();
    const [comments, setComments] = useState<Comment[]>([]);
    const [activeGiftMenu, setActiveGiftMenu] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [mentionCandidates, setMentionCandidates] = useState<any[]>([]);
    const [showMentions, setShowMentions] = useState(false);
    const [cursorPos, setCursorPos] = useState(0);
    const { data: session } = useSession(); // Unified Auth
    const user = session?.user;

    const MINI_GIFTS = [
        { id: 'tuerca', icon: '🔧', price: '2k' },
        { id: 'gas', icon: '⛽', price: '10k' },
        { id: 'nitro', icon: '🚀', price: '20k' },
    ];

    useEffect(() => {
        // Fetch Comments
        fetchComments();

        // Subscribe to new comments (Realtime!)
        const channel = supabase
            .channel('comments')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `target_id=eq.${targetId}` }, (payload) => {
                fetchComments();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [targetId]);

    const fetchComments = async () => {
        const { data } = await supabase
            .from('comments')
            .select('*, profiles(username, avatar_url, full_name)')
            .eq('target_id', targetId)
            .order('created_at', { ascending: true });

        if (data) setComments(data as any);
    };

    // --- MENTION LOGIC ---
    const searchUsers = async (query: string) => {
        if (query.length < 1) {
            setMentionCandidates([]);
            setShowMentions(false);
            return;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
            .limit(5);

        if (error) {
            console.error("Error searching users:", error);
            return;
        }

        if (data && data.length > 0) {
            setMentionCandidates(data);
            setShowMentions(true);
        } else {
            setShowMentions(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const pos = e.target.selectionStart;
        setNewComment(value);
        setCursorPos(pos);

        // Detect @mention
        const textBeforeCursor = value.slice(0, pos);
        const lastAt = textBeforeCursor.lastIndexOf('@');

        if (lastAt !== -1) {
            const query = textBeforeCursor.slice(lastAt + 1);
            // Allow only valid username characters (no spaces)
            if (!/\s/.test(query)) {
                searchUsers(query);
            } else {
                setShowMentions(false);
            }
        } else {
            setShowMentions(false);
        }
    };

    const insertMention = (username: string) => {
        const textBefore = newComment.slice(0, cursorPos);
        const textAfter = newComment.slice(cursorPos);
        const lastAt = textBefore.lastIndexOf('@');

        const newText = textBefore.slice(0, lastAt) + `@${username} ` + textAfter;
        setNewComment(newText);
        setShowMentions(false);
    };

    const [isPosting, setIsPosting] = useState(false);

    const handlePost = async () => {
        if (!newComment.trim() || !user) return;
        setIsPosting(true);

        try {
            console.log("Posting comment...", { user_id: user.id, target_id: targetId, content: newComment });

            // Ensure targetId is robustly handled, even if strict triggers are tricky
            const { error } = await supabase.from('comments').insert({
                user_id: user.id,
                target_id: targetId,
                target_type: targetType,
                content: newComment
            });

            if (error) {
                console.error("Error posting comment:", error);
                toast.error("Error al publicar: " + error.message);
            } else {
                setNewComment('');
                await fetchComments(); // Force immediate update
                onCommentAdded?.();
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="mt-12 max-w-3xl">
            <h3 className="text-xl font-bold font-oswald text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#FF9800]" />
                Comentarios ({comments.length})
            </h3>

            {/* List */}
            <div className="space-y-6 mb-8">
                {/* Pinned Welcome Message */}
                <div className="flex gap-4 mb-6 pb-6 border-b border-white/5 bg-[#FF9800]/5 p-4 rounded-2xl border border-[#FF9800]/10">
                    <div className="w-10 h-10 rounded-2xl bg-[#FF9800]/20 flex items-center justify-center text-[#FF9800] border border-[#FF9800]/20 shrink-0">
                        <span className="font-bold text-xs">SC</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-white">Speedlight Culture</span>
                            <span className="text-xs text-white/40">Ahora</span>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed bg-[#111] p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-[#222]">
                            ¡Bienvenido a los comentarios! Aquí puedes opinar, dar me gusta y premiar a la comunidad.
                        </p>
                        <div className="flex items-center gap-6 mt-2 ml-1">
                            <button className="flex items-center gap-1.5 text-xs text-white/40"><Heart className="w-3.5 h-3.5" /> <span>Me gusta</span></button>
                            <button className="flex items-center gap-1.5 text-xs text-white/40"><Reply className="w-3.5 h-3.5" /> <span>Responder</span></button>
                            <button className="flex items-center gap-1.5 text-xs text-[#FF9800]/70"><Gift className="w-3.5 h-3.5" /> <span>Premiar</span></button>
                        </div>
                    </div>
                </div>

                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="w-10 h-10 rounded-2xl bg-[#333] overflow-hidden flex-shrink-0 relative">
                            {comment.profiles?.avatar_url ? (
                                <Image src={comment.profiles.avatar_url} alt="Ava" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                    {comment.profiles?.full_name?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-bold text-white">{comment.profiles?.full_name || 'Usuario'}</span>
                                <span className="text-xs text-white/40">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed bg-[#111] p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-[#222]">
                                {comment.content.split(' ').map((word, i) => {
                                    if (word.startsWith('@')) {
                                        const username = word.substring(1); // Remove '@'
                                        return (
                                            <Link key={i} href={`/profile/${username}`} className="text-[#FF9800] font-bold cursor-pointer hover:underline mx-0.5">
                                                {word}
                                            </Link>
                                        );
                                    }
                                    return <span key={i}>{word} </span>;
                                })}
                            </p>

                            {/* COMMENT ACTIONS: Like, Reply, Gift */}
                            <div className="flex items-center gap-6 mt-2 ml-1">
                                <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-red-500 transition-colors group">
                                    <Heart className="w-3.5 h-3.5 group-hover:fill-current" />
                                    <span>Me gusta</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
                                    <Reply className="w-3.5 h-3.5" />
                                    <span>Responder</span>
                                </button>
                                {/* GIFT TO COMMENT (Micro-tipping) & MINI MENU */}
                                <div className="relative">
                                    <button
                                        onClick={() => setActiveGiftMenu(activeGiftMenu === comment.id ? null : comment.id)}
                                        className={`flex items-center gap-1.5 text-xs transition-colors ${activeGiftMenu === comment.id ? 'text-[#FF9800]' : 'text-[#FF9800]/70 hover:text-[#FF9800]'}`}
                                    >
                                        <Gift className="w-3.5 h-3.5" />
                                        <span>Premiar</span>
                                    </button>

                                    {/* MINI POPUP MENU */}
                                    {activeGiftMenu === comment.id && (
                                        <div className="absolute bottom-full left-0 mb-2 bg-[#0D0805] border border-[#FF9800]/30 rounded-xl shadow-xl p-2 flex gap-2 z-50 animate-in zoom-in-50 slide-in-from-bottom-2">
                                            {MINI_GIFTS.map(gift => (
                                                <button
                                                    key={gift.id}
                                                    onClick={() => {
                                                        toast.success(`Enviaste ${gift.icon} a ${comment.profiles?.full_name}`);
                                                        setActiveGiftMenu(null);
                                                    }}
                                                    className="flex flex-col items-center justify-center w-10 h-12 bg-white/5 hover:bg-[#FF9800]/20 rounded-lg transition-colors border border-transparent hover:border-[#FF9800]/50"
                                                    title={`Enviar por ${gift.price}`}
                                                >
                                                    <span className="text-lg leading-none mb-1">{gift.icon}</span>
                                                    <span className="text-[9px] font-bold text-[#FF9800]">{gift.price}</span>
                                                </button>
                                            ))}
                                            <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-[#0D0805] border-b border-r border-[#FF9800]/30 rotate-45 transform"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            {user ? (
                <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-2xl bg-[#222] overflow-hidden flex-shrink-0 relative border border-white/10">
                            {user.image ? (
                                <Image src={user.image} alt="User" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                    {user.name?.charAt(0) || 'T'}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="text-xs text-white/50 mb-1 ml-1 font-bold">{user.name}</div>

                        {/* Mention Suggestions Dropdown */}
                        {showMentions && mentionCandidates.length > 0 && (
                            <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#0D0805] border border-[#FF9800]/20 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
                                <div className="px-3 py-2 text-[10px] text-[#FF9800] font-bold uppercase tracking-wider bg-[#FF9800]/10 border-b border-[#FF9800]/10">
                                    Sugerencias
                                </div>
                                {mentionCandidates.map((candidate) => (
                                    <button
                                        key={candidate.id}
                                        onClick={() => insertMention(candidate.username)}
                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors text-left group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-black/50 overflow-hidden relative border border-white/10 group-hover:border-[#FF9800]/50 transition-colors">
                                            {candidate.avatar_url ? (
                                                <Image src={candidate.avatar_url} alt={candidate.username || 'User'} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/50 text-xs font-bold">
                                                    {candidate.username.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-[#FF9800] transition-colors">@{candidate.username}</p>
                                            <p className="text-xs text-white/40 truncate max-w-[120px]">{candidate.full_name}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        <textarea
                            value={newComment}
                            onChange={handleInputChange}
                            placeholder="Escribe un comentario..."
                            className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl p-4 text-white focus:outline-none focus:border-[#FF9800] transition-colors resize-none pr-12"
                            rows={3}
                        />
                        <button
                            onClick={handlePost}
                            disabled={!newComment.trim() || isPosting}
                            className="absolute bottom-3 right-3 bg-[#FF9800] text-black p-2 rounded-lg hover:bg-[#F57C00] disabled:opacity-50 transition-all"
                        >
                            {isPosting ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-[#111]/50 backdrop-blur-md p-6 rounded-2xl text-center border border-dashed border-white/10 flex flex-col items-center gap-3">
                    <p className="text-white/60 text-sm">Debes iniciar sesión para comentar.</p>
                    <a href="/login" className="px-6 py-2 bg-[#FF9800] text-black text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-[#F57C00] transition-colors shadow-lg shadow-[#FF9800]/20">
                        Iniciar Sesión
                    </a>
                </div>
            )}
        </div>
    );
};
