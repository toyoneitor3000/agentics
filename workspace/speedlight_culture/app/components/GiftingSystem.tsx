"use client";

import { useState } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

const GIFTS = [
    {
        id: "bolt",
        icon: "🔧",
        name: "Tuerca",
        price: 2000,
        gradient: "from-gray-400 to-gray-600",
        description: "Un pequeño aporte para ajustar detalles."
    },
    {
        id: "oil",
        icon: "🛢️",
        name: "Aceite",
        price: 10000,
        gradient: "from-yellow-600 to-yellow-800",
        description: "Mantén el motor lubricado y funcionando."
    },
    {
        id: "nitro",
        icon: "🏎️",
        name: "Nitro",
        price: 20000,
        gradient: "from-blue-500 to-purple-600",
        description: "Un impulso extra de velocidad."
    },
    {
        id: "tire",
        icon: "🛞",
        name: "Llanta",
        price: 50000,
        gradient: "from-zinc-700 to-black",
        description: "Adherencia necesaria para la pista."
    },
    {
        id: "turbo",
        icon: "🐌",
        name: "Turbo",
        price: 100000,
        gradient: "from-red-500 to-orange-500",
        description: "Potencia pura para el proyecto."
    },
    {
        id: "engine",
        icon: "🏆",
        name: "Motor",
        price: 500000,
        gradient: "from-yellow-300 to-yellow-600",
        description: "El corazón de la bestia. Soporte legendario."
    }
];

export function GiftingSystem({ projectTitle }: { projectTitle: string }) {
    const [selectedGift, setSelectedGift] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleDonate = async () => {
        if (!selectedGift) return;

        setIsProcessing(true);
        // Simulate API call / Payment Gateway
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsProcessing(false);
        setShowSuccess(true);

        // Reset after showing success
        setTimeout(() => {
            setShowSuccess(false);
            setSelectedGift(null);
        }, 3000);
    };

    const selectedGiftData = GIFTS.find(g => g.id === selectedGift);

    return (
        <div className="bg-[#1A0F08] border border-[#FF9800]/20 rounded-2xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-[#F5E6D3] mb-2 flex items-center gap-2">
                <span className="text-[#FF9800]">🎁</span> Apoya este Proyecto
            </h3>
            <p className="text-[#BCAAA4] mb-8 text-sm">
                Selecciona una parte virtual para donar. El 100% del valor (menos fees) va directo a {projectTitle}.
            </p>

            {/* Grid of Gifts */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {GIFTS.map((gift) => (
                    <button
                        key={gift.id}
                        onClick={() => setSelectedGift(gift.id)}
                        className={`group relative p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-3
                            ${selectedGift === gift.id
                                ? 'bg-[#2C1810] border-[#FF9800] scale-105 shadow-[0_0_20px_rgba(255,152,0,0.3)]'
                                : 'bg-black/40 border-[#FF9800]/10 hover:border-[#FF9800]/50 hover:bg-[#2C1810]/50'
                            }`}
                    >
                        <div className={`text-4xl filter drop-shadow-lg transition-transform duration-300 ${selectedGift === gift.id ? 'scale-110 animate-bounce' : 'group-hover:scale-110'}`}>
                            {gift.icon}
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-[#F5E6D3] text-sm">{gift.name}</div>
                            <div className="text-[#FF9800] text-xs font-mono mt-1">${gift.price.toLocaleString()}</div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Detail & Action Area */}
            <div className="min-h-[100px] flex flex-col justify-end">
                {selectedGiftData ? (
                    <div className="animate-fade-in space-y-4">
                        <div className="p-4 bg-[#FF9800]/5 rounded-lg border border-[#FF9800]/20">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-[#F5E6D3]">{selectedGiftData.name}</span>
                                <span className="font-mono text-[#FF9800] text-xl font-bold">${selectedGiftData.price.toLocaleString()} COP</span>
                            </div>
                            <p className="text-xs text-[#BCAAA4]">{selectedGiftData.description}</p>
                        </div>

                        <SignedIn>
                            <button
                                onClick={handleDonate}
                                disabled={isProcessing}
                                className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2
                                    ${isProcessing
                                        ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#FF9800] to-[#FFEB3B] text-black hover:shadow-[0_0_30px_rgba(255,152,0,0.4)] hover:scale-[1.02]'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando Nequi...
                                    </>
                                ) : (
                                    <>Enviar Donación</>
                                )}
                            </button>
                        </SignedIn>

                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="w-full py-4 rounded-xl font-bold uppercase tracking-wider bg-[#2C1810] text-[#BCAAA4] border border-[#FF9800]/30 hover:bg-[#FF9800] hover:text-black transition-all">
                                    Inicia sesión para donar
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                ) : (
                    <div className="text-center p-6 text-[#BCAAA4]/50 text-sm italic border-t border-dashed border-[#BCAAA4]/10">
                        Selecciona un ítem arriba para ver detalles
                    </div>
                )}
            </div>

            {/* Success Modal / Overlay */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#1A0F08] border border-[#FF9800] p-8 rounded-2xl max-w-sm w-full text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FF9800]/20 to-transparent"></div>
                        <div className="relative z-10">
                            <div className="text-6xl mb-4 animate-bounce">🎉</div>
                            <h3 className="text-2xl font-bold text-[#F5E6D3] mb-2">¡Donación Exitosa!</h3>
                            <p className="text-[#BCAAA4]">Has enviado un <strong>{selectedGiftData?.name}</strong> a {projectTitle}.</p>
                            <p className="text-xs text-[#8D6E63] mt-4">Gracias por apoyar la cultura.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
