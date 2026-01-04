'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { UserBadge } from "../UserBadge";

interface FollowListModalProps {
    userId: string;
    type: 'followers' | 'following' | 'friends';
    onClose: () => void;
}

export default function FollowListModal({ userId, type, onClose }: FollowListModalProps) {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            let data: any[] = [];

            try {
                if (type === 'friends') {
                    // Mutual followers
                    // 1. Get who follows me
                    const { data: followers } = await supabase
                        .from('follows')
                        .select('follower_id')
                        .eq('following_id', userId);

                    const followerIds = new Set(followers?.map(f => f.follower_id) || []);

                    // 2. Get who I follow
                    const { data: following } = await supabase
                        .from('follows')
                        .select('following_id')
                        .eq('follower_id', userId);

                    // 3. Find intersection
                    const friendIds = following
                        ?.map(f => f.following_id)
                        .filter(id => followerIds.has(id)) || [];

                    if (friendIds.length > 0) {
                        const { data: profiles } = await supabase
                            .from('profiles')
                            .select('*')
                            .in('id', friendIds);
                        data = profiles || [];
                    }

                } else if (type === 'followers') {
                    const { data: follows } = await supabase
                        .from('follows')
                        .select('follower_id')
                        .eq('following_id', userId);

                    const ids = follows?.map(f => f.follower_id) || [];
                    if (ids.length > 0) {
                        const { data: profiles } = await supabase
                            .from('profiles')
                            .select('*')
                            .in('id', ids);
                        data = profiles || [];
                    }
                } else {
                    const { data: follows } = await supabase
                        .from('follows')
                        .select('following_id')
                        .eq('follower_id', userId);

                    const ids = follows?.map(f => f.following_id) || [];
                    if (ids.length > 0) {
                        const { data: profiles } = await supabase
                            .from('profiles')
                            .select('*')
                            .in('id', ids);
                        data = profiles || [];
                    }
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }

            setUsers(data);
            setLoading(false);
        };

        fetchUsers();
    }, [userId, type]);

    // Close on click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'followers': return 'Seguidores';
            case 'following': return 'Seguidos';
            case 'friends': return 'Amigos';
        }
    };

    const getEmptyText = () => {
        switch (type) {
            case 'followers': return 'Sin seguidores';
            case 'following': return 'No sigues a nadie';
            case 'friends': return 'Sin amigos aún';
        }
    };

    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div className="bg-[#1a1a1a] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#1a1a1a]">
                    <h2 className="text-white font-bold text-sm uppercase tracking-wider">
                        {getTitle()}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#FF9800]"></div>
                        </div>
                    ) : users.length > 0 ? (
                        <div className="flex flex-col gap-1">
                            {users.map(u => (
                                <Link
                                    key={u.id}
                                    href={`/profile/${u.id}`}
                                    className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors group"
                                >
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black border border-white/10 shrink-0">
                                        {u.avatar_url ? (
                                            <Image src={u.avatar_url} alt={u.full_name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20 font-bold text-sm">
                                                {u.full_name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-white font-bold text-xs truncate group-hover:text-[#FF9800] transition-colors">{u.full_name}</p>
                                            <UserBadge role={u.role} size="sm" />
                                        </div>
                                        <p className="text-white/40 text-[10px] truncate">@{u.username || 'racer'}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                                {getEmptyText()}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
