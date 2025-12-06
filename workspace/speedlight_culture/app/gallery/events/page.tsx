"use client";

import Navbar from "../../components/Navbar";

const EVENTS = [
    {
        id: 1,
        title: "SpeedFest 2024",
        photographer: "Alex Shooter",
        date: "12 Dic 2024",
        photos: 142,
        cover: "https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Midnight Run Tokyo",
        photographer: "JDM Master",
        date: "10 Nov 2024",
        photos: 89,
        cover: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Classic Car Show",
        photographer: "Vintage Lens",
        date: "05 Oct 2024",
        photos: 215,
        cover: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Drift Championship",
        photographer: "Sideways Sam",
        date: "22 Sep 2024",
        photos: 320,
        cover: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop"
    },
];

export default function EventsPage() {
    return (
        <main className="min-h-screen bg-[#1A0F08] text-[#FFF8F0]">
            <Navbar />

            <div className="pt-32 pb-20 px-6 container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            <span className="text-[#D32F2F]">EVENTOS</span> & COBERTURAS
                        </h1>
                        <p className="text-[#BCAAA4] text-lg">Revive los mejores momentos capturados por nuestra comunidad.</p>
                    </div>

                    <button className="px-8 py-3 bg-[#2C1810] border border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white font-bold rounded-full transition-all duration-300 uppercase tracking-wider text-sm flex items-center">
                        <span className="mr-2">+</span> Cargar Álbum
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {EVENTS.map((event) => (
                        <div key={event.id} className="group cursor-pointer">
                            {/* Card Image */}
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 border border-[#4A2C1A] group-hover:border-[#D32F2F]/50 transition-all duration-300">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${event.cover})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                                <div className="absolute bottom-4 right-4 bg-[#D32F2F] text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {event.photos} FOTOS
                                </div>
                            </div>

                            {/* Card Content */}
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-[#D32F2F] transition-colors">{event.title}</h3>
                                    <span className="text-xs text-[#BCAAA4] border border-[#4A2C1A] px-2 py-1 rounded">{event.date}</span>
                                </div>
                                <div className="flex items-center text-[#BCAAA4] text-sm">
                                    <div className="w-6 h-6 rounded-full bg-[#4A2C1A] flex items-center justify-center mr-2 text-xs font-bold text-[#FF9800]">
                                        {event.photographer.charAt(0)}
                                    </div>
                                    <span>Por <span className="text-[#FFF8F0]">{event.photographer}</span></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
