"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartSidebar() {
  const { isCartOpen, toggleCart, items, removeItem, totalPrice } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    toggleCart();
    router.push('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-black/50 backdrop-blur-sm" 
        onClick={toggleCart}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-brand-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300 border-l-4 border-brand-yellow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
          <h2 className="text-2xl font-black tracking-tighter text-brand-black uppercase">Tu Carrito</h2>
          <Button variant="ghost" size="icon" onClick={toggleCart} className="hover:bg-gray-100 rounded-none">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-6">
              <ShoppingBagIcon className="w-16 h-16 opacity-20" />
              <p className="text-lg font-bold uppercase tracking-widest">El carrito está vacío</p>
              <Button variant="outline" onClick={toggleCart} className="rounded-none border-2 border-brand-black text-brand-black font-bold hover:bg-brand-black hover:text-white">
                VOLVER A LA TIENDA
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-24 h-24 bg-gray-50 border border-gray-200 relative flex-shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-brand-black text-lg leading-none mb-1">{item.name}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.category}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-brand-black font-black text-xl">{item.displayPrice}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-gray-500 bg-gray-100 px-2 py-0.5">x{item.quantity}</span>
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-white space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500 font-medium uppercase tracking-wide">
                <span>Subtotal</span>
                <span>${(totalPrice / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-brand-black">
                <span>TOTAL</span>
                <span>${(totalPrice / 100).toFixed(2)}</span>
                </div>
            </div>
            <Button 
              className="w-full bg-brand-yellow text-brand-black hover:bg-brand-black hover:text-brand-yellow h-14 text-xl font-black uppercase tracking-widest rounded-none transition-all border-2 border-brand-yellow hover:border-brand-black"
              onClick={handleCheckout}
            >
              PAGAR AHORA
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}
