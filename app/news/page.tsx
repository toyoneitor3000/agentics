import { getNews } from "@/app/actions/news";
import { Zap, Calendar, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CopyNewsButton from "./ShareNewsButton";
import ShareWeeklySummary from "./ShareWeeklySummary";

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default async function SpeedlightNewsPage() {
    const news = await getNews();

    return (
        <div className="min-h-screen bg-[#0D0805] text-[#F5E6D3] pt-24 pb-20 px-4 md:px-0">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9800]/10 border border-[#FF9800]/20 text-[#FF9800] text-xs font-bold uppercase tracking-wider mb-4">
                        <Zap className="w-3 h-3" />
                        <span>Actualizaciones en Tiempo Real</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-oswald italic uppercase tracking-tighter text-white mb-4">
                        SPEEDLIGHT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9800] to-yellow-500">NEWS</span>
                    </h1>
                    <p className="text-white/40 max-w-xl mx-auto text-lg mb-8">
                        Mantente al día con las últimas mejoras, despliegues y noticias del ecosistema.
                    </p>
                    {news.length > 0 && (
                        <ShareWeeklySummary news={news} />
                    )}
                </header>

                <div className="space-y-8 relative">
                    {/* Timeline Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#FF9800]/50 via-white/10 to-transparent transform -translate-x-1/2 hidden md:block"></div>

                    {news.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <p className="text-white/30 italic">No hay noticias publicadas aún.</p>
                        </div>
                    ) : (
                        news.map((item, index) => (
                            <div key={item.id} className={`flex flex-col md:flex-row gap-8 relative items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Timeline Dot */}
                                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-[#0D0805] border-2 border-[#FF9800] rounded-full transform -translate-x-1/2 mt-6 hidden md:block z-10 shadow-[0_0_10px_#FF9800]"></div>

                                {/* Content Card */}
                                <div className="flex-1 md:w-1/2 group">
                                    <div className="bg-[#0F0A08] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#FF9800]/30 transition-all hover:bg-white/5 relative overflow-hidden">
                                        {/* Glow Effect */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9800]/5 blur-3xl rounded-full pointer-events-none group-hover:bg-[#FF9800]/10 transition-all"></div>

                                        <div className="flex items-center gap-3 mb-4 text-xs font-mono text-white/40">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(item.published_at)}
                                            </span>
                                        </div>

                                        <h2 className="text-2xl font-bold uppercase tracking-tight text-white mb-3 group-hover:text-[#FF9800] transition-colors">
                                            {item.title}
                                        </h2>

                                        <div className="prose prose-invert prose-sm max-w-none text-white/70">
                                            <p>{item.content}</p>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between flex-wrap gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 flex items-center justify-center">
                                                    <Image
                                                        src="/icon.png"
                                                        alt="Speedlight"
                                                        width={24}
                                                        height={24}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Speedlight Team</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CopyNewsButton
                                                    title={item.title}
                                                    content={item.content}
                                                    date={item.published_at}
                                                />
                                                <a
                                                    href="https://chat.whatsapp.com/LXTAuLFydyUBCrvKpgJf03"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#25D366]/20 border border-white/10 hover:border-[#25D366]/50 rounded-lg transition-all group/btn text-xs font-bold uppercase tracking-wider text-white"
                                                >
                                                    <span>Consultar más</span>
                                                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Spacer for Timeline alignment */}
                                <div className="flex-1 hidden md:block"></div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
