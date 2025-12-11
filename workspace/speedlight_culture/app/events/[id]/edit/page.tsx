"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Upload, Calendar, Clock, MapPin, Type, Image as ImageIcon } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';

export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    // Image Upload State
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // Check User
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }

                // Fetch Event
                const { data: event, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error || !event) {
                    console.error("Error fetching event:", error);
                    router.push('/events'); // Or 404
                    return;
                }

                // Check Ownership
                if (event.user_id !== user.id) {
                    alert("No tienes permiso para editar este evento.");
                    router.push('/events');
                    return;
                }

                // Populate Form
                setTitle(event.title || '');
                setDate(event.date_text || event.date || '');
                setTime(event.time_text || event.time || '');
                setLocation(event.location || '');
                setDescription(event.description || '');
                setCurrentImageUrl(event.image || '');

            } catch (err) {
                console.error(err);
            } finally {
                setFetching(false);
            }
        };

        if (id) fetchEvent();
    }, [id, router, supabase]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = currentImageUrl;

            if (selectedImage) {
                const fileExt = selectedImage.name.split('.').pop();
                const fileName = `events/${Date.now()}_edit.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('projects')
                    .upload(fileName, selectedImage);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('projects')
                    .getPublicUrl(fileName);

                imageUrl = publicUrlData.publicUrl;
            }

            const { error: updateError } = await supabase
                .from('events')
                .update({
                    title,
                    date_text: date,
                    time_text: time,
                    location,
                    description,
                    image: imageUrl
                })
                .eq('id', id);

            if (updateError) throw updateError;

            router.push('/profile'); // Redirect to dashboard to see changes
            router.refresh();

        } catch (error: any) {
            console.error("Error updating event:", error);
            alert("Error al actualizar el evento: " + (error.message || "Inténtalo de nuevo"));
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="min-h-screen bg-[#050302] flex items-center justify-center text-white">Cargando evento...</div>;
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#050302]">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="mb-8">
                    <Link href="/profile" className="flex items-center gap-2 text-gray-400 hover:text-[#FF9800] transition-colors mb-4">
                        <ChevronLeft className="w-4 h-4" />
                        Cancelar Edición
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold font-display uppercase italic tracking-wider text-white">
                        Editar <span className="text-[#FF9800]">Evento</span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-300 uppercase tracking-wide">Título del Evento</label>
                            <div className="relative">
                                <Type className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#FF9800] focus:ring-1 focus:ring-[#FF9800] outline-none transition-all placeholder:text-gray-600" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 uppercase tracking-wide">Fecha</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    required
                                    type="date"
                                    value={date}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-[#111] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#FF9800] outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 uppercase tracking-wide">Hora</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#FF9800] outline-none transition-all" />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-300 uppercase tracking-wide">Ubicación</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input required type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#FF9800] outline-none transition-all placeholder:text-gray-600" />
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase tracking-wide">Descripción</label>
                        <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg py-3 px-4 text-white focus:border-[#FF9800] outline-none transition-all placeholder:text-gray-600 resize-none"></textarea>
                    </div>

                    {/* Image Upload Real */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase tracking-wide">Imagen de Portada</label>
                        <div className="relative group cursor-pointer hover:border-[#FF9800]/50 transition-colors border-dashed border-2 border-white/10 rounded-xl bg-[#111] overflow-hidden min-h-[200px] flex flex-col items-center justify-center text-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {previewUrl || currentImageUrl ? (
                                <div className="absolute inset-0 w-full h-full">
                                    <img src={previewUrl || currentImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-bold uppercase tracking-wider">Cambiar Imagen</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 flex flex-col items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-300">
                                    <div className="p-3 bg-[#1A1A1A] rounded-full text-[#FF9800] border border-[#FF9800]/20 shadow-[0_0_15px_rgba(255,152,0,0.1)]">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-bold text-white uppercase tracking-wider">Sube tu imagen</p>
                                    <p className="text-xs text-gray-500">Arrastra o selecciona un archivo (JPG, PNG)</p>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 text-center">Recomendado: 1200x630px para mejor calidad.</p>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-4">
                        <Link href="/profile" className="flex-1 py-3 text-center border border-white/10 rounded-lg text-gray-300 font-bold hover:bg-white/5 transition-colors">
                            Cancelar
                        </Link>
                        <button disabled={loading} type="submit" className="flex-1 py-3 bg-[#FF9800] text-black font-bold uppercase tracking-wider rounded-lg hover:bg-[#FF9800]/90 transition-all shadow-[0_0_20px_rgba(255,152,0,0.2)] hover:shadow-[0_0_30px_rgba(255,152,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
