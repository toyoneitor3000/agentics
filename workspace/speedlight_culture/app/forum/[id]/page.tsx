import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    Clock,
    Eye,
    MessageCircle,
    PinIcon,
    Flame,
    Share2,
    Flag,
    MoreHorizontal
} from "lucide-react";
import { getForumPost, getPostReplies } from "@/app/actions/forum";
import { FORUM_CATEGORIES } from "@/app/lib/forum-constants";
import ReplySection from "./ReplySection";

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

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

// Loading skeleton for replies
function RepliesSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-white/10 rounded w-1/4" />
                            <div className="h-4 bg-white/5 rounded w-full" />
                            <div className="h-4 bg-white/5 rounded w-3/4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Lista de respuestas
async function RepliesList({ postId }: { postId: string }) {
    const replies = await getPostReplies(postId);

    if (replies.length === 0) {
        return (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
                <MessageCircle className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-white/40">No hay respuestas aún</p>
                <p className="text-white/20 text-sm mt-1">¡Sé el primero en responder!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {replies.map((reply, index) => (
                <div
                    key={reply.id}
                    className="p-4 md:p-5 bg-[#0A0604] border border-white/10 rounded-xl animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className="flex items-start gap-3 md:gap-4">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {reply.author?.avatar_url ? (
                                <Image
                                    src={reply.author.avatar_url}
                                    alt={reply.author?.name || "Usuario"}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white/40 text-sm font-bold">
                                    {(reply.author?.name || "U")[0].toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="text-white font-bold text-sm">
                                    {reply.author?.name || "Usuario"}
                                </span>
                                {reply.author?.role && ["CEO", "ADMIN", "VIP"].includes(reply.author.role) && (
                                    <span className="px-1.5 py-0.5 bg-[#FF9800]/10 text-[#FF9800] text-[9px] font-bold rounded">
                                        {reply.author.role}
                                    </span>
                                )}
                                <span className="text-white/30 text-xs">
                                    {formatTimeAgo(reply.created_at)}
                                </span>
                            </div>
                            <p className="text-[#BCAAA4] text-sm whitespace-pre-wrap">
                                {reply.content}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default async function ForumPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post = await getForumPost(id);

    if (!post) {
        notFound();
    }

    const categoryColor = getCategoryColor(post.category);
    const isHot = (post.replies_count || 0) > 10;

    return (
        <main className="min-h-screen bg-[#0D0805] pt-24 pb-32">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Button */}
                <Link
                    href="/forum"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al foro
                </Link>

                {/* Post Header */}
                <article className="bg-[#0A0604] border border-white/10 rounded-2xl overflow-hidden mb-8">
                    {/* Top Bar */}
                    <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            {post.is_pinned && (
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
                        <div className="flex items-center gap-3 text-xs text-white/30">
                            <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {(post.views_count || 0).toLocaleString()} vistas
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircle className="w-3.5 h-3.5" />
                                {post.replies_count || 0} respuestas
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-black text-white mb-6">
                            {post.title}
                        </h1>

                        {/* Author Info */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                                {post.author?.avatar_url ? (
                                    <Image
                                        src={post.author.avatar_url}
                                        alt={post.author?.name || "Usuario"}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white/40 text-lg font-bold">
                                        {(post.author?.name || "U")[0].toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold">
                                        {post.author?.name || "Usuario"}
                                    </span>
                                    {post.author?.role && ["CEO", "ADMIN", "VIP"].includes(post.author.role) && (
                                        <span className="px-2 py-0.5 bg-[#FF9800]/10 text-[#FF9800] text-[10px] font-bold rounded">
                                            {post.author.role}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-white/40">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(post.created_at)}
                                </div>
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="prose prose-invert max-w-none">
                            <p className="text-[#BCAAA4] text-base leading-relaxed whitespace-pre-wrap">
                                {post.content}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/5">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all text-sm">
                                <Share2 className="w-4 h-4" />
                                Compartir
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm">
                                <Flag className="w-4 h-4" />
                                Reportar
                            </button>
                        </div>
                    </div>
                </article>

                {/* Replies Section */}
                <section>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-[#FF9800]" />
                        Respuestas ({post.replies_count || 0})
                    </h2>

                    <Suspense fallback={<RepliesSkeleton />}>
                        <RepliesList postId={id} />
                    </Suspense>
                </section>

                {/* Reply Form - Fixed at bottom on mobile */}
                <ReplySection postId={id} />
            </div>
        </main>
    );
}
