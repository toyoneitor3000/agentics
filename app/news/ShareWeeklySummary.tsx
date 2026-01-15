'use client';

import { Share2, Copy, Sparkles, Check, X } from 'lucide-react';
import { useState } from 'react';

interface NewsItem {
    id: string;
    title: string;
    content: string;
    published_at: string;
}

interface ShareWeeklySummaryProps {
    news: NewsItem[];
}

export default function ShareWeeklySummary({ news }: ShareWeeklySummaryProps) {
    const [summary, setSummary] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const generateSummary = () => {
        // Get news from the last 7 days ONLY
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentNews = news.filter(item => {
            const publishedDate = new Date(item.published_at);
            return publishedDate >= oneWeekAgo;
        });

        // Remove duplicates by title (keep the first/most recent one)
        const uniqueNews = recentNews.reduce((acc, item) => {
            const normalizedTitle = item.title.toLowerCase().trim();
            if (!acc.find(n => n.title.toLowerCase().trim() === normalizedTitle)) {
                acc.push(item);
            }
            return acc;
        }, [] as NewsItem[]);

        // Limit to max 5 news items
        const newsToShare = uniqueNews.slice(0, 5);

        const today = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        // Build the summary
        let text = `🚀 *SPEEDLIGHT NEWS - RESUMEN SEMANAL* 🚀
📅 ${today}

¡Estas son las últimas novedades de Speedlight!\n\n`;

        if (newsToShare.length === 0) {
            text += `No hay noticias nuevas esta semana. ¡Mantente atento!\n\n`;
        } else {
            newsToShare.forEach((item, index) => {
                const itemDate = new Date(item.published_at).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric',
                });
                text += `${index + 1}. *${item.title}*\n`;

                // Only show content if it's meaningfully different from title
                // Normalize: lowercase, trim, remove trailing punctuation
                const normalize = (s: string) => s.toLowerCase().trim().replace(/[.!?]+$/, '');
                const contentNormalized = normalize(item.content);
                const titleNormalized = normalize(item.title);

                // Skip if content equals title, starts with title, or title starts with content
                const isDuplicate =
                    contentNormalized === titleNormalized ||
                    contentNormalized.startsWith(titleNormalized) ||
                    titleNormalized.startsWith(contentNormalized);

                if (!isDuplicate && item.content.length > 0) {
                    const shortContent = item.content.slice(0, 80);
                    text += `   📌 ${shortContent}${item.content.length > 80 ? '...' : ''}\n`;
                }

                text += `   🗓️ ${itemDate}\n\n`;
            });
        }

        text += `━━━━━━━━━━━━━━━━
👉 Lee todos los detalles en:
https://speedlightculture.com/news

🎬 ¡Nos vemos en Speedlight!`;

        setSummary(text);
    };

    const handleShare = async () => {
        if (!summary) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Speedlight News - Resumen Semanal',
                    text: summary,
                    url: 'https://speedlightculture.com/news',
                });
            } catch (err) {
                console.log('Share cancelled:', err);
            }
        } else {
            handleCopy();
        }
    };

    const handleCopy = async () => {
        if (!summary) return;
        try {
            await navigator.clipboard.writeText(summary);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const handleClose = () => {
        setSummary(null);
        setCopied(false);
    };

    // Initial state: just show the generate button
    if (!summary) {
        return (
            <button
                onClick={generateSummary}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#FF9800] to-yellow-500 hover:from-[#FF9800]/90 hover:to-yellow-500/90 text-black font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF9800]/20 hover:shadow-[#FF9800]/40 hover:scale-105"
            >
                <Sparkles className="w-5 h-5" />
                <span>Generar Resumen Semanal</span>
            </button>
        );
    }

    // After generating: show the summary preview and action buttons
    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="relative bg-black/40 border border-white/10 rounded-2xl p-4 mb-4">
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 p-1 text-white/50 hover:text-white transition-colors"
                    title="Cerrar"
                >
                    <X className="w-5 h-5" />
                </button>
                <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono leading-relaxed max-h-60 overflow-y-auto pr-6">
                    {summary}
                </pre>
            </div>

            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#FF9800] to-yellow-500 hover:from-[#FF9800]/90 hover:to-yellow-500/90 text-black font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF9800]/20 hover:shadow-[#FF9800]/40 hover:scale-105"
                >
                    <Share2 className="w-5 h-5" />
                    <span>Compartir</span>
                </button>

                <button
                    onClick={handleCopy}
                    className="inline-flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl transition-all"
                    title="Copiar resumen"
                >
                    {copied ? (
                        <Check className="w-5 h-5 text-green-400" />
                    ) : (
                        <Copy className="w-5 h-5 text-white" />
                    )}
                </button>
            </div>
        </div>
    );
}
