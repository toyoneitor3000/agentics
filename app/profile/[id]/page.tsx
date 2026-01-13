import { createClient } from "@/app/utils/supabase/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UserProfile from "@/app/components/profile/UserProfile";
import { FollowButton } from "@/app/components/profile/FollowButton";
import MessageButton from "@/app/components/profile/MessageButton";
export const dynamic = 'force-dynamic';

interface PublicProfilePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Auth Check using Better Auth
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const currentUser = session?.user;

    // 1. Fetch Profile (Support UUID or Username)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let query = supabase.from('profiles').select('*');
    if (isUuid) {
        query = query.eq('id', id);
    } else {
        query = query.ilike('username', id);
    }

    const { data: profile } = await query.single();

    if (!profile) {
        return <div className="min-h-screen bg-[#0D0805] text-white flex items-center justify-center">Usuario no encontrado</div>;
    }

    // 2. Fetch Content (Projects, Albums, Events, Followers, Videos)
    const [projectsRes, albumsRes, eventsRes, followersRes, followingRes, videosRes] = await Promise.all([
        supabase.from('projects').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
        supabase.from('gallery_albums').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
        supabase.from('events').select('*').eq('created_by', profile.id).order('date', { ascending: true }),
        supabase.from('follows').select('follower_id').eq('following_id', profile.id),
        supabase.from('follows').select('following_id').eq('follower_id', profile.id),
        supabase.from('cinema_videos').select('*').eq('user_id', profile.id).eq('status', 'approved').order('created_at', { ascending: false })
    ]);

    // Calculate Friends (Mutual)
    const followers = followersRes.data?.map(f => f.follower_id) || [];
    const following = followingRes.data?.map(f => f.following_id) || [];
    const followersSet = new Set(followers);
    const friendsCount = following.filter(id => followersSet.has(id)).length;

    // 3. Calculate Total Likes Received on User's Projects
    const projects = projectsRes.data || [];
    const projectIds = projects.map(p => p.id);

    let totalLikesReceived = 0;
    if (projectIds.length > 0) {
        const { count } = await supabase
            .from('project_likes')
            .select('*', { count: 'exact', head: true })
            .in('project_id', projectIds);
        totalLikesReceived = count || 0;
    }

    const stats = {
        followers: followers.length,
        following: following.length,
        friends: friendsCount,
        likes_given: totalLikesReceived,
        xp: profile.xp || 0,
        level: profile.level || 1,
        join_date: new Date(profile.created_at || Date.now()).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })
    };

    const content = {
        projects: projects,
        albums: albumsRes.data || [],
        events: eventsRes.data || [],
        videos: videosRes.data || []
    };

    // 4. Check if following
    let isFollowing = false;
    if (currentUser) {
        const { data: followData } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', currentUser.id)
            .eq('following_id', profile.id)
            .single();
        isFollowing = !!followData;
    }

    const isOwnProfile = currentUser?.id === profile.id;

    return (
        <UserProfile
            profile={profile}
            stats={stats}
            content={content}
            isOwnProfile={isOwnProfile}
            actionButtons={!isOwnProfile ? (
                <div className="flex items-center">
                    <FollowButton targetUserId={profile.id} initialIsFollowing={isFollowing} currentUserId={currentUser?.id} />
                    <MessageButton targetUserId={profile.id} />
                </div>
            ) : null}
        />
    );
}
