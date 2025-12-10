'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import Image from 'next/image';
import { Lightbox } from '@/app/components/Lightbox';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [album, setAlbum] = useState<any>(null);
    const [photos, setPhotos] = useState<string[]>([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const supabase = createClient();

    // Unwrap params using React.use() approach or await in useEffect is tricky in client components,
    // but in Next.js 15 client components get params as promise.
    // Let's use a robust useEffect approach.
    const [albumId, setAlbumId] = useState<string>('');

    useEffect(() => {
        params.then(p => setAlbumId(p.id));
    }, [params]);

    useEffect(() => {
        if (!albumId) return;

        const fetchData = async () => {
            // 1. Get Album Basic Info (Without join to avoid FK issues)
            const { data: albumData, error } = await supabase
                .from('gallery_albums')
                .select('*')
                .eq('id', albumId)
                .single();

            if (error || !albumData) {
                console.error("DEBUG: Error fetching album:", error);
                setAlbum({ title: 'Error de Carga (Reintentar)', description: 'No pudimos cargar la información del álbum. Verifica tu conexión.' });
                return;
            }

            // 2. Get Author Profile manually
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', albumData.user_id)
                .single();

            // Merge data
            setAlbum({ ...albumData, profiles: profileData });

            // 3. Get Photos
            const { data: photosData } = await supabase
                .from('gallery_photos')
                .select('url')
                .eq('album_id', albumId);

            if (photosData) setPhotos(photosData.map(p => p.url));
        };

        fetchData();
    }, [albumId]);

    if (!album) return <div className="min-h-screen bg-black pt-[140px] text-white text-center">Cargando...</div>;

    return (
        <div className="min-h-screen bg-black text-white pt-[140px] pb-12">
            <div className="container mx-auto px-6">

                <Link href="/gallery" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Volver a Galería
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-oswald font-bold uppercase mb-4">{album.title}</h1>
                    <div className="flex items-center gap-6 text-sm text-white/40 font-roboto-mono">
                        <span className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            {album.profiles?.full_name || 'Autor Desconocido'}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(album.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-[#FF9800] border border-[#FF9800]/20 px-2 py-0.5 rounded textxs uppercase">
                            {photos.length} Fotos
                        </span>
                    </div>
                    {album.description && (
                        <p className="mt-6 text-white/60 max-w-2xl leading-relaxed">{album.description}</p>
                    )}
                </div>

                {/* Masonry-ish Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                    {photos.map((img, idx) => (
                        <div
                            key={idx}
                            onClick={() => { setCurrentIndex(idx); setLightboxOpen(true); }}
                            className="relative aspect-[4/3] group cursor-pointer overflow-hidden bg-[#111]"
                        >
                            <Image
                                src={img}
                                alt={`Photo ${idx}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    ))}
                </div>

                <Lightbox
                    images={photos}
                    currentIndex={currentIndex}
                    isOpen={lightboxOpen}
                    onClose={() => setLightboxOpen(false)}
                    onNext={() => setCurrentIndex((prev) => (prev + 1) % photos.length)}
                    onPrev={() => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                />

            </div>
        </div>
    );
}
