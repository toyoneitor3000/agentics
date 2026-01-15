"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, User, LogIn, Search, Settings, Edit3, LogOut, Loader2, LayoutDashboard, ChevronLeft, Megaphone, MessageCircle } from "lucide-react";
import { useSession, signOut } from "@/app/lib/auth-client";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { UserBadge } from "../UserBadge";
import NotificationsModal from "../NotificationsModal";

export default function AppHeader() {
    const { data: session, isPending } = useSession();
    const user = session?.user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const supabase = createClient();
    const pathname = usePathname();
    const router = useRouter();

    // Check Admin Role
    useEffect(() => {
        async function checkRole() {
            if (user?.id) {
                const { data } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (data) {
                    setUserRole(data.role);
                }
            }
        }
        checkRole();
    }, [user?.id, supabase]);

    const isAdmin = userRole === 'CEO' || userRole === 'ADMIN';
    // --- NAVIGATION LOGIC ---
    // Define main pages where Back Button should NOT appear
    const mainPages = ['/', '/cinema', '/projects', '/gallery', '/marketplace', '/academy', '/workshops', '/events', '/autostudio', '/search', '/notifications'];
    const showBackButton = pathname && !mainPages.includes(pathname);

    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const [showIgWarning, setShowIgWarning] = useState(false);
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);

    // --- INTELLIGENCE AT THE EDGE: NOTIFICATIONS & ENVIRONMENT ---
    // --- REALTIME NOTIFICATIONS & MESSAGES CHECK ---
    useEffect(() => {
        if (!user) return;

        // 1. Initial Check from DB (Notifications)
        const checkUnreadNotifications = async () => {
            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('recipient_id', user.id)
                .eq('is_read', false);

            if (!error && count !== null && count > 0) {
                setHasUnreadNotifications(true);
            }
        };
        checkUnreadNotifications();

        // 2. Initial Check from DB (Messages)
        const checkUnreadMessages = async () => {
            // RLS filters ensuring we only count messages in OUR conversations
            const { count, error } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .is('read_at', null)
                .neq('sender_id', user.id); // Not sent by me

            if (!error && count !== null && count > 0) {
                setHasUnreadMessages(true);
            }
        };
        checkUnreadMessages();

        // 3. Realtime Listener
        const channel = supabase
            .channel('header_updates')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `recipient_id=eq.${user.id}`,
                },
                () => {
                    setHasUnreadNotifications(true);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages'
                },
                (payload) => {
                    // Optimized: Only re-check if sender is not me
                    if (payload.new.sender_id !== user.id) {
                        checkUnreadMessages();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, supabase]);

    // --- INSTAGRAM / IN-APP BROWSER DETECTION ---
    useEffect(() => {
        const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
        const isInstagram = (ua.indexOf('Instagram') > -1) || (ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1);

        if (isInstagram) {
            // Show a friendly toast/banner for better experience
            const hasSeenWarning = sessionStorage.getItem('ig_browser_warning');
            if (!hasSeenWarning) {
                // We'll dispatch a custom event or straightforwardly inject a toast here eventually.
                // For now, let's console log or set a state if we had a global toast.
                // Since we don't have a global toast context readily exposed here,
                // we will create a simple DOM overlay or use alert for MVP/Dev transparency,
                // but for production, we should render a nice Banner.
                // Let's render a Banner component conditionally in the return.
                setShowIgWarning(true);
                sessionStorage.setItem('ig_browser_warning', 'true');
            }
        }
    }, []);

    const handleNotificationClick = () => {
        setHasUnreadNotifications(false);
        setShowNotificationsModal(true);
        localStorage.setItem('last_notification_check', Date.now().toString());
    };

    const handleMessageClick = () => {
        setHasUnreadMessages(false);
    };

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.reload();
                }
            }
        });
    };

    return (
        <>
            {/* INSTAGRAM BROWSER WARNING / ACTION (LIQUID GLASS) */}
            {showIgWarning && (
                <button
                    onClick={() => {
                        const doc = window.document as any;
                        const docEl = doc.documentElement as any;
                        const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
                        if (requestFullScreen) {
                            requestFullScreen.call(docEl).catch((e: any) => console.log("Fullscreen blocked", e));
                        }
                        setShowIgWarning(false);
                    }}
                    className="fixed top-0 left-0 right-0 z-[170] bg-[#FF9800]/20 hover:bg-[#FF9800]/30 backdrop-blur-xl border-b border-[#FF9800]/50 text-[#FF9800] h-14 flex items-center justify-center px-4 shadow-[0_0_30px_rgba(255,152,0,0.2)] animate-in slide-in-from-top duration-700 cursor-pointer group"
                >
                    <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 font-oswald font-bold uppercase tracking-widest text-[10px] md:text-sm drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-center">
                        <span className="animate-pulse hidden md:inline">⚠️</span>
                        <span className="text-white group-hover:text-[#FF9800] transition-colors">
                            NAVEGADOR LIMITADO DETECTADO. ABRE EL MENÚ <span className="text-[#FF9800] text-lg leading-none">•••</span> Y ELIGE "ABRIR EN NAVEGADOR"
                        </span>
                        <span className="animate-pulse hidden md:inline">⚠️</span>
                    </div>
                </button>
            )}

            <header className={`fixed top-0 left-0 right-0 z-[210] flex justify-between items-center px-2 md:px-4 py-3 w-full bg-transparent h-[70px] pointer-events-none ${showIgWarning ? 'mt-14' : ''}`}>
                {/* Cinematic Deep Fade Gradient (Background) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-[-1]" />

                {/* Left: Back Button (Deep Nav) OR Notifications (Main Nav) */}
                <div className="flex items-center gap-2 z-10 pointer-events-auto">
                    {showBackButton && (
                        <button
                            onClick={() => router.back()}
                            className="text-white hover:text-[#FF9800] transition-colors p-2 -ml-2 flex items-center justify-center bg-transparent"
                            aria-label="Volver atrás"
                        >
                            <ChevronLeft className="w-8 h-8 md:w-6 md:h-6" />
                        </button>
                    )}

                    {/* Mobile: Message/Notification Icon on Main Pages OR News (ONLY IF LOGGED IN) */}
                    {user && (!showBackButton || pathname === '/news') && (
                        <>
                            <Link
                                href="/messages"
                                onClick={handleMessageClick}
                                className={`text-white/80 hover:text-[#FF9800] transition-colors p-2 relative md:hidden ${showBackButton ? '' : '-ml-2'}`}
                            >
                                <MessageCircle className={`${pathname === '/news' ? 'w-5 h-5' : 'w-6 h-6'}`} />
                                {hasUnreadMessages && (
                                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF9800] rounded-full animate-pulse border border-black shadow-[0_0_8px_#FF9800]" />
                                )}
                            </Link>
                            <button
                                onClick={handleNotificationClick}
                                className={`text-white/80 hover:text-[#FF9800] transition-colors p-2 relative md:hidden ${showBackButton ? '' : '-ml-2'}`}
                            >
                                <Bell className={`${pathname === '/news' ? 'w-5 h-5' : 'w-6 h-6'}`} />
                                {hasUnreadNotifications && (
                                    <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-[#FF9800] rounded-full animate-pulse border border-black shadow-[0_0_8px_#FF9800]" />
                                )}
                            </button>
                        </>
                    )}

                    {/* Desktop: Brand Logo */}
                    <Link href="/" className="hidden md:block opacity-100 hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/logonavbar.png"
                            alt="Speedlight Culture"
                            width={180}
                            height={50}
                            className="w-40 h-auto object-contain"
                            priority
                        />
                    </Link>
                </div>

                {/* Center: Logo (Mobile Only) */}
                <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
                    <Link href="/" className="block opacity-100 hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/logonavbar.png"
                            alt="Speedlight Culture"
                            width={140}
                            height={40}
                            className="w-32 h-auto object-contain drop-shadow-xl"
                            priority
                        />
                    </Link>
                </div>

                {/* Right: Profile / Auth */}
                <div className="flex items-center gap-2 z-10 pointer-events-auto">
                    {/* Search Icon (Moved from Bottom Nav) */}
                    <Link href="/search" className="text-white hover:text-[#FF9800] transition-colors p-1">
                        <Search className="w-5 h-5" />
                    </Link>

                    {/* Desktop: Extra Actions (e.g. Notifications) */}
                    <div className="hidden md:flex items-center gap-2 mr-2">
                        {(!showBackButton || pathname === '/news') && user && (
                            <>
                                <Link
                                    href="/messages"
                                    onClick={handleMessageClick}
                                    className="text-white/60 hover:text-[#FF9800] p-2 transition-colors relative"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    {hasUnreadMessages && (
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF9800] rounded-full animate-pulse border border-black shadow-[0_0_8px_#FF9800]" />
                                    )}
                                </Link>
                                <button
                                    onClick={handleNotificationClick}
                                    className="text-white/60 hover:text-[#FF9800] p-2 transition-colors relative"
                                >
                                    <Bell className="w-5 h-5" />
                                    {hasUnreadNotifications && (
                                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#FF9800] rounded-full animate-pulse border border-black shadow-[0_0_8px_#FF9800]" />
                                    )}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Auth Status */}
                    {isPending ? (
                        <Loader2 className="w-6 h-6 text-[#FF9800] animate-spin" />
                    ) : user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-3 text-white hover:text-[#FF9800] transition-colors group"
                            >
                                <div className="flex flex-col items-end hidden md:flex">
                                    <span className="text-xs font-bold uppercase tracking-wider">{user.name?.split(' ')[0]}</span>
                                    {/* Badge in Header */}
                                    <UserBadge role={userRole || 'user'} size="sm" />
                                </div>
                                {user.image ? (
                                    <div className="w-8 h-8 rounded-xl border border-[#FF9800]/50 group-hover:border-[#FF9800] overflow-hidden transition-colors shadow-[0_0_10px_rgba(255,152,0,0.1)]">
                                        <Image src={user.image} alt={user.name || "User"} width={32} height={32} className="object-cover w-full h-full" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-xl border border-white/20 bg-white/5 flex items-center justify-center">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 top-12 w-56 bg-[#0A0A0A] border border-[#222] rounded-xl shadow-2xl py-2 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-white/5 md:hidden flex justify-between items-center">
                                            <div className="overflow-hidden">
                                                <p className="text-white font-bold text-sm truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            {/* Badge in Mobile Dropdown Header */}
                                            <UserBadge role={userRole || 'user'} size="sm" />
                                        </div>

                                        {/* Admin Link */}
                                        {isAdmin && (
                                            <Link
                                                href="/admin"
                                                className="px-4 py-3 text-sm text-white/80 hover:text-[#FF9800] hover:bg-white/5 flex items-center gap-3 transition-colors border-b border-white/5"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Admin Panel
                                            </Link>
                                        )}

                                        <Link
                                            href="/profile"
                                            className="px-4 py-3 text-sm text-white/80 hover:text-[#FF9800] hover:bg-white/5 flex items-center gap-3 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            Tu Perfil
                                        </Link>

                                        {/* Link de Publicidad / Negocio */}
                                        <Link
                                            href="/advertising"
                                            className="px-4 py-3 text-sm text-white/80 hover:text-[#FF9800] hover:bg-white/5 flex items-center gap-3 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <Megaphone className="w-4 h-4" />
                                            Publicidad / Negocio
                                        </Link>

                                        <Link
                                            href="/settings"
                                            className="px-4 py-3 text-sm text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <Settings className="w-4 h-4 text-white/50" />
                                            Ajustes
                                        </Link>
                                        <div className="h-px bg-white/10 my-1 mx-4"></div>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center gap-2 bg-[#FF9800] hover:bg-[#F57C00] text-black px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(255,152,0,0.2)]">
                            <LogIn className="w-4 h-4" />
                            <span className="hidden md:inline">Acceder</span>
                        </Link>
                    )}
                </div>
            </header>

            {/* Notifications Modal */}
            <NotificationsModal
                isOpen={showNotificationsModal}
                onClose={() => setShowNotificationsModal(false)}
                userId={user?.id}
            />
        </>
    );
}
