"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/app/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug; // In a real app, use this to fetch data
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, [supabase]);

    // Mock Data for Detail
    const COURSE = {
        title: "Masterclass: Fotografía Automotriz",
        description: "Aprende a capturar la velocidad y la esencia de los autos. Desde configuración de cámara hasta edición en Lightroom.",
        instructor: "Camilo Toloza",
        modules: [
            { title: "Fundamentos de Composición", duration: "45m", locked: false },
            { title: "Configuración para Barridos", duration: "1h 10m", locked: true },
            { title: "Iluminación Nocturna (Light Painting)", duration: "1h 30m", locked: true },
            { title: "Edición y Color Grading", duration: "2h 00m", locked: true },
        ]
    };

    return (
        <main className="min-h-screen bg-[#050302] pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content (Video Player area) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-[#2C1810] group cursor-pointer">
                            {/* Placeholder for Video Player */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-[#FF9800]/20 flex items-center justify-center border border-[#FF9800] group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-[#FF9800] ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                            <Image
                                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"
                                alt="Course Preview"
                                fill
                                className="object-cover opacity-50"
                            />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-[#F5E6D3] mb-2">{COURSE.title}</h1>
                            <p className="text-[#BCAAA4]">{COURSE.description}</p>
                        </div>

                        {/* Instructor Bio */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1A0F08] border border-[#2C1810]">
                            <div className="w-12 h-12 rounded-full bg-gray-700"></div>
                            <div>
                                <h4 className="font-bold text-[#F5E6D3]">{COURSE.instructor}</h4>
                                <p className="text-xs text-[#8D6E63]">Instructor Lead</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Curriculum) */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1A0F08] border border-[#2C1810] rounded-2xl p-6 sticky top-32">
                            <h3 className="text-xl font-bold text-[#F5E6D3] mb-4">Contenido del Curso</h3>

                            <div className="space-y-3">
                                {COURSE.modules.map((module, index) => (
                                    <div key={index} className={`p-4 rounded-lg flex items-center justify-between transition-colors ${!module.locked ? 'bg-[#2C1810] border-l-2 border-[#FF9800]' : 'bg-black/20 text-gray-500'}`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono opacity-50">{index + 1}.</span>
                                            <span className="text-sm font-medium">{module.title}</span>
                                        </div>
                                        {module.locked ? (
                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        ) : (
                                            <span className="text-xs text-[#FF9800]">{module.duration}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8">
                                {user ? (
                                    <button className="w-full py-4 rounded-xl bg-[#FF9800] text-black font-bold uppercase tracking-wider hover:bg-[#FFEB3B] transition-colors">
                                        Continuar Alumno
                                    </button>
                                ) : (
                                    <>
                                        <Link href="/login" className="block w-full">
                                            <button className="w-full py-4 rounded-xl bg-[#FF9800] text-black font-bold uppercase tracking-wider hover:bg-[#FFEB3B] transition-colors shadow-[0_0_20px_rgba(255,152,0,0.3)] animate-pulse">
                                                Empezar Gratis
                                            </button>
                                        </Link>
                                        <p className="text-xs text-center mt-3 text-[#8D6E63]">
                                            Regístrate para acceder al material completo
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
