"use client";

import { useState } from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toggleFollow } from "@/app/actions/social";
import { toast } from "sonner";

interface FollowButtonProps {
    targetUserId: string;
    initialIsFollowing: boolean;
    currentUserId?: string;
}

export function FollowButton({ targetUserId, initialIsFollowing, currentUserId }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggleFollow = async () => {
        if (!currentUserId) {
            router.push('/login');
            return;
        }
        if (loading) return;

        // Confirmation check for UNFOLLOWING
        if (isFollowing) {
            toast("¿Dejar de seguir a este usuario?", {
                action: {
                    label: 'Sí, dejar de seguir',
                    onClick: () => executeToggle()
                },
                cancel: {
                    label: 'Cancelar',
                    onClick: () => { }
                },
                duration: Infinity // Keep open until action
            });
            return;
        }

        // Following is instant, no confirmation needed
        await executeToggle();
    };

    const executeToggle = async () => {
        setLoading(true);
        // Optimistic update
        const previousState = isFollowing;
        setIsFollowing(!previousState);

        try {
            const actualState = await toggleFollow(targetUserId);
            setIsFollowing(actualState);
        } catch (error) {
            console.error("Error toggling follow:", error);
            setIsFollowing(previousState); // Revert
            toast.error("Error al actualizar seguimiento.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleFollow}
            disabled={loading}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border
                ${isFollowing
                    ? 'bg-[#1a1a1a] hover:bg-red-900/50 border-[#333] hover:border-red-500 text-white'
                    : 'bg-[#FF9800] hover:bg-[#F57C00] border-[#FF9800] text-black shadow-[0_0_15px_rgba(255,152,0,0.3)]'
                }
            `}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : isFollowing ? (
                <>
                    <UserCheck className="w-4 h-4" /> Siguiendo
                </>
            ) : (
                <>
                    <UserPlus className="w-4 h-4" /> Seguir
                </>
            )}
        </button>
    );
}
