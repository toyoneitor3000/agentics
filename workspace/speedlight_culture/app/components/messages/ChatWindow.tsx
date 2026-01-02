'use client';

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Send, Image as ImageIcon, MapPin, Mic, MoreVertical } from "lucide-react";
import { getMessages, sendMessage } from "@/app/actions/messages";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "@/app/lib/auth-client";

interface Message {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
    type: string;
    avatar_url?: string;
}

export default function ChatWindow({ conversationId, otherUser }: { conversationId: string, otherUser: any }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();
    const currentUser = session?.user;

    // Load initial messages
    useEffect(() => {
        if (!conversationId) return;

        setLoading(true);
        getMessages(conversationId)
            .then(data => {
                setMessages(data);
                setLoading(false);
                scrollToBottom();
            })
            .catch(err => console.error(err));

        // Realtime Subscription
        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    // Check if message already exists (optimistic update handle)
                    const newMsg = payload.new as Message;
                    setMessages(prev => {
                        if (prev.find(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                    scrollToBottom();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        // Optimistic Update
        const tempId = Math.random().toString();
        const optimisticMsg: Message = {
            id: tempId,
            content: newMessage,
            sender_id: currentUser?.id || 'unknown',
            created_at: new Date().toISOString(),
            type: 'text',
            avatar_url: currentUser?.image
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage("");
        scrollToBottom();

        try {
            await sendMessage(conversationId, optimisticMsg.content);
            // The realtime listener will eventually confirm this, 
            // but we might want to replace the temp ID if we were doing strict state management
        } catch (error) {
            console.error("Failed to send", error);
            toast.error("Error al enviar mensaje");
            // Remove optimistic message on error
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (loading) return <div className="h-full flex items-center justify-center text-white/40">Cargando chat...</div>;

    return (
        <div className="flex flex-col h-full bg-[#050505] relative">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#111]/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-[#222] overflow-hidden border border-white/10">
                            {otherUser?.other_avatar ? (
                                <Image src={otherUser.other_avatar} alt="User" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-bold">{otherUser?.other_name?.[0]}</div>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]"></div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">{otherUser?.other_name || 'Usuario'}</h3>
                        <p className="text-white/40 text-xs">En línea</p>
                    </div>
                </div>
                <button className="text-white/40 hover:text-white p-2 text-2xl">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUser?.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl p-3 ${isMe
                                ? 'bg-[#FF9800] text-black rounded-tr-none'
                                : 'bg-[#222] text-white rounded-tl-none border border-white/5'
                                }`}>
                                <p className="text-sm md:text-md whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                <span className={`text-[10px] mt-1 block opacity-60 text-right ${isMe ? 'text-black/60' : 'text-white/40'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
                <div className="flex items-end gap-2 bg-[#1a1a1a] p-2 rounded-xl border border-white/5 focus-within:border-[#FF9800]/50 transition-colors">
                    <button className="p-2 text-white/40 hover:text-[#FF9800] transition-colors"><ImageIcon className="w-5 h-5" /></button>
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none resize-none py-2 max-h-32"
                        rows={1}
                    />
                    {newMessage.trim() ? (
                        <button
                            onClick={handleSend}
                            className="p-2 bg-[#FF9800] text-black rounded-lg hover:bg-[#F57C00] transition-transform active:scale-95"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    ) : (
                        <button className="p-2 text-white/40 hover:text-white transition-colors"><Mic className="w-5 h-5" /></button>
                    )}
                </div>
            </div>
        </div>
    );
}
