"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Send,
    Loader2,
    MessageSquare,
    Wrench,
    CarFront,
    Calendar,
    ShoppingBag,
    HelpCircle
} from "lucide-react";
import { createForumPost } from "@/app/actions/forum";
import { FORUM_CATEGORIES } from "@/app/lib/forum-constants";

const CATEGORY_ICONS: Record<string, any> = {
    general: MessageSquare,
    mecanica: Wrench,
    proyectos: CarFront,
    eventos: Calendar,
    marketplace: ShoppingBag,
    ayuda: HelpCircle,
};

export default function NewForumPostPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const result = await createForumPost({ title, content, category });

            if (result.success && result.postId) {
                router.push(`/forum/${result.postId}`);
            } else {
                setError(result.error || "Error al crear el post");
            }
        } catch (err) {
            setError("Error inesperado. Intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedCategory = FORUM_CATEGORIES.find(c => c.id === category);

    return (
        <main className="min-h-screen bg-[#0D0805] pt-24 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/forum"
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                            Nuevo Tema
                        </h1>
                        <p className="text-white/40 text-sm">Comparte con la comunidad</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Category Selection */}
                    <div>
                        <label className="block text-white/60 text-sm font-bold uppercase tracking-wider mb-3">
                            Categoría *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {FORUM_CATEGORIES.map((cat) => {
                                const Icon = CATEGORY_ICONS[cat.id] || MessageSquare;
                                const isSelected = category === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        className={`p-4 rounded-xl border transition-all text-left ${isSelected
                                            ? 'border-[#FF9800]/50 bg-[#FF9800]/10 shadow-[0_0_20px_rgba(255,152,0,0.1)]'
                                            : 'border-white/10 bg-[#0A0604] hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                style={{
                                                    backgroundColor: isSelected ? cat.color : `${cat.color}20`,
                                                    color: isSelected ? '#000' : cat.color
                                                }}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-white/60'}`}>
                                                {cat.name}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-white/60 text-sm font-bold uppercase tracking-wider mb-3">
                            Título *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="¿Cuál es el tema de tu discusión?"
                            className="w-full px-4 py-4 bg-[#0A0604] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF9800]/50 transition-all"
                            maxLength={200}
                        />
                        <p className="text-white/30 text-xs mt-2">{title.length}/200 caracteres</p>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-white/60 text-sm font-bold uppercase tracking-wider mb-3">
                            Contenido *
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Describe tu tema en detalle. Mientras más contexto des, mejores respuestas recibirás..."
                            rows={10}
                            className="w-full px-4 py-4 bg-[#0A0604] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF9800]/50 transition-all resize-none"
                        />
                        <p className="text-white/30 text-xs mt-2">{content.length} caracteres (mínimo 10)</p>
                    </div>

                    {/* Preview */}
                    {(title || content) && (
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Vista previa</p>
                            <div className="flex items-center gap-2 mb-2">
                                {selectedCategory && (
                                    <span
                                        className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded"
                                        style={{ backgroundColor: `${selectedCategory.color}20`, color: selectedCategory.color }}
                                    >
                                        {selectedCategory.name}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-white font-bold mb-2">{title || "Sin título"}</h3>
                            <p className="text-white/60 text-sm whitespace-pre-wrap">{content || "Sin contenido"}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex gap-4">
                        <Link
                            href="/forum"
                            className="px-6 py-4 bg-white/5 border border-white/10 text-white/60 font-bold uppercase tracking-wider rounded-xl hover:bg-white/10 transition-all"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim() || !content.trim() || !category}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#FF9800] text-black font-bold uppercase tracking-wider rounded-xl hover:bg-[#F57C00] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(255,152,0,0.2)]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Publicando...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Publicar Tema
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
