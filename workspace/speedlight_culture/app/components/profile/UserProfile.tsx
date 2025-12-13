'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Star, Users, Heart, Grid, Youtube, Image as ImageIcon, Briefcase, Zap, BadgeCheck, CarFront, MoreVertical, Archive, Trash2, Edit, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface ProfileProps {
    profile: any;
    stats: {
        followers: number;
        following: number;
        likes_given: number;
        xp: number;
        level: number;
        join_date: string;
    };
    content: {
        projects: any[];
        albums: any[];
        events: any[];
    };
    isOwnProfile: boolean;
    actionButtons?: React.ReactNode;
}

export default function UserProfile({ profile, stats, content, isOwnProfile, actionButtons }: ProfileProps) {
    const [activeTab, setActiveTab] = useState<'garage' | 'gallery' | 'events' | 'cinema' | 'archived'>('garage');
    const supabase = createClient();
    const router = useRouter();
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Filter Content (Active vs Archived)
    const filterContent = (items: any[]) => {
        const active = items.filter(i => !i.archived);
        const archived = items.filter(i => i.archived);
        return { active, archived };
    };

    const projects = filterContent(content.projects);
    const albums = filterContent(content.albums);
    const events = filterContent(content.events);

    const hasArchivedContent = projects.archived.length > 0 || albums.archived.length > 0 || events.archived.length > 0;

    const toggleMenu = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleArchive = async (type: 'projects' | 'gallery_albums' | 'events', id: string, currentStatus: boolean) => {
        await supabase.from(type).update({ archived: !currentStatus }).eq('id', id);
        setOpenMenuId(null);
        router.refresh();
    };

    const handleDelete = async (type: 'projects' | 'gallery_albums' | 'events', id: string) => {
        if (!confirm('¿Estás seguro de eliminar esto permanentemente?')) return;
        await supabase.from(type).delete().eq('id', id);
        setOpenMenuId(null);
        router.refresh();
    };

    // Generic Action Menu Component
    const ActionMenu = ({ type, id, isArchived, editUrl }: { type: 'projects' | 'gallery_albums' | 'events', id: string, isArchived: boolean, editUrl?: string }) => {
        if (!isOwnProfile) return null;

        const menuId = `${type}-${id}`;
        const isOpen = openMenuId === menuId;

        return (
            <div className="absolute top-2 right-2 z-30">
                <button
                    onClick={(e) => toggleMenu(menuId, e)}
                    className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={(e) => { e.preventDefault(); setOpenMenuId(null); }} />
                        <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                            {/* Edit */}
                            {editUrl && (
                                <Link
                                    href={editUrl}
                                    className="px-4 py-3 text-left text-xs font-bold text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                >
                                    <Edit className="w-3 h-3" /> Editar
                                </Link>
                            )}

                            {/* Archive */}
                            <button
                                onClick={(e) => { e.preventDefault(); handleArchive(type, id, isArchived); }}
                                className="px-4 py-3 text-left text-xs font-bold text-white hover:bg-white/5 flex items-center gap-3 transition-colors border-t border-white/5"
                            >
                                {isArchived ? <Eye className="w-3 h-3 text-green-500" /> : <EyeOff className="w-3 h-3 text-yellow-500" />}
                                {isArchived ? 'Mostrar en perfil' : 'Archivar (Ocultar)'}
                            </button>

                            {/* Delete */}
                            <button
                                onClick={(e) => { e.preventDefault(); handleDelete(type, id); }}
                                className="px-4 py-3 text-left text-xs font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors border-t border-white/5"
                            >
                                <Trash2 className="w-3 h-3" /> Eliminar
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-24">
            {/* 1. COVER IMAGE (Full Bleed Mobile) */}
            <div className="relative h-80 md:h-[420px] w-full bg-[#111] overflow-hidden">
                {profile?.cover_url ? (
                    <Image src={profile.cover_url} alt="Cover" fill className="object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#050505] opacity-50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
            </div>

            <div className="px-4 sm:px-6 relative z-10 -mt-40 md:-mt-64">
                {/* 2. HEADER INFO */}
                <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="relative mb-4">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#050505] bg-[#1a1a1a] overflow-hidden shadow-2xl relative z-10">
                            {profile?.avatar_url ? (
                                <Image src={profile.avatar_url} alt={profile.full_name || 'User'} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/20">
                                    {profile?.full_name?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                        {/* Founder/Level Badge (Pill) - Centered below avatar */}
                        {profile?.founder_number && profile.founder_number <= 500 ? (
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/90 border border-[#FFD700]/50 text-[#FFD700] pl-2 pr-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.3)] whitespace-nowrap min-w-max backdrop-blur-md">
                                <Star className="w-3 h-3 fill-[#FFD700]" />
                                <span className="text-[10px] font-black tracking-widest leading-none">
                                    {profile.founder_number.toString().padStart(3, '0')}/500
                                </span>
                            </div>
                        ) : (
                            <div className="absolute -bottom-2 right-2 z-20 bg-[#FF9800] text-black font-black text-xs w-8 h-8 flex items-center justify-center rounded-full border-4 border-[#050505]">
                                {stats.level}
                            </div>
                        )}
                    </div>

                    {/* BADGES ROW (Restored) */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                        {profile?.role === 'CEO' ? (
                            <span className="bg-white text-black border border-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.4)] flex items-center gap-1">
                                <Zap className="w-3 h-3 fill-black" /> CEO
                            </span>
                        ) : (
                            <span className="bg-[#FF9800]/10 text-[#FF9800] border border-[#FF9800]/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                {profile?.role || 'Rookie'}
                            </span>
                        )}
                        {/* If founder > 500, simple Member badge */}
                        {profile?.founder_number && profile.founder_number > 500 && (
                            <span className="text-white/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-white/10 px-2 py-1 rounded-full">
                                <BadgeCheck className="w-3 h-3" /> MEMBER #{profile.founder_number}
                            </span>
                        )}
                    </div>

                    {/* Identifiers */}
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white mb-0 leading-none">
                        {profile?.full_name || 'Racer Unknown'}
                    </h1>
                    {profile?.alias && (
                        <p className="text-[#FF9800] font-medium text-sm tracking-wide mb-1">
                            {profile.alias.startsWith('@') ? profile.alias : `@${profile.alias}`}
                        </p>
                    )}

                    {/* Location & Join Date (Moved Up) */}
                    <div className="flex items-center justify-center gap-3 text-[10px] text-white/40 uppercase tracking-wider mb-3">
                        {profile?.location && profile.show_location !== false && (
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {profile.location}</span>
                        )}
                        {profile?.show_join_date !== false && (
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Desde: {stats.join_date}</span>
                        )}
                    </div>

                    {/* Bio */}
                    {profile?.bio && (
                        <p className="text-white/60 text-xs font-light max-w-sm mx-auto leading-relaxed mb-6 line-clamp-2">
                            {profile.bio}
                        </p>
                    )}

                    {/* Action Buttons (For Public Profiles) */}
                    {actionButtons && (
                        <div className="flex justify-center mb-6">
                            {actionButtons}
                        </div>
                    )}

                    {/* 3. STATS BAR (Refined - No Following, 'Seguidores', 'Respeto' for XP) */}
                    <div className="grid grid-cols-3 divide-x divide-white/10 w-full max-w-xs mx-auto mb-8 border-t border-b border-white/5 py-3 bg-white/[0.02] rounded-xl">
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-white">{stats.followers}</span>
                            <span className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">Seguidores</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-white">{stats.likes_given}</span>
                            <span className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">Likes</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-[#FF9800]">{stats.xp}K</span>
                            <span className="text-[9px] text-[#FF9800]/60 uppercase tracking-widest mt-0.5">XP Total</span>
                        </div>
                    </div>

                    {/* 4. CONTENT TABS (With Labels) */}
                    <div className="overflow-x-auto w-full max-w-lg mb-6 scrollbar-hide">
                        <div className="flex items-center justify-between min-w-max gap-2 px-2">
                            <button
                                onClick={() => setActiveTab('garage')}
                                className={`flex-1 flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${activeTab === 'garage' ? 'bg-[#FF9800] text-black' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Briefcase className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Garaje</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('gallery')}
                                className={`flex-1 flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${activeTab === 'gallery' ? 'bg-[#FF9800] text-black' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                            >
                                <ImageIcon className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Galería</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('events')}
                                className={`flex-1 flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${activeTab === 'events' ? 'bg-[#FF9800] text-black' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Calendar className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Eventos</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('cinema')}
                                className={`flex-1 flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${activeTab === 'cinema' ? 'bg-[#FF9800] text-black' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Youtube className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Cinema</span>
                            </button>

                            {/* Archived Tab (Only for Owner) */}
                            {isOwnProfile && hasArchivedContent && (
                                <button
                                    onClick={() => setActiveTab('archived')}
                                    className={`flex-1 flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${activeTab === 'archived' ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <Archive className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Archivados</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 5. GRID CONTENT */}
                    <div className="w-full max-w-4xl">
                        {/* GARAJE */}
                        {activeTab === 'garage' && (
                            projects.active.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {projects.active.map((p) => (
                                        <div key={p.id} className="relative group">
                                            <Link href={`/projects/${p.id}`} className="block aspect-[4/5] bg-[#1a1a1a] rounded-xl overflow-hidden relative">
                                                {p.cover_image || p.gallery_images?.[0] ? (
                                                    <Image src={p.cover_image || p.gallery_images[0]} alt={p.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/10"><Briefcase className="w-8 h-8" /></div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                                                    <p className="text-white font-bold text-sm truncate">{p.title}</p>
                                                    <p className="text-[#FF9800] text-[10px] uppercase font-bold">{p.make} {p.model}</p>
                                                </div>
                                            </Link>
                                            <ActionMenu type="projects" id={p.id} isArchived={false} editUrl={`/projects/${p.id}/edit`} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={CarFront} text="Garaje vacío" subtext="Sube tu primer proyecto y empieza a ganar XP." />
                            )
                        )}

                        {/* GALERÍA */}
                        {activeTab === 'gallery' && (
                            albums.active.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {albums.active.map((a) => (
                                        <div key={a.id} className="relative group">
                                            <Link href={`/gallery/${a.id}`} className="block aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden relative">
                                                {a.cover_url ? (
                                                    <Image src={a.cover_url} alt={a.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon className="w-8 h-8" /></div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm">{a.title}</span>
                                                </div>
                                            </Link>
                                            <ActionMenu type="gallery_albums" id={a.id} isArchived={false} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={ImageIcon} text="Sin álbumes" />
                            )
                        )}

                        {/* EVENTOS */}
                        {activeTab === 'events' && (
                            events.active.length > 0 ? (
                                <div className="space-y-3">
                                    {events.active.map((e) => (
                                        <div key={e.id} className="relative group">
                                            <Link href={`/events/${e.id}`} className="flex bg-[#111] p-3 rounded-xl gap-4 border border-[#222]">
                                                <div className="w-16 h-16 bg-[#222] rounded-lg shrink-0 relative overflow-hidden">
                                                    {e.image && <Image src={e.image} alt={e.title} fill className="object-cover" />}
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="text-white font-bold text-sm">{e.title}</h3>
                                                    <p className="text-white/40 text-xs">{e.date || 'Fecha por definir'}</p>
                                                    <p className="text-[#FF9800] text-xs font-bold uppercase mt-1">{e.location}</p>
                                                </div>
                                            </Link>
                                            <ActionMenu type="events" id={e.id} isArchived={false} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={Calendar} text="Sin eventos" />
                            )
                        )}

                        {/* CINEMA */}
                        {activeTab === 'cinema' && (
                            <EmptyState icon={Youtube} text="Próximamente" subtext="El módulo de video estará disponible pronto." />
                        )}

                        {/* ARCHIVADOS */}
                        {activeTab === 'archived' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                {projects.archived.length > 0 && (
                                    <div>
                                        <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Briefcase className="w-4 h-4" /> Proyectos Archivados
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {projects.archived.map((p) => (
                                                <div key={p.id} className="relative group opacity-60 hover:opacity-100 transition-opacity">
                                                    <div className="aspect-[4/5] bg-[#1a1a1a] rounded-xl overflow-hidden relative">
                                                        {p.cover_image && <Image src={p.cover_image} alt={p.title} fill className="object-cover grayscale" />}
                                                    </div>
                                                    <ActionMenu type="projects" id={p.id} isArchived={true} editUrl={`/projects/${p.id}/edit`} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {albums.archived.length > 0 && (
                                    <div>
                                        <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" /> Álbumes Archivados
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {albums.archived.map((a) => (
                                                <div key={a.id} className="relative group opacity-60 hover:opacity-100 transition-opacity">
                                                    <div className="aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden relative">
                                                        {a.cover_url && <Image src={a.cover_url} alt={a.title} fill className="object-cover grayscale" />}
                                                    </div>
                                                    <ActionMenu type="gallery_albums" id={a.id} isArchived={true} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, text, subtext }: { icon: any, text: string, subtext?: string }) {
    return (
        <div className="py-12 flex flex-col items-center text-white/20 border border-white/5 rounded-2xl bg-white/[0.02]">
            <Icon className="w-12 h-12 mb-3 opacity-50" />
            <p className="font-bold uppercase tracking-wider text-sm">{text}</p>
            {subtext && <p className="text-xs mt-1 max-w-[200px] text-center">{subtext}</p>}
        </div>
    );
}
