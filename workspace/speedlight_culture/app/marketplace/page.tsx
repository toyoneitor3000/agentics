"use client";



export default function MarketplacePage() {
    return (
        <main className="min-h-screen">


            <div className="pt-48 pb-20 px-6 container mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF9800] via-[#FFEB3B] to-[#FF9800] animate-glow">
                            MARKETPLACE
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#BCAAA4] max-w-2xl mx-auto font-light">
                        Compra y venta segura de partes y accesorios exclusivos.
                    </p>
                </div>

                <div className="flex justify-center items-center h-[400px] border border-[#FF9800]/10 rounded-2xl bg-[#0A0604]/50 backdrop-blur-sm">
                    <p className="text-[#FF9800] text-xl tracking-widest uppercase animate-pulse">
                        Próximamente
                    </p>
                </div>
            </div>
        </main>
    );
}
