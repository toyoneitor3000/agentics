'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Save, Loader2, ArrowLeft, X, Star, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LocationInput from '@/app/components/LocationInput';
import { UploadGallery } from '@/app/components/UploadGallery';
import { updateProject, setProjectCover, deleteProjectImage } from '@/app/actions/projects';

interface EditProjectFormProps {
    project: any; // Using any for simplicity in rapid refactor, ideally strict type
}

export default function EditProjectForm({ project }: EditProjectFormProps) {
    const router = useRouter();
    const id = project.id;

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: project.title || '',
        make: project.make || '',
        model: project.model || '',
        year: project.year || '',
        description: project.description || '',
        location: project.location || ''
    });
    const [specs, setSpecs] = useState({
        engine: project.specs?.engine || '',
        horsepower: project.specs?.horsepower || '',
        torque: project.specs?.torque || '',
        transmission: project.specs?.transmission || '',
        suspension: project.specs?.suspension || '',
        drivetrain: project.specs?.drivetrain || '',
        quarter_mile: project.specs?.quarter_mile || '',
        tocancipa_time: project.specs?.tocancipa_time || '',
        color: project.specs?.color || '',
        weight: project.specs?.weight || '',
        performance_0_100: project.specs?.performance_0_100 || '',
        top_speed: project.specs?.top_speed || ''
    });

    // Optimistic state for UI responsiveness
    const [gallery, setGallery] = useState<string[]>(project.gallery_images || []);
    const [coverImage, setCoverImage] = useState<string | null>(project.cover_image || null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpecs({ ...specs, [e.target.name]: e.target.value });
    };

    const handleDeleteImage = async (urlToDelete: string) => {
        if (!confirm('¿Eliminar esta imagen?')) return;

        // Client Side Optimistic Update
        const newGallery = gallery.filter(url => url !== urlToDelete);
        setGallery(newGallery);

        let newCover = coverImage;
        if (coverImage === urlToDelete) {
            newCover = newGallery.length > 0 ? newGallery[0] : null;
            setCoverImage(newCover);
        }

        try {
            await deleteProjectImage(id, urlToDelete);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar imagen');
            // Revert logic would go here
        }
    };

    const handleSetCover = async (url: string) => {
        setCoverImage(url); // Optimistic
        try {
            await setProjectCover(id, url);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error al actualizar portada');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateProject(id, {
                title: formData.title,
                make: formData.make,
                model: formData.model,
                year: parseInt(formData.year) || 0,
                description: formData.description,
                location: formData.location,
                specs: specs
            });
            router.refresh();
            router.push('/profile');
        } catch (error) {
            console.error(error);
            alert('Error al actualizar proyecto. Posiblemente sesión expirada.');
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#111] border border-[#222] rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#FF9800]/10 rounded-xl flex items-center justify-center text-[#FF9800]">
                    <Camera className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-oswald font-bold uppercase">Editar Proyecto</h1>
                    <p className="text-white/40 text-sm">Actualiza la información de tu vehículo.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. BASIC INFO */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase font-bold text-white/40 mb-2">Título del Proyecto</label>
                        <input
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ej: Proyecto Drift S13 'The Ghost'"
                            required
                            className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Marca</label>
                            <input
                                name="make"
                                type="text"
                                value={formData.make}
                                onChange={handleChange}
                                placeholder="Nissan"
                                required
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Modelo</label>
                            <input
                                name="model"
                                type="text"
                                value={formData.model}
                                onChange={handleChange}
                                placeholder="Silvia S13"
                                required
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Año</label>
                            <input
                                name="year"
                                type="number"
                                value={formData.year}
                                onChange={handleChange}
                                placeholder="1992"
                                required
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Ubicación</label>
                            <LocationInput
                                value={formData.location}
                                onChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. TECHNICAL SPECS (FICHA TÉCNICA) */}
                <div className="space-y-6 pt-4 border-t border-[#222]">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-5 bg-[#FF9800] rounded-full"></span>
                        Ficha Técnica
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Map through specs keys or list manually as before */}
                        {/* Manual mapping for simplicity and control */}
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Motor</label>
                            <input name="engine" type="text" value={specs.engine} onChange={handleSpecChange} placeholder="Ej: RB26DETT" className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Potencia (HP)</label>
                            <input name="horsepower" type="text" value={specs.horsepower} onChange={handleSpecChange} placeholder="Ej: 280 HP" className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Torque</label>
                            <input name="torque" type="text" value={specs.torque} onChange={handleSpecChange} placeholder="Ej: 353 Nm" className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Transmisión</label>
                            <input name="transmission" type="text" value={specs.transmission} onChange={handleSpecChange} placeholder="Ej: Manual 5 Vel" className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Suspensión</label>
                            <input name="suspension" type="text" value={specs.suspension} onChange={handleSpecChange} placeholder="Ej: Coilovers Tein" className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Tracción</label>
                            <input name="drivetrain" type="text" value={specs.drivetrain} onChange={handleSpecChange} placeholder="Ej: RWD / AWD" className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">1/4 de Milla</label>
                            <input name="quarter_mile" type="text" value={specs.quarter_mile} onChange={handleSpecChange} placeholder="Ej: 11.5 seg" className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Tiempo Tocancipá</label>
                            <input name="tocancipa_time" type="text" value={specs.tocancipa_time} onChange={handleSpecChange} placeholder="Ej: 1:20.5" className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Color</label>
                            <input name="color" type="text" value={specs.color} onChange={handleSpecChange} placeholder="Ej: Midnight Purple" className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Peso</label>
                            <input name="weight" type="text" value={specs.weight} onChange={handleSpecChange} placeholder="Ej: 1300 kg" className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">0 - 100 km/h</label>
                            <input name="performance_0_100" type="text" value={specs.performance_0_100} onChange={handleSpecChange} placeholder="Ej: 5.6 seg" className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">Velocidad Máxima</label>
                            <input name="top_speed" type="text" value={specs.top_speed} onChange={handleSpecChange} placeholder="Ej: 250 km/h" className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors" />
                        </div>
                    </div>
                </div>

                {/* 3. STORY */}
                <div>
                    <label className="block text-xs uppercase font-bold text-white/40 mb-2">Historia / Modificaciones</label>
                    <textarea
                        name="description"
                        rows={6}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Cuenta la historia de tu auto, lista las modificaciones y futuros planes..."
                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                    />
                </div>

                {/* 4. MEDIA MANAGEMENT */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-[#FF9800]" /> Galería del Proyecto
                    </h3>

                    {/* Gallery Grid */}
                    {gallery.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {gallery.map((url, index) => (
                                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-black border border-[#333]">
                                    <Image src={url} alt={`Gallery ${index}`} fill className="object-cover" />

                                    {/* Cover Badge */}
                                    {coverImage === url && (
                                        <div className="absolute top-2 left-2 bg-[#FF9800] text-black text-[10px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1 shadow-md">
                                            <Star className="w-3 h-3 fill-black" /> PORTADA
                                        </div>
                                    )}

                                    {/* Actions Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        {coverImage !== url && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetCover(url)}
                                                className="px-3 py-1 bg-white text-black text-xs font-bold rounded-full hover:bg-[#FF9800] transition-colors"
                                            >
                                                Hacer Portada
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(url)}
                                            className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Uploader */}
                    <UploadGallery projectId={id} />
                    <p className="text-xs text-white/30 text-center mt-2">
                        Las imágenes se guardan automáticamente al subirse.
                    </p>
                </div>

                <div className="pt-4 border-t border-[#222]">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#FF9800] hover:bg-[#F57C00] text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Guardar Información
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
