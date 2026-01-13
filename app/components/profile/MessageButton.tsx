'use client';

import { startConversation } from "@/app/actions/messages";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function MessageButton({ targetUserId }: { targetUserId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleMessage = async () => {
        setLoading(true);
        try {
            const convoId = await startConversation(targetUserId);
            // Redirect to messages page with active convo
            // Ideally we would pass ?c=ID but my MessagesPage uses state.
            // For now, let's just go to /messages and the user selects it from the list (since it was just created/updated to top)
            // Better: update page.tsx to read searchParam.
            router.push('/messages');
            // Wait a sec then toast
            setTimeout(() => toast.success("Chat abierto"), 500);
        } catch (e: any) {
            if (e.message.includes('Unauthorized')) {
                router.push('/login');
            } else {
                toast.error("Error al abrir chat");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleMessage}
            disabled={loading}
            className="flex items-center gap-2 bg-[#222] hover:bg-[#333] text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors border border-white/10 ml-2"
        >
            <MessageCircle className="w-4 h-4" />
            <span>{loading ? '...' : 'Mensaje'}</span>
        </button>
    );
}
