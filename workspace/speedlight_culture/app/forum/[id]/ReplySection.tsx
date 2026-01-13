"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { createReply } from "@/app/actions/forum";
import { useSession } from "@/app/lib/auth-client";
import Link from "next/link";

export default function ReplySection({ postId }: { postId: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setError("");
        setIsSubmitting(true);

        try {
            const result = await createReply(postId, content);

            if (result.success) {
                setContent("");
                router.refresh();
            } else {
                setError(result.error || "Error al publicar la respuesta");
            }
        } catch (err) {
            setError("Error inesperado. Intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!session?.user) {
        return (
            <div className="fixed bottom-0 left-0 right-0 md:relative md:mt-8 bg-[#0A0604] border-t md:border border-white/10 md:rounded-2xl p-4 md:p-6 z-40">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-white/40 text-sm mb-3">
                        Debes iniciar sesión para responder
                    </p>
                    <Link
                        href={`/login?redirect=/forum/${postId}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF9800] text-black font-bold uppercase tracking-wider rounded-xl hover:bg-[#F57C00] transition-colors"
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 md:relative md:mt-8 bg-[#0A0604] border-t md:border border-white/10 md:rounded-2xl p-4 md:p-6 z-40">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                {error && (
                    <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                        rows={2}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF9800]/50 transition-all resize-none text-sm"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className="px-5 py-3 bg-[#FF9800] text-black font-bold rounded-xl hover:bg-[#F57C00] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 self-end"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>

                <p className="text-white/20 text-xs mt-2 hidden md:block">
                    Presiona Enter para agregar líneas • Enviar con el botón
                </p>
            </form>
        </div>
    );
}
