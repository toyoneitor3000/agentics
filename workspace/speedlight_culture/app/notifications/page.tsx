"use client";

import { useState } from "react";
import { Bell, MessageSquare, Star, Heart, Share2, Info } from "lucide-react";

export default function NotificationsPage() {
    const [filter, setFilter] = useState<'all' | 'mentions' | 'system'>('all');

    // MOCK DATA (Eventually this comes from Supabase 'notifications' table)
    const notifications = [
        {
            id: 1,
            type: 'like',
            user: 'Pigmento Design',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
            content: 'le gustó tu publicación "RX-7 Build Day 1"',
            time: 'Hace 2m',
            read: false
        },
        {
            id: 2,
            type: 'system',
            content: 'Bienvenido al Cinema 2.0. Ahora puedes subir contenido vertical.',
            time: 'Hace 1h',
            read: false,
            icon: Info
        },
        {
            id: 3,
            type: 'comment',
            user: 'JDM_Lover',
            avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=60',
            content: 'comentó: "¡Brutal esa edición! 🔥"',
            time: 'Hace 4h',
            read: true
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-24 pt-20 px-4 md:px-0">
            <div className="max-w-xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold font-oswald uppercase tracking-wide">Notificaciones</h1>
                    <button className="text-xs text-white/40 hover:text-[#FF9800]">Marcar todo como leído</button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${filter === 'all' ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/40'}`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setFilter('mentions')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${filter === 'mentions' ? 'bg-[#FF9800] text-black border-[#FF9800]' : 'bg-transparent text-white/40 border-white/10 hover:border-white/40'}`}
                    >
                        Menciones
                    </button>
                    <button
                        onClick={() => setFilter('system')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${filter === 'system' ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent text-white/40 border-white/10 hover:border-white/40'}`}
                    >
                        Sistema
                    </button>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {notifications.map((notif) => (
                        <div key={notif.id} className={`flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-[#111] transition-colors ${!notif.read ? 'bg-white/5 border-white/10' : ''}`}>
                            {/* Avatar or Icon */}
                            <div className="shrink-0">
                                {notif.avatar ? (
                                    <img src={notif.avatar} alt="User" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <Info className="w-5 h-5" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <p className="text-sm text-white/90 leading-relaxed">
                                    {notif.user && <span className="font-bold mr-1">{notif.user}</span>}
                                    {notif.content}
                                </p>
                                <span className="text-[10px] text-white/40 mt-1 block font-mono">{notif.time}</span>
                            </div>

                            {/* Status Dot */}
                            {!notif.read && (
                                <div className="w-2 h-2 bg-[#FF9800] rounded-full mt-2" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Empty State Mock */}
                {notifications.length === 0 && (
                    <div className="py-20 text-center opacity-40">
                        <Bell className="w-12 h-12 mx-auto mb-4" />
                        <p>No tienes notificaciones nuevas.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
