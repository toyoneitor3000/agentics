"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

import { MoreHorizontal, Camera, Wrench, ShoppingBag, Loader2, Zap, Play, ChevronRight } from "lucide-react";
import { AdFeedCard } from "@/app/components/AdBanners";
import { getAdByType } from "@/app/data/ads";
import SocialActions from "@/app/components/feed/SocialActions";
import { useLanguage } from "@/app/context/LanguageContext";

// --- PREMIUM FEED COMPONENTS ---

const FeedPostHeader = ({ user, time, action, type }: { user: any, time: string, action?: string, type: string }) => (
  <div className="flex items-center justify-between px-4 py-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 relative overflow-hidden">
        {user.avatar ? (
          <Image src={user.avatar} alt={user.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-white/50 font-bold">{user.name.charAt(0)}</div>
        )}
      </div>
      <div>
        <Link href={user.id ? `/profile/${user.id}` : '#'} className="text-sm font-bold text-white hover:text-[#FF9800] transition-colors">
          {user.name}
        </Link>
        <div className="flex items-center gap-2 text-xs text-white/40 font-roboto-mono">
          <span>{time}</span>
          <span className="w-1 h-1 bg-white/20 rounded-full"></span>
          <span className="uppercase tracking-wider text-[10px]">{action}</span>
        </div>
      </div>
    </div>
    <button className="text-white/20 hover:text-white transition-colors">
      <MoreHorizontal className="w-5 h-5" />
    </button>
  </div>
);

export default function Home() {
  const supabase = createClient();
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const feedAd = getAdByType('feed_card');
  const { language } = useLanguage();

  const t_home = {
    es: {
      featured: "Máquinas Destacadas",
      viewAll: "Ver todo",
      latest: "Última Actividad",
      empty: "El feed está tranquilo hoy...",
      project: "PROYECTO",
      gallery: "GALERÍA",
      marketplace: "MARKETPLACE",
      seller: "Vendedor",
      builder: "Constructor",
      photographer: "Fotógrafo",
      untitled: "Sin título",
      play: "Ver",
      ago: "hace"
    },
    en: {
      featured: "Featured Machines",
      viewAll: "View All",
      latest: "Latest Activity",
      empty: "The feed is quiet today...",
      project: "PROJECT",
      gallery: "GALLERY",
      marketplace: "MARKETPLACE",
      seller: "Seller",
      builder: "Builder",
      photographer: "Photographer",
      untitled: "Untitled",
      play: "Play",
      ago: "ago"
    }
  };

  const labels = t_home[language];

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id);
      fetchFeed(session?.user?.id);
    }

    async function fetchFeed(userId?: string) {
      try {
        setLoading(true);

        // Helper to fetch stats
        const getStats = async (id: string, column: string) => {
          try {
            // Count Likes
            const { count: likesCount, error: likesError } = await supabase
              .from('likes')
              .select('*', { count: 'exact', head: true })
              .eq(column, id);

            // Count Comments
            const { count: commentsCount, error: commentsError } = await supabase
              .from('comments')
              .select('*', { count: 'exact', head: true })
              .eq(column, id);

            if (likesError || commentsError) throw new Error("Stats fetch failed");

            // Allow user queries if logged in
            let isLiked = false;
            if (userId) {
              const { data } = await supabase
                .from('likes')
                .select('id')
                .eq(column, id)
                .eq('user_id', userId)
                .single();
              isLiked = !!data;
            }

            return { likes: likesCount || 0, comments: commentsCount || 0, isLiked };
          } catch (err) {
            // Fail silently for UI stability if tables lack
            return { likes: 0, comments: 0, isLiked: false };
          }
        };

        // 1. Fetch Projects (Limit 15 to have enough for both sections)
        const { data: projects } = await supabase
          .from('projects')
          .select('id, title, description, cover_image, created_at, profiles(id, full_name, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(15);

        // 2. Fetch Albums
        const { data: albums } = await supabase
          .from('gallery_albums')
          .select('id, title, cover_url, created_at, user_id')
          .order('created_at', { ascending: false })
          .limit(10);

        // Enrich Albums
        let albumWithAuthors: any[] = [];
        if (albums) {
          const userIds = [...new Set(albums.map(a => a.user_id).filter(Boolean))];
          const { data: users } = await supabase.from('profiles').select('id, full_name, avatar_url').in('id', userIds);
          const userMap = new Map(users?.map(u => [u.id, u]) || []);

          albumWithAuthors = albums.map(a => ({
            ...a,
            profiles: userMap.get(a.user_id) || { full_name: 'Speedlight User', avatar_url: null, id: null }
          }));
        }

        // 3. Fetch Marketplace
        const { data: market } = await supabase
          .from('marketplace_listings')
          .select('id, title, description, images, price, created_at, profile_id')
          .order('created_at', { ascending: false })
          .limit(10);

        // Enrich Market
        let marketWithAuthors: any[] = [];
        if (market) {
          const userIds = [...new Set(market.map(m => m.profile_id).filter(Boolean))];
          const { data: users } = await supabase.from('profiles').select('id, full_name, avatar_url').in('id', userIds);
          const userMap = new Map(users?.map(u => [u.id, u]) || []);

          marketWithAuthors = market.map(m => ({
            ...m,
            profiles: userMap.get(m.profile_id) || { full_name: 'Vendedor', avatar_url: null, id: null }
          }));
        }

        // --- SEPARATE CONTENT TYPES ---

        // Take top 5 projects for "Featured Machines" Horizontal Scroll
        const featuredRaw = projects ? projects.slice(0, 5) : [];
        const remainingProjects = projects ? projects.slice(5) : [];

        // Process Featured Items
        const featured: any[] = [];
        await Promise.all(featuredRaw.map(async (p) => {
          const stats = await getStats(p.id, 'project_id');
          featured.push({
            id: p.id,
            uniqueId: `feat_${p.id}`,
            type: 'project',
            date: new Date(p.created_at),
            user: {
              id: (p.profiles as any)?.id,
              name: (p.profiles as any)?.full_name || 'Constructor',
              avatar: (p.profiles as any)?.avatar_url
            },
            content: {
              title: p.title,
              text: p.description,
              image: p.cover_image
            },
            stats
          });
        }));
        setFeaturedItems(featured);


        // Process Vertical Feed Items
        const items: any[] = [];

        await Promise.all([
          ...(remainingProjects.map(async (p) => {
            const stats = await getStats(p.id, 'project_id');
            items.push({
              id: p.id,
              uniqueId: `proj_${p.id}`,
              type: 'project',
              date: new Date(p.created_at),
              user: {
                id: (p.profiles as any)?.id,
                name: (p.profiles as any)?.full_name || 'Constructor',
                avatar: (p.profiles as any)?.avatar_url
              },
              content: {
                title: p.title,
                text: p.description,
                image: p.cover_image
              },
              stats
            });
          })),
          ...(albumWithAuthors?.map(async (a) => {
            const stats = await getStats(a.id, 'album_id');
            items.push({
              id: a.id,
              uniqueId: `album_${a.id}`,
              type: 'gallery',
              date: new Date(a.created_at),
              user: {
                id: a.profiles?.id,
                name: a.profiles?.full_name || 'Fotógrafo',
                avatar: a.profiles?.avatar_url
              },
              content: {
                title: a.title,
                text: 'Nuevo álbum publicado en la galería.',
                image: a.cover_url
              },
              stats
            });
          }) || []),
          ...(marketWithAuthors?.map(async (m) => {
            const stats = await getStats(m.id, 'listing_id');
            items.push({
              id: m.id,
              uniqueId: `market_${m.id}`,
              type: 'marketplace',
              date: new Date(m.created_at),
              user: {
                id: m.profiles?.id,
                name: m.profiles?.full_name || 'Vendedor',
                avatar: m.profiles?.avatar_url
              },
              content: {
                title: m.title,
                text: `${m.description?.substring(0, 100)}... Precio: $${m.price?.toLocaleString()}`,
                image: m.images && m.images.length > 0 ? m.images[0] : null
              },
              stats
            });
          }) || [])
        ]);

        items.sort((a, b) => b.date.getTime() - a.date.getTime());

        if (items.length > 2 && feedAd) {
          items.splice(2, 0, { id: 'native_ad_1', type: 'ad', data: feedAd, date: new Date() });
        }

        setFeedItems(items);
      } catch (error) {
        console.error("Error loading feed:", error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    // Simple logic for brevity
    let value = 0;
    let unit = "";

    if (seconds < 60) return language === 'es' ? "ahora" : "now";

    if (seconds < 3600) {
      value = Math.floor(seconds / 60);
      unit = language === 'es' ? 'm' : 'm';
    } else if (seconds < 86400) {
      value = Math.floor(seconds / 3600);
      unit = language === 'es' ? 'h' : 'h';
    } else if (seconds < 2592000) {
      value = Math.floor(seconds / 86400);
      unit = language === 'es' ? 'd' : 'd';
    } else {
      value = Math.floor(seconds / 2592000);
      unit = language === 'es' ? 'mo' : 'mo';
    }

    return `${value}${unit}`;
  };

  return (
    <div className="max-w-[700px] mx-auto min-h-screen pb-20 overflow-x-hidden">

      {/* Mobile Title - Reference Style */}
      <div className="md:hidden sticky top-[60px] z-40 bg-[#050302]/80 backdrop-blur-xl px-4 py-3 border-b border-white/5 mb-6 flex items-center justify-between">
        <div className="w-6"></div> {/* Spacer for centering */}
        <h1 className="font-oswald font-bold text-2xl text-white uppercase tracking-wider drop-shadow-lg text-center">
          Speedlight <span className="text-[#FF9800] text-shadow-glow">Culture</span>
        </h1>
        <div className="w-6 flex justify-end">
          <div className="relative">
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF9800] rounded-full animate-pulse"></span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
          </div>
        </div>
      </div>


      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#FF9800] animate-spin" />
        </div>
      ) : (
        <>
          {/* HORIZONTAL SCROLL - Featured Machines */}
          {featuredItems.length > 0 && (
            <div className="mb-8">
              <div className="px-4 flex items-center justify-between mb-4">
                <h2 className="text-[#FF9800] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-3 bg-[#FF9800] rounded-full"></span>
                  {labels.featured}
                </h2>
                <Link href="/projects" className="text-white/40 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 hover:text-white transition-colors">
                  {labels.viewAll} <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory scrollbar-hide">
                {featuredItems.map((item) => (
                  <Link href={`/projects/${item.id}`} key={item.uniqueId} className="snap-center shrink-0 w-[85vw] max-w-[340px]">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#FF9800]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group">
                      {item.content?.image ? (
                        <Image
                          src={item.content.image}
                          alt={item.content.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1e1e1e] to-black flex items-center justify-center">
                          <Wrench className="text-white/10 w-12 h-12" />
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                      {/* Play/View Button */}
                      <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 flex items-center gap-2 hover:bg-white/20 transition-all">
                        <Play className="w-3 h-3 text-white fill-white" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{labels.play}</span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-24">
                        <h3 className="font-oswald font-bold text-lg text-white truncate drop-shadow-lg tracking-wide">{item.content.title}</h3>
                        <p className="text-[#FF9800] text-xs font-bold tracking-wider">{timeAgo(item.date)} ago</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}


          {/* VERTICAL SCROLL - Main Feed */}
          <div className="px-4 space-y-8">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#FF9800]" />
              <h2 className="text-white text-sm font-bold uppercase tracking-wider">{labels.latest}</h2>
            </div>

            {feedItems.length === 0 && (
              <div className="p-12 text-center text-white/30 border border-white/5 rounded-2xl bg-[#0A0A0A]">
                <p>{labels.empty}</p>
              </div>
            )}

            {feedItems.map((item) => {
              if (item.type === 'ad') {
                return (
                  <div key={item.id} className="rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                    <AdFeedCard data={item.data} />
                  </div>
                );
              }

              return (
                <div key={item.uniqueId} className="bg-[#111] rounded-2xl overflow-hidden shadow-2xl border border-white/5 hover:border-[#FF9800]/20 transition-all duration-300 group">

                  <FeedPostHeader
                    user={item.user}
                    time={timeAgo(item.date)}
                    action={
                      item.type === 'project' ? labels.project :
                        item.type === 'gallery' ? labels.gallery :
                          labels.marketplace
                    }
                    type={item.type}
                  />

                  {/* Main Visual Content */}
                  {item.content?.image ? (
                    <div className="relative w-full aspect-[4/5] bg-[#050505]">
                      <Image
                        src={item.content.image}
                        alt="Content"
                        fill
                        className="object-cover"
                      />

                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
                        <div className="flex items-center gap-2 mb-2">
                          {item.type === 'project' && <Wrench className="w-4 h-4 text-[#FF9800]" />}
                          {item.type === 'gallery' && <Camera className="w-4 h-4 text-[#FF9800]" />}
                          {item.type === 'marketplace' && <ShoppingBag className="w-4 h-4 text-[#FF9800]" />}
                          <span className="text-[#FF9800] text-xs font-bold uppercase tracking-widest">{item.type}</span>
                        </div>
                        <h3 className="font-oswald font-bold text-2xl md:text-3xl text-white leading-tight mb-2 drop-shadow-md">
                          {item.content.title}
                        </h3>
                        {item.content.text && (
                          <p className="text-white/80 text-sm md:text-base line-clamp-2 font-light drop-shadow-sm max-w-xl">
                            {item.content.text}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Text Only Fallback */
                    <div className="p-6 md:p-10 min-h-[200px] flex flex-col justify-center bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
                      <h3 className="font-oswald font-bold text-2xl text-white mb-4">
                        {item.content?.title || labels.untitled}
                      </h3>
                      <p className="text-white/70 text-lg font-light leading-relaxed">
                        {item.content?.text}
                      </p>
                    </div>
                  )}

                  <SocialActions
                    entityId={item.id}
                    entityType={item.type}
                    initialLikes={item.stats.likes}
                    initialComments={item.stats.comments}
                    initialIsLiked={item.stats.isLiked}
                    currentUserId={currentUserId}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
