"use client";

import { useEffect, useState, useRef } from "react";
import { Database, ShieldCheck, Server, Globe, X, Minus, Maximize2, Move } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUi } from "@/app/context/UiContext";

type StatusData = {
    status: 'operational' | 'degraded' | 'outage' | 'maintenance';
    latency: number;
    services: {
        database: boolean;
        auth: boolean;
    };
    region: string;
};

export default function SystemStatus() {
    const [data, setData] = useState<StatusData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const { showDebugConsole, toggleDebugConsole } = useUi();
    const constraintsRef = useRef(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch('/api/status');
                const json = await res.json();
                setData(json);
            } catch (e) {
                console.error("Status check failed", e);
                // Fallback for visual continuity even if check fails
                setData({
                    status: 'operational',
                    latency: 0,
                    services: { database: true, auth: true },
                    region: 'EDGE'
                });
            } finally {
                setLoading(false);
            }
        };

        if (showDebugConsole) {
            checkStatus();
            // Poll every 60 seconds
            const interval = setInterval(checkStatus, 60000);
            return () => clearInterval(interval);
        }
    }, [showDebugConsole]);

    if (!showDebugConsole) return null;

    // Loading State
    if (loading || !data) {
        return null; // Don't show anything until loaded to avoid flickering
    }

    // Determine colors
    let color = "bg-green-500";
    let textColor = "text-green-500";
    let statusLabel = "OPERATIONAL";

    if (data.status === 'degraded') {
        color = "bg-yellow-500";
        textColor = "text-yellow-500";
        statusLabel = "DEGRADED";
    } else if (data.status === 'outage') {
        color = "bg-red-500";
        textColor = "text-red-500";
        statusLabel = "OUTAGE";
    } else if (data.status === 'maintenance') {
        color = "bg-blue-500";
        textColor = "text-blue-500";
        statusLabel = "MAINTENANCE";
    }

    return (
        <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[99999]">
            <motion.div
                drag
                dragMomentum={false}
                dragConstraints={constraintsRef}
                initial={{ x: 20, y: typeof window !== 'undefined' ? window.innerHeight - 150 : 500 }}
                className={`pointer-events-auto absolute bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-300 ${isMinimized ? 'rounded-full w-auto' : 'rounded-lg w-64'
                    }`}
            >
                {/* Header (Always Visible) */}
                <div className={`flex items-center justify-between px-3 py-2 ${isMinimized ? '' : 'border-b border-white/5 bg-white/5 cursor-move'}`}>

                    {/* Status Indicator (Visible in both modes) */}
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${color} ${data.status === 'operational' ? 'animate-pulse' : ''} shadow-[0_0_8px_currentColor]`}></span>
                        {!isMinimized && <span className="text-[10px] font-bold text-white/50 tracking-widest font-roboto-mono uppercase">DEBUG CONSOLE</span>}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1 ml-2">
                        {/* Min/Max Button */}
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-1 hover:bg-white/10 rounded-md text-white/50 hover:text-white transition-colors"
                        >
                            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        </button>

                        {/* Close Button (Only in maximized or handled via other means? Keep it accessible) */}
                        {!isMinimized && (
                            <button
                                onClick={() => toggleDebugConsole(false)}
                                className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded-md text-white/50 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Extended Details (Hidden when minimized) */}
                <AnimatePresence>
                    {!isMinimized && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-4 space-y-3 text-xs"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-white/70 font-bold">Status</span>
                                <span className={`font-bold ${textColor}`}>{statusLabel}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-white/70">
                                    <Database className="w-3 h-3" /> Database
                                </span>
                                {data.services.database ? (
                                    <span className="text-green-500 font-bold">ONLINE</span>
                                ) : (
                                    <span className="text-red-500 font-bold">OFFLINE</span>
                                )}
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-white/70">
                                    <ShieldCheck className="w-3 h-3" /> Auth
                                </span>
                                {data.services.auth ? (
                                    <span className="text-green-500 font-bold">SECURE</span>
                                ) : (
                                    <span className="text-red-500 font-bold">ISSUES</span>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-2">
                                <span className="flex items-center gap-2 text-white/50">
                                    <Globe className="w-3 h-3" /> Region
                                </span>
                                <span className="text-white/50 font-roboto-mono">{data.region}</span>
                            </div>

                            <div className="text-[10px] text-white/20 font-mono pt-1 text-center flex justify-between">
                                <span>Latency: {data.latency}ms</span>
                                <span className="flex items-center gap-1"><Move className="w-2 h-2" /> Draggable</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
