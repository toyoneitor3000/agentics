"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Ticket, Clock, Map as MapIcon, Filter, List, Plus } from 'lucide-react';
import CalendarView from '../components/CalendarView';
import { createClient } from '@/app/utils/supabase/client';

export default function EventsPage() {
    const [view, setView] = useState<'list' | 'calendar'>('list');
    const [events, setEvents] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('created_at', { ascending: false });

            if (data && !error) {
                const mappedEvents = data.map(e => ({
                    id: e.id,
                    title: e.title,
                    date: e.date_text || 'Fecha por definir',
                    time: e.time_text || 'Hora por definir',
                    location: e.location || 'Ubicación secreta',
                    type: e.type || 'social',
                    typeLabel: e.type_label || 'Community Event',
                    attendees: Math.floor(Math.random() * 100) + 10, // Mock for now
                    price: 'Gratis', // Mock for now
                    image: e.image || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop"
                }));
                setEvents(mappedEvents);
            } else {
                // Fallback to mock if no DB or empty (Optional: remove this if you want strict real data)
                setEvents([
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
                    }
                ]);
            }
        };

        fetchEvents();
    }, []);

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
                    <div className="flex flex-wrap gap-3">
                        <Link href="/events/new" className="flex items-center gap-2 px-4 py-2 bg-[#D32F2F] border border-[#D32F2F] rounded-lg text-sm font-bold text-white hover:bg-[#B71C1C] transition-colors">
                            <Plus className="w-4 h-4" />
                            Publicar Evento
                        </Link>
                        <div className="flex bg-[#1A1A1A] p-1 rounded-lg border border-white/10">
                            <button
                                onClick={() => setView('list')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${view === 'list' ? 'bg-[#FF9800] text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                            >
                                <List className="w-4 h-4" />
                                Lista
                            </button>
                            <button
                                onClick={() => setView('calendar')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${view === 'calendar' ? 'bg-[#FF9800] text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Calendar className="w-4 h-4" />
                                Calendario
                            </button>
                        </div>
                    </div>
                </div>

                {view === 'calendar' ? (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        <CalendarView events={events} />
                    </div>
                ) : (
                    <>
                        {/* Map Preview Placeholder - Only in list view or move to separate section? Keeping here for now */}
                        <div className="w-full h-64 bg-[#111] rounded-2xl border border-white/5 mb-12 flex items-center justify-center relative overflow-hidden group cursor-pointer animate-in fade-in duration-500">
                            <div className="absolute inset-0 bg-[url('https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif')] opacity-20 bg-cover bg-center"></div>
                            <div className="z-10 text-center">
                                <MapIcon className="w-12 h-12 text-[#FF9800] mx-auto mb-3" />
                                <h3 className="text-xl font-bold text-white">Explorar Mapa de Eventos</h3>
                                <p className="text-sm text-gray-400">Ver eventos cercanos a tu ubicación</p>
                            </div>
                        </div>

                        {/* Events Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
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
                    </>
                )}

                {/* Empty State / CTA for Producers */}
                <div className="mt-16 bg-gradient-to-r from-[#1A1A1A] to-[#111] rounded-2xl p-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <h3 className="text-2xl font-bold text-white mb-2">¿Organizas Car Meets?</h3>
                        <p className="text-gray-400">
                            Publica tu evento en el Calendario Oficial de Speedlight Culture y llega a miles de entusiastas reales.
                        </p>
                    </div>
                    <Link href="/events/new" className="px-8 py-3 bg-[#D32F2F] text-white font-bold rounded-lg hover:bg-[#B71C1C] transition-colors whitespace-nowrap">
                        Publicar Evento Gratis
                    </Link>
                </div>
            </div>
        </div>
    );
}
