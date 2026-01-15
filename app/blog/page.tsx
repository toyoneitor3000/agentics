"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    BookOpen,
    Calendar,
    Clock,
    User,
    ChevronRight,
    Flame,
    TrendingUp,
    Tag,
    Search,
    Filter
} from "lucide-react";
import { AdSidebarSpec } from "../components/AdBanners";

// Datos de ejemplo del blog
const FEATURED_POST = {
    id: 1,
    slug: "guia-completa-drift-colombia",
    title: "Guía Completa: Cómo Iniciar en el Drift en Colombia",
    excerpt: "Desde los fundamentos técnicos hasta los eventos más importantes. Todo lo que necesitas saber para comenzar tu camino en el mundo del drift colombiano.",
    image: "/icon.png",
    category: "Tutoriales",
    author: "Speedlight Team",
    authorImage: "/icon.png",
    readTime: "12 min",
    publishedAt: "2026-01-10",
    featured: true,
    views: 2847
};

const BLOG_POSTS = [
    {
        id: 2,
        slug: "top-10-carros-drift-2026",
        title: "Top 10: Mejores Autos para Drift en 2026",
        excerpt: "Analizamos los vehículos más populares y efectivos para la disciplina del drift este año.",
        image: "/icon.png",
        category: "Rankings",
        author: "Juan Pérez",
        readTime: "8 min",
        publishedAt: "2026-01-08",
        views: 1523
    },
    {
        id: 3,
        slug: "preparacion-motor-rb26",
        title: "La Preparación Perfecta del Motor RB26",
        excerpt: "Guía técnica para maximizar el rendimiento del legendario motor Nissan RB26DETT.",
        image: "/icon.png",
        category: "Mecánica",
        author: "Carlos Drift",
        readTime: "15 min",
        publishedAt: "2026-01-05",
        views: 987
    },
    {
        id: 4,
        slug: "historia-drift-japon",
        title: "Historia del Drift: Desde las Montañas de Japón",
        excerpt: "Un recorrido por los orígenes del drift y cómo esta disciplina conquistó al mundo.",
        image: "/icon.png",
        category: "Historia",
        author: "Speedlight Team",
        readTime: "10 min",
        publishedAt: "2026-01-02",
        views: 2156
    },
    {
        id: 5,
        slug: "suspension-drift-setup",
        title: "Setup de Suspensión para Drift: Guía Definitiva",
        excerpt: "Configuraciones recomendadas para diferentes estilos de drift y condiciones de pista.",
        image: "/icon.png",
        category: "Tutoriales",
        author: "María García",
        readTime: "14 min",
        publishedAt: "2025-12-28",
        views: 1834
    },
    {
        id: 6,
        slug: "eventos-drift-2026",
        title: "Calendario de Eventos Drift 2026 en Latinoamérica",
        excerpt: "Todas las fechas y ubicaciones de los eventos más importantes de la temporada.",
        image: "/icon.png",
        category: "Eventos",
        author: "Speedlight Team",
        readTime: "6 min",
        publishedAt: "2025-12-25",
        views: 3241
    }
];

const CATEGORIES = [
    { name: "Todos", count: 24 },
    { name: "Tutoriales", count: 8 },
    { name: "Mecánica", count: 6 },
    { name: "Rankings", count: 4 },
    { name: "Historia", count: 3 },
    { name: "Eventos", count: 3 }
];

