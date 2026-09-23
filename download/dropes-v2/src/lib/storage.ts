/**
 * src/lib/storage.ts
 * ------------------------------------------------------------------
 * Typed localStorage helpers. Single source of truth for all keys.
 * ------------------------------------------------------------------
 */

import type { CartItem, FavoriteSet, LocalUser, OrderRecord } from '@/types';

const KEYS = {
  cart: 'dropes:cart',
  favorites: 'dropes:favorites',
  user: 'dropes:user',
  orders: 'dropes:orders',
  seenUpsell: 'dropes:seen_upsell',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode — silently ignore */
  }
}

// Cart ────────────────────────────────────────────────────────────────────────
export const loadCart = (): CartItem[] => read<CartItem[]>(KEYS.cart, []);
export const saveCart = (cart: CartItem[]): void => write(KEYS.cart, cart);

// Favorites ──────────────────────────────────────────────────────────────────
export const loadFavorites = (): FavoriteSet => read<FavoriteSet>(KEYS.favorites, []);
export const saveFavorites = (ids: FavoriteSet): void => write(KEYS.favorites, ids);

// User ────────────────────────────────────────────────────────────────────────
export const loadUser = (): LocalUser | null => read<LocalUser | null>(KEYS.user, null);
export const saveUser = (user: LocalUser | null): void => write(KEYS.user, user);

// Orders ──────────────────────────────────────────────────────────────────────
export const loadOrders = (): OrderRecord[] => read<OrderRecord[]>(KEYS.orders, []);
export const saveOrders = (orders: OrderRecord[]): void => write(KEYS.orders, orders);

// Upsell flag (per session) ──────────────────────────────────────────────────
export const hasSeenUpsell = (): boolean => read<boolean>(KEYS.seenUpsell, false);
export const markUpsellSeen = (): void => write(KEYS.seenUpsell, true);

// Misc ────────────────────────────────────────────────────────────────────────
export const STORAGE_KEYS = KEYS;
