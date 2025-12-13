'use client';

import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Camera, Loader2, ArrowLeft, ChevronLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LocationInput from '@/app/components/LocationInput';

export default function NewProjectPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        make: '',
        model: '',
        year: '',
        description: '',
        location: '' // Added location
    });
    const [specs, setSpecs] = useState({
        engine: '',
        horsepower: '',
        torque: '',
        transmission: '',
        suspension: '',
        drivetrain: '',
        quarter_mile: '',
        tocancipa_time: '',
        color: '',
        weight: '',
        performance_0_100: '',
        top_speed: ''
    });

    const supabase = createClient();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpecs({ ...specs, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/login');
            return;
        }

        const { data, error } = await supabase
            .from('projects')
            .insert([
                {
                    title: formData.title,
                    make: formData.make,
                    model: formData.model,
                    year: parseInt(formData.year),
                    description: formData.description,
                    location: formData.location,
                    user_id: user.id,
                    specs: specs // Save specs
                }
            ])
            .select();

        if (error) {
            alert('Error al crear proyecto: ' + error.message);
            setIsLoading(false);
        } else {
            const projectId = data[0].id;
            // Redirect to edit page immediately to upload photos? 
            // Or to project page. Usually uploading photos is next step.
            // For now, redirect to edit page to encourage photo upload.
            router.push(`/projects/${projectId}/edit`);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-24 pb-12">
            <div className="max-w-3xl mx-auto px-4">
                <Link href="/profile" className="text-white/40 hover:text-white flex items-center gap-2 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Cancelar
                </Link>

                <div className="bg-[#111] border border-[#222] rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#FF9800]/10 rounded-xl flex items-center justify-center text-[#FF9800]">
                            <Camera className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-oswald font-bold uppercase">Nuevo Proyecto</h1>
                            <p className="text-white/40 text-sm">Comparte tu vehículo con la comunidad.</p>
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
                                <div>
                                    <label className="block text-xs uppercase font-bold text-white/40 mb-2">Motor</label>
                                    <input
                                        name="engine"
                                        type="text"
                                        value={specs.engine}
                                        onChange={handleSpecChange}
                                        placeholder="Ej: RB26DETT"
                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-white/40 mb-2">Potencia (HP)</label>
                                    <input
                                        name="horsepower"
                                        type="text"
                                        value={specs.horsepower}
                                        onChange={handleSpecChange}
                                        placeholder="Ej: 280 HP"
                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-white/40 mb-2">Torque</label>
                                    <input
                                        name="torque"
                                        type="text"
                                        value={specs.torque}
                                        onChange={handleSpecChange}
                                        placeholder="Ej: 353 Nm"
                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-white/40 mb-2">Transmisión</label>
                                    <input
                                        name="transmission"
                                        type="text"
                                        value={specs.transmission}
                                        onChange={handleSpecChange}
                                        placeholder="Ej: Manual 5 Vel"
                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-white/40 mb-2">Suspensión</label>
                                    <input
                                        name="suspension"
                                        type="text"
                                        value={specs.suspension}
                                        onChange={handleSpecChange}
                                        placeholder="Ej: Coilovers Tein"
                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-white/40 mb-2">Tracción</label>
                                    <input
                                        name="drivetrain"
                                        type="text"
                                        value={specs.drivetrain}
                                        onChange={handleSpecChange}
                                        placeholder="Ej: RWD / AWD"
                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-white/40 mb-2">1/4 de Milla</label>
                                    <input
                                        name="quarter_mile"
                                        type="text"
                                        value={specs.quarter_mile}
                                        onChange={handleSpecChange}
                                        placeholder="Ej: 11.5 seg"
                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-white/40 mb-2">Tiempo Tocancipá</label>
                                    <input
                                        name="tocancipa_time"
                                        type="text"
                                        value={specs.tocancipa_time}
                                        onChange={handleSpecChange}
                                        placeholder="Ej: 1:20.5"
                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-white/40 mb-2">Color</label>
                                    <input
                                        name="color"
                                        type="text"
                                        value={specs.color}
                                        onChange={handleSpecChange}
                                        placeholder="Ej: Midnight Purple"
                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-white/40 mb-2">Peso</label>
                                    <input
                                        name="weight"
                                        type="text"
                                        value={specs.weight}
                                        onChange={handleSpecChange}
                                        placeholder="Ej: 1300 kg"
                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-white/40 mb-2">0 - 100 km/h</label>
                                    <input
                                        name="performance_0_100"
                                        type="text"
                                        value={specs.performance_0_100}
                                        onChange={handleSpecChange}
                                        placeholder="Ej: 5.6 seg"
                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-white/40 mb-2">Velocidad Máxima</label>
                                    <input
                                        name="top_speed"
                                        type="text"
                                        value={specs.top_speed}
                                        onChange={handleSpecChange}
                                        placeholder="Ej: 250 km/h"
                                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                                    />
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#FF9800] text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-[#F57C00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Creando...
                                </>
                            ) : (
                                'Continuar y Subir Fotos'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
