'use client';

import { useState, useEffect } from "react";
import { getNotifications, markAllNotificationsRead, markNotificationRead, deleteAllNotifications } from '@/app/actions/notifications';
import { Bell, MessageSquare, Heart, Info, AtSign, UserPlus, X, Check, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/client";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | undefined;
}

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

export default function NotificationsModal({ isOpen, onClose, userId }: NotificationsModalProps) {
    const [filter, setFilter] = useState<'all' | 'mentions' | 'system'>('all');
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

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
        if (isOpen && userId) {
            fetchNotifications();
        }
    }, [isOpen, userId]);

    // Realtime Subscription (Keep for live updates)
    useEffect(() => {
        if (!userId || !isOpen) return;

        const channel = supabase
            .channel('modal_notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `recipient_id=eq.${userId}`,
                },
                async () => {
                    fetchNotifications();
                    toast.info("Nueva notificación recibida");
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, isOpen]);

    const markAllAsRead = async () => {
        if (!userId) return;

        // Optimistic UI update
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        await markAllNotificationsRead();
    };

    const clearAll = async () => {
        if (!userId || notifications.length === 0) return;

        if (confirm('¿Estás seguro de que deseas borrar todas las notificaciones? Esta acción no se puede deshacer.')) {
            // Optimistic update
            setNotifications([]);
            await deleteAllNotifications();
            toast.success("Notificaciones borradas");
        }
    };

    const markOneAsRead = async (notifId: string) => {
        // Optimistic
        setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
        await markNotificationRead(notifId);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'like': return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
            case 'comment': return <MessageSquare className="w-4 h-4 text-blue-400 fill-blue-400/20" />;
            case 'mention': return <AtSign className="w-4 h-4 text-[#FF9800]" />;
            case 'follow': return <UserPlus className="w-4 h-4 text-green-500" />;
            case 'system': return <Info className="w-4 h-4 text-purple-500" />;
            default: return <Bell className="w-4 h-4 text-white/60" />;
        }
    };

    const handleNotificationClick = (notif: any) => {
        if (!notif.is_read) markOneAsRead(notif.id);
        if (notif.target_type === 'news') {
            router.push('/news');
            onClose();
        }
        // Can add more navigation logic here based on notification type
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'mentions') return n.type === 'mention';
        if (filter === 'system') return n.type === 'system' || n.type === 'admin_broadcast';
        return true;
    });

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop - clickeable para cerrar */}
            <div
                className="fixed inset-0 z-[205] bg-black/40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Notification Menu - posicionado debajo de la navbar */}
            <div className="fixed top-[62px] left-0 right-0 z-[206] flex justify-center px-4 animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="w-full max-w-md bg-[#0A0A0A]/40 backdrop-blur-3xl border border-white/10 rounded-2xl flex flex-col max-h-[calc(100vh-100px)] overflow-hidden shadow-2xl shadow-black/60">

                    {/* Header */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#FF9800]/10 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-[#FF9800]" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-lg font-oswald uppercase tracking-wide">Notificaciones</h2>
                                {notifications.some(n => !n.is_read) && (
                                    <span className="text-xs text-[#FF9800]">{notifications.filter(n => !n.is_read).length} nuevas</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-500/20 rounded-xl text-red-500 transition-all group"
                                    title="Borrar todas las notificaciones"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Limpiar</span>
                                </button>
                            )}
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex p-2 gap-2 border-b border-white/5 bg-transparent">
                        <button
                            onClick={() => setFilter('all')}
                            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${filter === 'all' ? 'bg-white text-black' : 'text-white/40 hover:bg-white/5'}`}
                        >
                            Todas
                        </button>
                        <button
                            onClick={() => setFilter('mentions')}
                            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${filter === 'mentions' ? 'bg-[#FF9800] text-black' : 'text-white/40 hover:bg-white/5'}`}
                        >
                            Menciones
                        </button>
                        <button
                            onClick={() => setFilter('system')}
                            className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${filter === 'system' ? 'bg-blue-500 text-white' : 'text-white/40 hover:bg-white/5'}`}
                        >
                            Sistema
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-2">
                        {loading ? (
                            <div className="space-y-3 animate-pulse p-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-white/5 rounded-xl" />
                                ))}
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="py-16 text-center opacity-40">
                                <Bell className="w-12 h-12 mx-auto mb-4 text-white/20" />
                                <p className="text-sm">No tienes notificaciones nuevas.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredNotifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group
                                        ${!notif.is_read
                                                ? 'bg-white/5 border-[#FF9800]/30 hover:bg-white/10'
                                                : 'bg-transparent border-white/5 hover:bg-white/5'
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
                                                <div className="absolute -bottom-1 -right-1 bg-[#0A0A0A] rounded-full p-0.5 border border-black/50">
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
                                            <div className="shrink-0 w-2 h-2 bg-[#FF9800] rounded-full mt-2 animate-pulse" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                        {notifications.some(n => !n.is_read) && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-2 text-xs text-white/40 hover:text-[#FF9800] transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                            >
                                <Check className="w-4 h-4" />
                                Marcar todo como leído
                            </button>
                        )}
                        <Link
                            href="/notifications"
                            onClick={onClose}
                            className="ml-auto text-xs text-[#FF9800] hover:text-[#FF9800]/80 transition-colors px-3 py-2 rounded-lg hover:bg-[#FF9800]/10"
                        >
                            Ver todas →
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
