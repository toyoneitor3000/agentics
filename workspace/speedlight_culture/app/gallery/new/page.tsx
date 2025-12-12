'use client';

import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Camera, Upload, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function NewAlbumPage() {
    const router = useRouter();
    const supabase = createClient();

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Eventos');
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);

            // Generate previews
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) return alert('Sube al menos una foto');
        setUploading(true);
        setUploadProgress(0);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Debes iniciar sesión");

            // 1. Create Album Record (Smart Fallback)
            let albumData;

            // Attempt A: Try with 'category' (Ideal)
            const { data: albumWithCat, error: errorWithCat } = await supabase
                .from('gallery_albums')
                .insert({
                    user_id: user.id,
                    title,
                    description,
                    category, // Optimistic UI
                    is_official: false
                })
                .select()
                .single();

            if (!errorWithCat) {
                albumData = albumWithCat;
            } else {
                console.warn("Category insert failed, trying fallback...", errorWithCat.message);

                // Attempt B: Fallback for older DB schema (No category)
                if (errorWithCat.message.includes('category') || errorWithCat.code === 'PGRST204') {
                    const { data: albumFallback, error: errorFallback } = await supabase
                        .from('gallery_albums')
                        .insert({
                            user_id: user.id,
                            title,
                            description,
                            is_official: false
                        })
                        .select()
                        .single();

                    if (errorFallback) throw errorFallback;
                    albumData = albumFallback;
                } else {
                    throw errorWithCat; // Real error (auth, network, etc)
                }
            }

            const album = albumData;
            let completedCount = 0;

            // 2. Upload Photos
            const uploadPromises = files.map(async (file, index) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${album.id}/${Date.now()}_${index}.${fileExt}`;

                // Upload to Storage
                const { error: uploadError } = await supabase.storage
                    .from('projects') // Using 'projects' bucket for now as per instructions
                    .upload(`albums/${fileName}`, file);

                if (uploadError) throw uploadError;

                // Get Public URL
                const { data: publicUrlData } = supabase.storage
                    .from('projects')
                    .getPublicUrl(`albums/${fileName}`);

                const finalUrl = publicUrlData.publicUrl;

                // Insert into gallery_photos
                await supabase.from('gallery_photos').insert({
                    album_id: album.id,
                    url: finalUrl
                    // user_id is NOT in the schema for photos (it relies on album ownership)
                });

                // Set first photo as cover if needed
                if (index === 0) {
                    await supabase
                        .from('gallery_albums')
                        .update({ cover_url: finalUrl })
                        .eq('id', album.id);
                }

                // Update Progress
                completedCount++;
                setUploadProgress(Math.round((completedCount / files.length) * 100));
            });

            await Promise.all(uploadPromises);

            // Force refresh of server components (Profile, Gallery)
            router.refresh();

            // Redirect to the new album
            router.push(`/gallery/${album.id}`);

        } catch (error: any) {
            console.error('Error uploading album:', error);
            alert(`Error: ${error.message || 'Error desconocido'}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#141414] text-white pt-[100px] pb-20">
            <div className="container mx-auto px-6 max-w-4xl">

                <Link href="/gallery" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Cancelar y Volver
                </Link>

                <h1 className="text-3xl md:text-5xl font-oswald font-bold uppercase mb-8 flex items-center gap-3">
                    <Upload className="w-8 h-8 text-[#FF9800]" />
                    Crear Nuevo Álbum
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Title */}
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2 tracking-widest">Título del Álbum</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-[#111] border border-[#222] rounded-xl p-4 text-white focus:outline-none focus:border-[#FF9800] transition-colors font-oswald text-xl uppercase"
                                placeholder="Ej: Track Day Tocancipá 2024"
                                required
                            />
                        </div>

                        {/* Category Selector */}
                        <div>
                            <label className="block text-xs uppercase font-bold text-white/40 mb-2 tracking-widest">Categoría</label>
                            <p className="text-[10px] text-white/30 mb-2">Selecciona la categoría que mejor describa tu álbum.</p>
                            <select
                                value={['Eventos', 'Spotting', 'Taller', 'Sesión', 'Estudio', 'Paisajes', 'Wallpapers', 'Track Day', 'Racing'].includes(category) ? category : 'Otro'}
                                onChange={e => {
                                    const val = e.target.value;
                                    setCategory(val === 'Otro' ? '' : val); // Clean for input if 'Otro'
                                }}
                                className="w-full bg-[#111] border border-[#222] rounded-xl p-4 text-white focus:outline-none focus:border-[#FF9800] transition-colors appearance-none"
                            >
                                <optgroup label="Comunidad & Calle">
                                    <option value="Eventos">Eventos & Meets</option>
                                    <option value="Spotting">Spotting / Calle</option>
                                    <option value="Taller">Taller & Builds</option>
                                </optgroup>
                                <optgroup label="Profesional & Arte">
                                    <option value="Sesión">Sesión Fotográfica</option>
                                    <option value="Estudio">Fotografía de Estudio</option>
                                    <option value="Paisajes">Paisajes & Ruta</option>
                                    <option value="Wallpapers">Wallpapers / 4K</option>
                                </optgroup>
                                <optgroup label="Motorsport">
                                    <option value="Track Day">Track Day / Pista</option>
                                    <option value="Racing">Competencia / Racing</option>
                                </optgroup>
                                <option value="Otro">Otro (Especificar)</option>
                            </select>

                            {/* Custom Category Input - Only shows if 'Otro' is active (or logic implies custom) */}
                            {(!['Eventos', 'Spotting', 'Taller', 'Sesión', 'Estudio', 'Paisajes', 'Wallpapers', 'Track Day', 'Racing'].includes(category)) && (
                                <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="w-full bg-[#111] border border-[#222] rounded-xl p-4 text-white focus:outline-none focus:border-[#FF9800] transition-colors font-oswald text-sm uppercase"
                                        placeholder="Escribe la categoría (ej: Drift, Rally, Clásicos...)"
                                        autoFocus
                                    />
                                    <p className="text-[10px] text-[#FF9800] mt-1 ml-1">* Se guardará como una nueva categoría.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs uppercase font-bold text-white/40 mb-2 tracking-widest">Descripción</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full bg-[#111] border border-[#222] rounded-xl p-4 text-white focus:outline-none focus:border-[#FF9800] transition-colors h-32 resize-none"
                            placeholder="Cuéntanos la historia detrás de estas fotos..."
                        />
                    </div>

                    {/* Image Uploader Area */}
                    <div>
                        <label className="block text-xs uppercase font-bold text-white/40 mb-4 tracking-widest">
                            Fotos ({files.length} seleccionadas)
                        </label>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {/* Upload Button */}
                            <label className="aspect-square bg-[#111] border-2 border-dashed border-[#333] hover:border-[#FF9800] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors group">
                                <Camera className="w-8 h-8 text-white/20 group-hover:text-[#FF9800] mb-2 transition-colors" />
                                <span className="text-xs text-white/40 group-hover:text-white font-bold uppercase">Añadir Fotos</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>

                            {/* Previews */}
                            {previews.map((src, idx) => (
                                <div key={idx} className="relative aspect-square bg-black rounded-xl overflow-hidden border border-[#222]">
                                    <Image src={src} fill className="object-cover" alt="Preview" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button with Progress Bar */}
                    <div className="relative w-full">
                        {uploading && (
                            <div className="absolute inset-0 bg-[#333] rounded-xl overflow-hidden">
                                <div
                                    className="h-full bg-[#FF9800] transition-all duration-300 ease-out flex items-center justify-center font-bold text-black uppercase"
                                    style={{ width: `${uploadProgress}%` }}
                                >
                                    {uploadProgress >= 10 && `${uploadProgress}%`}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={uploading}
                            className={`w-full bg-transarent border border-[#FF9800] text-[#FF9800] font-bold uppercase py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${uploading ? 'opacity-0' : 'hover:bg-[#FF9800] hover:text-black'}`}
                        >
                            <Upload className="w-5 h-5" /> Publicar Álbum
                        </button>

                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white font-bold uppercase mix-blend-difference">
                                {uploadProgress < 100 ? `Subiendo ${uploadProgress}%` : 'Finalizando...'}
                            </div>
                        )}
                    </div>

                </form>
            </div>
        </div>
    );
}
