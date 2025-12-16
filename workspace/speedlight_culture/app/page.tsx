"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

import { Wrench, Play, ChevronRight, Zap, Loader2 } from "lucide-react";
import { AdFeedCard } from "@/app/components/AdBanners";
import { getAdByType } from "@/app/data/ads";
import { useLanguage } from "@/app/context/LanguageContext";
import HomeIntro from "@/app/components/home/HomeIntro";
import FeedCard from "@/app/components/feed/FeedCard";
import { getCinemaFeed } from "@/app/actions/cinema";

export default function Home() {
  const supabase = createClient();
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  // INTRO LOGIC STATE
  const [showIntro, setShowIntro] = useState(false);
  const [isCheckingIntro, setIsCheckingIntro] = useState(true);

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

      // --- INTRO LOGIC CHECK ---
      const hasVisited = localStorage.getItem('speedlight_visited');
      const isLogged = !!session?.user;

      if (!isLogged && !hasVisited) {
        setShowIntro(true);
      } else {
        setShowIntro(false);
      }
      setIsCheckingIntro(false);

      fetchFeed(session?.user?.id);
    }

    async function fetchFeed(userId?: string) {
      try {
        setLoading(true);

        const getStats = async (id: string, type: string) => {
          try {
            const { count: likesCount } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('target_id', id).eq('target_type', type);
            const { count: commentsCount } = await supabase.from('comments').select('*', { count: 'exact', head: true }).eq('target_id', id).eq('target_type', type);

            let isLiked = false;
            if (userId) {
              const { data } = await supabase.from('likes').select('id').eq('target_id', id).eq('target_type', type).eq('user_id', userId).single();
              isLiked = !!data;
            }
            return { likes: likesCount || 0, comments: commentsCount || 0, isLiked };
          } catch (err) {
            return { likes: 0, comments: 0, isLiked: false };
          }
        };

        // 1. Projects
        const { data: projects } = await supabase
          .from('projects')
          .select('id, title, description, cover_image, created_at, profiles(id, full_name, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(10);

        // 2. Albums
        const { data: albums } = await supabase
          .from('gallery_albums')
          .select('id, title, cover_url, created_at, user_id')
          .order('created_at', { ascending: false })
          .limit(5);

        // 3. Marketplace
        const { data: market } = await supabase
          .from('marketplace_listings')
          .select('id, title, description, images, price, created_at, profile_id')
          .order('created_at', { ascending: false })
          .limit(5);

        // 4. Videos (Server Action) -> Enriched with Unified Stats
        const videos = await getCinemaFeed();

        // Process Videos with Unified Stats (Parallel)
        const videoPromises = videos.map(async (v) => {
          const type = v.format === 'vertical' ? 'social' : 'cinema';
          // OVERRIDE: Fetch stats from 'likes' table to match SocialActions behavior
          const stats = await getStats(v.id, type);

          return {
            id: v.id,
            uniqueId: `vid_${v.id}`,
            type: type,
            date: new Date(v.created_at || Date.now()), // Use real date if available or fallback
            user: { id: null, name: v.creator, avatar: v.avatar },
            content: { title: v.title, text: v.description, image: v.poster, video_poster: v.poster, video: v.videoUrl },
            stats // Use Unified Stats
          };
        });

        const normalizedVideos = await Promise.all(videoPromises);

        // 5. Articles (New)
        const { data: articles } = await supabase
          .from('articles')
          .select('id, title, summary, content, cover_image, category, created_at, author_id')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(5);

        // 6. Events (New)
        const { data: events } = await supabase
          .from('events')
          .select('id, title, date_text, location, description, image, type, created_at, user_id')
          .order('created_at', { ascending: false })
          .limit(5);

        // 7. Workshops / Businesses (New)
        const { data: workshops } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, business_category, custom_links, bio')
          .eq('account_type', 'business')
          .limit(3);

        // --- ENRICHMENT helper ---
        const enrichUsers = async (rawItems: any[], idField: string) => {
          if (!rawItems || rawItems.length === 0) return [];
          const userIds = [...new Set(rawItems.map(i => i[idField]).filter(Boolean))];
          if (userIds.length === 0) return rawItems;
          const { data: users } = await supabase.from('profiles').select('id, full_name, avatar_url').in('id', userIds);
          const userMap = new Map(users?.map(u => [u.id, u]) || []);
          return rawItems.map(i => ({
            ...i,
            profiles: userMap.get(i[idField]) || { full_name: 'Usuario', avatar_url: null, id: i[idField] }
          }));
        };

        const albumWithAuthors = await enrichUsers(albums || [], 'user_id');
        const marketWithAuthors = await enrichUsers(market || [], 'profile_id');
        const articlesWithAuthors = await enrichUsers(articles || [], 'author_id');
        const eventsWithAuthors = await enrichUsers(events || [], 'user_id');

        // --- NORMALIZE CONTENT ---

        // FEATURED: Top Projects
        const featuredCandidates = projects ? projects.filter(p => p.cover_image) : [];
        const featuredRaw = featuredCandidates.slice(0, 5);
        const featuredIds = new Set(featuredRaw.map(p => p.id));
        const feedProjects = projects ? projects.filter(p => !featuredIds.has(p.id)) : [];

        // Featured Items
        const featured: any[] = [];
        await Promise.all(featuredRaw.map(async (p) => {
          // ... stats ...
          const stats = await getStats(p.id, 'project');
          featured.push({
            id: p.id, uniqueId: `feat_${p.id}`, type: 'project', date: new Date(p.created_at),
            user: { id: (p.profiles as any)?.id, name: (p.profiles as any)?.full_name, avatar: (p.profiles as any)?.avatar_url },
            content: { title: p.title, text: p.description, image: p.cover_image },
            stats
          });
        }));
        setFeaturedItems(featured);


        // FEED ITEMS
        const items: any[] = [];
        const pushItem = async (raw: any, type: string, mapFn: any) => {
          const stats = await getStats(raw.id, type); // Normalize video stats type
          items.push({ ...mapFn(raw), stats });
        };

        await Promise.all([
          // Projects
          ...feedProjects.map(p => pushItem(p, 'project', (x: any) => ({
            id: x.id, uniqueId: `proj_${x.id}`, type: 'project', date: new Date(x.created_at),
            user: { id: x.profiles?.id, name: x.profiles?.full_name, avatar: x.profiles?.avatar_url },
            content: { title: x.title, text: x.description, image: x.cover_image }
          }))),
          // Albums
          ...albumWithAuthors.map(a => pushItem(a, 'gallery', (x: any) => ({
            id: x.id, uniqueId: `album_${x.id}`, type: 'gallery', date: new Date(x.created_at),
            user: { id: x.profiles?.id, name: x.profiles?.full_name, avatar: x.profiles?.avatar_url },
            content: { title: x.title, text: 'Álbum Fotográfico', image: x.cover_url }
          }))),
          // Market
          ...marketWithAuthors.map(m => pushItem(m, 'marketplace', (x: any) => ({
            id: x.id, uniqueId: `market_${x.id}`, type: 'marketplace', date: new Date(x.created_at),
            user: { id: x.profiles?.id, name: x.profiles?.full_name, avatar: x.profiles?.avatar_url },
            content: { title: x.title, text: `$${x.price?.toLocaleString()}`, image: x.images?.[0] }
          }))),
          // Articles
          ...articlesWithAuthors.map(a => pushItem(a, 'article', (x: any) => ({
            id: x.id, uniqueId: `art_${x.id}`, type: 'article', date: new Date(x.created_at),
            user: { id: x.profiles?.id, name: x.profiles?.full_name, avatar: x.profiles?.avatar_url },
            content: { title: x.title, text: x.summary, image: x.cover_image }
          }))),
          // Events
          ...eventsWithAuthors.map(e => pushItem(e, 'event', (x: any) => ({
            id: x.id, uniqueId: `evt_${x.id}`, type: 'event', date: new Date(x.created_at),
            user: { id: x.profiles?.id, name: x.profiles?.full_name, avatar: x.profiles?.avatar_url },
            content: { title: x.title, text: `${x.date_text} • ${x.location}`, image: x.image, description: x.description }
          }))),
          // Workshops (as specialized cards)
          ...(workshops || []).map(w => pushItem(w, 'workshop', (x: any) => ({
            id: x.id, uniqueId: `workshop_${x.id}`, type: 'workshop', date: new Date(), // Pinned
            user: { id: x.id, name: x.full_name, avatar: x.avatar_url },
            content: { title: x.full_name, text: x.bio || 'Taller Certificado', image: x.avatar_url }
          })))
        ]);

        items.push(...normalizedVideos);

        // Sort by Date
        // Note: videos have fake date now. Ideally sort mixes them well.
        items.sort((a, b) => b.date.getTime() - a.date.getTime());

        // Inject Ad & AutoStudio
        if (items.length > 2 && feedAd) {
          items.splice(2, 0, { id: 'native_ad_1', uniqueId: 'native_ad_1', type: 'ad', data: feedAd, date: new Date() });
        }
        if (items.length > 5) {
          items.splice(5, 0, {
            id: 'autostudio_promo',
            uniqueId: 'autostudio_promo',
            type: 'article', // Reuse article card for nice layout
            date: new Date(),
            user: { name: 'AutoStudio AI', avatar: null }, // Placeholder
            content: {
              title: '¿Buscas Taller?',
              text: 'Usa nuestra IA para encontrar los mejores especialistas en tu ciudad.',
              image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=2070',
              summary: 'Asistente Inteligente'
            },
            ctaLink: '/autostudio'
          });
        }

        setFeedItems(items);

      } catch (error) {
        console.error("Error loading feed:", error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [language]);


  const timeAgo = (date: Date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let value = 0;
    let unit = "";
    if (seconds < 60) return language === 'es' ? "ahora" : "now";
    if (seconds < 3600) { value = Math.floor(seconds / 60); unit = 'm'; }
    else if (seconds < 86400) { value = Math.floor(seconds / 3600); unit = 'h'; }
    else if (seconds < 2592000) { value = Math.floor(seconds / 86400); unit = 'd'; }
    else { value = Math.floor(seconds / 2592000); unit = 'mo'; }
    return `${value}${unit}`;
  };

  const handleEnterApp = () => {
    localStorage.setItem('speedlight_visited', 'true');
    setShowIntro(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isCheckingIntro) {
    return (
      <div className="flex justify-center items-center pb-20 pt-20 h-screen bg-black">
        <Loader2 className="w-8 h-8 text-[#FF9800] animate-spin" />
      </div>
    );
  }

  if (showIntro) {
    return <HomeIntro onEnterApp={handleEnterApp} featuredItems={featuredItems} recentActivity={feedItems} />;
  }

  return (
    <div className="max-w-[700px] mx-auto min-h-screen pb-20 pt-20 overflow-x-hidden">

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#FF9800] animate-spin" />
        </div>
      ) : (
        <>
          {/* HORIZONTAL SCROLL - Featured Machines */}
          {featuredItems.length > 0 && (
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="px-4 flex items-center justify-between mb-2">
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


          {/* MAIN FEED */}
          <div className="px-4 space-y-8">
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
                <FeedCard
                  key={item.uniqueId}
                  item={item}
                  labels={labels}
                  currentUserId={currentUserId}
                  timeAgo={timeAgo}
                />
              );
            })}

            {/* End of Feed Spacer */}
            <div className="h-24 flex flex-col items-center justify-center text-white/20 text-xs uppercase tracking-widest gap-2">
              <span>End of Transmission</span>
              <span className="text-[10px] normal-case tracking-normal">
                Diseñado y desarrollado por <span className="text-[#A855F7] font-bold">Purpur.dev</span>
                <span className="mx-1">•</span>
                Bogotá, Colombia
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
