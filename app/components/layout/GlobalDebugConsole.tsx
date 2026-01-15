"use client";

import { useEffect, useState, useRef } from "react";
import { Database, ShieldCheck, Server, Globe, X, Minus, Maximize2, Move, Copy, Terminal, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUi } from "@/app/context/UiContext";
import { createClient } from "@/app/utils/supabase/client";
import { useSession } from "@/app/lib/auth-client";

type StatusData = {
    status: 'operational' | 'degraded' | 'outage' | 'maintenance';
    latency: number;
    services: {
        database: boolean;
        auth: boolean;
    };
    region: string;
};

export default function GlobalDebugConsole() {
    const { showDebugConsole, toggleDebugConsole } = useUi();
    const { data: session } = useSession();
    const [isMinimized, setIsMinimized] = useState(false);
    const [activeTab, setActiveTab] = useState<'logs' | 'system'>('logs');
    const [mounted, setMounted] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // --- AUTH & ROLE CHECK ---
    const supabase = createClient();
    useEffect(() => {
        const checkRole = async () => {
            if (!session?.user) {
                setIsAuthorized(false);
                return;
            }

            const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            if (data && (data.role === 'CEO' || data.role === 'ADMIN')) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        };
        checkRole();
    }, [session, supabase]);

    const constraintsRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // --- SYSTEM STATUS LOGIC ---
    const [statusData, setStatusData] = useState<StatusData | null>(null);
    useEffect(() => {
        if (!showDebugConsole) return;
        const checkStatus = async () => {
            try {
                const res = await fetch('/api/status');
                const json = await res.json();
                setStatusData(json);
            } catch (e) {
                setStatusData({
                    status: 'operational',
                    latency: 0,
                    services: { database: true, auth: true },
                    region: 'EDGE'
                });
            }
        };
        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, [showDebugConsole]);

    // --- CONSOLE LOG LOGIC ---
    const [logs, setLogs] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!showDebugConsole) return;

        const hook = (method: 'log' | 'warn' | 'error', args: any[]) => {
            const msg = args.map(a => {
                if (typeof a === 'string') return a;
                if (a instanceof Error) return a.message;
                try { return JSON.stringify(a).substring(0, 300); } catch { return '[Obj]'; }
            }).join(' ');

            // Format: [TIME] [METHOD] Msg
            const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setLogs(prev => [...prev.slice(-99), `[${time}] [${method.toUpperCase()}] ${msg}`]);
        };

        const oldLog = console.log;
        const oldWarn = console.warn;
        const oldError = console.error;

        console.log = (...args) => { hook('log', args); oldLog(...args); };
        console.warn = (...args) => { hook('warn', args); oldWarn(...args); };
        console.error = (...args) => { hook('error', args); oldError(...args); };

        return () => {
            console.log = oldLog;
            console.warn = oldWarn;
            console.error = oldError;
        }
    }, [showDebugConsole]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(logs.join('\n'));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.error("Copy failed", e);
        }
    };

    if (!mounted || !showDebugConsole || !isAuthorized) return null;

    // determine status color
    let statusColor = "bg-green-500 text-green-500";
    if (statusData?.status === 'degraded') statusColor = "bg-yellow-500 text-yellow-500";
    if (statusData?.status === 'outage') statusColor = "bg-red-500 text-red-500";

    return (
        <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
            <motion.div
                drag
                dragMomentum={false}
                dragConstraints={constraintsRef}
                initial={{ x: 20, y: window.innerHeight - 320 }}
                className={`pointer-events-auto absolute flex flex-col transition-all duration-300 shadow-2xl overflow-hidden border border-white/10 ${isMinimized
                    ? 'bg-[#0A0A0A] rounded-full w-auto items-center justify-center'
                    : 'bg-[#0D0805]/95 backdrop-blur-md rounded-xl w-[90vw] max-w-[400px] h-[300px]'
                    }`}
            >
                {/* HEADER */}
                <div
                    className={`flex items-center justify-between px-3 py-2 select-none ${!isMinimized ? 'bg-white/5 border-b border-white/5 cursor-move' : 'cursor-pointer'}`}
                    onDoubleClick={() => setIsMinimized(!isMinimized)}
                >
                    <div className="flex items-center gap-2">
                        {/* Status Dot */}
                        <div className={`w-2.5 h-2.5 rounded-full ${statusColor.split(' ')[0]} ${statusData?.status === 'operational' ? 'animate-pulse' : ''} shadow-[0_0_8px_currentColor]`} />

                        {!isMinimized && (
                            <span className="text-[10px] font-bold font-mono text-white/50 tracking-wider uppercase">
                                DEBUG CONSOLE
                            </span>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-1">
                        {!isMinimized && (
                            <>
                                <button
                                    onClick={() => setActiveTab('logs')}
                                    className={`p-1.5 rounded text-[10px] font-bold transition-colors ${activeTab === 'logs' ? 'bg-[#FF9800] text-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    LOGS
                                </button>
                                <button
                                    onClick={() => setActiveTab('system')}
                                    className={`p-1.5 rounded text-[10px] font-bold transition-colors ${activeTab === 'system' ? 'bg-[#FF9800] text-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    SYSTEM
                                </button>
                                <div className="w-px h-3 bg-white/10 mx-1" />
                            </>
                        )}

                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-1.5 hover:bg-white/10 rounded-md text-white/50 hover:text-white transition-colors"
                        >
                            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                        </button>

                        {!isMinimized && (
                            <button
                                onClick={() => toggleDebugConsole(false)}
                                className="p-1.5 hover:bg-red-500/20 hover:text-red-500 rounded-md text-white/50 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* CONTENT (Hidden if minimized) */}
                {!isMinimized && (
                    <div className="flex-1 overflow-hidden relative flex flex-col">

                        {/* LOGS TAB */}
                        {activeTab === 'logs' && (
                            <>
                                <div className="flex-1 overflow-y-auto p-3 font-mono text-[10px] space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                    {logs.length === 0 && <div className="text-white/20 italic text-center py-10">Waiting for logs...</div>}
                                    {logs.map((log, i) => (
                                        <div key={i} className={`break-all border-b border-white/5 pb-0.5 ${log.includes('[ERROR]') ? 'text-red-400' : 'text-green-400'}`}>
                                            {log}
                                        </div>
                                    ))}
                                    {/* Anchor to scroll to bottom could go here */}
                                </div>
                                {/* Footer Actions */}
                                <div className="p-2 border-t border-white/5 bg-black/20 flex justify-between items-center">
                                    <span className="text-[9px] text-white/30">{logs.length} entries</span>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white/70 px-2 py-1 rounded text-[10px] transition-colors border border-white/5"
                                    >
                                        <Copy className="w-3 h-3" />
                                        {copied ? 'Copied' : 'Copy All'}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* SYSTEM TAB */}
                        {activeTab === 'system' && statusData && (
                            <div className="p-4 space-y-4">
                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2 text-white/70">
                                            <Activity className="w-4 h-4 text-[#FF9800]" />
                                            <span className="font-bold text-xs">Global Status</span>
                                        </div>
                                        <span className={`text-xs font-bold ${statusColor.split(' ')[1]}`}>{statusData.status.toUpperCase()}</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${statusColor.split(' ')[0]} w-full animate-pulse`}></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5 flex flex-col gap-1">
                                        <span className="text-[10px] text-white/40 uppercase">Database</span>
                                        <div className="flex items-center gap-2">
                                            <Database className="w-3 h-3 text-white/60" />
                                            <span className={`text-xs font-bold ${statusData.services.database ? 'text-green-400' : 'text-red-400'}`}>
                                                {statusData.services.database ? 'ONLINE' : 'OFFLINE'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5 flex flex-col gap-1">
                                        <span className="text-[10px] text-white/40 uppercase">Auth</span>
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3 text-white/60" />
                                            <span className={`text-xs font-bold ${statusData.services.auth ? 'text-green-400' : 'text-red-400'}`}>
                                                {statusData.services.auth ? 'SECURE' : 'ISSUES'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-[10px] text-white/30 pt-4 border-t border-white/5">
                                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {statusData.region}</span>
                                    <span className="font-mono">{statusData.latency}ms</span>
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </motion.div>
        </div>
    );
}
