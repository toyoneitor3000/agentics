'use client';

import { useEffect, useState } from "react";
import { getConversations } from "@/app/actions/messages";
import Image from "next/image";
import { Search } from "lucide-react";

export default function ConversationList({ activeId, onSelect }: { activeId: string | null, onSelect: (id: string, user: any) => void }) {
    const [conversations, setConversations] = useState<any[]>([]);

    useEffect(() => {
        getConversations()
            .then(setConversations)
            .catch(console.error);
    }, []);

    return (
        <div className="h-full flex flex-col bg-[#050505] border-r border-white/5">
            <div className="p-4 border-b border-white/5">
                <h2 className="text-xl font-bold text-white mb-4 font-oswald uppercase">Mensajes</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Buscar chat..."
                        className="w-full bg-[#111] border border-[#222] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800]/50 placeholder-white/20"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
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
    );
}
