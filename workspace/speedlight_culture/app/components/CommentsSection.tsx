'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { Send, MessageSquare } from 'lucide-react';

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

export const CommentsSection = ({ targetId, targetType }: { targetId: string, targetType: 'project' | 'lesson' | 'post' }) => {
    const supabase = createClient();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Fetch User
        supabase.auth.getUser().then(({ data }) => setUser(data.user));

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

    const handlePost = async () => {
        if (!newComment.trim() || !user) return;

        await supabase.from('comments').insert({
            user_id: user.id,
            target_id: targetId,
            target_type: targetType,
            content: newComment
        });

        setNewComment('');
    };

    return (
        <div className="mt-12 max-w-3xl">
            <h3 className="text-xl font-bold font-oswald text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#FF9800]" />
                Comentarios ({comments.length})
            </h3>

            {/* List */}
            <div className="space-y-6 mb-8">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="w-10 h-10 rounded-full bg-[#333] overflow-hidden flex-shrink-0">
                            {comment.profiles?.avatar_url ? (
                                <img src={comment.profiles.avatar_url} alt="Ava" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                    {comment.profiles?.full_name?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-bold text-white">{comment.profiles?.full_name || 'Usuario'}</span>
                                <span className="text-xs text-white/40">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed bg-[#111] p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-[#222]">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            {user ? (
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#222] overflow-hidden flex-shrink-0">
                        {/* Current User Avatar Placeholder */}
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escribe un comentario..."
                            className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl p-4 text-white focus:outline-none focus:border-[#FF9800] transition-colors resize-none pr-12"
                            rows={3}
                        />
                        <button
                            onClick={handlePost}
                            disabled={!newComment.trim()}
                            className="absolute bottom-3 right-3 bg-[#FF9800] text-black p-2 rounded-lg hover:bg-[#F57C00] disabled:opacity-50 transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-[#111] p-4 rounded-xl text-center border border-[#222]">
                    <p className="text-white/50 text-sm mb-2">Inicia sesión para unirte a la discusión.</p>
                </div>
            )}
        </div>
    );
};
