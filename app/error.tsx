'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#0D0805] text-[#FFF8F0] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#FF9800] rounded-full blur-[150px] opacity-10"></div>
                <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-[#FF4500] rounded-full blur-[120px] opacity-10"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">

                {/* Icon */}
                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,152,0,0.2)]">
                    <AlertTriangle className="w-12 h-12 text-[#FF9800]" />
                </div>

                {/* Text */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black font-oswald uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                        System Failure
                    </h1>
                    <p className="text-white/60 font-inter text-lg">
                        Algo salió mal en el taller. <br />
                        <span className="text-xs font-mono text-white/30 mt-2 block bg-black/30 p-2 rounded border border-white/5">
                            Code: {error.digest || 'UNKNOWN_ERROR'} <br />
                            {error.message}
                        </span>
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-[#FF9800] text-black font-bold font-oswald uppercase tracking-widest hover:bg-[#FFB74D] transition-colors rounded-xl shadow-lg shadow-[#FF9800]/20"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Reintentar
                    </button>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white border border-white/10 font-bold font-oswald uppercase tracking-widest hover:bg-white/10 transition-colors rounded-xl backdrop-blur-sm"
                    >
                        <Home className="w-5 h-5" />
                        Ir al Inicio
                    </Link>
                </div>
            </div>

            {/* Footer Decoration */}
            <div className="absolute bottom-8 text-white/10 font-mono text-xs tracking-[0.3em]">
                SPEEDLIGHT CULTURE // ERROR_HANDLER
            </div>
        </div>
    );
}
