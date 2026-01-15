import Link from 'next/link';

export default function EcosystemBanner() {
    return (
        <div className="bg-gradient-to-r from-[#003399] to-[#66cc33] text-white py-2 px-4 text-sm font-medium relative z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs uppercase tracking-wider">Education</span>
                    <p className="hidden sm:block">¿Quieres aprender a construir proyectos como estos?</p>
                    <p className="block sm:hidden">Aprende en la Academia</p>
                </div>

                <Link
                    href="https://speedlightacademy.com"
                    className="flex items-center gap-2 hover:bg-white/10 px-3 py-1 rounded transition-colors group"
                >
                    <span>Ir a Speedlight Academy</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:translate-x-1 transition-transform"
                    >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
