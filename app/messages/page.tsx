'use client';

import { useState } from "react";
import ConversationList from "@/app/components/messages/ConversationList";
import ChatWindow from "@/app/components/messages/ChatWindow";
import { MessageSquare, ChevronLeft } from "lucide-react";

export default function MessagesPage() {
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [activeUser, setActiveUser] = useState<any>(null);

    const handleSelect = (id: string, user: any) => {
        setActiveConversationId(id);
        setActiveUser(user);
    };

    const handleBack = () => {
        setActiveConversationId(null);
        setActiveUser(null);
    };

    return (
        <div className="flex h-screen bg-black pt-[90px] relative"> {/* Add padding for Navbar */}

            {/* Sidebar (List) - Hidden on mobile if chat is active */}
            <div className={`w-full md:w-80 lg:w-96 border-r border-[#222] flex flex-col ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                <ConversationList activeId={activeConversationId} onSelect={handleSelect} />
            </div>

            {/* Chat Area - Hidden on mobile if no chat active */}
            <div className={`flex-1 flex flex-col bg-[#0D0805] relative ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                {activeConversationId ? (
                    <>
                        {/* Mobile Back Button Overlay (Inside Header usually, but here for structure) */}
                        <div className="md:hidden absolute top-4 left-4 z-50">
                            <button onClick={handleBack} className="p-2 bg-black/50 backdrop-blur rounded-xl text-white border border-white/10">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>
                        <ChatWindow conversationId={activeConversationId} otherUser={activeUser} />
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/20 p-8 text-center">
                        <div className="w-20 h-20 bg-[#111] rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                            <MessageSquare className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-bold text-white/40 mb-2">Tus Mensajes</h2>
                        <p className="max-w-xs text-sm">Seleccion una conversación para comenzar a chatear o busca un usuario.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
