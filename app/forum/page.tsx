import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    MessageSquare,
    Users,
    Eye,
    Clock,
    ChevronRight,
    Flame,
    PinIcon,
    TrendingUp,
    Plus,
    Filter,
    MessageCircle,
    Award,
    Zap,
    Wrench,
    CarFront,
    Calendar,
    ShoppingBag,
    HelpCircle,
    Loader2
} from "lucide-react";
import { AdSidebarSpec } from "../components/AdBanners";
import { getForumPosts, getForumStats } from "../actions/forum";
import { FORUM_CATEGORIES } from "../lib/forum-constants";
import ForumSearch from "./ForumSearch";
import NewPostButton from "./NewPostButton";

// Iconos por categoría
const CATEGORY_ICONS: Record<string, any> = {
    general: MessageSquare,
    mecanica: Wrench,
    proyectos: CarFront,
    eventos: Calendar,
    marketplace: ShoppingBag,
    ayuda: HelpCircle,
};

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function getCategoryColor(category: string): string {
    const cat = FORUM_CATEGORIES.find(c => c.id === category.toLowerCase() || c.name.toLowerCase() === category.toLowerCase());
    return cat?.color || "#FF9800";
}

function getCategoryName(category: string): string {
    const cat = FORUM_CATEGORIES.find(c => c.id === category.toLowerCase() || c.name.toLowerCase() === category.toLowerCase());
    return cat?.name || category;
}

// Loading skeleton
function ForumSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-5 bg-[#0A0604] border border-white/10 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/10 rounded w-3/4" />
                            <div className="h-3 bg-white/5 rounded w-1/2" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Componente de estadísticas
async function ForumStatsBar() {
    const stats = await getForumStats();

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0A0604] border border-white/10 rounded-2xl p-4 text-center hover:border-[#FF9800]/30 transition-colors">
                <p className="text-2xl md:text-3xl font-black text-[#FF9800]">{stats.totalPosts.toLocaleString()}</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">Discusiones</p>
            </div>
            <div className="bg-[#0A0604] border border-white/10 rounded-2xl p-4 text-center hover:border-[#FF9800]/30 transition-colors">
                <p className="text-2xl md:text-3xl font-black text-[#FF9800]">{stats.totalReplies.toLocaleString()}</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">Respuestas</p>
            </div>
            <div className="bg-[#0A0604] border border-white/10 rounded-2xl p-4 text-center hover:border-[#FF9800]/30 transition-colors">
                <p className="text-2xl md:text-3xl font-black text-[#FF9800]">{stats.totalMembers.toLocaleString()}</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">Miembros</p>
            </div>
            <div className="bg-[#0A0604] border border-[#25D366]/30 rounded-2xl p-4 text-center">
                <p className="text-2xl md:text-3xl font-black text-[#25D366] flex items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#25D366] rounded-full animate-pulse" />
                    {stats.onlineNow}
                </p>
                <p className="text-xs text-white/40 uppercase tracking-wider">En Línea</p>
            </div>
        </div>
    );
}

// Lista de posts
async function ForumPostsList({ category, search }: { category?: string; search?: string }) {
    const posts = await getForumPosts({ category, search, limit: 30 });

    if (posts.length === 0) {
        return (
            <div className="text-center py-16 bg-[#0A0604] rounded-2xl border border-white/10">
                <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/40 text-lg mb-2">No hay discusiones aún</p>
                <p className="text-white/20 text-sm">¡Sé el primero en crear un tema!</p>
            </div>
        );
    }

    // Separar posts fijados y normales
    const pinnedPosts = posts.filter(p => p.is_pinned);
    const normalPosts = posts.filter(p => !p.is_pinned);

    return (
        <div className="space-y-6">
            {/* Posts Fijados */}
            {pinnedPosts.length > 0 && (
                <section>
                    <h2 className="flex items-center gap-2 text-lg font-bold text-white uppercase tracking-wider mb-4">
                        <PinIcon className="w-4 h-4 text-[#FF9800]" />
                        Destacados
                    </h2>
                    <div className="space-y-3">
                        {pinnedPosts.map((post) => (
                            <PostCard key={post.id} post={post} isPinned />
                        ))}
                    </div>
                </section>
            )}

            {/* Posts Normales */}
            <section>
                <h2 className="flex items-center gap-2 text-lg font-bold text-white uppercase tracking-wider mb-4">
                    <TrendingUp className="w-4 h-4 text-[#FF9800]" />
                    {pinnedPosts.length > 0 ? "Discusiones Recientes" : "Todas las Discusiones"}
                </h2>
                <div className="space-y-2">
                    {normalPosts.map((post, index) => (
                        <PostCard key={post.id} post={post} index={index} />
                    ))}
                </div>
            </section>
        </div>
    );
}

