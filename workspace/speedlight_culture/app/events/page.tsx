import Link from 'next/link';
import { Calendar, MapPin, Users, Ticket, Clock, Map as MapIcon, Filter } from 'lucide-react';

export default function EventsPage() {
    // Mock data for initial visualization
    const events = [
        {
            id: 1,
            title: "Bogotá Car Meet: Nocturnal Editions",
            date: "15 Dic, 2025",
            time: "8:00 PM",
            location: "Bima Outlet Center, Bogotá",
            type: "social",
            typeLabel: "Culture Meet",
            attendees: 120,
            price: "Gratis",
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "Taller de Fotografía Nocturna",
            date: "18 Dic, 2025",
            time: "6:00 PM",
            location: "Speedlight HQ, Medellín",
            type: "academy",
            typeLabel: "Academy Workshop",
            attendees: 15,
            price: "$50.000 COP",
            image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=1000&auto=format&fit=crop"
        },
        {
            id: 3,
            title: "Track Day: Tocancipá Open",
            date: "20 Dic, 2025",
            time: "9:00 AM",
            location: "Autódromo de Tocancipá",
            type: "social",
            typeLabel: "Track Day",
            attendees: 45,
            price: "$350.000 COP",
            image: "https://images.unsplash.com/photo-1532906619279-a787609a3dc2?q=80&w=1000&auto=format&fit=crop"
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#050302]">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2 font-display uppercase italic tracking-wider">
                            Calendario <span className="text-[#D32F2F]">Global</span>
                        </h1>
                        <p className="text-gray-400 max-w-xl">
                            La única fuente de verdad. Encuentra Car Meets, Talleres y Track Days en un solo lugar.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-sm font-bold text-white hover:bg-white/5 transition-colors">
                            <Filter className="w-4 h-4" />
                            Filtrar
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#FF9800] text-black rounded-lg text-sm font-bold hover:bg-[#FF9800]/90 transition-colors">
                            <Calendar className="w-4 h-4" />
                            Vista Mensual
                        </button>
                    </div>
                </div>

                {/* Map Preview Placeholder */}
                <div className="w-full h-64 bg-[#111] rounded-2xl border border-white/5 mb-12 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-[url('https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif')] opacity-20 bg-cover bg-center"></div>
                    <div className="z-10 text-center">
                        <MapIcon className="w-12 h-12 text-[#FF9800] mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-white">Explorar Mapa de Eventos</h3>
                        <p className="text-sm text-gray-400">Ver eventos cercanos a tu ubicación</p>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-white/5 hover:border-[#FF9800]/50 transition-colors group">
                            {/* Image Header */}
                            <div className="relative h-48 w-full">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 left-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${event.type === 'academy' ? 'bg-[#D32F2F] text-white' : 'bg-[#FF9800] text-black'
                                        }`}>
                                        {event.typeLabel}
                                    </span>
                                </div>
                                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm font-bold flex items-center gap-1">
                                    <Ticket className="w-3 h-3 text-[#66cc33]" />
                                    {event.price}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-center gap-2 text-[#FF9800] text-sm font-bold mb-2">
                                    <Calendar className="w-4 h-4" />
                                    {event.date}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 font-display leading-tight">{event.title}</h3>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Clock className="w-4 h-4 text-gray-600" />
                                        {event.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-600" />
                                        {event.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Users className="w-4 h-4 text-gray-600" />
                                        {event.attendees} Asistentes confirmados
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-white font-bold hover:bg-white/10 hover:border-white/20 transition-all">
                                    Ver Detalles & RSVP
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State / CTA for Producers */}
                <div className="mt-16 bg-gradient-to-r from-[#1A1A1A] to-[#111] rounded-2xl p-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <h3 className="text-2xl font-bold text-white mb-2">¿Organizas Car Meets?</h3>
                        <p className="text-gray-400">
                            Publica tu evento en el Calendario Oficial de Speedlight Culture y llega a miles de entusiastas reales.
                        </p>
                    </div>
                    <Link href="/contact" className="px-8 py-3 bg-[#D32F2F] text-white font-bold rounded-lg hover:bg-[#B71C1C] transition-colors whitespace-nowrap">
                        Publicar Evento Gratis
                    </Link>
                </div>
            </div>
        </div>
    );
}
