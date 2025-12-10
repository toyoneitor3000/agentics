'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import GalleryRow from '@/app/components/GalleryRow';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Camera } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function GalleryPage() {
    const supabase = createClient();

    // Data State
    const [hdPhotos, setHdPhotos] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);

    // Categorized Albums State
    const [events, setEvents] = useState<any[]>([]);
    const [trackDays, setTrackDays] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);

    // Hero Slideshow State
    const [heroItems, setHeroItems] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Hero Slideshow Logic: Combine Top Content (Albums + Projects)
    useEffect(() => {
        const slides = [
            // 1. Top Recent Albums (The User wants to see these!)
            ...albums.slice(0, 5).map(a => ({
                id: a.id,
                type: 'Álbum Reciente',
                subtitle: a.category || 'Evento Speedlight',
                title: a.title,
                desc: `Explora las mejores capturas de ${a.title}. Una colección exclusiva de Speedlight Culture.`,
                link: `/gallery/${a.id}`,
                image: a.cover_url || '/placeholder.png'
            })),
            // 2. Featured Projects
            ...projects.slice(0, 3).map(p => ({
                id: p.id,
                type: 'Proyecto Destacado',
                subtitle: (p.make && p.model) ? `${p.make} ${p.model}` : 'Proyecto de Garaje',
                title: p.title,
                desc: p.description || "Historias de garaje que inspiran. Mira la transformación completa.",
                link: `/projects/${p.id}`,
                image: p.cover_image || (p.gallery_images && p.gallery_images[0]) || '/placeholder.png'
            })),
            // 3. HD Photos (if any)
            ...hdPhotos.slice(0, 2).map(i => ({
                ...i,
                type: 'Tendencia #1',
                subtitle: "Comunidad Speedlight",
                desc: "La comunidad ha hablado. Esta es la foto más votada del momento.",
                link: `/gallery/${i.id}`
            }))
        ];

        // Filter valid slides
        const validSlides = slides.filter(s => s.id && s.image && s.image !== '/placeholder.png');

        if (validSlides.length > 0) {
            setHeroItems(validSlides);
        } else if (albums.length > 0) {
            // Fallback if images are failing validation but albums exist
            setHeroItems(slides);
        }
    }, [hdPhotos, projects, albums]);

    // Hero Auto-rotate
    useEffect(() => {
        if (heroItems.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % heroItems.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [heroItems]);


    // Data Fetching
    useEffect(() => {
        const fetchAllData = async () => {
            // 1. Fetch "Speedlight HD" (Top Rated Photos) - Mocked for now until View works perfectly or populated
            // In real scenario query from 'top_photos' view

            // For Demo: Use High Quality Project Covers with Authors
            const { data: topProjects } = await supabase
                .from('projects')
                .select('id, title, cover_image, make, model, profiles(full_name)')
                .not('cover_image', 'is', null)
                .limit(10);

            const hdItems = topProjects?.map(p => ({
                id: p.id,
                image: p.cover_image,
                title: p.title,
                subtitle: "Speedlight Selection",
                author: (p.profiles as any)?.full_name || 'Speedlight Member',
                link: `/projects/${p.id}` // Ideally links to photo fullscreen
            })) || [];
            setHdPhotos(hdItems);

            // 2. Fetch ALL Recent Albums (Robust & Decoupled)
            let rawAlbums: any[] = [];

            // Step A: Try Fetching with 'category'
            const { data: albumData, error: albumError } = await supabase
                .from('gallery_albums')
                .select('id, title, cover_url, category, created_at, user_id')
                .order('created_at', { ascending: false })
                .limit(50);

            if (albumData && !albumError) {
                // Success with Category
                const userIds = Array.from(new Set(albumData.map(a => a.user_id).filter(Boolean)));
                const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds);
                const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

                rawAlbums = albumData.map(a => ({
                    ...a,
                    author_name: profileMap.get(a.user_id) || 'Fotógrafo Speedlight'
                }));
            } else {
                console.warn("Fetch with category failed, retrying fallback...", albumError);

                // Step B: Fallback (No category column)
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('gallery_albums')
                    .select('id, title, cover_url, created_at, user_id')
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (fallbackData) {
                    const userIds = Array.from(new Set(fallbackData.map(a => a.user_id).filter(Boolean)));
                    const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds);
                    const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

                    rawAlbums = fallbackData.map(a => ({
                        ...a,
                        category: 'Eventos', // Forced Default
                        author_name: profileMap.get(a.user_id) || 'Fotógrafo Speedlight'
                    }));
                } else {
                    console.error("Fallback fetch also failed:", fallbackError);
                }
            }

            const mapAlbumToItem = (a: any) => ({
                id: a.id,
                image: a.cover_url || '/placeholder.png',
                title: a.title,
                subtitle: new Date(a.created_at).toLocaleDateString(),
                author: a.author_name,
                link: `/gallery/${a.id}`
            });

            const allAlbums = rawAlbums;
            setAlbums(allAlbums); // <--- CRITICAL FIX: Save albums to state so Hero can use them

            const createPlaceholder = (category: string, title: string) => [{
                id: `cta-${category}`,
                image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80', // Generic garage/camera vibe
                title: title,
                subtitle: "¡Espacio Disponible!",
                author: "Comunidad Speedlight",
                link: "/gallery/new"
            }];

            // Filter Categories with Fallbacks
            const eventItems = allAlbums.filter(a => !a.category || a.category === 'Eventos').map(mapAlbumToItem);
            setEvents(eventItems.length > 0 ? eventItems : createPlaceholder('eventos', 'Sube el Primer Evento'));

            const trackItems = allAlbums.filter(a => a.category === 'Track Day').map(mapAlbumToItem);
            setTrackDays(trackItems.length > 0 ? trackItems : createPlaceholder('track', 'Inaugura la Pista'));

            const sessionItems = allAlbums.filter(a => a.category === 'Sesión' || a.category === 'Spotting').map(mapAlbumToItem);
            setSessions(sessionItems.length > 0 ? sessionItems : createPlaceholder('sesion', 'Tu Arte Aquí'));


            // 3. Fetch "Recent Projects" ... (Keep existing logic)
            // ...
            const { data: projectData } = await supabase
                .from('projects')
                .select('id, title, cover_image, gallery_images, make, model, profiles(full_name)')
                .order('created_at', { ascending: false })
                .limit(10);

            const projectItems = projectData?.map(p => ({
                id: p.id,
                image: p.cover_image || (p.gallery_images && p.gallery_images.length > 0 ? p.gallery_images[0] : '/placeholder.png'),
                title: `${p.make} ${p.model}`,
                subtitle: p.title,
                author: (p.profiles as any)?.full_name || 'Constructor Indie',
                link: `/projects/${p.id}`
            })) || [];
            setProjects(projectItems);
        };

        fetchAllData();
    }, []);

    const currentHero = heroItems[currentIndex];

    return (
        <div className="min-h-screen bg-[#141414] text-white">

            {/* IMMERSIVE HERO SLIDESHOW */}
            <div className="relative w-full h-[85vh] group overflow-hidden">

                {/* Background Images with Fade Transition */}
                {heroItems.map((item, index) => (
                    <div
                        key={item.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <Image
                            src={item.image}
                            fill
                            className="object-cover"
                            alt="Hero Background"
                            priority={index === 0}
                        />
                        {/* Cinematic Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-[#141414]"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
                    </div>
                ))}

                {/* Fallback if no content */}
                {heroItems.length === 0 && (
                    <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
                        <Camera className="w-24 h-24 text-white/10" />
                    </div>
                )}

                {/* 2. TOP BAR (Overlaid) */}
                <div className="absolute top-0 left-0 w-full p-6 pt-[120px] z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-[#FF9800] text-xs font-bold uppercase tracking-[0.2em] mb-1 drop-shadow-lg">
                            Ecosistema Visual
                        </h2>
                        <h1 className="text-3xl md:text-5xl font-oswald font-bold uppercase drop-shadow-2xl text-white">
                            Galería Speedlight
                        </h1>
                    </div>
                    <Link href="/gallery/new">
                        <button className="bg-white/10 hover:bg-[#FF9800] backdrop-blur-md border border-white/20 text-white hover:text-black px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-3 transition-all duration-300">
                            <Plus className="w-5 h-5" />
                            <span>Subir Álbum</span>
                        </button>
                    </Link>
                </div>

                {/* 3. FEATURED CONTENT INFO (Dynamic) */}
                {currentHero && (
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20 pb-24 flex items-end justify-between">
                        <div className="max-w-3xl animate-in fade-in slide-in-from-left-10 duration-700" key={currentIndex}>
                            {/* Tags or Badge */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-[#E50914] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                    {currentHero.type}
                                </span>
                                <span className="text-white/80 text-sm font-medium drop-shadow-md border-l pl-3 border-white/30">
                                    {currentHero.subtitle || "Original de Speedlight Culture"}
                                </span>
                            </div>

                            {/* Main Title */}
                            <h2 className="text-5xl md:text-7xl font-oswald font-bold uppercase mb-6 leading-[0.9] text-white drop-shadow-2xl">
                                {currentHero.title}
                            </h2>

                            {/* Description */}
                            <p className="text-white/90 text-lg md:text-xl font-light mb-8 max-w-xl leading-relaxed drop-shadow-md text-balance">
                                {currentHero.desc}
                            </p>

                            {/* CTA */}
                            <div className="flex items-center gap-4">
                                <Link href={currentHero.link}>
                                    <button className="bg-white text-black hover:bg-[#FF9800] px-8 py-4 rounded-md font-bold text-lg transition-colors flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                        <Camera className="w-5 h-5" />
                                        Ver Galería
                                    </button>
                                </Link>
                                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-4 rounded-md font-bold text-lg transition-colors flex items-center gap-2">
                                    ℹ️ Más Info
                                </button>
                            </div>
                        </div>

                        {/* Indicators / Progress */}
                        <div className="hidden md:flex gap-2 mb-4">
                            {heroItems.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-[#FF9800]' : 'w-4 bg-white/30 hover:bg-white'}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ROWS SECTION - Shifted up slightly to blend */}
            <div className="-mt-12 relative z-30 space-y-4 pb-20 bg-gradient-to-t from-[#141414] via-[#141414] to-transparent pt-12">

                <GalleryRow title="Speedlight HD (Top Voted)" items={hdPhotos} />

                <GalleryRow title="Track Days & Racing" items={trackDays} />

                <GalleryRow title="Eventos & Meets" items={events} isPoster={true} />

                <GalleryRow title="Sesiones & Spotting" items={sessions} />

                <GalleryRow title="Proyectos de Garaje" items={projects} />

                <GalleryRow title="Tendencias Globales" items={hdPhotos.slice().reverse()} />
            </div>

        </div>
    );
}
