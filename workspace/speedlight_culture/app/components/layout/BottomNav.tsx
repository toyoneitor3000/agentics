"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home, Compass, Play, ShoppingBag, GraduationCap, Calendar, Wrench,
    MessageSquare, Image as ImageIcon, Search, Plus, Menu, X, Settings2, GripVertical
} from "lucide-react";
import { useScrollDirection } from "@/app/hooks/useScrollDirection";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// AVAILABLE APPS REGISTRY
const ALL_APPS: Record<string, { name: string, icon: any, path: string }> = {
    '/gallery': { name: "Galería", icon: ImageIcon, path: '/gallery' },
    '/cinema': { name: "Cinema", icon: Play, path: '/cinema' },
    '/projects': { name: "Garage", icon: Compass, path: '/projects' },
    '/marketplace': { name: "Marketplace", icon: ShoppingBag, path: '/marketplace' },
    '/academy': { name: "Academy", icon: GraduationCap, path: '/academy' },
    '/workshops': { name: "Talleres", icon: Wrench, path: '/workshops' },
    '/events': { name: "Eventos", icon: Calendar, path: '/events' },
    '/autostudio': { name: "AutoStudio", icon: MessageSquare, path: '/autostudio' },
};

export default function BottomNav() {
    const pathname = usePathname();
    const scrollDirection = useScrollDirection();
    const isHidden = scrollDirection === "down";
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // --- DOCK CUSTOMIZATION STATE ---
    // Slots: [1: Fixed Home, 2: Flex, 3: Fixed Create, 4: Flex, 5: Fixed Menu]
    // We only store the "paths" for Slot 2 and Slot 4
    const [leftSlot, setLeftSlot] = useState<string>('/cinema'); // Default
    const [rightSlot, setRightSlot] = useState<string>('/projects'); // Default
    const [isEditMode, setIsEditMode] = useState(false);

    const isActive = (path: string) => pathname === path || (path !== '/' && pathname?.startsWith(path));

    useEffect(() => {
        // Load Preferences
        const savedLeft = localStorage.getItem('dockSlotLeft');
        const savedRight = localStorage.getItem('dockSlotRight');
        if (savedLeft && ALL_APPS[savedLeft]) setLeftSlot(savedLeft);
        if (savedRight && ALL_APPS[savedRight]) setRightSlot(savedRight);
    }, []);

    const [selectedSlotForEdit, setSelectedSlotForEdit] = useState<'left' | 'right' | null>(null);

    const selectAppForSlot = (path: string) => {
        if (selectedSlotForEdit === 'left') {
            setLeftSlot(path);
            localStorage.setItem('dockSlotLeft', path);
        } else if (selectedSlotForEdit === 'right') {
            setRightSlot(path);
            localStorage.setItem('dockSlotRight', path);
        }
        setSelectedSlotForEdit(null);
        setIsEditMode(false);
        setIsMenuOpen(false); // Close menu on success
    };

    // --- RENDER HELPERS ---
    const renderSlot = (path: string, slotId: 'left' | 'right') => {
        const app = ALL_APPS[path] || ALL_APPS[slotId === 'left' ? '/cinema' : '/projects'];
        const Icon = app?.icon || Play; // Fallback
        const active = isActive(path);
        const isSelectedForEdit = isEditMode && selectedSlotForEdit === slotId;

        return (
            <div className="relative group">
                {/* Selection Indicator (Edit Mode) */}
                {isEditMode && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-[#FF9800] text-black px-2 py-0.5 rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-wider">
                        {isSelectedForEdit ? "Seleccionado" : "Cambiar"}
                    </div>
                )}

                {isEditMode ? (
                    <button
                        onClick={() => setSelectedSlotForEdit(slotId)}
                        className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 relative
                            ${isSelectedForEdit
                                ? 'bg-[#FF9800] text-black animate-pulse ring-2 ring-[#FF9800]/50'
                                : 'bg-white/5 text-white/60 border border-dashed border-white/30 hover:bg-white/10'
                            }`}
                    >
                        <Icon className="w-6 h-6" />
                        <GripVertical className="absolute top-1 right-1 w-3 h-3 opacity-50" />
                    </button>
                ) : (
                    <Link
                        href={app.path}
                        className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${active ? 'bg-white/10 text-white backdrop-blur-3xl shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                        <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 2} />
                    </Link>
                )}
            </div>
        );
    };

    // Determine correct app for slots (safe lookup)
    const effectiveLeftSlot = ALL_APPS[leftSlot] ? leftSlot : '/cinema';
    const effectiveRightSlot = ALL_APPS[rightSlot] ? rightSlot : '/projects';

    return (
        <>
            {/* Main Navigation Bar */}
            <div
                className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${isHidden && !isMenuOpen ? 'translate-y-[180%]' : 'translate-y-0'} w-[94%] max-w-[420px]`}
            >
                <div className="relative flex items-center justify-between px-1 h-[72px] rounded-full bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.05)] ring-1 ring-black/20">

                    {/* Slot 1: Home (Fixed) */}
                    <Link
                        href="/"
                        className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${isActive('/') ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                        <Home className="w-6 h-6" strokeWidth={isActive('/') ? 2.5 : 2} />
                    </Link>

                    {/* Slot 2: Flexible Left */}
                    {renderSlot(effectiveLeftSlot, 'left')}

                    {/* Slot 3: Center Create (Fixed & Flat) */}
                    {/* User requested Flat Balance. No negative margin. */}
                    <div className="flex items-center justify-center w-16 h-16 shrink-0 z-10">
                        <Link
                            href="/create"
                            className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF9800] to-[#FFB74D] text-black shadow-[0_0_20px_rgba(255,152,0,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
                        >
                            <Plus className="w-7 h-7" strokeWidth={3} />
                        </Link>
                    </div>

                    {/* Slot 4: Flexible Right */}
                    {renderSlot(effectiveRightSlot, 'right')}

                    {/* Slot 5: Menu (Fixed) */}
                    <button
                        onClick={() => {
                            setIsMenuOpen(!isMenuOpen);
                            if (isEditMode) setIsEditMode(false); // Reset edit on toggle
                        }}
                        className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${isMenuOpen ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" strokeWidth={2.5} /> : <Menu className="w-6 h-6" strokeWidth={2} />}
                    </button>
                </div>
            </div>

            {/* Menu Drawer (Overlay) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 100, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 100, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl overflow-hidden"
                        >
                            {/* Glass Shine */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <span className="text-white/40 text-xs font-bold uppercase tracking-widest pl-2">Todas las Apps</span>
                                <button
                                    onClick={() => {
                                        setIsEditMode(!isEditMode);
                                        setSelectedSlotForEdit(null);
                                    }}
                                    className={`text-xs flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border outline-none ${isEditMode ? 'bg-[#FF9800] text-black border-[#FF9800]' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                                >
                                    <Settings2 className="w-3 h-3" />
                                    {isEditMode ? "Guardar Dock" : "Editar Dock"}
                                </button>
                            </div>

                            {/* EDIT MODE INSTRUCTION */}
                            {isEditMode && (
                                <div className="mb-4 p-3 bg-[#FF9800]/10 border border-[#FF9800]/20 rounded-xl text-[11px] text-[#FF9800] text-center animate-in fade-in leading-relaxed">
                                    {!selectedSlotForEdit
                                        ? "Toca un icono en la barra inferior para cambiarlo."
                                        : "Toca una app de esta lista para asignarla al Dock."}
                                </div>
                            )}

                            <div className="grid grid-cols-4 gap-4 relative z-10">
                                {Object.values(ALL_APPS).map((app) => {
                                    const Icon = app.icon;
                                    const isCurrentLeft = effectiveLeftSlot === app.path;
                                    const isCurrentRight = effectiveRightSlot === app.path;
                                    const inDock = isCurrentLeft || isCurrentRight;

                                    return (
                                        <button
                                            key={app.path}
                                            disabled={isEditMode && !selectedSlotForEdit} // Disable selection if no target slot picked yet
                                            onClick={() => {
                                                if (isEditMode && selectedSlotForEdit) {
                                                    selectAppForSlot(app.path);
                                                } else if (!isEditMode) {
                                                    // Normal Navigation via window because Link inside button is weird
                                                    window.location.href = app.path;
                                                }
                                            }}
                                            className={`relative flex flex-col items-center gap-2 p-2 rounded-2xl transition-all group outline-none
                                                ${inDock && isEditMode ? 'opacity-30 grayscale' : ''}
                                                ${isEditMode && selectedSlotForEdit ? 'hover:bg-white/10 cursor-pointer animate-pulse' : ''}
                                            `}
                                        >

                                            <div className="flex flex-col items-center gap-2 w-full">
                                                <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center bg-[#1F1F1F] border border-white/5 transition-all shadow-lg ${!isEditMode && 'group-hover:bg-[#2A2A2A] group-hover:scale-110'} ${isEditMode && selectedSlotForEdit ? 'bg-[#FF9800]/20 border-[#FF9800]/50' : ''}`}>
                                                    <Icon className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-[10px] text-white/50 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full">{app.name}</span>
                                            </div>

                                            {/* Dot indicator if in dock */}
                                            {inDock && !isEditMode && <div className="absolute top-2 right-2 w-2 h-2 bg-white/20 rounded-full" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
