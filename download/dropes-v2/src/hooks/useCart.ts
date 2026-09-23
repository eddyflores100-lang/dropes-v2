/**
 * src/hooks/useCart.ts
 * ------------------------------------------------------------------
 * Cart state synced with localStorage.
 * ------------------------------------------------------------------
 */

import { useCallback, useEffect, useState } from 'react';
import type { CartItem, Product } from '@/types';
import { loadCart, saveCart } from '@/lib/storage';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => loadCart());

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.id !== id)
        : prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setCart([]), []);

  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  return { cart, addItem, updateQuantity, removeItem, clear, count };
}
