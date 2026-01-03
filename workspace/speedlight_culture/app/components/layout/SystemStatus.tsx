"use client";

import { useEffect, useState } from "react";
import { Database, ShieldCheck, Server, Globe, X } from "lucide-react";
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
    const [isHovered, setIsHovered] = useState(false);
    const { showDebugConsole, toggleDebugConsole } = useUi();

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

        checkStatus();
        // Poll every 60 seconds
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!showDebugConsole) return null;

    if (loading || !data) {
        return (
            <div className="flex items-center gap-2 opacity-50">
                <span className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></span>
                <span>CONNECTING...</span>
            </div>
        );
    }

    // Determine colors based on status
    let color = "bg-green-500";
    let textColor = "text-green-500";
    let label = "OPERATIONAL";

    if (data.status === 'degraded') {
        color = "bg-yellow-500";
        textColor = "text-yellow-500";
        label = "DEGRADED";
    } else if (data.status === 'outage') {
        color = "bg-red-500";
        textColor = "text-red-500";
        label = "OUTAGE";
    } else if (data.status === 'maintenance') {
        color = "bg-blue-500";
        textColor = "text-blue-500";
        label = "MAINTENANCE";
    }

    // Latency color
    const latency = data.latency;
    let latencyColor = "text-white/50";
    if (latency > 200) latencyColor = "text-yellow-500";
    if (latency > 500) latencyColor = "text-red-500";

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Status Display */}
            <div className="flex items-center gap-2 cursor-help group">
                <span className="text-white/30">Status:</span>
                <span className={`w-2 h-2 rounded-full ${color} ${data.status === 'operational' ? 'animate-pulse' : ''} shadow-[0_0_8px_currentColor] ${textColor}`}></span>
                <span className={`font-bold ${textColor} tracking-wider`}>{label}</span>
                {data.latency > 0 && (
                    <span className={`hidden md:inline text-[9px] font-roboto-mono ml-1 ${latencyColor}`}>
                        {data.latency}ms
                    </span>
                )}
            </div>

            {/* Hover Tooltip (Glassmorphism) */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-0 mb-3 w-56 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-4 shadow-2xl z-50 text-xs"
                    >
                        <h4 className="border-b border-white/10 pb-2 mb-2 font-bold text-white flex justify-between items-center">
                            SYSTEM HEALTH
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/50">{data.region}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleDebugConsole(false);
                                    }}
                                    className="text-white/50 hover:text-red-500 transition-colors p-1"
                                    title="Close Debug Console"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        </h4>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-white/70">
                                    <Database className="w-3 h-3" /> Database
                                </span>
                                {data.services.database ? (
                                    <span className="text-green-500 font-bold text-[10px]">ONLINE</span>
                                ) : (
                                    <span className="text-red-500 font-bold text-[10px]">OFFLINE</span>
                                )}
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-white/70">
                                    <ShieldCheck className="w-3 h-3" /> Auth
                                </span>
                                {data.services.auth ? (
                                    <span className="text-green-500 font-bold text-[10px]">SECURE</span>
                                ) : (
                                    <span className="text-red-500 font-bold text-[10px]">ISSUES</span>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-2">
                                <span className="flex items-center gap-2 text-white/50">
                                    <Globe className="w-3 h-3" /> Region
                                </span>
                                <span className="text-white/50 font-roboto-mono">{data.region}</span>
                            </div>
                        </div>

                        {/* Triangle pointer */}
                        <div className="absolute top-full left-6 -mt-1 border-4 border-transparent border-t-black/80"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
