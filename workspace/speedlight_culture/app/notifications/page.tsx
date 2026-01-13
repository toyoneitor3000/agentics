"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Bell, MessageSquare, Star, Heart, Share2, Info, AtSign, UserPlus } from "lucide-react";
import Link from "next/link";
import { useSession } from '@/app/lib/auth-client';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '@/app/actions/notifications';
import { toast } from 'sonner';

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "a";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mes";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "min";
    return Math.floor(seconds) + "s";
}

export default function NotificationsPage() {
    const [filter, setFilter] = useState<'all' | 'mentions' | 'system'>('all');
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Auth - Use App Session (Source of Truth)
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const supabase = createClient();

    // Fetch Notifications (Server Action)
    const fetchNotifications = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [userId]);

    // Realtime Subscription (Keep for live updates)
    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel('realtime_notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `recipient_id=eq.${userId}`,
                },
                async (payload) => {
                    // Refresh completely to get actor data easily
                    // Or implement refined fetch. Refresh is safer.
                    fetchNotifications();
                    toast.info("Nueva notificación recibida");
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const markAllAsRead = async () => {
        if (!userId) return;

        // Optimistic UI update
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

        await markAllNotificationsRead();
    };

    const markOneAsRead = async (notifId: string) => {
        // Optimistic
        setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
        await markNotificationRead(notifId);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'like': return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
            case 'comment': return <MessageSquare className="w-5 h-5 text-blue-400 fill-blue-400/20" />;
            case 'mention': return <AtSign className="w-5 h-5 text-[#FF9800]" />;
            case 'follow': return <UserPlus className="w-5 h-5 text-green-500" />;
            case 'system': return <Info className="w-5 h-5 text-purple-500" />;
            default: return <Bell className="w-5 h-5 text-white/60" />;
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'mentions') return n.type === 'mention';
        if (filter === 'system') return n.type === 'system' || n.type === 'admin_broadcast';
        return true;
    });

    return (
        <div className="min-h-screen bg-transparent text-white pb-24 pt-20 px-4 md:px-0">
            <div className="max-w-xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold font-oswald uppercase tracking-wide">Notificaciones</h1>
                    {notifications.some(n => !n.is_read) && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-white/40 hover:text-[#FF9800] transition-colors"
                        >
                            Marcar todo como leído
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${filter === 'all' ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/40'}`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setFilter('mentions')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${filter === 'mentions' ? 'bg-[#FF9800] text-black border-[#FF9800]' : 'bg-transparent text-white/40 border-white/10 hover:border-white/40'}`}
                    >
                        Menciones
                    </button>
                    <button
                        onClick={() => setFilter('system')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${filter === 'system' ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent text-white/40 border-white/10 hover:border-white/40'}`}
                    >
                        Sistema
                    </button>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {loading && (
                        <div className="space-y-4 animate-pulse">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-20 bg-white/5 rounded-xl border border-white/5" />
                            ))}
                        </div>
                    )}

                    {!loading && filteredNotifications.length === 0 && (
                        <div className="py-20 text-center opacity-40">
                            <Bell className="w-12 h-12 mx-auto mb-4 text-white/20" />
                            <p className="text-sm">No tienes notificaciones nuevas.</p>
                        </div>
                    )}

                    {!loading && filteredNotifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => {
                                if (!notif.is_read) markOneAsRead(notif.id);
                                if (notif.target_type === 'news') {
                                    window.location.href = '/news';
                                }
                            }}
                            className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all group cursor-pointer 
                                ${!notif.is_read
                                    ? 'bg-white/10 border-white/20'
                                    : 'bg-black/20 border-white/5 hover:bg-white/5'
                                }`}
                        >
                            {/* Avatar or Icon */}
                            <div className="shrink-0 relative">
                                {notif.actor?.avatar_url ? (
                                    <img src={notif.actor.avatar_url} alt={notif.actor.username} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/40">
                                        {getIcon(notif.type)}
                                    </div>
                                )}
                                {/* Small Icon Badge Overlay */}
                                {notif.actor?.avatar_url && (
                                    <div className="absolute -bottom-1 -right-1 bg-black/80 rounded-full p-0.5 border border-black/50">
                                        {getIcon(notif.type)}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white/90 leading-relaxed break-words">
                                    {notif.target_type === 'news' || !notif.actor?.username ? (
                                        <span className="font-bold mr-1 text-[#FF9800]">
                                            Speedlight Team
                                        </span>
                                    ) : notif.actor?.username && (
                                        <span className="font-bold mr-1 hover:text-[#FF9800] transition-colors">
                                            {notif.actor.username}
                                        </span>
                                    )}
                                    {notif.message || notif.content || "Nueva notificación"}
                                </p>
                                <span className="text-[10px] text-white/40 mt-1 block font-mono">
                                    {timeAgo(notif.created_at)}
                                </span>
                            </div>

                            {/* Status Dot */}
                            {!notif.is_read && (
                                <div className="shrink-0 w-2 h-2 bg-[#FF9800] rounded-full mt-2" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
