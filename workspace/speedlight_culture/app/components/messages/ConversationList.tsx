'use client';

import { useEffect, useState, useRef } from "react";
import { getConversations, startConversation, searchUsers, getSuggestedContacts } from "@/app/actions/messages";
import Image from "next/image";
import { Search, UserPlus, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function ConversationList({ activeId, onSelect }: { activeId: string | null, onSelect: (id: string, user: any) => void }) {
    const [conversations, setConversations] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

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

    const handleUserSelect = async (user: any) => {
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
                                        <div className="w-10 h-10 rounded-full bg-[#222] overflow-hidden">
                                            {user.avatar_url ? (
                                                <Image src={user.avatar_url} alt="User" fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white font-bold">{user.username?.[0] || 'U'}</div>
                                            )}
                                        </div>
                                        {user.relationship === 'mutual' && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FF9800] rounded-full flex items-center justify-center border-2 border-[#050505]" title="Mutuo">
                                                <UserPlus className="w-2 h-2 text-black" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h3 className="text-sm font-bold text-white truncate">{user.full_name || user.username}</h3>
                                        <p className="text-xs text-white/40 truncate">@{user.username}</p>
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
                                                <div className="w-10 h-10 rounded-full bg-[#222] overflow-hidden border border-transparent group-hover:border-[#FF9800]/30 transition-colors">
                                                    {user.avatar_url ? (
                                                        <Image src={user.avatar_url} alt="User" fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white font-bold">{user.username?.[0] || 'U'}</div>
                                                    )}
                                                </div>
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#050505]"></div>
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
                                            <div className="w-12 h-12 rounded-full bg-[#222] overflow-hidden">
                                                {c.other_avatar ? (
                                                    <Image src={c.other_avatar} alt="User" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white font-bold">{c.other_name?.[0] || 'U'}</div>
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
                    </div>
                ))
                        )}
            </div>
        </>
    )
}
            </div >
        </div >
    );
}
