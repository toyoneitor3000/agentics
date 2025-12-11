
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Heart, MessageCircle, Share2, MoreHorizontal, Camera, Wrench, ShoppingBag, Loader2 } from "lucide-react";
import { AdFeedCard } from "@/app/components/AdBanners";
import { getAdByType } from "@/app/data/ads";

// Sub-components for Feed
const FeedPostHeader = ({ user, time, action }: { user: any, time: string, action?: string }) => (
  <div className="flex items-center justify-between p-4 pb-2">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden border border-[#FF9800]/20 relative">
        {user.avatar ? (
          <Image src={user.avatar} alt={user.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#F5E6D3] font-bold">{user.name.charAt(0)}</div>
        )}
      </div>
      <div>
        <Link href={user.id ? `/profile/${user.id}` : '#'} className="text-sm font-bold text-[#F5E6D3] hover:underline decoration-[#FF9800] underline-offset-2">{user.name}</Link>
        <p className="text-xs text-[#BCAAA4]">{action} • {time}</p>
      </div>
    </div>
    <button className="text-[#BCAAA4] hover:text-white">
      <MoreHorizontal className="w-5 h-5" />
    </button>
  </div>
);

const FeedPostActions = ({ likes, comments }: { likes: number, comments: number }) => (
  <div className="p-4 pt-2">
    <div className="flex items-center gap-6 mb-3">
      <button className="flex items-center gap-2 group">
        <Heart className="w-6 h-6 text-[#F5E6D3] group-hover:text-[#FF9800] transition-colors" />
      </button>
      <button className="flex items-center gap-2 group">
        <MessageCircle className="w-6 h-6 text-[#F5E6D3] group-hover:text-[#FF9800] transition-colors" />
      </button>
      <button className="flex items-center gap-2 group">
        <Share2 className="w-6 h-6 text-[#F5E6D3] group-hover:text-[#FF9800] transition-colors" />
      </button>
    </div>
    <p className="text-sm font-bold text-[#F5E6D3]">{likes} Me gusta</p>
    <p className="text-sm text-[#BCAAA4] mt-1 cursor-pointer hover:text-white">Ver los {comments} comentarios</p>
  </div>
);

export default function Home() {
  const supabase = createClient();
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const feedAd = getAdByType('feed_card');

  useEffect(() => {
    async function fetchFeed() {
      try {
        setLoading(true);

        // 1. Fetch Projects
        const { data: projects } = await supabase
          .from('projects')
          .select('id, title, description, cover_image, created_at, profiles(id, full_name, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(10);

        // 2. Fetch Albums
        const { data: albums } = await supabase
          .from('gallery_albums')
          .select('id, title, cover_url, created_at, user_id') // User might need separate fetch if strict FK not set, but assuming it works or fallback
          .order('created_at', { ascending: false })
          .limit(10);

        // Fetch profiles for albums if relation missing in query
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
          .select('id, title, description, images, price, created_at, profile_id') // Assuming table structure
          .order('created_at', { ascending: false })
          .limit(10);

        // Fetch profiles for market
        let marketWithAuthors: any[] = [];
        if (market) {
          // Logic similar to albums if direct relation query fails
          const userIds = [...new Set(market.map(m => m.profile_id).filter(Boolean))]; // Assuming profile_id column
          const { data: users } = await supabase.from('profiles').select('id, full_name, avatar_url').in('id', userIds);
          const userMap = new Map(users?.map(u => [u.id, u]) || []);

          marketWithAuthors = market.map(m => ({
            ...m,
            profiles: userMap.get(m.profile_id) || { full_name: 'Vendedor', avatar_url: null, id: null }
          }));
        }


        // 4. Transform & Mix
        const items: any[] = [];

        // Project Items
        projects?.forEach(p => {
          items.push({
            id: `proj_${p.id}`,
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
            stats: { likes: Math.floor(Math.random() * 50) + 5, comments: Math.floor(Math.random() * 10) } // Mock stats for now
          });
        });

        // Album Items
        albumWithAuthors.forEach(a => {
          items.push({
            id: `album_${a.id}`,
            type: 'gallery',
            date: new Date(a.created_at),
            user: {
              id: a.profiles?.id,
              name: a.profiles?.full_name || 'Fotógrafo',
              avatar: a.profiles?.avatar_url
            },
            content: {
              title: `Nuevo Álbum: ${a.title}`,
              text: 'Ha subido nuevas fotos a la galería.',
              image: a.cover_url
            },
            stats: { likes: Math.floor(Math.random() * 100) + 20, comments: Math.floor(Math.random() * 20) }
          });
        });

        // Market Items
        marketWithAuthors?.forEach(m => {
          items.push({
            id: `market_${m.id}`,
            type: 'marketplace',
            date: new Date(m.created_at),
            user: {
              id: m.profiles?.id,
              name: m.profiles?.full_name || 'Vendedor',
              avatar: m.profiles?.avatar_url
            },
            content: {
              title: `VENDO: ${m.title}`,
              text: `${m.description?.substring(0, 100)}... Precio: $${m.price}`,
              image: m.images && m.images.length > 0 ? m.images[0] : null
            },
            stats: { likes: Math.floor(Math.random() * 20), comments: Math.floor(Math.random() * 5) }
          });
        });

        // Insert Ads periodically (every 5 items)
        // Sort by date desc
        items.sort((a, b) => b.date.getTime() - a.date.getTime());

        // Insert Ad at index 2
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

    fetchFeed();
  }, []);

  // Time Formatter
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " años";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " días";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " min";
    return Math.floor(seconds) + " seg";
  };

  return (
    <div className="max-w-[600px] mx-auto min-h-screen">

      {/* Feed Header */}
      <div className="md:hidden sticky top-[60px] z-40 bg-[#050302]/90 backdrop-blur-md px-4 py-3 border-b border-[#FF9800]/10">
        <p className="font-bold text-lg text-[#F5E6D3]">Speedlight Feed</p>
      </div>

      {/* Create Post Input Placeholder */}
      <div className="p-4 border-b border-[#FF9800]/10 flex gap-4 items-center">
        <div className="w-10 h-10 rounded-full bg-[#1A0F08] border border-[#FF9800]/30 flex items-center justify-center">
          <span className="text-[#FF9800] font-bold">Yo</span>
        </div>
        <input
          type="text"
          placeholder="¿Qué estás construyendo hoy?"
          className="bg-transparent text-[#F5E6D3] placeholder-[#BCAAA4] flex-1 outline-none text-sm"
        />
        <button className="text-[#FF9800] font-bold text-sm uppercase">Publicar</button>
      </div>

      {loading && (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#FF9800] animate-spin" />
        </div>
      )}

      {/* Feed Items */}
      <div className="pb-20">
        {!loading && feedItems.length === 0 && (
          <div className="p-8 text-center text-[#BCAAA4]">
            <p>No hay actividad reciente. Sé el primero en publicar algo.</p>
          </div>
        )}

        {feedItems.map((item) => {
          if (item.type === 'ad') {
            return (
              <div key={item.id} className="py-4 border-b border-[#FF9800]/10">
                <AdFeedCard data={item.data} />
              </div>
            );
          }

          return (
            <div key={item.id} className="border-b border-[#FF9800]/10 bg-[#050302]">
              <FeedPostHeader
                user={item.user}
                time={timeAgo(item.date)}
                action={
                  item.type === 'project' ? 'actualizó proyecto' :
                    item.type === 'gallery' ? 'subió álbum' :
                      'publicó venta'
                }
              />

              {/* Content Text */}
              <div className="px-4 mb-3">
                {item.content?.title && <h3 className="font-bold text-[#F5E6D3] mb-1">{item.content.title}</h3>}
                {item.content?.text && <p className="text-sm text-[#E0E0E0] line-clamp-3">{item.content.text}</p>}
              </div>

              {/* Content Image */}
              {item.content?.image && (
                <div className="w-full aspect-square md:aspect-[4/3] relative bg-[#1A1A1A]">
                  <Image
                    src={item.content.image}
                    alt="Content"
                    fill
                    className="object-cover"
                  />
                  {/* Type Badge */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2">
                    {item.type === 'project' && <><Wrench className="w-3 h-3 text-[#FF9800]" /> PROJECT</>}
                    {item.type === 'gallery' && <><Camera className="w-3 h-3 text-[#FF9800]" /> GALLERY</>}
                    {item.type === 'marketplace' && <><ShoppingBag className="w-3 h-3 text-[#FF9800]" /> MARKET</>}
                  </div>
                </div>
              )}

              <FeedPostActions likes={item.stats!.likes} comments={item.stats!.comments} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
