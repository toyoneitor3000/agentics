import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import UserProfile from "@/app/components/profile/UserProfile";
import { headers } from "next/headers";
import Link from "next/link";
import { Edit3 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const supabase = await createClient();
    const { auth } = await import("@/app/lib/auth");

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    const { user } = session;

    // 1. Fetch Profile (Still using Supabase Client for DATA, but bypassing Auth check)
    // We need to fetch the profile associated with this BetterAuth user ID.
    // NOTE: BetterAuth ID might be different from Supabase Auth ID if we just migrated.
    // But since we just created fresh tables, it's a new user. We need to Ensure a PROFILE exists for this new user.
    // If no profile exists, we should probably create one on the fly or handle it.

    // For now, let's try to fetch.
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // If profile is missing (first time login with BetterAuth), create a basic one.
    let finalProfile = profile;
    if (!profile) {
        const { data: newProfile, error } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                full_name: user.name,
                avatar_url: user.image,
                email: user.email,
                username: user.email?.split('@')[0] || "racer_" + Math.floor(Math.random() * 1000)
            })
            .select()
            .single();

        if (newProfile) finalProfile = newProfile;
    }

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
        join_date: new Date(user.createdAt || Date.now()).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })
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
            actionButtons={
                <Link href="/profile/edit" className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#222] border border-white/10 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors">
                    <Edit3 className="w-4 h-4" />
                    Editar Perfil
                </Link>
            }
        />
    );
}
