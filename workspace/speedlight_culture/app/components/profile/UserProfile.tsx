'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Star, Users, Heart, Grid, Youtube, Image as ImageIcon, Briefcase, Zap, BadgeCheck, CarFront, MoreVertical, Archive, Trash2, Edit, Eye, EyeOff, AlertCircle, Film, Play } from 'lucide-react';
import { createClient } from '@/app/utils/supabase/client';
import { UserBadge } from "../UserBadge";
import { useRouter } from 'next/navigation';
import { archiveContent, deleteContent } from "@/app/actions/content";
import { toast } from "sonner";
import { bulkDeleteContent, bulkArchiveContent, bulkUpdateFormat } from "@/app/actions/content";
import { CheckCircle2, Circle, X, Trash, Archive as ArchiveIcon, LayoutGrid, List as ListIcon, CheckSquare } from "lucide-react";
import VideoEditModal from '@/app/components/video/VideoEditModal';
import FollowListModal from './FollowListModal';

interface ProfileProps {
    profile: any;
    stats: {
        followers: number;
        following: number;
        friends?: number;
        likes_given: number;
        xp: number;
        level: number;
        join_date: string;
    };
    content: {
        projects: any[];
        albums: any[];
        events: any[];
        videos: any[];
    };
    isOwnProfile: boolean;
    actionButtons?: React.ReactNode;
}

type TabType = 'garage' | 'gallery' | 'events' | 'cinema' | 'social' | 'archived';

