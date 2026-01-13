'use client';

import { useState, useEffect } from "react";
import { Search, X, Users, MessageSquare, Plus, Check } from "lucide-react";
import Image from "next/image";
import { getSuggestedContacts, getFollowingContacts, createGroupConversation, startConversation } from "@/app/actions/messages";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface NewChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConversationCreated: (id: string, user?: any) => void;
}

export default function NewChatModal({ isOpen, onClose, onConversationCreated }: NewChatModalProps) {
    const [view, setView] = useState<'contacts' | 'following' | 'group'>('contacts');
    const [contacts, setContacts] = useState<any[]>([]);
    const [following, setFollowing] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Group Chat State
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [contactsData, followingData] = await Promise.all([
                getSuggestedContacts(), // Mutual
                getFollowingContacts()  // Following
            ]);
            setContacts(contactsData);
            setFollowing(followingData);
        } catch (error) {
            console.error(error);
            toast.error("Error cargando contactos");
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelect = async (user: any) => {
        try {
            // For 1-on-1, start conversation directly
            const convoId = await startConversation(user.id);
            onConversationCreated(convoId, {
                other_name: user.full_name || user.username,
                other_avatar: user.avatar_url,
                other_user_id: user.id
            });
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Error iniciando chat");
        }
    };

    const toggleUserSelection = (userId: string) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            toast.error("Ingresa un nombre para el grupo");
            return;
        }
        if (selectedUsers.size < 2) {
            toast.error("Selecciona al menos 2 personas");
            return;
        }

        try {
            const apiParticipants = Array.from(selectedUsers);
            const convoId = await createGroupConversation(groupName, apiParticipants);
            onConversationCreated(convoId); // Group listener logic should pick it up or we treat it as generic
            toast.success("Grupo creado");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Error creando grupo");
        }
    };

    // Filter lists
    const filterList = (list: any[]) => {
        if (!searchQuery) return list;
        return list.filter(u =>
            (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl flex flex-col max-h-[80vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-white font-bold text-lg">Nuevo Mensaje</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex p-2 gap-2 border-b border-white/5 bg-[#161616]">
                    <button
                        onClick={() => setView('contacts')}
                        className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${view === 'contacts' ? 'bg-[#FF9800] text-black' : 'text-white/40 hover:bg-white/5'}`}
                    >
                        Contactos
                    </button>
                    <button
                        onClick={() => setView('following')}
                        className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${view === 'following' ? 'bg-[#FF9800] text-black' : 'text-white/40 hover:bg-white/5'}`}
                    >
                        Seguidos
                    </button>
                    <button
                        onClick={() => setView('group')}
                        className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${view === 'group' ? 'bg-[#FF9800] text-black' : 'text-white/40 hover:bg-white/5'}`}
                    >
                        Grupo
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar..."
                            className="w-full bg-[#050505] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF9800]/50 placeholder-white/20"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-2">
                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-white/30 text-xs">Could not load users...</div>
                    ) : (
                        <>
                            {view === 'group' && (
                                <div className="p-2 mb-2">
                                    <label className="text-xs text-white/40 font-bold uppercase mb-1 block">Nombre del Grupo</label>
                                    <input
                                        type="text"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        placeholder="Ej. Proyecto Alpha"
                                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800]/50"
                                    />
                                    <div className="mt-4 flex items-center justify-between text-xs text-white/40 uppercase font-bold">
                                        <span>Seleccionar Participantes ({selectedUsers.size})</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                {filterList(
                                    view === 'group'
                                        ? [...contacts, ...following].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
                                        : (view === 'contacts' ? contacts : following)
                                ).map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => view === 'group' ? toggleUserSelection(user.id) : handleUserSelect(user)}
                                        className={`p-2 flex items-center gap-3 rounded-xl cursor-pointer transition-colors ${view === 'group' && selectedUsers.has(user.id)
                                            ? 'bg-[#FF9800]/20 border border-[#FF9800]/30'
                                            : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <div className="relative shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-[#222] overflow-hidden">
                                                {user.avatar_url ? (
                                                    <Image src={user.avatar_url} alt="User" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white font-bold">{user.username?.[0] || 'U'}</div>
                                                )}
                                            </div>
                                            {view === 'group' && selectedUsers.has(user.id) && (
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FF9800] rounded-full flex items-center justify-center text-black">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-white truncate">{user.full_name || user.username}</h3>
                                            <p className="text-xs text-white/40 truncate">@{user.username}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer for Group */}
                {view === 'group' && (
                    <div className="p-4 border-t border-white/5 bg-[#161616]">
                        <button
                            onClick={handleCreateGroup}
                            disabled={selectedUsers.size < 2 || !groupName.trim()}
                            className="w-full py-3 bg-[#FF9800] text-black font-bold uppercase rounded-xl hover:bg-[#FF9800]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Crear Grupo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
