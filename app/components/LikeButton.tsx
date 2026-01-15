'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
    projectId: string;
    initialIsLiked: boolean;
    initialLikeCount: number; // For future display
}

export default function LikeButton({ projectId, initialIsLiked }: LikeButtonProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const toggleLike = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        const newStatus = !isLiked;
        setIsLiked(newStatus); // Optimistic UI

        if (newStatus) {
            await supabase.from('project_likes').insert({ project_id: projectId, user_id: user.id });
        } else {
            await supabase.from('project_likes').delete().match({ project_id: projectId, user_id: user.id });
        }

        setIsLoading(false);
        router.refresh();
    };

    return (
        <button
            onClick={toggleLike}
            className={`p-3 rounded-full backdrop-blur-sm transition-all border ${isLiked
                    ? 'bg-[#FF9800] text-black border-[#FF9800]'
                    : 'bg-black/30 text-white/80 border-white/10 hover:bg-black/50 hover:text-white'
                }`}
            disabled={isLoading}
        >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-black' : ''}`} />
        </button>
    );
}
