"use client";

import Link from "next/link";
import Image from "next/image";
import { AdFeedCard } from "../components/AdBanners";

// Mock Data for Projects
const PROJECTS = [
    {
        id: "1",
        title: "Restauración BMW E30 1989",
        owner: "Juan Pérez",
        image: "https://images.unsplash.com/photo-1554744512-d6c603f27c54?q=80&w=1000&auto=format&fit=crop",
        goal: 5000000,
        current: 1250000,
        description: "Devolviendo la gloria a este clásico alemán. Proyecto de restauración completa de motor y pintura.",
        category: "Restauración"
    },
    {
        id: "2",
        title: "Honda Civic EG Turbo Build",
        owner: "Camilo Toloza",
        image: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?q=80&w=1000&auto=format&fit=crop",
        goal: 8000000,
        current: 6500000,
        description: "Buscando los 400HP. Necesito apoyo para la ECU programable y la puesta a punto en dinamómetro.",
        category: "Performance"
    },
    {
        id: "3",
        title: "Subaru WRX STI Track Day",
        owner: "Laura García",
        image: "https://images.unsplash.com/photo-1600712242805-5f7b1a8337d5?q=80&w=1000&auto=format&fit=crop",
        goal: 3000000,
        current: 500000,
        description: "Preparación para la temporada de Time Attack en Tocancipá. Frenos, suspensión y llantas.",
        category: "Track"
    }
];

export default function ProjectsPage() {
    return (
        <main className="min-h-screen bg-[#050302]">
            <div className="pt-48 pb-20 px-6 container mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF9800] via-[#FFEB3B] to-[#FF9800] animate-glow">
                            SPEEDLIGHT PROJECTS
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#BCAAA4] max-w-2xl mx-auto font-light">
                        Apoya los proyectos más ambiciosos de la comunidad. Dona partes virtuales, impulsa sueños reales.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PROJECTS.map((project, index) => {
                        const progress = (project.current / project.goal) * 100;
                        return (
                            <div key={project.id} className="group rounded-2xl bg-[#1A0F08] border border-[#FF9800]/20 overflow-hidden hover:border-[#FF9800]/50 transition-all duration-300 flex flex-col">
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-[#1A0F08]/20 group-hover:bg-transparent transition-all z-10"></div>
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#FF9800]/30 text-[#FF9800] text-xs font-bold uppercase tracking-wider">
                                        {project.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-bold text-[#F5E6D3] mb-1 group-hover:text-[#FF9800] transition-colors">{project.title}</h3>
                                        <p className="text-[#8D6E63] text-sm">por <span className="text-[#BCAAA4] font-medium">{project.owner}</span></p>
                                    </div>

                                    <p className="text-[#BCAAA4] mb-6 line-clamp-2 text-sm">
                                        {project.description}
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="mt-auto">
                                        <div className="flex justify-between text-sm mb-2 font-mono">
                                            <span className="text-[#FF9800]">${project.current.toLocaleString()} COP</span>
                                            <span className="text-[#8D6E63]">${project.goal.toLocaleString()} COP</span>
                                        </div>
                                        <div className="w-full h-2 bg-[#2C1810] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#FF9800] to-[#FFEB3B] rounded-full"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-xs text-[#8D6E63]">{progress.toFixed(0)}% Completado</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Link href={`/projects/${project.id}`} className="mt-6 block w-full">
                                        <button className="w-full py-3 bg-[#2C1810] hover:bg-[#FF9800] text-[#FF9800] hover:text-black font-bold uppercase tracking-wider text-sm rounded-lg transition-all duration-300 border border-[#FF9800]/30">
                                            Ver Proyecto
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Ad Placement between rows if needed, or at bottom */}
                <div className="mt-16">
                    <AdFeedCard />
                </div>
            </div>
        </main>
    );
}
