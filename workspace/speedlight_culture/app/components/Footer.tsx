import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="border-t border-[#FF9800]/10 bg-[#050302] py-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FF9800]/5 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                    <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                        <Image
                            src="/logonavbar.png"
                            alt="Speedlight Culture"
                            width={120}
                            height={40}
                            className="h-8 w-auto opacity-80"
                        />
                        <span className="text-xs tracking-[0.2em] uppercase text-[#BCAAA4]">© 2025</span>
                    </div>

                    <div className="flex gap-8">
                        {["Twitter", "Instagram", "Discord"].map((social) => (
                            <Link
                                key={social}
                                href="#"
                                className="text-xs uppercase tracking-[0.2em] text-[#BCAAA4] hover:text-[#FF9800] transition-colors relative group"
                            >
                                {social}
                                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#FF9800] group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="border-t border-[#FF9800]/10 pt-8 flex justify-center">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#BCAAA4]/60 text-center">
                        Diseñado y Desarrollado por <a href="https://purrpurr.dev" target="_blank" rel="noopener noreferrer" className="text-[#FF9800] hover:text-[#FFB74D] transition-colors">purrpurr.dev</a> en Bogotá, Colombia.
                    </p>
                </div>
            </div>
        </footer>
    );
}
