"use client";

import { X, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface LoginRequiredModalProps {
    isOpen: boolean;
    onClose?: () => void;
}

export default function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Glow Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#FF9800]/20 blur-[50px] pointer-events-none"></div>

                    <div className="p-8 text-center relative z-10">
                        <div className="mx-auto w-16 h-16 bg-[#FF9800]/10 rounded-full flex items-center justify-center mb-6 border border-[#FF9800]/20">
                            <UserPlus className="w-8 h-8 text-[#FF9800]" />
                        </div>

                        <h3 className="text-2xl font-bold font-oswald uppercase text-white mb-2 italic transform -skew-x-2">
                            Únete a la <span className="text-[#FF9800]">Cultura</span>
                        </h3>

                        <p className="text-white/60 text-sm font-sans mb-8 leading-relaxed">
                            Para disfrutar de la experiencia completa, interactuar con constructores y guardar tus favoritos, necesitas una cuenta.
                        </p>

                        <div className="space-y-3">
                            <Link
                                href="/login"
                                className="flex items-center justify-center w-full py-4 px-4 bg-[#FF9800] hover:bg-[#FF9800]/90 text-black font-bold font-oswald uppercase tracking-wider rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] gap-2 shadow-[0_0_20px_rgba(255,152,0,0.3)]"
                            >
                                <LogIn className="w-5 h-5" /> Entrar al Garage
                            </Link>
                        </div>

                        {onClose && (
                            <button
                                onClick={onClose}
                                className="mt-6 text-[10px] text-white/30 uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Continuar como invitado
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
