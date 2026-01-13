'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UploadGallery } from './UploadGallery';
import { Lightbox } from './Lightbox';
import { AlertTriangle } from 'lucide-react';

interface ProjectGalleryProps {
    projectId: string;
    images: string[];
    isOwner: boolean;
}

export const ProjectGallery = ({ projectId, images, isOwner }: ProjectGalleryProps) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setIsLightboxOpen(true);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-oswald font-bold uppercase flex items-center gap-3">
                    <span className="w-8 h-1 bg-[#FF9800]"></span>
                    Galería
                </h2>

            </div>

            {/* Warning & Uploader for Owner (Collapsible) */}
            {isOwner && (
                <details className="mb-8 group">
                    <summary className="list-none cursor-pointer flex items-center gap-2 text-[#FF9800] text-sm font-bold uppercase tracking-widest bg-[#FF9800]/10 px-4 py-3 rounded-xl hover:bg-[#FF9800]/20 transition-colors">
                        <span className="flex-1">Agregar Fotos a la Galería</span>
                        <span className="text-xl leading-none group-open:rotate-180 transition-transform">+</span>
                    </summary>
                    <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="bg-yellow-900/10 border border-yellow-700/30 p-4 rounded-xl flex gap-3 items-start">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-yellow-500 font-bold text-sm mb-1">Nota de Privacidad</h4>
                                <p className="text-yellow-500/60 text-xs leading-relaxed">
                                    Las imágenes son públicas. Evita subir fotos con direcciones o datos sensibles visibles.
                                </p>
                            </div>
                        </div>
                        <UploadGallery projectId={projectId} />
                    </div>
                </details>
            )}

            {/* Image Grid */}
            {images && images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            onClick={() => openLightbox(idx)}
                            className="relative aspect-video bg-[#111] rounded-xl overflow-hidden group cursor-pointer border border-transparent hover:border-[#FF9800]/50 transition-all"
                        >
                            <Image
                                src={img}
                                alt={`Gallery ${idx}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-bold uppercase tracking-widest border border-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                    Ver HD
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="aspect-video bg-[#111] border border-[#222] border-dashed rounded-xl flex flex-col items-center justify-center text-white/30">
                    <p>Aún no hay fotos en la galería.</p>
                </div>
            )}

            <Lightbox
                images={images}
                currentIndex={currentImageIndex}
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                onNext={nextImage}
                onPrev={prevImage}
            />
        </section>
    );
};
