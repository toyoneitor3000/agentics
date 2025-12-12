"use client";

import { useState } from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";

interface FollowButtonProps {
    targetUserId: string;
    initialIsFollowing: boolean;
    currentUserId?: string;
}

export function FollowButton({ targetUserId, initialIsFollowing, currentUserId }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleToggleFollow = async () => {
        if (!currentUserId) return alert("Inicia sesión para seguir a este usuario."); // Simple alert for now
        if (loading) return;

        setLoading(true);
        const newStatus = !isFollowing;
        setIsFollowing(newStatus); // Optimistic

        try {
            if (newStatus) {
                // Follow
                const { error } = await supabase
                    .from('follows')
                    .insert({
                        follower_id: currentUserId,
                        following_id: targetUserId
                    });
                if (error) throw error;
            } else {
                // Unfollow
                const { error } = await supabase
                    .from('follows')
                    .delete()
                    .match({
                        follower_id: currentUserId,
                        following_id: targetUserId
                    });
                if (error) throw error;
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
            setIsFollowing(!newStatus); // Revert
            alert("Error al actualizar seguimiento.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleFollow}
            disabled={loading}
            className={`
                px-4 py-3 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all
                ${isFollowing
                    ? 'bg-[#1a1a1a] hover:bg-red-900/50 border border-[#333] hover:border-red-500 text-white'
                    : 'bg-[#FF9800] hover:bg-[#F57C00] text-black shadow-[0_0_15px_rgba(255,152,0,0.3)]'
                }
            `}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : isFollowing ? (
                <>
                    <UserCheck className="w-5 h-5" /> Siguiendo
                </>
            ) : (
                <>
                    <UserPlus className="w-5 h-5" /> Seguir
                </>
            )}
        </button>
    );
}
