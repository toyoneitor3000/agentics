"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, Check } from "lucide-react";

export default function OnboardingGuide() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
        if (!hasSeenOnboarding) {
            // Small delay to allow app to load
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleComplete = () => {
        setIsOpen(false);
        localStorage.setItem("hasSeenOnboarding", "true");
    };

    const steps = [
        {
            title: "Bienvenido a Speedlight Culture",
            description: "La red social definitiva para la cultura automotriz. Aquí tienes una guía rápida para empezar.",
            image: "🚗"
        },
        {
            title: "Navegación Simplificada",
            description: "Todo lo que necesitas está en la barra inferior. Home, Cinema y tu Garaje (Proyectos) están a un toque de distancia.",
            image: "🧭"
        },
        {
            title: "Tu Centro Creativo (+)",
            description: "El botón naranja central es tu herramienta de poder. Úsalo para subir Videos, Proyectos, Eventos o Blogs desde cualquier lugar.",
            image: "🧡"
        },
        {
            title: "Menú y Más",
            description: "Accede a la Galería, Marketplace, Academy y más a través del botón de Menú en la derecha.",
            image: "grid"
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1A1A1A] border border-[#333] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 flex">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-full flex-1 transition-colors duration-300 ${i <= step ? 'bg-[#FF9800]' : 'bg-[#333]'}`}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-[#FF9800]/10 flex items-center justify-center text-4xl mb-2 border border-[#FF9800]/20 text-[#FF9800]">
                        {steps[step].image === "grid" ? (
                            <div className="grid grid-cols-2 gap-1">
                                <div className="w-2 h-2 bg-[#FF9800]" />
                                <div className="w-2 h-2 bg-[#FF9800]" />
                                <div className="w-2 h-2 bg-[#FF9800]" />
                                <div className="w-2 h-2 bg-[#FF9800]" />
                            </div>
                        ) : steps[step].image}
                    </div>

                    <h2 className="text-2xl font-bold text-white">{steps[step].title}</h2>
                    <p className="text-white/60 leading-relaxed">{steps[step].description}</p>
                </div>

                {/* Actions */}
                <div className="p-6 bg-[#111] border-t border-[#222] flex justify-between items-center">
                    <button
                        onClick={handleComplete}
                        className="text-white/40 hover:text-white text-sm font-medium px-4 py-2"
                    >
                        Saltar
                    </button>

                    <button
                        onClick={() => {
                            if (step < steps.length - 1) {
                                setStep(step + 1);
                            } else {
                                handleComplete();
                            }
                        }}
                        className="bg-[#FF9800] hover:bg-[#F57C00] text-black font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-transform active:scale-95"
                    >
                        {step < steps.length - 1 ? (
                            <>Siguiente <ChevronRight className="w-4 h-4" /></>
                        ) : (
                            <>Entendido <Check className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
