"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Sticker } from "@/lib/data";
import { Plus } from "lucide-react";

export default function AddToCartBtn({ sticker }: { sticker: Sticker }) {
  const { addItem } = useCart();

  return (
    <Button 
      size="lg" 
      className="w-full h-16 text-xl bg-brand-black hover:bg-brand-yellow hover:text-brand-black text-white font-black uppercase tracking-widest rounded-none border-2 border-transparent hover:border-brand-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
      onClick={() => addItem(sticker)}
    >
      <Plus className="w-6 h-6 mr-2" strokeWidth={3} />
      Agregar al Carrito
    </Button>
  );
}
