"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product } from "./types";

interface CartState {
  items: CartItem[];
  favorites: string[];
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  count: () => number;
  total: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      favorites: [],

      add: (product, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: qty }] };
        }),

      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      setQty: (id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) =>
                  i.id === id ? { ...i, quantity: qty } : i
                ),
        })),

      clear: () => set({ items: [] }),

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),

      isFavorite: (id) => get().favorites.includes(id),

      count: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      total: () =>
        get().items.reduce(
          (acc, i) =>
            acc +
            (parseFloat(i.priceNow.replace(",", ".")) || 0) * i.quantity,
          0
        ),
    }),
    {
      name: "dropes-cart-v3",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
