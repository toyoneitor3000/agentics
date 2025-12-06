"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

export default function CartButton() {
  const { totalItems, toggleCart } = useCart();

  return (
    <Button 
      variant="default" 
      onClick={toggleCart}
      className="bg-brand-black hover:bg-brand-yellow hover:text-brand-black text-brand-white font-bold transition-all duration-300 border-2 border-transparent hover:border-brand-black"
    >
      <ShoppingBag className="w-4 h-4 md:mr-2" />
      <span className="hidden md:inline">CARRITO</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-brand-yellow text-brand-black text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-brand-white shadow-sm">
          {totalItems}
        </span>
      )}
    </Button>
  );
}
