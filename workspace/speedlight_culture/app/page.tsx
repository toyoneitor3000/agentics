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
  <div className="absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/20 relative overflow-hidden shadow-lg">
        {user.avatar ? (
          <Image src={user.avatar} alt={user.name} fill sizes="40px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-white/50 font-bold">{user.name.charAt(0)}</div>
        )}
      </div>
      <div>
        <Link href={user.id ? `/profile/${user.id}` : '#'} className="text-sm font-bold text-white hover:text-[#FF9800] transition-colors drop-shadow-md">
          {user.name}
        </Link>
        <div className="flex items-center gap-2 text-[10px] text-white/80 font-roboto-mono tracking-wide drop-shadow-sm">
          <span>{time}</span>
          <span className="w-1 h-1 bg-[#FF9800] rounded-full"></span>
          <span className="uppercase tracking-wider text-[#FF9800]">{action}</span>
        </div>
      </div>
    </div>
    <button className="text-white/60 hover:text-white transition-colors bg-black/20 backdrop-blur-md p-2 rounded-full">
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
        const getStats = async (id: string, type: string) => {
          try {
            // Count Likes
            const { count: likesCount, error: likesError } = await supabase
              .from('likes')
              .select('*', { count: 'exact', head: true })
              .eq('target_id', id)
              .eq('target_type', type);

            // Count Comments
            const { count: commentsCount, error: commentsError } = await supabase
              .from('comments')
              .select('*', { count: 'exact', head: true })
              .eq('target_id', id)
              .eq('target_type', type);

            if (likesError || commentsError) throw new Error("Stats fetch failed");

            // Allow user queries if logged in
            let isLiked = false;
            if (userId) {
              const { data } = await supabase
                .from('likes')
                .select('id')
                .eq('target_id', id)
                .eq('target_type', type)
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

        // 1. Featured: Only Top 5 projects WITH images (Premium Look)
        const featuredCandidates = projects ? projects.filter(p => p.cover_image) : [];
        const featuredRaw = featuredCandidates.slice(0, 5);

        // 2. Feed: Everything else (Rest of image-projects + ALL image-less projects)
        // We filter out the exact IDs that made it to Featured
        const featuredIds = new Set(featuredRaw.map(p => p.id));
        const feedProjects = projects ? projects.filter(p => !featuredIds.has(p.id)) : [];

        // Process Featured Items
        const featured: any[] = [];
        await Promise.all(featuredRaw.map(async (p) => {
          const stats = await getStats(p.id, 'project');
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
          ...(feedProjects.map(async (p) => {
            const stats = await getStats(p.id, 'project');
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
            const stats = await getStats(a.id, 'gallery');
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
            const stats = await getStats(m.id, 'marketplace');
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
    <div className="max-w-[700px] mx-auto min-h-screen pb-20 pt-24 overflow-x-hidden">



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
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group">
                      {item.content?.image ? (
                        <Image
                          src={item.content.image}
                          alt={item.content.title}
                          fill
                          sizes="(max-width: 768px) 85vw, 340px"
                          priority={true}
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1e1e1e] to-black flex items-center justify-center">
                          <Wrench className="text-white/10 w-12 h-12" />
                        </div>
                      )}

                      {/* Clean Overlay */}
                      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>

                      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-2 hover:bg-[#FF9800] hover:text-black hover:border-[#FF9800] transition-all group-hover:scale-105">
                        <Play className="w-3 h-3 text-white group-hover:text-black fill-current" />
                        <span className="text-[10px] font-bold text-white group-hover:text-black uppercase tracking-wider">{labels.play}</span>
                      </div>

                      <div className="absolute bottom-5 left-5 right-5">
                        <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <span className="text-[#FF9800] text-[10px] font-black uppercase tracking-[0.2em]">{item.user.name}</span>
                        </div>
                        <h3 className="font-oswald font-bold text-xl text-white truncate drop-shadow-lg tracking-wide group-hover:text-[#FF9800] transition-colors">{item.content.title}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}


          {/* VERTICAL SCROLL - Main Feed */}
          <div className="px-4 space-y-10">
            <div className="flex items-center gap-2 mb-4 px-1">
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
                  <div key={item.id} className="rounded-3xl overflow-hidden shadow-2xl border border-white/5 mx-[-10px] md:mx-0">
                    <AdFeedCard data={item.data} />
                  </div>
                );
              }

              return (
                <div key={item.uniqueId} className="bg-[#0D0D0D] rounded-3xl overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.6)] border border-[#ffffff05] hover:border-[#FF9800]/20 transition-all duration-500 group relative">

                  {/* HEADER OVERLAY - Now inside image context */}
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
                    <div className="relative w-full aspect-[3/4] bg-[#050505] overflow-hidden">
                      <Image
                        src={item.content.image}
                        alt="Content"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />

                      {/* IMMERSIVE GRADIENT OVERLAY */}
                      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent flex flex-col justify-end p-6 pb-24">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${item.type === 'project' ? 'border-[#FF9800] text-[#FF9800] bg-[#FF9800]/10' :
                            item.type === 'marketplace' ? 'border-green-500 text-green-500 bg-green-500/10' :
                              'border-blue-500 text-blue-500 bg-blue-500/10'
                            }`}>
                            {item.type}
                          </span>
                        </div>
                        <h3 className="font-oswald font-bold text-3xl md:text-4xl text-white leading-[0.9] mb-3 drop-shadow-lg">
                          {item.content.title}
                        </h3>
                        {item.content.text && (
                          <p className="text-white/70 text-sm md:text-base font-light line-clamp-2 drop-shadow-md max-w-lg mb-2">
                            {item.content.text}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Text Only Fallback */
                    <div className="relative w-full aspect-[4/3] flex flex-col justify-end p-8 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
                      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#FF9800]/5 to-transparent"></div>
                      <h3 className="font-oswald font-bold text-3xl text-white mb-4 relative z-10">
                        {item.content?.title || labels.untitled}
                      </h3>
                      <p className="text-white/70 text-lg font-light leading-relaxed relative z-10">
                        {item.content?.text}
                      </p>
                    </div>
                  )}

                  {/* ACTIONS - FLOATING/INTEGRATED */}
                  <div className="absolute bottom-0 inset-x-0 bg-[#0D0D0D]">
                    <SocialActions
                      entityId={item.id}
                      entityType={item.type}
                      initialLikes={item.stats.likes}
                      initialComments={item.stats.comments}
                      initialIsLiked={item.stats.isLiked}
                      currentUserId={currentUserId}
                    />
                  </div>

                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
