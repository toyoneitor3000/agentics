"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sticker } from '@/lib/data';

interface CartItem extends Sticker {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (sticker: Sticker) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Inicializar siempre con array vacío para evitar errores de hidratación
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Solo cargar de localStorage en el cliente
  useEffect(() => {
    const savedCart = localStorage.getItem('pigmento-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    // Validamos que no sea el render inicial vacío para no borrar datos existentes
    if (items.length > 0) {
       localStorage.setItem('pigmento-cart', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (sticker: Sticker) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === sticker.id);
      if (existing) {
        return prev.map((item) =>
          item.id === sticker.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...sticker, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ¡IMPORTANTE! Siempre renderizamos el Provider, nunca devolvemos null o fragmento vacío
  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}