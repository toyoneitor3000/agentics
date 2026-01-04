'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger'
}: ConfirmModalProps) {
    if (!isOpen) return null;


    const colors = {
        danger: 'bg-red-500 text-white hover:bg-red-600',
        warning: 'bg-yellow-500 text-black hover:bg-yellow-600',
        info: 'bg-[#FF9800] text-black hover:bg-[#F57C00]'
    };

    const iconColors = {
        danger: 'text-red-500',
        warning: 'text-yellow-500',
        info: 'text-[#FF9800]'
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="p-6 text-center">
                        <div className={`w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 ${iconColors[variant]}`}>
                            <AlertTriangle className="w-8 h-8" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">{title}</h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-8">
                            {message}
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${colors[variant]}`}
                            >
                                {confirmText}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs text-white/40 hover:text-white hover:bg-white/5 transition-all"
                            >
                                {cancelText}
                            </button>
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/20 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
