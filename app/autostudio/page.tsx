"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Zap, Wrench, Loader2, Bot } from 'lucide-react';
import Image from 'next/image';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    suggestions?: any[];
}

export default function AutoStudioPage() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Bienvenido a AutoStudio. Soy tu asistente de personalización. ¿Qué modificación tienes en mente para tu auto hoy? Puedo sugerirte los mejores talleres certificados.'
        }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Simulate AI Response (Mock)
        setTimeout(() => {
            let responseContent = "Entiendo lo que buscas. Basado en tu ubicación y vehículo, aquí tienes algunas opciones:";
            let suggestions: any[] = [];

            if (input.toLowerCase().includes('pintura') || input.toLowerCase().includes('color')) {
                responseContent = "Para trabajos de pintura de alta gama, te recomiendo estos talleres especializados en corrección y PPF:";
                suggestions = [
                    { name: "Paint Mods Studio", rating: 4.8, location: "Medellín" },
                    { name: "Gloss Hunters", rating: 4.9, location: "Bogotá" }
                ];
            } else if (input.toLowerCase().includes('motor') || input.toLowerCase().includes('turbo')) {
                responseContent = "Si buscas potencia, necesitas manos expertas. Estos son los mejores en performance:";
                suggestions = [
                    { name: "Taller Hermanos Gasca", rating: 4.5, location: "Bogotá" },
                    { name: "Race Tech", rating: 4.7, location: "Cali" }
                ];
            } else {
                responseContent = "Puedo ayudarte con Performance, Estética, Audio y más. ¿Podrías ser más específico con la modificación que deseas?";
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseContent,
                suggestions: suggestions.length > 0 ? suggestions : undefined
            };

            setMessages(prev => [...prev, aiMsg]);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white pb-20 md:pb-0">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#0A0A0A]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF9800] to-[#F57C00] flex items-center justify-center shadow-[0_0_15px_rgba(255,152,0,0.3)]">
                    <Bot className="w-6 h-6 text-black fill-black" />
                </div>
                <div>
                    <h1 className="font-oswald font-bold text-xl uppercase tracking-wider">Auto<span className="text-[#FF9800]">Studio</span></h1>
                    <p className="text-xs text-white/50 font-roboto-mono">AI Personalization Assistant</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 ${msg.role === 'user'
                            ? 'bg-[#FF9800] text-black font-medium'
                            : 'bg-[#1A1A1A] border border-white/10 text-white/90'
                            }`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>

                            {/* Suggestions Cards */}
                            {msg.suggestions && (
                                <div className="mt-4 space-y-3">
                                    {msg.suggestions.map((sug: any, idx: number) => (
                                        <div key={idx} className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                                                    <Wrench className="w-4 h-4 text-[#FF9800]" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-white">{sug.name}</h4>
                                                    <span className="text-xs text-white/50">{sug.location}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-[#FF9800]/20 px-2 py-1 rounded">
                                                <span className="text-[#FF9800] text-xs font-bold">{sug.rating} ★</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-[#1A1A1A] rounded-2xl p-4 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-[#FF9800] animate-spin" />
                            <span className="text-xs text-white/50">Escribiendo...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0A0A0A] border-t border-white/10">
                <div className="max-w-4xl mx-auto relative flex items-center gap-2 bg-[#1A1A1A] rounded-2xl p-2 border border-white/5 focus-within:border-[#FF9800]/50 transition-colors">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ej: Quiero pintar mi rines de negro brillante..."
                        className="flex-1 bg-transparent text-white placeholder-white/30 px-4 py-2 outline-none font-roboto-mono text-sm"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="p-3 bg-[#FF9800] rounded-xl hover:bg-[#F57C00] disabled:opacity-50 disabled:hover:bg-[#FF9800] transition-colors text-black"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
