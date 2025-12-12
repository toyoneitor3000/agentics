'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, Package, Calendar, Image as ImageIcon, Loader2, ArrowRight } from 'lucide-react';
import { useDebounce } from '@/app/hooks/useDebounce'; // Ensuring we don't hammer the DB, if hook exists. If not, I'll inline.

// Inline Debounce Hook if not exists (safer to inline for this single file to avoid dep check)
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

type SearchResult = {
    type: 'user' | 'project' | 'event' | 'album';
    id: string;
    title: string;
    subtitle?: string;
    image?: string | null;
    link: string;
};

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounceValue(query, 500);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'users' | 'projects' | 'events' | 'albums'>('all');
    const supabase = createClient();

    useEffect(() => {
        const search = async () => {
            if (!debouncedQuery.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            const searchQuery = `%${debouncedQuery}%`;
            let combinedResults: SearchResult[] = [];

            try {
                // 1. Search Users/Profiles
                if (activeTab === 'all' || activeTab === 'users') {
                    const { data: users } = await supabase
                        .from('profiles')
                        .select('id, full_name, bio, avatar_url, role')
                        .ilike('full_name', searchQuery)
                        .limit(5);

                    if (users) {
                        combinedResults.push(...users.map(u => ({
                            type: 'user' as const,
                            id: u.id,
                            title: u.full_name || 'Usuario',
                            subtitle: u.role || 'Miembro',
                            image: u.avatar_url,
                            link: `/profile/${u.id}`
                        })));
                    }
                }

                // 2. Search Projects
                if (activeTab === 'all' || activeTab === 'projects') {
                    const { data: projects } = await supabase
                        .from('projects')
                        .select('id, title, make, model, cover_image, gallery_images')
                        .or(`title.ilike.${searchQuery},make.ilike.${searchQuery},model.ilike.${searchQuery}`)
                        .limit(5);

                    if (projects) {
                        combinedResults.push(...projects.map(p => ({
                            type: 'project' as const,
                            id: p.id,
                            title: p.title,
                            subtitle: `${p.make} ${p.model}`,
                            image: p.cover_image || (p.gallery_images && p.gallery_images[0]),
                            link: `/projects/${p.id}`
                        })));
                    }
                }

                // 3. Search Events
                if (activeTab === 'all' || activeTab === 'events') {
                    const { data: events } = await supabase
                        .from('events')
                        .select('id, title, location, image, date')
                        .ilike('title', searchQuery)
                        .limit(5);

                    if (events) {
                        combinedResults.push(...events.map(e => ({
                            type: 'event' as const,
                            id: e.id,
                            title: e.title,
                            subtitle: e.location || e.date,
                            image: e.image,
                            link: `/events/${e.id}` // Assuming detail page exists or edit
                        })));
                    }
                }

                // 4. Search Albums
                if (activeTab === 'all' || activeTab === 'albums') {
                    const { data: albums } = await supabase
                        .from('gallery_albums')
                        .select('id, title, description, cover_url')
                        .ilike('title', searchQuery)
                        .limit(5);

                    if (albums) {
                        combinedResults.push(...albums.map(a => ({
                            type: 'album' as const,
                            id: a.id,
                            title: a.title,
                            subtitle: 'Galería',
                            image: a.cover_url,
                            link: `/gallery/${a.id}`
                        })));
                    }
                }

            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setResults(combinedResults);
                setLoading(false);
            }
        };

        search();
    }, [debouncedQuery, activeTab]);

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-24 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-oswald font-bold uppercase mb-6">Explorar</h1>

                {/* Search Input */}
                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Buscar usuarios, proyectos, marcas..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-[#111] border border-[#333] rounded-full py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-[#FF9800] transition-all"
                        autoFocus
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                </div>

                {/* Tags/Filters */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                    {[
                        { id: 'all', label: 'Todo' },
                        { id: 'users', label: 'Usuarios' },
                        { id: 'projects', label: 'Garage' },
                        { id: 'events', label: 'Eventos' },
                        { id: 'albums', label: 'Galería' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'bg-[#FF9800] text-black'
                                    : 'bg-[#1a1a1a] text-white/50 hover:bg-[#252525] hover:text-white'}
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Results Area */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12 text-white/30 flex flex-col items-center">
                            <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#FF9800]" />
                            <p className="text-xs">Buscando en la red...</p>
                        </div>
                    ) : results.length > 0 ? (
                        results.map((result, idx) => (
                            <Link href={result.link} key={`${result.type}-${result.id}-${idx}`}>
                                <div className="bg-[#111] hover:bg-[#1a1a1a] border border-[#222] hover:border-[#333] p-3 rounded-xl flex items-center gap-4 transition-all group">
                                    {/* Image */}
                                    <div className="w-12 h-12 rounded-full bg-[#222] overflow-hidden relative shrink-0">
                                        {result.image ? (
                                            <Image src={result.image} alt={result.title} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                                {result.type === 'user' && <User className="w-5 h-5" />}
                                                {result.type === 'project' && <Package className="w-5 h-5" />}
                                                {result.type === 'event' && <Calendar className="w-5 h-5" />}
                                                {result.type === 'album' && <ImageIcon className="w-5 h-5" />}
                                            </div>
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="text-white font-bold truncate">{result.title}</h3>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider
                                                ${result.type === 'user' ? 'bg-purple-900/30 text-purple-400' :
                                                    result.type === 'project' ? 'bg-orange-900/30 text-orange-400' :
                                                        result.type === 'event' ? 'bg-blue-900/30 text-blue-400' : 'bg-green-900/30 text-green-400'}
                                            `}>
                                                {result.type === 'user' ? 'Perfil' :
                                                    result.type === 'project' ? 'Proyecto' :
                                                        result.type === 'event' ? 'Evento' : 'Album'}
                                            </span>
                                        </div>
                                        <p className="text-white/40 text-xs truncate">{result.subtitle}</p>
                                    </div>

                                    {/* Arrow */}
                                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                                </div>
                            </Link>
                        ))
                    ) : debouncedQuery ? (
                        <div className="text-center py-12 text-white/30">
                            <p>No se encontraron resultados para "{query}"</p>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-white/10">
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="text-sm">Empieza a escribir para buscar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
