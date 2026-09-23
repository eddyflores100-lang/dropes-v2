/**
 * src/hooks/useFavorites.ts
 * ------------------------------------------------------------------
 * Favorites (wishlist) synced with localStorage.
 * ------------------------------------------------------------------
 */

import { useCallback, useEffect, useState } from 'react';
import type { FavoriteSet } from '@/types';
import { loadFavorites, saveFavorites } from '@/lib/storage';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteSet>(() => loadFavorites());

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggle = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const count = favorites.length;

  return { favorites, isFavorite, toggle, count };
}
