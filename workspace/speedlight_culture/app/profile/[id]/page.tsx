import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import UserProfile from "@/app/components/profile/UserProfile";
import { FollowButton } from "@/app/components/profile/FollowButton";
export const dynamic = 'force-dynamic';

interface PublicProfilePageProps {
    params: Promise<{
        id: string;
    }>;
}

// Correct simple props for React 18 Next.js server component
export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    // 1. Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (!profile) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Usuario no encontrado</div>;
    }

    // 2. Fetch Content
    const [projectsRes, albumsRes, eventsRes, followersRes, likesRes] = await Promise.all([
        supabase.from('projects').select('*').eq('user_id', id).order('created_at', { ascending: false }),
        supabase.from('gallery_albums').select('*').eq('user_id', id).order('created_at', { ascending: false }),
        supabase.from('events').select('*').eq('created_by', id).order('date', { ascending: true }),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', id),
        supabase.from('likes').select('*', { count: 'exact', head: true }).eq('user_id', id)
    ]);

    const stats = {
        followers: followersRes.count || 0,
        following: 0, // Hidden per design
        likes_given: likesRes.count || 0,
        xp: profile.xp || 0,
        level: profile.level || 1,
        join_date: new Date(profile.created_at || Date.now()).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })
    };

    const content = {
        projects: projectsRes.data || [],
        albums: albumsRes.data || [],
        events: eventsRes.data || []
    };

    // 3. Check if following
    let isFollowing = false;
    if (currentUser) {
        const { data: followData } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', currentUser.id)
            .eq('following_id', id)
            .single();
        isFollowing = !!followData;
    }

    const isOwnProfile = currentUser?.id === id;

    return (
        <UserProfile
            profile={profile}
            stats={stats}
            content={content}
            isOwnProfile={isOwnProfile}
            actionButtons={!isOwnProfile ? (
                <FollowButton targetUserId={id} initialIsFollowing={isFollowing} currentUserId={currentUser?.id} />
            ) : null}
        />
    );
}
