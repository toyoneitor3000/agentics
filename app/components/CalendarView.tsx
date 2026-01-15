"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';

interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    type: string;
    typeLabel: string;
    image: string;
}

interface CalendarViewProps {
    events: Event[];
}

export default function CalendarView({ events }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // Start at Dec 2025 for demo match

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 is Sunday

    // Adjust for Monday start if desired, but standard US is Sunday. Let's stick to standard sunday start for now.

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const getEventsForDay = (day: number) => {
        return events.filter(e => {
            // Very basic parser matching "15 Dic, 2025" or similar
            const eventDateParts = e.date.split(' ');
            if (eventDateParts.length < 1) return false;
            const eventDay = parseInt(eventDateParts[0]);

            // In a real app, use a proper date object in the event data
            // For now, assume if the day matches and we are in Dec 2025 (demo)
            return eventDay === day && currentDate.getMonth() === 11 && currentDate.getFullYear() === 2025;
        });
    };

    const nextMonth = () => {
        // Just visual for now or increment logic
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    return (
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider">
                    {monthNames[currentDate.getMonth()]} <span className="text-[#FF9800]">{currentDate.getFullYear()}</span>
                </h3>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-white/5">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="py-4 text-center text-sm font-bold text-gray-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 auto-rows-fr bg-[#111]">
                {/* Blanks */}
                {blanks.map(i => (
                    <div key={`blank-${i}`} className="min-h-[120px] border-b border-r border-white/5 bg-[#0A0A0A]"></div>
                ))}

                {/* Days */}
                {days.map(day => {
                    const dayEvents = getEventsForDay(day);
                    const isToday = false; // logic would go here

                    return (
                        <div key={day} className="min-h-[120px] p-2 border-b border-r border-white/5 relative group hover:bg-[#1A1A1A] transition-colors">
                            <span className={`text-sm font-bold ${isToday ? 'bg-[#FF9800] text-black w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-400'}`}>
                                {day}
                            </span>

                            <div className="mt-2 space-y-1">
                                {dayEvents.map(event => (
                                    <div key={event.id} className="text-xs p-1.5 rounded bg-[#2A2A2A] border-l-2 border-[#FF9800] hover:bg-[#333] transition-colors cursor-pointer truncate">
                                        <div className="font-bold text-white truncate">{event.title}</div>
                                        <div className="text-[10px] text-gray-400">{event.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