export default function UserProfile({ profile, stats, content, isOwnProfile, actionButtons }: ProfileProps) {
    const [activeTab, setActiveTab] = useState<TabType>('garage');
    const supabase = createClient();
    const router = useRouter();
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [editingVideo, setEditingVideo] = useState<any>(null);

    const [openFollowList, setOpenFollowList] = useState<'followers' | 'following' | 'friends' | null>(null);

    // Helper to map tab to DB table
    const getContentType = (tab: TabType): 'projects' | 'gallery_albums' | 'events' | 'cinema_videos' | null => {
        switch (tab) {
            case 'garage': return 'projects';
            case 'gallery': return 'gallery_albums';
            case 'events': return 'events';
            case 'cinema': return 'cinema_videos';
            case 'social': return 'cinema_videos';
            case 'archived': return null; // Logic bit complex for archived tab mixed types, maybe disable for now or handle later
            default: return null;
        }
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedItems);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedItems(newSet);
    };

    const handleBulkDelete = async () => {
        const type = getContentType(activeTab);
        if (!type || selectedItems.size === 0) return;

        toast("¿Eliminar " + selectedItems.size + " elementos?", {
            action: {
                label: 'Eliminar',
                onClick: () => {
                    setIsBulkActionLoading(true);
                    toast.promise(
                        async () => {
                            await bulkDeleteContent(type, Array.from(selectedItems));
                            setIsSelectionMode(false);
                            setSelectedItems(new Set());
                            setIsBulkActionLoading(false);
                            router.refresh();
                        },
                        {
                            loading: 'Eliminando...',
                            success: 'Elementos eliminados',
                            error: 'Error al eliminar'
                        }
                    );
                }
            }
        });
    };

    const handleBulkArchive = async (archive: boolean) => {
        const type = getContentType(activeTab);
        if (!type || selectedItems.size === 0) return;

        toast("¿" + (archive ? 'Archivar' : 'Desarchivar') + " " + selectedItems.size + " elementos?", {
            action: {
                label: archive ? 'Archivar' : 'Recuperar',
                onClick: () => {
                    setIsBulkActionLoading(true);
                    toast.promise(
                        async () => {
                            await bulkArchiveContent(type, Array.from(selectedItems), archive);
                            setIsSelectionMode(false);
                            setSelectedItems(new Set());
                            setIsBulkActionLoading(false);
                            router.refresh();
                        },
                        {
                            loading: 'Actualizando...',
                            success: archive ? 'Elementos archivados' : 'Elementos recuperados',
                            error: 'Error al actualizar'
                        }
                    );
                }
            }
        });
    };

    const handleBulkFormatChange = async (targetFormat: 'horizontal' | 'vertical') => {
        const type = getContentType(activeTab);
        if (type !== 'cinema_videos' || selectedItems.size === 0) return;

        toast.promise(
            async () => {
                await bulkUpdateFormat(type, Array.from(selectedItems), targetFormat);
                setIsSelectionMode(false);
                setSelectedItems(new Set());
                router.refresh();
            },
            {
                loading: 'Moviendo contenido...',
                success: targetFormat === 'vertical' ? 'Movido a Social' : 'Movido a Cinema',
                error: 'Error al mover'
            }
        );
    };

    // Wrapper for Selectable Items
    const SelectableItem = ({ id, children }: { id: string, children: React.ReactNode }) => {
        const isSelected = selectedItems.has(id);
        if (!isSelectionMode) return <>{children}</>;

        return (
            <div onClick={() => toggleSelection(id)} className={`relative cursor-pointer transition-all ${isSelected ? 'ring-2 ring-[#FF9800] scale-[0.98]' : 'hover:opacity-80'}`}>
                {children}
                <div className="absolute top-2 right-2 z-50">
                    {isSelected ? <CheckCircle2 className="w-6 h-6 text-[#FF9800] fill-black" /> : <Circle className="w-6 h-6 text-white drop-shadow-md" />}
                </div>
                {/* Block interactions inside when selecting */}
                <div className="absolute inset-0 z-40 bg-transparent" />
            </div>
        );
    };


    // Filter Content (Active vs Archived)
    const filterContent = (items: any[]) => {
        // Exclude deleted (soft-delete for videos)
        const nonDeleted = items.filter(i => i.category !== 'Deleted');
        const active = nonDeleted.filter(i => !i.archived);
        const archived = nonDeleted.filter(i => i.archived);
        return { active, archived };
    };

    const projects = filterContent(content.projects);
    const albums = filterContent(content.albums);
    const events = filterContent(content.events);
    const videos = filterContent(content.videos);

    const hasArchivedContent = projects.archived.length > 0 || albums.archived.length > 0 || events.archived.length > 0 || videos.archived.length > 0;

    const toggleMenu = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleArchive = (type: 'projects' | 'gallery_albums' | 'events' | 'cinema_videos', id: string, currentStatus: boolean) => {
        toast.promise(
            async () => {
                await archiveContent(type, id, !currentStatus);
                setOpenMenuId(null);
                router.refresh();
            },
            {
                loading: 'Actualizando...',
                success: currentStatus ? 'Elemento desarchivado' : 'Elemento archivado',
                error: 'Error al actualizar'
            }
        );
    };

    const handleDelete = (type: 'projects' | 'gallery_albums' | 'events' | 'cinema_videos', id: string) => {
        toast(type === 'cinema_videos' ? "¿Mover a eliminados?" : "¿Eliminar permanentemente?", {
            action: {
                label: 'Sí, eliminar',
                onClick: () => {
                    toast.promise(
                        async () => {
                            await deleteContent(type, id);
                            setOpenMenuId(null);
                            router.refresh();
                        },
                        {
                            loading: 'Eliminando...',
                            success: 'Elemento eliminado',
                            error: 'Error al eliminar'
                        }
                    );
                }
            },
            cancel: {
                label: 'Cancelar',
                onClick: () => { }
            },
            duration: 5000,
        });
    };

    // Generic Action Menu Component
    const ActionMenu = ({ type, id, isArchived, editUrl, onEdit }: { type: 'projects' | 'gallery_albums' | 'events' | 'cinema_videos', id: string, isArchived: boolean, editUrl?: string, onEdit?: () => void }) => {
        if (!isOwnProfile) return null;

        const menuId = `${type}-${id}`;
        const isOpen = openMenuId === menuId;

        return (

            <div className="absolute top-2 left-2 z-30">
                <button
                    onClick={(e) => toggleMenu(menuId, e)}
                    className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={(e) => { e.preventDefault(); setOpenMenuId(null); }} />
                        <div className="absolute left-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                            {/* Edit */}
                            {editUrl ? (
                                <Link
                                    href={editUrl}
                                    className="px-4 py-3 text-left text-xs font-bold text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                >
                                    <Edit className="w-3 h-3" /> Editar
                                </Link>
                            ) : onEdit ? (
                                <button
                                    onClick={(e) => { e.preventDefault(); onEdit(); setOpenMenuId(null); }}
                                    className="px-4 py-3 text-left text-xs font-bold text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                                >
                                    <Edit className="w-3 h-3" /> Editar
                                </button>
                            ) : null}

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
        <div className="min-h-screen bg-[#0D0805] text-white pb-24">
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
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-[#050505] bg-[#1a1a1a] overflow-hidden shadow-2xl relative z-10">
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

                    {/* Identifiers */}
                    <div className="flex flex-col items-center justify-center mt-3 mb-1 gap-3">
                        {/* Verified / Role Badge Centered ABOVE Name */}
                        <UserBadge role={profile?.role} founderNumber={profile?.founder_number} email={profile?.email} size="md" />

                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white leading-none text-center">
                            {profile?.full_name || 'Racer Unknown'}
                        </h1>
                    </div>

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

                    {/* 3. STATS BAR (Refined - Followers Clickable, Likes, XP) */}
                    <div className="grid grid-cols-3 divide-x divide-white/10 w-full max-w-xs mx-auto mb-8 border-t border-b border-white/5 py-3 bg-white/[0.02] rounded-xl">
                        <button
                            onClick={() => isOwnProfile && setOpenFollowList('followers')}
                            className="flex flex-col items-center hover:bg-white/5 transition-colors rounded-lg -mx-1 py-1 cursor-pointer"
                        >
                            <span className="text-lg font-bold text-white">{stats.followers}</span>
                            <span className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">Seguidores</span>
                        </button>
                        <div className="flex flex-col items-center py-1 cursor-pointer hover:bg-white/5 transition-colors rounded-lg -mx-1" onClick={() => isOwnProfile && setOpenFollowList('friends')}>
                            <span className="text-lg font-bold text-white">{stats.friends ?? 0}</span>
                            <span className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">Amigos</span>
                        </div>
                        <div className="flex flex-col items-center py-1">
                            <span className="text-lg font-bold text-[#FF9800]">{stats.xp}K</span>
                            <span className="text-[9px] text-[#FF9800]/60 uppercase tracking-widest mt-0.5">XP Total</span>
                        </div>
                    </div>

                    {/* 4. CONTENT TABS (With Labels) */}
                    <div className="overflow-x-auto w-full max-w-lg mb-4 scrollbar-hide">
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
                            <button
                                onClick={() => setActiveTab('social')}
                                className={`flex-1 flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${activeTab === 'social' ? 'bg-[#FF9800] text-black' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Zap className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Social</span>
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

                    {/* 4.5 CONTROL BAR (View Mode & Selection) */}
                    <div className="w-full max-w-4xl px-4 mb-6 flex items-center justify-between">
                        {/* View Toggles */}
                        <div className="flex bg-[#1a1a1a] rounded-lg p-1 gap-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#333] text-white' : 'text-white/30 hover:text-white'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-[#333] text-white' : 'text-white/30 hover:text-white'}`}
                            >
                                <ListIcon className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Manage/Select Button */}
                        {isOwnProfile && getContentType(activeTab) && (
                            <button
                                onClick={() => {
                                    setIsSelectionMode(!isSelectionMode);
                                    setSelectedItems(new Set());
                                }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${isSelectionMode ? 'bg-[#FF9800] text-black' : 'bg-[#1a1a1a] text-white/60 hover:text-white border border-white/10'}`}
                            >
                                <CheckSquare className="w-4 h-4" />
                                {isSelectionMode ? 'Cancelar' : 'Gestionar'}
                            </button>
                        )}
                    </div>



                    {/* Floating Selection Bar */}
                    {isSelectionMode && (
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a] border border-white/10 rounded-full shadow-2xl px-6 py-3 flex items-center gap-6 animate-in slide-in-from-bottom-5 fade-in duration-300">
                            <span className="text-white text-sm font-bold">{selectedItems.size} seleccionados</span>

                            {(activeTab === 'cinema' || activeTab === 'social') && (
                                <>
                                    <div className="h-6 w-px bg-white/10" />
                                    <button
                                        onClick={() => handleBulkFormatChange(activeTab === 'cinema' ? 'vertical' : 'horizontal')}
                                        disabled={selectedItems.size === 0 || isBulkActionLoading}
                                        className="text-white hover:text-[#FF9800] disabled:opacity-50 transition-colors flex items-center gap-2 text-sm font-bold"
                                    >
                                        {activeTab === 'cinema' ? <Zap className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                                        {activeTab === 'cinema' ? 'Mover a Social' : 'Mover a Cinema'}
                                    </button>
                                </>
                            )}

                            <div className="h-6 w-px bg-white/10" />

                            <button
                                onClick={() => handleBulkArchive(true)}
                                disabled={selectedItems.size === 0 || isBulkActionLoading}
                                className="text-yellow-500 hover:text-yellow-400 disabled:opacity-50 transition-colors flex items-center gap-2 text-sm font-bold"
                            >
                                <ArchiveIcon className="w-4 h-4" /> Archivar
                            </button>

                            <div className="h-6 w-px bg-white/10" />

                            <button
                                onClick={handleBulkDelete}
                                disabled={selectedItems.size === 0 || isBulkActionLoading}
                                className="text-red-500 hover:text-red-400 disabled:opacity-50 transition-colors flex items-center gap-2 text-sm font-bold"
                            >
                                <Trash className="w-4 h-4" /> Eliminar
                            </button>
                        </div>
                    )}

                    {/* 5. GRID CONTENT */}
                    <div className="w-full max-w-4xl px-2">
                        {/* GARAJE */}
                        {activeTab === 'garage' && (
                            projects.active.length > 0 ? (
                                <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 gap-3" : "flex flex-col gap-3"}>
                                    {projects.active.map((p) => (
                                        <div key={p.id} className="relative group">
                                            <SelectableItem id={p.id}>
                                                <Link href={`/projects/${p.id}`} className={`block bg-[#1a1a1a] rounded-xl overflow-hidden relative ${viewMode === 'list' ? 'flex h-24' : 'aspect-[4/5]'}`}>
                                                    {/* Image */}
                                                    <div className={`relative ${viewMode === 'list' ? 'w-24 h-full shrink-0' : 'w-full h-full'}`}>
                                                        {p.cover_image || p.gallery_images?.[0] ? (
                                                            <Image src={p.cover_image || p.gallery_images[0]} alt={p.title} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-white/10"><Briefcase className="w-8 h-8" /></div>
                                                        )}
                                                    </div>

                                                    {/* Content Overlay/Side */}
                                                    {viewMode === 'grid' ? (
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                                                            <p className="text-white font-bold text-sm truncate">{p.title}</p>
                                                            <p className="text-[#FF9800] text-[10px] uppercase font-bold">{p.make} {p.model}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex-1 p-3 flex flex-col justify-center">
                                                            <p className="text-white font-bold text-sm truncate">{p.title}</p>
                                                            <p className="text-[#FF9800] text-[10px] uppercase font-bold mt-1">{p.make} {p.model}</p>
                                                        </div>
                                                    )}
                                                </Link>
                                                <div className={viewMode === 'list' ? "absolute top-2 left-2" : ""}>
                                                    <ActionMenu type="projects" id={p.id} isArchived={false} editUrl={`/projects/${p.id}/edit`} />
                                                </div>
                                            </SelectableItem>
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
                                <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 gap-3" : "flex flex-col gap-3"}>
                                    {albums.active.map((a) => (
                                        <div key={a.id} className="relative group">
                                            <SelectableItem id={a.id}>
                                                <Link href={`/gallery/${a.id}`} className={`block bg-[#1a1a1a] rounded-xl overflow-hidden relative ${viewMode === 'list' ? 'flex h-24' : 'aspect-square'}`}>
                                                    <div className={`relative ${viewMode === 'list' ? 'w-24 h-full shrink-0' : 'w-full h-full'}`}>
                                                        {a.cover_url ? (
                                                            <Image src={a.cover_url} alt={a.title} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon className="w-8 h-8" /></div>
                                                        )}
                                                        {/* Hover Overlay only in Grid */}
                                                        {viewMode === 'grid' && (
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <span className="text-white font-bold text-sm">{a.title}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* List View Content */}
                                                    {viewMode === 'list' && (
                                                        <div className="flex-1 p-3 flex items-center">
                                                            <span className="text-white font-bold text-sm">{a.title}</span>
                                                        </div>
                                                    )}
                                                </Link>
                                                <ActionMenu type="gallery_albums" id={a.id} isArchived={false} />
                                            </SelectableItem>
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
                                <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}>
                                    {events.active.map((e) => (
                                        <div key={e.id} className="relative group">
                                            <SelectableItem id={e.id}>
                                                <Link href={`/events/${e.id}`} className={viewMode === 'list' ? "flex bg-[#111] p-3 rounded-xl gap-4 border border-[#222]" : "block aspect-[4/5] bg-[#1a1a1a] rounded-xl overflow-hidden relative"}>
                                                    {/* Image Logic */}
                                                    {viewMode === 'list' ? (
                                                        <div className="w-16 h-16 bg-[#222] rounded-lg shrink-0 relative overflow-hidden">
                                                            {e.image && <Image src={e.image} alt={e.title} fill className="object-cover" />}
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full relative">
                                                            {e.image ? <Image src={e.image} alt={e.title} fill className="object-cover" /> : <div className="w-full h-full bg-[#222]" />}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                                                                <h3 className="text-white font-bold text-sm truncate">{e.title}</h3>
                                                                <p className="text-[#FF9800] text-[10px] uppercase font-bold">{e.location}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* List Content */}
                                                    {viewMode === 'list' && (
                                                        <div className="text-left">
                                                            <h3 className="text-white font-bold text-sm">{e.title}</h3>
                                                            <p className="text-white/40 text-xs">{e.date || 'Fecha por definir'}</p>
                                                            <p className="text-[#FF9800] text-xs font-bold uppercase mt-1">{e.location}</p>
                                                        </div>
                                                    )}
                                                </Link>
                                                <ActionMenu type="events" id={e.id} isArchived={false} />
                                            </SelectableItem>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={Calendar} text="Sin eventos" />
                            )
                        )}

                        {/* CINEMA */}
                        {activeTab === 'cinema' && (
                            videos.active.filter(v => v.format !== 'vertical').length > 0 ? (
                                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "flex flex-col gap-3"}>
                                    {videos.active.filter(v => v.format !== 'vertical').map((v) => (
                                        <div key={v.id} className="relative group bg-[#111] rounded-xl overflow-hidden border border-[#222]">
                                            <SelectableItem id={v.id}>

                                                {viewMode === 'list' ? (
                                                    /* LIST VIEW FOR CINEMA */
                                                    <div className="flex p-2 gap-3 h-24">
                                                        {/* Small Video Preview */}
                                                        <div className="aspect-video h-full relative bg-black rounded-lg overflow-hidden shrink-0">
                                                            {v.thumbnail_url ? <img src={v.thumbnail_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#333]" />}
                                                        </div>
                                                        {/* Details */}
                                                        <div className="flex flex-col justify-center">
                                                            <h3 className="text-white font-bold text-sm line-clamp-1">{v.title}</h3>
                                                            <p className="text-white/40 text-[10px] uppercase font-bold mt-1">Cinema • {new Date(v.created_at).toLocaleDateString()}</p>
                                                            <div className="mt-2 text-[10px] bg-[#FF9800]/20 text-[#FF9800] px-2 py-0.5 rounded w-fit capitalize">{v.status}</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* GRID VIEW (Existing) */
                                                    <>
                                                        <div className="aspect-video relative bg-black">
                                                            {v.thumbnail_url && !v.video_url?.includes('.mp4') && !v.video_url?.includes('supabase') ? (
                                                                <>
                                                                    <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                        <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                                                            <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : v.video_url && (v.video_url.includes('.mp4') || v.video_url.includes('supabase')) ? (
                                                                <>
                                                                    <video
                                                                        src={v.video_url}
                                                                        className="w-full h-full object-cover"
                                                                        muted
                                                                        playsInline
                                                                        loop
                                                                        onMouseOver={(e) => e.currentTarget.play()}
                                                                        onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                                                        onClick={(e) => {
                                                                            e.currentTarget.muted = !e.currentTarget.muted;
                                                                            e.currentTarget.controls = true;
                                                                            e.currentTarget.play();
                                                                        }}
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                                                                        <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                                                            <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
                                                                    <Youtube className="w-10 h-10 text-white/20" />
                                                                </div>
                                                            )}

                                                            {v.status !== 'approved' && (
                                                                <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase rounded border border-yellow-500/20 backdrop-blur-md">
                                                                    {v.status === 'pending' ? 'Procesando' : v.status}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-3">
                                                            <h3 className="text-white font-bold text-sm truncate">{v.title}</h3>
                                                            <p className="text-white/40 text-[10px] uppercase font-bold mt-1 line-clamp-1">
                                                                Cinema 16:9 • {new Date(v.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </>
                                                )}
                                                <ActionMenu type="cinema_videos" id={v.id} isArchived={false} onEdit={() => setEditingVideo(v)} />
                                            </SelectableItem>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={Film} text="Cine Vacío" subtext="No hay producciones cinematográficas." />
                            )
                        )}

                        {/* SOCIAL (Vertical Only) */}
                        {activeTab === 'social' && (
                            videos.active.filter(v => v.format === 'vertical').length > 0 ? (
                                <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" : "flex flex-col gap-3"}>
                                    {videos.active.filter(v => v.format === 'vertical').map((v) => (
                                        <div key={v.id} className="relative group bg-[#111] rounded-xl overflow-hidden border border-[#222]">
                                            <SelectableItem id={v.id}>

                                                {viewMode === 'list' ? (
                                                    /* LIST VIEW FOR SOCIAL */
                                                    <div className="flex p-2 gap-3 h-24">
                                                        {/* Small Vertical Preview */}
                                                        <div className="aspect-[9/16] h-full relative bg-black rounded-lg overflow-hidden shrink-0">
                                                            {/* Use video tag for preview if no thumb */}
                                                            <video src={v.video_url} className="w-full h-full object-cover" muted />
                                                        </div>
                                                        {/* Details */}
                                                        <div className="flex flex-col justify-center">
                                                            <h3 className="text-white font-bold text-sm line-clamp-1">{v.title}</h3>
                                                            <p className="text-white/40 text-[10px] uppercase font-bold mt-1">Social Reel</p>
                                                            <div className="mt-2 text-[10px] bg-[#FF9800]/20 text-[#FF9800] px-2 py-0.5 rounded w-fit capitalize">{v.status}</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* GRID VIEW (Existing) */
                                                    <>
                                                        <div className="aspect-[9/16] relative bg-black">
                                                            {/* Vertical Video Logic */}
                                                            <video
                                                                src={v.video_url}
                                                                className="w-full h-full object-cover"
                                                                muted
                                                                playsInline
                                                                loop
                                                                onMouseOver={(e) => e.currentTarget.play()}
                                                                onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                                                onClick={(e) => {
                                                                    e.currentTarget.muted = !e.currentTarget.muted;
                                                                    e.currentTarget.controls = true;
                                                                    e.currentTarget.play();
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                                                                <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                                                    <Play className="w-4 h-4 text-white fill-current" />
                                                                </div>
                                                            </div>

                                                            {v.status !== 'approved' && (
                                                                <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase rounded border border-yellow-500/20 backdrop-blur-md">
                                                                    {v.status}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-3">
                                                            <h3 className="text-white font-bold text-sm truncate">{v.title}</h3>
                                                            <p className="text-white/40 text-[10px] uppercase font-bold mt-1">Social Reel</p>
                                                        </div>
                                                    </>
                                                )}
                                                <ActionMenu type="cinema_videos" id={v.id} isArchived={false} onEdit={() => setEditingVideo(v)} />
                                            </SelectableItem>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={Zap} text="Social Vacío" subtext="No hay videos verticales." />
                            )
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

                                {videos.archived.length > 0 && (
                                    <div>
                                        <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Youtube className="w-4 h-4" /> Videos y Reels Archivados
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {videos.archived.map((v) => (
                                                <div key={v.id} className="relative group opacity-60 hover:opacity-100 transition-opacity">
                                                    <div className={`${v.format === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'} bg-[#1a1a1a] rounded-xl overflow-hidden relative`}>
                                                        {v.thumbnail_url ? (
                                                            <Image src={v.thumbnail_url} alt={v.title} fill className="object-cover grayscale" />
                                                        ) : (
                                                            <video src={v.video_url} className="w-full h-full object-cover grayscale" />
                                                        )}
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                            <EyeOff className="w-6 h-6 text-white/50" />
                                                        </div>
                                                    </div>
                                                    <ActionMenu type="cinema_videos" id={v.id} isArchived={true} onEdit={() => setEditingVideo(v)} />
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
            {/* Video Edit Modal */}
            {editingVideo && (
                <VideoEditModal
                    isOpen={!!editingVideo}
                    onClose={() => setEditingVideo(null)}
                    video={editingVideo}
                />
            )}
            {/* Follow List Modal */}
            {openFollowList && (
                <FollowListModal
                    userId={profile.id}
                    type={openFollowList}
                    onClose={() => setOpenFollowList(null)}
                />
            )}
        </div >
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
