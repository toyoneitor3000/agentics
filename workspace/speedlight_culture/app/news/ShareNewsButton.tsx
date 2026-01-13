'use client';

import { Share2, Copy } from 'lucide-react';
import { useState } from 'react';

interface ShareNewsButtonProps {
    title: string;
    content: string;
    date: string;
}

export default function ShareNewsButton({ title, content, date }: ShareNewsButtonProps) {
    const [fallbackCopied, setFallbackCopied] = useState(false);

    const handleShare = async () => {
        const formattedDate = new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const shareText = `🚀 *SPEEDLIGHT NEWS* 🚀

📌 *${title}*

${content}

📅 ${formattedDate}

👉 Lee más en: https://speedlightculture.com/news`;

        // Check if Web Share API is available (iOS, Android, modern browsers)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Speedlight News: ${title}`,
                    text: shareText,
                    url: 'https://speedlightculture.com/news',
                });
            } catch (err) {
                // User cancelled or error - silently ignore
                console.log('Share cancelled or failed:', err);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            try {
                await navigator.clipboard.writeText(shareText);
                setFallbackCopied(true);
                setTimeout(() => setFallbackCopied(false), 2000);
            } catch (err) {
                console.error('Fallback copy failed:', err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#FF9800]/20 border border-white/10 hover:border-[#FF9800]/50 rounded-lg transition-all group/btn text-xs font-bold uppercase tracking-wider text-white"
            title="Compartir noticia"
        >
            {fallbackCopied ? (
                <>
                    <Copy className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Copiado</span>
                </>
            ) : (
                <>
                    <Share2 className="w-4 h-4 text-[#FF9800]" />
                    <span>Compartir</span>
                </>
            )}
        </button>
    );
}

