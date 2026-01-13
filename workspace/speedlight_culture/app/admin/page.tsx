'use client';

import { useState, useEffect } from "react";
import { getCommits, publishNews, deleteNews, getNews, Commit } from "@/app/actions/news";
import { Loader2, GitCommit, Send, CheckCircle, AlertCircle, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
    const [commits, setCommits] = useState<Commit[]>([]);
    const [publishedNews, setPublishedNews] = useState<any[]>([]); // New state for existing news
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState<string | null>(null); // Hash of commit being published
    const [deleting, setDeleting] = useState<string | null>(null); // ID of news being deleted

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [commitsData, newsData] = await Promise.all([
            getCommits(),
            getNews()
        ]);
        setCommits(commitsData);
        setPublishedNews(newsData);
        setLoading(false);
    };

    const handlePublish = async (commit: Commit) => {
        setPublishing(commit.hash);
        try {
            const res = await publishNews({
                title: commit.message,
                content: `${commit.message}`, // Clean content without author or hash
                category: 'update',
                commit_hash: commit.hash
            });

            if (res.success) {
                toast.success("Publicado en Speedlight News correctamente");
                loadData(); // Refresh list to show newly published item (if we were showing it)
            } else {
                toast.error(`Error al publicar: ${res.error}`);
            }
        } catch (error: any) {
            toast.error(`Fallo inesperado: ${error.message}`);
        } finally {
            setPublishing(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de querer eliminar esta noticia? Se borrarán también las notificaciones asociadas.")) return;

        setDeleting(id);
        try {
            const res = await deleteNews(id);
            if (res.success) {
                toast.success("Noticia eliminada correctamente");
                // Optimistic Update
                setPublishedNews(prev => prev.filter(n => n.id !== id));
            } else {
                toast.error(`Error al eliminar: ${res.error}`);
            }
        } catch (error: any) {
            toast.error(`Error inesperado: ${error.message}`);
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">CONTROL DE MISION</h1>
                <p className="text-white/40 font-mono text-sm mb-6">gestión de actualizaciones y despliegue</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <a href="/admin/users" className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#FF9800]/50 transition-all group">
                        <div className="text-xs text-white/40 uppercase tracking-widest mb-1 group-hover:text-[#FF9800]">Pilotos Activos</div>
                        <div className="text-xl font-bold text-white">Directorio</div>
                    </a>
                    {/* Add other summary cards if needed, but keeping it clean for now */}
                </div>
            </header>

            {/* Commit Center */}
            <section className="bg-[#0F0A08] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <GitCommit className="text-[#FF9800]" />
                    <h2 className="text-xl font-bold uppercase tracking-wide text-white">Centro de Notificaciones de Commits</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-white/20 w-8 h-8" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {commits.length === 0 ? (
                            <p className="text-white/30 italic text-center py-8">No hay commits recientes disponibles.</p>
                        ) : (
                            commits.map((commit) => (
                                <div key={commit.hash} className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#FF9800]/30 transition-all">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono text-xs text-[#FF9800] bg-[#FF9800]/10 px-2 py-0.5 rounded">
                                                {commit.hash.substring(0, 7)}
                                            </span>
                                            <span className="text-xs text-white/40">{commit.date}</span>
                                            <span className="text-xs text-white/30">by {commit.author}</span>
                                        </div>
                                        <p className="text-white font-medium text-sm md:text-base">{commit.message}</p>
                                    </div>

                                    <button
                                        onClick={() => handlePublish(commit)}
                                        disabled={publishing === commit.hash}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-[#FF9800] hover:text-black text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                    >
                                        {publishing === commit.hash ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        {publishing === commit.hash ? "Publicando..." : "Publicar en News"}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </section>

            {/* Published News Section */}
            <section className="bg-[#0F0A08] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Zap className="text-[#FF9800]" />
                    <h2 className="text-xl font-bold uppercase tracking-wide text-white">Publicaciones Activas</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-white/20 w-8 h-8" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {publishedNews.length === 0 ? (
                            <p className="text-white/30 italic text-center py-8">No hay noticias publicadas.</p>
                        ) : (
                            publishedNews.map((news) => (
                                <div key={news.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-all group">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs text-white/40 font-mono">
                                                {new Date(news.published_at).toLocaleDateString()}
                                            </span>
                                            {news.commit_hash && (
                                                <span className="font-mono text-xs text-[#FF9800]/50 px-2 py-0.5 rounded border border-[#FF9800]/20">
                                                    {news.commit_hash.substring(0, 7)}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-white font-bold text-base md:text-lg mb-1">{news.title}</h3>
                                        <p className="text-white/50 text-xs md:text-sm line-clamp-1">{news.content}</p>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(news.id)}
                                        disabled={deleting === news.id}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-900/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 text-xs font-bold uppercase tracking-wider rounded-lg transition-all disabled:opacity-50 shrink-0"
                                    >
                                        {deleting === news.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        {deleting === news.id ? "Eliminando..." : "Eliminar"}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
