'use client';

import { useEffect, useState, useRef } from "react";
import { startConversation, searchUsers, getSuggestedContacts, getConversations, markMessagesAsDelivered } from "@/app/actions/messages";
import Image from "next/image";
import { Search, UserPlus, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useSession } from '@/app/lib/auth-client';
import { createClient } from '@/app/utils/supabase/client';

export default function ConversationList({ activeId, onSelect }: { activeId: string | null, onSelect: (id: string, user: any) => void }) {
    const [conversations, setConversations] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const supabase = createClient();

    useEffect(() => {
        // Load conversations
        getConversations()
            .then(setConversations)
            .catch(console.error);

        // Load suggestions (mutual follows)
        getSuggestedContacts()
            .then(setSuggestions)
            .catch(console.error);
    }, []);

    // Handle Search
    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (searchQuery.trim()) {
            setIsSearching(true);
            searchTimeout.current = setTimeout(() => {
                searchUsers(searchQuery)
                    .then(results => {
                        setSearchResults(results);
                        setIsSearching(false);
                    })
                    .catch(() => setIsSearching(false));
            }, 300);
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    }, [searchQuery]);

    const { data: session } = useSession();
    const currentUserId = session?.user?.id;
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!currentUserId) return;

        // Global message listener to mark as delivered (if app is open)
        const messageChannel = supabase
            .channel('global_messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages'
                },
                (payload) => {
                    const newMsg = payload.new;
                    // If message is for a conversation I am in (implied by RLS receiving it) and not from me
                    if (newMsg.sender_id !== currentUserId) {
                        markMessagesAsDelivered(newMsg.conversation_id);
                    }
                }
            )
            .subscribe();

        const presenceChannel = supabase.channel('online_users')
            .on('presence', { event: 'sync' }, () => {
                const newState = presenceChannel.presenceState();
                const activeIds = new Set(Object.keys(newState));
                setOnlineUsers(activeIds);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await presenceChannel.track({ online_at: new Date().toISOString(), user_id: currentUserId });
                }
            });

        return () => {
            supabase.removeChannel(messageChannel);
            supabase.removeChannel(presenceChannel);
        };
    }, [currentUserId]);

    // ... existing search logic ...

    // Helper for online badge (Squircle)
    const OnlineBadge = () => (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4CAF50] rounded-md border-2 border-[#050505] shadow-[0_0_8px_rgba(76,175,80,0.5)]" title="En línea"></div>
    );

    const handleUserSelect = async (user: any) => {
        // ... (existing handleUserSelect code) ...
        try {
            // Optimistic selection or loading state could go here
            if (user.has_conversation && user.conversation_id) {
                onSelect(user.conversation_id, {
                    other_name: user.full_name || user.username,
                    other_avatar: user.avatar_url,
                    other_user_id: user.id
                });
            } else {
                // Start new conversation
                const newId = await startConversation(user.id);
                onSelect(newId, {
                    other_name: user.full_name || user.username,
                    other_avatar: user.avatar_url,
                    other_user_id: user.id
                });

                // Refresh conversations list to show the new one
                getConversations().then(setConversations);
            }
            // Clear search to show chat
            setSearchQuery("");
        } catch (error) {
            console.error("Error selecting user:", error);
            toast.error("Error al abrir conversación");
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#050505] border-r border-white/5">
            <div className="p-4 border-b border-white/5">
                <h2 className="text-xl font-bold text-white mb-4 font-oswald uppercase">Mensajes</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar personas..."
                        className="w-full bg-[#111] border border-[#222] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800]/50 placeholder-white/20"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {searchQuery.trim() ? (
                    // Search Results
                    <div className="px-2 py-2">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 px-2">Resultados</h3>
                        {searchResults.length === 0 ? (
                            <div className="text-center text-white/20 py-4 text-xs">
                                {isSearching ? "Buscando..." : "No se encontraron usuarios"}
                            </div>
                        ) : (
                            searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => handleUserSelect(user)}
                                    className="p-2 flex gap-3 cursor-pointer hover:bg-white/5 transition-colors rounded-lg mb-1"
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-10 h-10 rounded-xl bg-[#222] overflow-hidden">
                                            {user.avatar_url ? (
                                                <Image src={user.avatar_url} alt="User" fill className="object-cover rounded-xl" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white font-bold rounded-xl">{user.username?.[0] || 'U'}</div>
                                            )}
                                        </div>
                                        {/* Shows Green Badge if Online */}
                                        {onlineUsers.has(user.id) && <OnlineBadge />}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h3 className="text-sm font-bold text-white truncate">{user.full_name || user.username}</h3>
                                        <p className="text-xs text-white/40 truncate flex items-center gap-1">
                                            @{user.username}
                                            {user.relationship === 'mutual' && <span className="text-[#FF9800] bg-[#FF9800]/10 px-1 rounded text-[9px] ml-1">Mutuo</span>}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    // Default View: Suggestions + Conversations
                    <>
                        {suggestions.length > 0 && (
                            <div className="mb-4">
                                <h3 className="px-4 py-2 text-xs font-bold text-white/40 uppercase tracking-wider">Sugeridos</h3>
                                <div className="space-y-1 px-2">
                                    {suggestions.map((user) => (
                                        <div
                                            key={user.id}
                                            onClick={() => handleUserSelect(user)}
                                            className="p-2 flex gap-3 cursor-pointer hover:bg-white/5 transition-colors rounded-lg group"
                                        >
                                            <div className="relative shrink-0">
                                                <div className="w-10 h-10 rounded-xl bg-[#222] overflow-hidden border border-transparent group-hover:border-[#FF9800]/30 transition-colors">
                                                    {user.avatar_url ? (
                                                        <Image src={user.avatar_url} alt="User" fill className="object-cover rounded-xl" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white font-bold rounded-xl">{user.username?.[0] || 'U'}</div>
                                                    )}
                                                </div>
                                                {/* Shows Green Badge if Online */}
                                                {onlineUsers.has(user.id) && <OnlineBadge />}
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <h3 className="text-sm text-white/90 group-hover:text-white truncate transition-colors">{user.full_name || user.username}</h3>
                                                <p className="text-[10px] text-[#FF9800] truncate flex items-center gap-1">
                                                    Mutual
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-center px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MessageCircle className="w-4 h-4 text-white/60" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="px-4 py-2 text-xs font-bold text-white/40 uppercase tracking-wider">Chats Recientes</h3>
                            {conversations.length === 0 ? (
                                <div className="p-8 text-center text-white/30 text-xs">
                                    No tienes mensajes aún.
                                </div>
                            ) : (
                                conversations.map((c) => (
                                    <div
                                        key={c.id}
                                        onClick={() => onSelect(c.id, c)}
                                        className={`p-4 flex gap-3 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 ${activeId === c.id ? 'bg-white/5 border-l-2 border-l-[#FF9800]' : 'border-l-2 border-l-transparent'}`}
                                    >
                                        <div className="relative shrink-0">
                                            <div className="w-12 h-12 rounded-xl bg-[#222] overflow-hidden">
                                                {c.other_avatar ? (
                                                    <Image src={c.other_avatar} alt="User" fill className="object-cover rounded-xl" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white font-bold rounded-xl">{c.other_name?.[0] || 'U'}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className={`text-sm truncate ${activeId === c.id ? 'text-white font-bold' : 'text-white/80'}`}>{c.other_name || 'Usuario'}</h3>
                                                {c.last_message_at && (
                                                    <span className="text-[10px] text-white/30">
                                                        {new Date(c.last_message_at).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-xs truncate ${activeId === c.id ? 'text-white/60' : 'text-white/40'}`}>
                                                {c.last_message || 'Inicia la conversación...'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
