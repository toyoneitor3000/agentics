import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import UserProfile from "@/app/components/profile/UserProfile";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // 2. Fetch Content (Parallel Queries)
    // We use Promise.allsettled or Promise.all. 
    // Using Promise.all assumes all tables exist. If 'reels' doesn't exist, I'll skip it in this query.
    // I know projects, gallery_albums, events, follows, likes exist.

    const [projectsRes, albumsRes, eventsRes, followersRes, followingRes, likesRes] = await Promise.all([
        supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('gallery_albums').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('events').select('*').eq('created_by', user.id).order('date', { ascending: true }),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', user.id),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', user.id),
        supabase.from('likes').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
    ]);

    const stats = {
        followers: followersRes.count || 0,
        following: followingRes.count || 0,
        likes_given: likesRes.count || 0,
        xp: profile?.xp || 0,
        level: profile?.level || 1,
        join_date: new Date(user.created_at || Date.now()).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })
    };

    const content = {
        projects: projectsRes.data || [],
        albums: albumsRes.data || [],
        events: eventsRes.data || []
    };

    return (
        <UserProfile
            profile={profile}
            stats={stats}
            content={content}
            isOwnProfile={true}
        />
    );
}
