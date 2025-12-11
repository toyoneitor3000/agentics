"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Compass, ShoppingBag, GraduationCap, MessageCircle, Heart, PlusSquare, User, Menu, Camera, Calendar, ChevronLeft, ChevronRight, Play, Wrench, MessageSquare } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import LanguageSwitcher from "../LanguageSwitcher";

interface DesktopSidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export default function DesktopSidebar({ isCollapsed, toggleSidebar }: DesktopSidebarProps) {
    const pathname = usePathname();
    const { language } = useLanguage();

    const t_nav = {
        es: {
            home: "Inicio",
            cinema: "Cinema",
            explore: "Explorar",
            gallery: "Galería",
            academy: "Academy",
            marketplace: "Marketplace",
            autostudio: "AutoStudio",
            workshops: "Talleres",
            events: "Eventos",
            messages: "Mensajes",
            notifications: "Notificaciones",
            create: "Crear",
            profile: "Perfil"
        },
        en: {
            home: "Home",
            cinema: "Cinema",
            explore: "Explore",
            gallery: "Gallery",
            academy: "Academy",
            marketplace: "Marketplace",
            autostudio: "AutoStudio",
            workshops: "Workshops",
            events: "Events",
            messages: "Messages",
            notifications: "Notifications",
            create: "Create",
            profile: "Profile"
        }
    };

    const labels = t_nav[language];

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { name: labels.home, path: "/", icon: Home },
        { name: labels.cinema, path: "/reels", icon: Play },
        { name: labels.explore, path: "/projects", icon: Compass },
        { name: labels.gallery, path: "/gallery", icon: Camera },
        { name: labels.academy, path: "/academy", icon: GraduationCap },
        { name: labels.marketplace, path: "/marketplace", icon: ShoppingBag },
        { name: labels.autostudio, path: "/autostudio", icon: MessageSquare },
        { name: labels.workshops, path: "/workshops", icon: Wrench },
        { name: labels.events, path: "/events", icon: Calendar },
        { name: labels.messages, path: "/messages", icon: MessageCircle },
        { name: labels.notifications, path: "/notifications", icon: Heart },
        { name: labels.create, path: "/create", icon: PlusSquare },
        { name: labels.profile, path: "/profile", icon: User },
    ];

    return (
        <div
            className={`hidden md:flex flex-col fixed left-0 top-0 h-full bg-[#050302] border-r border-[#FF9800]/10 py-6 z-50 transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[244px]'}`}
        >
            {/* Logo */}
            <div className={`mb-10 px-4 flex ${isCollapsed ? 'justify-center' : 'items-center justify-between'}`}>
                {!isCollapsed ? (
                    <Link href="/" className="block">
                        <Image
                            src="/logonavbar.png"
                            alt="Speedlight"
                            width={140}
                            height={30}
                            className="w-auto h-8 object-contain"
                        />
                    </Link>
                ) : (
                    <Link href="/" className="block">
                        <Image
                            src="/favicon.ico" // Assuming favicon or small logo exists, else use standard icon
                            alt="S"
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain"
                        />
                    </Link>
                )}

            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col space-y-2 px-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-3 py-3 rounded-xl transition-all duration-300 group relative
                                ${active
                                    ? "text-[#FF9800] bg-[#FF9800]/10 font-bold"
                                    : "text-[#F5E6D3] hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <Icon
                                className={`w-6 h-6 transition-transform group-hover:scale-110 ${active ? "fill-[#FF9800] text-[#FF9800]" : ""}`}
                                strokeWidth={active ? 2.5 : 2}
                            />
                            {!isCollapsed && <span className="text-base tracking-wide">{item.name}</span>}

                            {/* Tooltip for Collapsed Mode */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-[#1A1A1A] text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle (Bottom) */}
            <div className="px-3 mt-auto space-y-2">
                <LanguageSwitcher collapsed={isCollapsed} />

                {!isCollapsed && (
                    <button className="flex items-center gap-4 text-[#F5E6D3] hover:text-white transition-colors w-full p-3 rounded-xl hover:bg-white/5">
                        <Menu className="w-6 h-6" />
                        <span className="text-base tracking-wide">Más</span>
                    </button>
                )}
                <button
                    onClick={toggleSidebar}
                    className={`mt-4 flex items-center justify-center w-full p-2 text-[#F5E6D3] hover:text-[#FF9800] hover:bg-white/5 rounded-lg transition-colors`}
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
