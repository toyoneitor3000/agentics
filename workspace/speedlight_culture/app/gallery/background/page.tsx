"use client";

import Navbar from "../../components/Navbar";
import { useState } from "react";

const WALLPAPERS = [
    { id: 1, title: "Neon Drift", url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop", category: "Drift" },
    { id: 2, title: "Classic Muscle", url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop", category: "Classic" },
    { id: 3, title: "Night Runner", url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop", category: "Street" },
    { id: 4, title: "Track Day", url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop", category: "Racing" },
    { id: 5, title: "JDM Legend", url: "https://images.unsplash.com/photo-1611016186353-9af296956294?q=80&w=800&auto=format&fit=crop", category: "JDM" },
    { id: 6, title: "Sunset Cruise", url: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=800&auto=format&fit=crop", category: "Lifestyle" },
];

const CATEGORIES = ["Todos", "Drift", "Classic", "Street", "Racing", "JDM", "Lifestyle"];

export default function BackgroundsPage() {
    const [activeCategory, setActiveCategory] = useState("Todos");

    const filteredWallpapers = activeCategory === "Todos"
        ? WALLPAPERS
        : WALLPAPERS.filter(w => w.category === activeCategory);

    return (
        <main className="min-h-screen bg-[#1A0F08] text-[#FFF8F0]">
            <Navbar />

            <div className="pt-32 pb-20 px-6 container mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        <span className="text-[#FF9800]">FONDOS</span> DE PANTALLA
                    </h1>
                    <p className="text-[#BCAAA4] text-lg">Personaliza tus dispositivos con la mejor estética automotriz.</p>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-4 mb-12">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${activeCategory === cat
                                    ? "bg-[#FF9800] text-[#1A0F08] border-[#FF9800]"
                                    : "bg-transparent text-[#BCAAA4] border-[#4A2C1A] hover:border-[#FF9800]/50 hover:text-[#FFF8F0]"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredWallpapers.map((wallpaper) => (
                        <div key={wallpaper.id} className="group relative aspect-[16/9] rounded-xl overflow-hidden border border-[#4A2C1A] hover:border-[#FF9800]/50 transition-all duration-300">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${wallpaper.url})` }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                <button className="px-8 py-3 bg-[#FF9800] text-[#1A0F08] font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#FFB74D]">
                                    DESCARGAR
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-lg font-bold text-white">{wallpaper.title}</h3>
                                <span className="text-xs text-[#FF9800] uppercase tracking-wider">{wallpaper.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