const TRENDING_TAGS = ["Drift", "RB26", "2JZ", "Silvia S15", "Setup", "Colombia", "Competencias"];

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPosts = BLOG_POSTS.filter(post => {
        const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className="min-h-screen bg-[#0D0805]">
            {/* Hero Section */}
            <div className="relative pt-32 pb-16 px-4 md:px-8 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FF9800]/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-[#FF9800]/5 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#D32F2F]/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF9800]/10 border border-[#FF9800]/30 text-[#FF9800] text-xs font-bold uppercase tracking-widest mb-6">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Blog Speedlight</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black font-oswald italic uppercase tracking-tighter text-white mb-4">
                            ÚLTIMAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9800] via-[#FFEB3B] to-[#FF9800] animate-glow">HISTORIAS</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#BCAAA4] max-w-2xl mx-auto">
                            Tutoriales, guías técnicas, noticias y todo sobre la cultura automotriz que nos apasiona.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#FF9800] transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar artículos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-[#0A0604] border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF9800]/50 focus:shadow-[0_0_20px_rgba(255,152,0,0.1)] transition-all"
                            />
                        </div>
                    </div>

                    {/* Featured Article */}
                    <div className="relative group cursor-pointer mb-16">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF9800]/20 to-[#D32F2F]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-[#0A0604] border border-white/10 rounded-3xl overflow-hidden group-hover:border-[#FF9800]/30 transition-all duration-500">
                            <div className="grid md:grid-cols-2 gap-6 md:gap-0">
                                {/* Image */}
                                <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0604] via-transparent to-transparent z-10 md:hidden" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0604] z-10 hidden md:block" />
                                    <div className="w-full h-full bg-gradient-to-br from-[#FF9800]/20 to-[#D32F2F]/20 flex items-center justify-center">
                                        <Image
                                            src={FEATURED_POST.image}
                                            alt={FEATURED_POST.title}
                                            width={120}
                                            height={120}
                                            className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-60 group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    {/* Featured Badge */}
                                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-[#FF9800] text-black text-xs font-black uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(255,152,0,0.4)]">
                                        <Flame className="w-3.5 h-3.5" />
                                        Destacado
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 md:p-8 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 bg-[#FF9800]/10 text-[#FF9800] text-xs font-bold uppercase tracking-wider rounded-full border border-[#FF9800]/30">
                                            {FEATURED_POST.category}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-white/40 text-xs">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            {FEATURED_POST.views.toLocaleString()} vistas
                                        </span>
                                    </div>

                                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white mb-4 group-hover:text-[#FF9800] transition-colors">
                                        {FEATURED_POST.title}
                                    </h2>

                                    <p className="text-[#BCAAA4] text-base md:text-lg mb-6 line-clamp-3">
                                        {FEATURED_POST.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#FF9800]/10 border border-[#FF9800]/30 flex items-center justify-center overflow-hidden">
                                                <Image
                                                    src={FEATURED_POST.authorImage}
                                                    alt={FEATURED_POST.author}
                                                    width={40}
                                                    height={40}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-bold">{FEATURED_POST.author}</p>
                                                <div className="flex items-center gap-2 text-white/40 text-xs">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(FEATURED_POST.publishedAt)}
                                                    <span className="mx-1">•</span>
                                                    <Clock className="w-3 h-3" />
                                                    {FEATURED_POST.readTime}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="hidden md:flex items-center gap-2 text-[#FF9800] text-sm font-bold uppercase tracking-wider group-hover:gap-4 transition-all">
                                            Leer más
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                <div className="grid lg:grid-cols-[1fr_320px] gap-12">

                    {/* Articles Grid */}
                    <div>
                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${selectedCategory === cat.name
                                            ? 'bg-[#FF9800] text-black shadow-[0_0_20px_rgba(255,152,0,0.3)]'
                                            : 'bg-white/5 text-white/60 border border-white/10 hover:border-[#FF9800]/30 hover:text-[#FF9800]'
                                        }`}
                                >
                                    {cat.name}
                                    <span className="ml-2 opacity-60">({cat.count})</span>
                                </button>
                            ))}
                        </div>

                        {/* Posts Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredPosts.map((post, index) => (
                                <article
                                    key={post.id}
                                    className="group relative bg-[#0A0604] border border-white/10 rounded-2xl overflow-hidden hover:border-[#FF9800]/30 transition-all duration-300 cursor-pointer animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF9800]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Image */}
                                    <div className="relative aspect-[16/10] bg-gradient-to-br from-[#FF9800]/10 to-[#D32F2F]/10 flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            width={80}
                                            height={80}
                                            className="w-16 h-16 object-contain opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-500"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-[#FF9800] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#FF9800]/20">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 relative z-10">
                                        <div className="flex items-center gap-3 mb-3 text-xs text-white/40">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(post.publishedAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {post.readTime}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF9800] transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>

                                        <p className="text-[#BCAAA4] text-sm line-clamp-2 mb-4">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-white/40 text-xs">
                                                <User className="w-3 h-3" />
                                                {post.author}
                                            </span>
                                            <span className="flex items-center gap-1 text-white/30 text-xs">
                                                <TrendingUp className="w-3 h-3" />
                                                {post.views.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* No Results */}
                        {filteredPosts.length === 0 && (
                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                                <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                <p className="text-white/40 text-lg">No se encontraron artículos</p>
                                <p className="text-white/20 text-sm mt-2">Intenta con otra búsqueda o categoría</p>
                            </div>
                        )}

                        {/* Load More */}
                        {filteredPosts.length > 0 && (
                            <div className="text-center mt-12">
                                <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white/60 text-sm font-bold uppercase tracking-wider hover:border-[#FF9800]/30 hover:text-[#FF9800] transition-all">
                                    Cargar más artículos
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {/* Trending Tags */}
                        <div className="bg-[#0A0604] border border-white/10 rounded-2xl p-6">
                            <h4 className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-sm mb-4">
                                <Tag className="w-4 h-4 text-[#FF9800]" />
                                Tags Populares
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {TRENDING_TAGS.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 bg-white/5 text-white/60 text-xs font-medium rounded-full border border-white/5 hover:border-[#FF9800]/30 hover:text-[#FF9800] cursor-pointer transition-all"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Categories Widget */}
                        <div className="bg-[#0A0604] border border-white/10 rounded-2xl p-6">
                            <h4 className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-sm mb-4">
                                <Filter className="w-4 h-4 text-[#FF9800]" />
                                Categorías
                            </h4>
                            <ul className="space-y-2">
                                {CATEGORIES.slice(1).map((cat) => (
                                    <li key={cat.name}>
                                        <button
                                            onClick={() => setSelectedCategory(cat.name)}
                                            className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-[#BCAAA4] hover:text-[#FF9800] hover:bg-white/5 transition-all text-sm"
                                        >
                                            <span>{cat.name}</span>
                                            <span className="text-white/30">{cat.count}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter CTA */}
                        <div className="bg-gradient-to-br from-[#FF9800]/10 to-[#D32F2F]/10 border border-[#FF9800]/20 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9800]/10 rounded-full blur-3xl pointer-events-none" />
                            <h4 className="text-white font-bold text-lg mb-2 relative z-10">¿No te pierdas nada?</h4>
                            <p className="text-[#BCAAA4] text-sm mb-4 relative z-10">
                                Únete a nuestra comunidad en WhatsApp para recibir las últimas noticias.
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
