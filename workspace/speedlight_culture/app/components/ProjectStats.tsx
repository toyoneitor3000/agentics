'use client';

import { useState } from 'react';
import { Heart, Bookmark, Share2, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toggleLike, toggleSave, logShare } from '@/app/actions/social';

interface ProjectStatsProps {
    projectId: string;
    likeCount: number;
    saveCount: number;
    shareCount: number;
    commentCount: number;
    isLiked: boolean;
    isSaved: boolean;
    user: any; // Passed from parent
}

export default function ProjectStats({
    projectId,
    likeCount: initialLikes,
    saveCount: initialSaves,
    shareCount: initialShares,
    commentCount,
    isLiked: initialIsLiked,
    isSaved: initialIsSaved,
    user
}: ProjectStatsProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [saves, setSaves] = useState(initialSaves);
    const [shares, setShares] = useState(initialShares);

    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleAction = async (action: 'like' | 'save' | 'share', e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (action === 'share') {
            // Optimistic update
            setShares(prev => prev + 1);

            // Server Action
            await logShare(projectId);

            // Trigger native share or copy link
            const url = window.location.href;
            if (navigator.share) {
                navigator.share({ title: 'Speedlight Culture', url }).catch(() => { });
            } else {
                navigator.clipboard.writeText(url);
                alert('Enlace copiado al portapapeles!');
            }
            return;
        }

        // Auth check using prop
        if (!user) {
            router.push('/login');
            return;
        }
        if (isLoading) return;

        try {
            if (action === 'like') {
                setIsLoading(true);
                // Optimistic
                const newStatus = !isLiked;
                setIsLiked(newStatus);
                setLikes(prev => newStatus ? prev + 1 : prev - 1);

                await toggleLike(projectId);
                setIsLoading(false);
            }

            if (action === 'save') {
                setIsLoading(true);
                // Optimistic
                const newStatus = !isSaved;
                setIsSaved(newStatus);
                setSaves(prev => newStatus ? prev + 1 : prev - 1);

                await toggleSave(projectId);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Action failed:', error);
            // Revert on error
            alert('Error al procesar la acción. Por favor revisa tu conexión o intenta iniciar sesión nuevamente.');
            setIsLoading(false);
            router.refresh();
        }
    };

    const scrollToComments = () => {
        const el = document.getElementById('comments-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
            {/* Like */}
            <button
                onClick={(e) => handleAction('like', e)}
                className="flex items-center gap-2 group focus:outline-none"
            >
                <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-[#FF9800] text-[#FF9800]' : 'text-white/70 group-hover:text-white'}`} />
                <span className="text-sm font-bold text-white">{likes}</span>
            </button>

            <div className="w-px h-4 bg-white/10"></div>

            {/* Comment */}
            <button
                onClick={scrollToComments}
                className="flex items-center gap-2 group focus:outline-none"
            >
                <MessageCircle className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                <span className="text-sm font-bold text-white">{commentCount}</span>
            </button>

            <div className="w-px h-4 bg-white/10"></div>

            {/* Save */}
            <button
                onClick={(e) => handleAction('save', e)}
                className="flex items-center gap-2 group focus:outline-none"
            >
                <Bookmark className={`w-5 h-5 transition-colors ${isSaved ? 'fill-white text-white' : 'text-white/70 group-hover:text-white'}`} />
                <span className="text-sm font-bold text-white">{saves}</span>
            </button>

            <div className="w-px h-4 bg-white/10"></div>

            {/* Share */}
            <button
                onClick={(e) => handleAction('share', e)}
                className="flex items-center gap-2 group focus:outline-none"
            >
                <Share2 className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                <span className="text-sm font-bold text-white">{shares}</span>
            </button>
        </div>
    );
}
