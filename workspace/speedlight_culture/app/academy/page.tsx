"use client";

import Link from "next/link";
import Image from "next/image";
import { AdFeedCard } from "../components/AdBanners";
import PageHero from '@/app/components/PageHero';

const COURSES = [
    {
        id: "intro-mecanica",
        title: "Introducción a la Mecánica Deportiva",
        instructor: "Taller 911",
        level: "Principiante",
        duration: "4h 30m",
        image: "https://images.unsplash.com/photo-1486262715619-01b8c22971f5?q=80&w=1000&auto=format&fit=crop",
        price: 0, // Free
        isNew: true
    },
    {
        id: "fotografia-automotriz",
        title: "Masterclass: Fotografía Automotriz",
        instructor: "Camilo Toloza",
        level: "Intermedio",
        duration: "6h 15m",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
        price: 45000,
        isNew: false
    },
    {
        id: "track-day-basics",
        title: "Fundamentos de Track Day",
        instructor: "Juan Pablo Montoya (AI)",
        level: "Avanzado",
        duration: "2h 45m",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop",
        price: 80000,
        isNew: true
    }
];



export default function AcademyPage() {
    return (
        <main className="min-h-screen bg-[#050302] pb-24">
            <PageHero
                title="Speedlight Academy"
                subtitle="Aprende. Construye. Corre."
                description="La primera plataforma educativa dedicada exclusivamente a la cultura automotriz en Latinoamérica."
                image="/images/academy-hero.jpg" // Placeholder
                action={{
                    label: "Ver Todos los Cursos",
                    href: "#courses",
                    icon: undefined
                }}
            />
            {/* Courses Grid */}
            <div id="courses" className="container mx-auto px-6 mt-12 pb-24">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-[#F5E6D3]">Cursos Destacados</h2>
                    <div className="flex gap-2">
                        <button className="p-2 border border-[#2C1810] rounded hover:bg-[#2C1810] text-[#FF9800] transition-colors">
                            ←
                        </button>
                        <button className="p-2 border border-[#2C1810] rounded hover:bg-[#2C1810] text-[#FF9800] transition-colors">
                            →
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {COURSES.map((course) => (
                        <Link href={`/academy/${course.id}`} key={course.id} className="group">
                            <div className="bg-[#1A0F08] border border-[#2C1810] rounded-2xl overflow-hidden hover:border-[#FF9800]/50 transition-all duration-300 h-full flex flex-col">
                                {/* Thumbnail */}
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={course.image}
                                        alt={course.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {course.isNew && (
                                        <div className="absolute top-4 left-4 bg-[#FF9800] text-black text-xs font-bold px-2 py-1 rounded">
                                            NUEVO
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded">
                                        {course.duration}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="mb-2 flex items-center justify-between text-xs text-[#8D6E63] uppercase tracking-wide font-medium">
                                        <span>{course.level}</span>
                                        <span className="text-[#FF9800]">{course.instructor}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#F5E6D3] mb-3 group-hover:text-[#FF9800] transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>

                                    <div className="mt-auto pt-4 border-t border-[#2C1810] flex items-center justify-between">
                                        <span className={`text-lg font-bold ${course.price === 0 ? 'text-[#66BB6A]' : 'text-[#F5E6D3]'}`}>
                                            {course.price === 0 ? 'GRATIS' : `$${course.price.toLocaleString()} COP`}
                                        </span>
                                        <span className="text-[#FF9800] text-sm font-bold uppercase group-hover:underline">
                                            Ver Curso
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Ad Placement */}
                <div className="mt-16">
                    <AdFeedCard />
                </div>
            </div>
        </main>
    );
}
