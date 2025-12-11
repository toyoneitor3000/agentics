"use client";

import { useState } from 'react';
import { Upload, FileVideo, Ban, CheckCircle2, AlertTriangle, MonitorPlay } from 'lucide-react';
import Link from 'next/link';

export default function UploadReelPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // Handle file drop here (mock)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 md:pl-[244px] md:pt-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <span className="bg-[#FF9800] text-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                        Studio
                    </span>
                    <h1 className="text-3xl font-oswald font-bold uppercase">Submit to Cinema</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Upload Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Drag & Drop Zone */}
                        <div
                            className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer
                                ${isDragging ? 'border-[#FF9800] bg-[#FF9800]/10' : 'border-white/10 hover:border-[#FF9800]/50 bg-[#111]'}
                            `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleLeave}
                            onDrop={handleDrop}
                        >
                            {file ? (
                                <div className="flex flex-col items-center">
                                    <FileVideo className="w-16 h-16 text-[#FF9800] mb-4" />
                                    <p className="font-bold text-lg">{file.name}</p>
                                    <p className="text-sm text-white/50 mb-6">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    <button onClick={() => setFile(null)} className="text-xs text-red-500 hover:text-red-400 uppercase font-bold tracking-widest">Eliminar</button>
                                </div>
                            ) : (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                        <Upload className="w-8 h-8 text-white/50" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Arrastra y suelta tu video high-res</h3>
                                    <p className="text-white/50 text-sm mb-6 max-w-xs">Soporta .MP4, .MOV (H.264/H.265). <br /> Tamaño máximo 2GB.</p>
                                    <button className="bg-[#FF9800] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-[#F57C00] transition-colors">
                                        Seleccionar Archivo
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Metadata Form */}
                        <div className="bg-[#111] p-6 rounded-2xl border border-white/5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-white/50 mb-2">Título</label>
                                <input type="text" placeholder="Ej: Midnight Run GT3" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FF9800] outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-white/50 mb-2">Descripción / Créditos</label>
                                <textarea rows={3} placeholder="Cuenta la historia detrás del build..." className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FF9800] outline-none transition-colors"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Guidelines */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#FF9800]/20 sticky top-4">
                            <h3 className="font-oswald font-bold text-lg uppercase mb-4 flex items-center gap-2">
                                <MonitorPlay className="w-5 h-5 text-[#FF9800]" />
                                Estándares de Envío
                            </h3>

                            <p className="text-sm text-white/70 mb-6 leading-relaxed">
                                Speedlight Cinema es una galería curada de arte automovilístico. Para asegurar la calidad, todos los envíos deben cumplir estos criterios:
                            </p>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm">Enfoque Automotriz</h4>
                                        <p className="text-xs text-white/50">Solo Autos o Motos. No vlogs, no gaming, no contenido irrelevante.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm">Alta Fidelidad</h4>
                                        <p className="text-xs text-white/50">Mínimo 1080p60. Preferible 4K. No 'shaky footage' de mano sin estabilización.</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Ban className="w-5 h-5 text-red-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm">Estrictamente Prohibido</h4>
                                        <p className="text-xs text-white/50">Piques ilegales, conducción temeraria, o reposts de TikTok/Reels de bajo esfuerzo con marcas de agua.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <div className="flex items-start gap-3 bg-[#FF9800]/10 p-3 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-[#FF9800] shrink-0" />
                                    <p className="text-[10px] text-[#FF9800] font-bold leading-tight">
                                        Todos los envíos pasan por revisión manual. Videos que no cumplan el estándar "Cinemático" serán rechazados.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
