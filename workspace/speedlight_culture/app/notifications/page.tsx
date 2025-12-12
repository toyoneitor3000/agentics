"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/client";
import { Heart, MessageCircle, UserPlus, Bell, ChevronRight, Loader2, Check } from "lucide-react";
import OneSignal from 'react-onesignal';
import { useLanguage } from "@/app/context/LanguageContext";

type NotificationType = 'like' | 'comment' | 'follow' | 'system' | 'admin_broadcast';

interface NotificationItem {
    id: string;
    recipient_id: string;
    actor_id?: string;
    type: NotificationType;
    target_id?: string;
    target_type?: string;
    message?: string;
    is_read: boolean;
    created_at: string;
    actor?: {
        full_name: string;
        avatar_url: string | null;
    };
}

export default function NotificationsPage() {
    const supabase = createClient();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();

    const t_notif = {
        es: {
            title: "Notificaciones",
            empty: "No tienes notificaciones nuevas.",
            types: {
                like: "le gustó tu",
                comment: "comentó en tu",
                follow: "comenzó a seguirte",
                system: "Notificación del sistema",
                admin_broadcast: "Anuncio de Speedlight"
            },
            context: {
                project: "proyecto",
                gallery: "foto",
                marketplace: "artículo",
                profile: ""
            },
            pushTitle: "Activa las notificaciones",
            pushDesc: "No te pierdas de nada. Recibe alertas en tu celular cuando alguien interactúe contigo.",
            enableBtn: "Activar Push Notifications"
        },
        en: {
            title: "Notifications",
            empty: "You have no new notifications.",
            types: {
                like: "liked your",
                comment: "commented on your",
                follow: "started following you",
                system: "System Notification",
                admin_broadcast: "Speedlight Announcement"
            },
            context: {
                project: "project",
                gallery: "photo",
                marketplace: "item",
                profile: ""
            },
            pushTitle: "Enable Push Notifications",
            pushDesc: "Don't miss out. Get alerts on your phone when someone interacts with you.",
            enableBtn: "Enable Push Notifications"
        }
    };

    const strings = t_notif[language || 'es'];

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setLoading(false);
            return;
        }

        // 1. Fetch raw notifications
        const { data: notificationsData, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('recipient_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]); // Show empty state on error instead of fake data
        } else if (notificationsData && notificationsData.length > 0) {
            // 2. Manually fetch actors (users) to avoid foreign key issues
            const actorIds = [...new Set(notificationsData.map((n: any) => n.actor_id).filter(Boolean))];

            let profilesMap = new Map();
            if (actorIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('profiles') // Assuming 'profiles' table exists and is public
                    .select('id, full_name, avatar_url')
                    .in('id', actorIds);

                if (profiles) {
                    profilesMap = new Map(profiles.map((p: any) => [p.id, p]));
                }
            }

            // 3. Merge data
            const enrichedNotifications = notificationsData.map((n: any) => ({
                ...n,
                actor: n.actor_id ? profilesMap.get(n.actor_id) : null
            }));

            setNotifications(enrichedNotifications);
            markAllRead(user.id);
        } else {
            setNotifications([]);
        }
        setLoading(false);
    };

    const markAllRead = async (userId: string) => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('recipient_id', userId)
            .eq('is_read', false);
    };

    const handleEnablePush = async () => {
        if (window.location.hostname === 'localhost') {
            alert("Las Notificaciones Push requieren un dominio HTTPS seguro (producción). No están disponibles en localhost.");
            return;
        }
        try {
            await OneSignal.Slidedown.promptPush();
        } catch (e) {
            console.error("OneSignal Prompt Error", e);
        }
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'like': return <Heart className="w-4 h-4 text-white fill-red-500" />;
            case 'comment': return <MessageCircle className="w-4 h-4 text-blue-400 fill-blue-400/20" />;
            case 'follow': return <UserPlus className="w-4 h-4 text-green-500" />;
            case 'system': return <Bell className="w-4 h-4 text-[#FF9800]" />;
            default: return <Bell className="w-4 h-4 text-white" />;
        }
    };

    const getGradient = (type: NotificationType) => {
        switch (type) {
            case 'like': return "from-red-500/20 to-transparent";
            case 'comment': return "from-blue-500/20 to-transparent";
            case 'follow': return "from-green-500/20 to-transparent";
            default: return "from-[#FF9800]/10 to-transparent";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex justify-center">
                <Loader2 className="w-8 h-8 text-[#FF9800] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-0 max-w-2xl mx-auto">
            <div className="flex justify-between items-end mb-8 px-2">
                <h1 className="text-3xl font-oswald font-bold text-white uppercase tracking-wider glow-text">
                    {strings.title}
                </h1>
                <button
                    onClick={fetchNotifications}
                    className="text-xs text-[#FF9800] uppercase tracking-widest hover:text-white transition-colors"
                >
                    Refresh
                </button>
            </div>

            {/* Push Permission Banner (if relevant, logically we'd check permission state first) */}
            <div className="mb-8 p-6 bg-gradient-to-r from-black/60 to-black/30 backdrop-blur-md rounded-2xl border border-white/5 flex flex-col md:flex-row items-center gap-6 shadow-xl">
                <div className="p-3 bg-[#FF9800]/20 rounded-full">
                    <Bell className="w-6 h-6 text-[#FF9800]" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-white font-bold mb-1">{strings.pushTitle}</h3>
                    <p className="text-sm text-gray-400">{strings.pushDesc}</p>
                </div>
                <button
                    onClick={handleEnablePush}
                    className="px-6 py-2 bg-[#FF9800] text-black font-bold uppercase text-[10px] tracking-widest rounded-full hover:bg-white transition-colors shadow-[0_0_15px_rgba(255,152,0,0.4)]"
                >
                    {strings.enableBtn}
                </button>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                    <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">{strings.empty}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`relative overflow-hidden group p-4 rounded-xl border transition-all duration-300 ${notif.is_read
                                ? 'bg-black/20 border-white/5 hover:bg-black/40'
                                : 'bg-black/40 border-[#FF9800]/30 hover:bg-black/50'
                                }`}
                        >
                            {/* Type Indicator Gradient */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getGradient(notif.type)}`}></div>

                            <div className="flex gap-4 items-center">
                                {/* Actor Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-neutral-800 overflow-hidden border border-white/10">
                                        {notif.actor?.avatar_url ? (
                                            <Image
                                                src={notif.actor.avatar_url}
                                                alt="Avatar"
                                                width={48}
                                                height={48}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-white/30">
                                                {notif.actor?.full_name?.charAt(0) || '?'}
                                            </div>
                                        )}
                                    </div>
                                    {/* Icon Badge */}
                                    <div className="absolute -bottom-1 -right-1 p-1 bg-[#1A0F08] rounded-full border border-white/10">
                                        {getIcon(notif.type)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        <span className="font-bold text-white hover:text-[#FF9800] cursor-pointer transition-colors">
                                            {notif.actor?.full_name || 'System'}
                                        </span>
                                        {' '}
                                        {strings.types[notif.type]}
                                        {' '}
                                        {notif.target_type && (
                                            <span className="text-gray-400">
                                                {/* Translate target type key to friendly name */}
                                                {(strings.context as any)[notif.target_type] || ''}
                                            </span>
                                        )}
                                        {notif.message && <span className="text-gray-400">: "{notif.message}"</span>}
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-roboto-mono">
                                        {new Date(notif.created_at).toLocaleDateString()} • {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>

                                {/* Action / Unread Dot */}
                                {!notif.is_read && (
                                    <div className="w-2 h-2 rounded-full bg-[#FF9800] shadow-[0_0_10px_#FF9800]"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
