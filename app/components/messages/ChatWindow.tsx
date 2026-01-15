'use client';

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Send, Image as ImageIcon, MapPin, Mic, MoreVertical, Check, CheckCheck, Clock } from "lucide-react";
import { getMessages, sendMessage, markMessagesAsRead, markMessagesAsDelivered } from "@/app/actions/messages";
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
    read_at?: string | null;
    delivered_at?: string | null;
    status?: 'sending' | 'sent' | 'delivered' | 'read';
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
                // Mark as read immediately when opening
                markMessagesAsRead(conversationId);
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
                    const newMsg = payload.new as Message;

                    // If message is from other user, mark it as delivered (and read since we are here)
                    if (newMsg.sender_id !== currentUser?.id) {
                        // We are viewing the chat, so mark as read immediately
                        markMessagesAsRead(conversationId);
                    }

                    setMessages(prev => {
                        // Avoid duplicates from optimistic updates
                        if (prev.find(m => m.id === newMsg.id)) {
                            return prev.map(m => m.id === newMsg.id ? { ...newMsg, status: 'sent' } : m);
                        }
                        return [...prev, newMsg];
                    });
                    scrollToBottom();
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    const updatedMsg = payload.new as Message;
                    setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
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
            avatar_url: currentUser?.image || undefined,
            status: 'sending'
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage("");
        scrollToBottom();

        try {
            await sendMessage(conversationId, optimisticMsg.content);
            // Success: update status to 'sent' (though realtime INSERT usually handles this)
            setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: 'sent' } : m));
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
        <div className="flex flex-col h-full bg-[#0D0805] relative">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#111]/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-[#222] overflow-hidden border border-white/10">
                            {otherUser?.other_avatar ? (
                                <Image src={otherUser.other_avatar} alt="User" fill className="object-cover rounded-xl" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-bold rounded-xl">{otherUser?.other_name?.[0]}</div>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-md border-2 border-[#111] shadow-[0_0_8px_rgba(76,175,80,0.5)]"></div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">{otherUser?.other_name || 'Usuario'}</h3>
                        <p className="text-white/40 text-xs">
                            {otherUser?.is_group ? 'Grupo' : 'En línea'}
                        </p>
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
                                <div className={`flex items-center justify-end gap-1 mt-1 opacity-60 ${isMe ? 'text-black/60' : 'text-white/40'}`}>
                                    <span className="text-[10px]">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isMe && (
                                        <span className="ml-1">
                                            {msg.status === 'sending' ? (
                                                <Clock className="w-3 h-3" />
                                            ) : msg.read_at ? (
                                                <CheckCheck className="w-3 h-3 text-blue-600" />
                                            ) : msg.delivered_at ? (
                                                <CheckCheck className="w-3 h-3" />
                                            ) : (
                                                <Check className="w-3 h-3" />
                                            )}
                                        </span>
                                    )}
                                </div>
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