// Card de post individual
function PostCard({ post, isPinned, index }: { post: any; isPinned?: boolean; index?: number }) {
    const categoryColor = getCategoryColor(post.category);
    const isHot = (post.replies_count || 0) > 10;

    return (
        <Link
            href={`/forum/${post.id}`}
            className={`group block p-4 md:p-5 rounded-xl border transition-all duration-300 cursor-pointer animate-fade-in ${isPinned
                ? "bg-gradient-to-r from-[#FF9800]/5 to-transparent border-[#FF9800]/20 hover:border-[#FF9800]/40"
                : "bg-[#0A0604] border-white/10 hover:border-[#FF9800]/30"
                }`}
            style={{ animationDelay: `${(index || 0) * 50}ms` }}
        >
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="hidden md:flex w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex-shrink-0 items-center justify-center overflow-hidden">
                    {post.author?.avatar_url ? (
                        <Image
                            src={post.author.avatar_url}
                            alt={post.author?.name || "Usuario"}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-white/40 text-sm font-bold">
                            {(post.author?.name || "U")[0].toUpperCase()}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {isPinned && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-[#FF9800]/20 text-[#FF9800] text-[10px] font-bold uppercase tracking-wider rounded">
                                <PinIcon className="w-3 h-3" />
                                Fijado
                            </span>
                        )}
                        {isHot && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded">
                                <Flame className="w-3 h-3" />
                                Hot
                            </span>
                        )}
                        <span
                            className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded"
                            style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                        >
                            {getCategoryName(post.category)}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm md:text-base font-bold text-white group-hover:text-[#FF9800] transition-colors line-clamp-2 mb-1">
                        {post.title}
                    </h3>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-[11px] text-white/40 flex-wrap">
                        <span>
                            por <span className="text-[#FF9800]/70">{post.author?.name || "Usuario"}</span>
                            {post.author?.role && ["CEO", "ADMIN", "VIP"].includes(post.author.role) && (
                                <span className="ml-1 px-1.5 py-0.5 bg-[#FF9800]/10 text-[#FF9800] text-[9px] font-bold rounded">
                                    {post.author.role}
                                </span>
                            )}
                        </span>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(post.last_activity || post.created_at)}
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-4 text-xs text-white/30 flex-shrink-0">
                    <div className="text-center">
                        <p className="text-white font-bold">{post.replies_count || 0}</p>
                        <p className="text-[10px]">resp.</p>
                    </div>
                    <div className="text-center">
                        <p className="text-white font-bold">{(post.views_count || 0).toLocaleString()}</p>
                        <p className="text-[10px]">vistas</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-[#FF9800] transition-colors" />
                </div>

                {/* Mobile stats */}
                <div className="flex md:hidden items-center gap-3 text-[10px] text-white/30">
                    <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post.replies_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views_count || 0}
                    </span>
                </div>
            </div>
        </Link>
    );
}

// Categories Grid
function CategoriesGrid({ selectedCategory, onSelect }: { selectedCategory?: string; onSelect?: (cat: string) => void }) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {FORUM_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.id] || MessageSquare;
                const isSelected = selectedCategory === cat.id;
                return (
                    <Link
                        key={cat.id}
                        href={`/forum?category=${cat.id}`}
                        className={`group text-left p-5 bg-[#0A0604] border rounded-2xl transition-all duration-300 ${isSelected
                            ? 'border-[#FF9800]/50 shadow-[0_0_30px_rgba(255,152,0,0.1)]'
                            : 'border-white/10 hover:border-white/20'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                                style={{ backgroundColor: `${cat.color}20`, border: `1px solid ${cat.color}30` }}
                            >
                                <Icon className="w-5 h-5" style={{ color: cat.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-bold text-sm group-hover:text-[#FF9800] transition-colors">{cat.name}</h3>
                                <p className="text-white/40 text-xs line-clamp-1 mt-0.5">{cat.description}</p>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

export default async function ForumPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; search?: string }>;
}) {
    const params = await searchParams;
    const category = params.category;
    const search = params.search;

    return (
        <main className="min-h-screen bg-[#0D0805]">
            {/* Hero Section */}
            <div className="relative pt-32 pb-12 px-4 md:px-8 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FF9800]/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-[#FF9800]/5 rounded-full blur-[180px] pointer-events-none" />
                <div className="absolute bottom-0 right-20 w-[400px] h-[400px] bg-[#D32F2F]/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="text-center mb-10 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF9800]/10 border border-[#FF9800]/30 text-[#FF9800] text-xs font-bold uppercase tracking-widest mb-6">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Comunidad Speedlight</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black font-oswald italic uppercase tracking-tighter text-white mb-4">
                            FORO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9800] via-[#FFEB3B] to-[#FF9800] animate-glow">SPEEDLIGHT</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#BCAAA4] max-w-2xl mx-auto">
                            Debate, comparte y aprende con la comunidad automotriz más apasionada de Latinoamérica.
                        </p>
                    </div>

                    {/* Stats Bar */}
                    <Suspense fallback={
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-pulse">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-[#0A0604] border border-white/10 rounded-2xl p-4 h-20" />
                            ))}
                        </div>
                    }>
                        <ForumStatsBar />
                    </Suspense>

                    {/* Search & New Thread */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <ForumSearch initialSearch={search} />
                        <NewPostButton />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                <div className="grid lg:grid-cols-[1fr_320px] gap-12">

                    {/* Main Column */}
                    <div className="space-y-8">
                        {/* Categories */}
                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white uppercase tracking-wider mb-4">
                                <Filter className="w-5 h-5 text-[#FF9800]" />
                                Categorías
                            </h2>
                            <CategoriesGrid selectedCategory={category} />
                        </section>

                        {/* Posts List */}
                        <Suspense fallback={<ForumSkeleton />}>
                            <ForumPostsList category={category} search={search} />
                        </Suspense>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {/* Quick Rules */}
                        <div className="bg-[#0A0604] border border-white/10 rounded-2xl p-6">
                            <h4 className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-sm mb-4">
                                <Zap className="w-4 h-4 text-[#FF9800]" />
                                Reglas Rápidas
                            </h4>
                            <ul className="space-y-2 text-sm text-[#BCAAA4]">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#FF9800]">•</span>
                                    Respeta a todos los miembros
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#FF9800]">•</span>
                                    No spam ni autopromoción excesiva
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#FF9800]">•</span>
                                    Usa el buscador antes de crear temas duplicados
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#FF9800]">•</span>
                                    Publica en la categoría correcta
                                </li>
                            </ul>
                        </div>

                        {/* WhatsApp CTA */}
                        <div className="bg-gradient-to-br from-[#25D366]/10 to-[#128C7E]/10 border border-[#25D366]/20 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />
                            <h4 className="text-white font-bold text-lg mb-2 relative z-10">¿Prefieres WhatsApp?</h4>
                            <p className="text-[#BCAAA4] text-sm mb-4 relative z-10">
                                Únete a nuestro grupo oficial para charlas en tiempo real.
                            </p>
                            <a
                                href="https://chat.whatsapp.com/LXTAuLFydyUBCrvKpgJf03"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#22c55e] transition-colors shadow-[0_0_20px_rgba(37,211,102,0.2)] relative z-10"
                            >
                                Unirse al Grupo
                            </a>
                        </div>

                        {/* Ad Placement */}
                        <AdSidebarSpec />
                    </aside>
                </div>
            </div>
        </main>
    );
}
