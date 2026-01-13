'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Sparkles, Car, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const WelcomeModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show modal after a short delay on mount
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleAction = (id: string) => {
        setIsOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-4xl bg-brand-dark-blue border border-brand-cyan/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-in zoom-in-95 duration-300 flex flex-col md:flex-row">

                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-brand-cyan/20 border border-white/10 rounded-full transition-colors group"
                >
                    <X size={20} className="text-white group-hover:text-brand-cyan" />
                </button>

                {/* Image Side - Hidden on mobile, 40% on desktop */}
                <div className="hidden md:block relative w-2/5 min-h-[400px]">
                    <Image
                        src="/about-us.jpg"
                        alt="Victory Cars Detail"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-dark-blue" />
                </div>

                {/* Content Side */}
                <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center gap-6 relative">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 w-fit">
                            <Sparkles size={14} className="text-brand-cyan" />
                            <span className="text-brand-cyan text-xs font-bold tracking-wider uppercase">Experiencia Premium</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white leading-tight">
                            Transforma tu <span className="text-brand-cyan">Vehículo</span>
                        </h2>

                        <p className="text-brand-slate text-lg leading-relaxed">
                            Dale a tu auto el cuidado que merece con nuestros servicios de detailing profesional y protección cerámica de última generación.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <button
                            onClick={() => handleAction('contact')}
                            className="group flex-1 py-4 bg-brand-cyan text-brand-dark-blue font-orbitron font-bold rounded-xl hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2"
                        >
                            <Calendar size={20} />
                            <span>AGENDAR CITA</span>
                        </button>
                        <button
                            onClick={() => handleAction('services')}
                            className="group flex-1 py-4 bg-transparent border border-white/20 text-white font-orbitron font-bold rounded-xl hover:bg-white/5 hover:border-brand-cyan/50 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Car size={20} className="text-brand-slate group-hover:text-brand-cyan transition-colors" />
                            <span>VER SERVICIOS</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
