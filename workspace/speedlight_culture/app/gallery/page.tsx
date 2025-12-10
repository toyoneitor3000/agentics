'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import GalleryRow from '@/app/components/GalleryRow';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Camera } from 'lucide-react';

export default function GalleryPage() {
    const supabase = createClient();
    const [hdPhotos, setHdPhotos] = useState<any[]>([]);
    const [albums, setAlbums] = useState<any[]>([]); // Deprecated/Fallback
    const [projects, setProjects] = useState<any[]>([]);

    // Categorized Albums
    const [events, setEvents] = useState<any[]>([]);
    const [trackDays, setTrackDays] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);

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

            // 2. Fetch ALL Recent Albums (Robust Schema Handling)
            let rawAlbums = [];

            // Attempt A: Try with 'category'
            const { data: dataWithCat, error: errorWithCat } = await supabase
                .from('gallery_albums')
                .select('id, title, cover_url, category, created_at, profiles(full_name)')
                .order('created_at', { ascending: false })
                .limit(50);

            if (!errorWithCat) {
                rawAlbums = dataWithCat || [];
            } else {
                console.warn("Retrying fetch without category column...");
                // Attempt B: Fallback if 'category' column missing
                const { data: dataFallback } = await supabase
                    .from('gallery_albums')
                    .select('id, title, cover_url, created_at, profiles(full_name)')
                    .order('created_at', { ascending: false })
                    .limit(50);

                rawAlbums = (dataFallback || []).map(a => ({ ...a, category: 'Eventos' }));
            }

            const mapAlbumToItem = (a: any) => ({
                id: a.id,
                image: a.cover_url || '/placeholder.png',
                title: a.title,
                subtitle: new Date(a.created_at).toLocaleDateString(),
                author: (a.profiles as any)?.full_name || 'Fotógrafo Anónimo',
                link: `/gallery/${a.id}`
            });

            const allAlbums = rawAlbums;

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

    // Determine Hero Content: HD Photo OR First Album OR First Project
    const heroContent = hdPhotos.length > 0 ? hdPhotos[0] : (albums.length > 0 ? albums[0] : (projects.length > 0 ? projects[0] : null));

    return (
        <div className="min-h-screen bg-[#141414] text-white">

            {/* IMMERSIVE HERO SECTION */}
            <div className="relative w-full h-[85vh] group">

                {/* 1. HERO BACKGROUND IMAGE */}
                {heroContent ? (
                    <div className="absolute inset-0">
                        <Image
                            src={heroContent.image}
                            fill
                            className="object-cover"
                            alt="Hero Background"
                            priority
                        />
                        {/* Cinematic Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-[#141414]"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
                    </div>
                ) : (
                    /* Fallback Empty State Background */
                    <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
                        <div className="text-center opacity-20">
                            <Camera className="w-24 h-24 mx-auto mb-4" />
                            <h1 className="text-4xl font-oswald uppercase">Galería Speedlight</h1>
                        </div>
                    </div>
                )}

                {/* 2. TOP BAR (Overlaid) */}
                <div className="absolute top-0 left-0 w-full p-6 pt-[120px] z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* Page Branding */}
                    <div>
                        <h2 className="text-[#FF9800] text-xs font-bold uppercase tracking-[0.2em] mb-1 drop-shadow-lg">
                            Ecosistema Visual
                        </h2>
                        <h1 className="text-3xl md:text-5xl font-oswald font-bold uppercase drop-shadow-2xl text-white">
                            Galería Speedlight
                        </h1>
                    </div>

                    {/* Action Button */}
                    <Link href="/gallery/new">
                        <button className="bg-white/10 hover:bg-[#FF9800] backdrop-blur-md border border-white/20 text-white hover:text-black px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-3 transition-all duration-300">
                            <Plus className="w-5 h-5" />
                            <span>Subir Álbum</span>
                        </button>
                    </Link>
                </div>

                {/* 3. FEATURED CONTENT INFO (Bottom Left) */}
                {heroContent && (
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20 pb-24">
                        <div className="max-w-3xl">
                            {/* Tags or Badge */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-[#E50914] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                    {hdPhotos.length > 0 ? '#1 Tendencias' : 'Estreno'}
                                </span>
                                <span className="text-white/80 text-sm font-medium drop-shadow-md">
                                    {heroContent.subtitle || "Original de Speedlight Culture"}
                                </span>
                            </div>

                            {/* Main Title */}
                            <h2 className="text-5xl md:text-7xl font-oswald font-bold uppercase mb-6 leading-[0.9] text-white drop-shadow-2xl">
                                {heroContent.title}
                            </h2>

                            {/* Description / Inspirational Text */}
                            <p className="text-white/90 text-lg md:text-xl font-light mb-8 max-w-xl leading-relaxed drop-shadow-md text-balance">
                                {heroContent.id === projects[0]?.id
                                    ? "Proyectos destacados de la comunidad. Mira cómo las leyendas se construyen desde el chasis."
                                    : "Explora esta colección exclusiva. Vota por tus favoritos para llevarlos a la cima del ranking HD."
                                }
                            </p>

                            {/* CTA */}
                            <div className="flex items-center gap-4">
                                <Link href={heroContent.link}>
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
