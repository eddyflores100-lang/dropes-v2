/**
 * FavoritesDrawer.tsx — Side drawer showing saved wishlist items.
 */
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import productsData from '@/data/products.json';
import type { Product } from '@/types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onBuy: (p: Product) => void;
  onProductClick: (p: Product) => void;
}

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favorites,
  onToggleFavorite,
  onBuy,
  onProductClick,
}: FavoritesDrawerProps) {
  const items = (productsData as Product[]).filter((p) => favorites.includes(p.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-ink-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-ink-100">
              <h3 className="text-xl font-black text-ink-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                <Heart className="w-5 h-5 text-brand-600 fill-brand-600" />
                Favoritos
                {items.length > 0 && <span className="text-sm text-ink-400">({items.length})</span>}
              </h3>
              <button onClick={onClose} className="p-2 rounded-full bg-ink-100 hover:bg-ink-200 transition-colors" aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-20 text-ink-400 flex flex-col items-center">
                  <div className="w-20 h-20 bg-ink-50 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-10 h-10 text-ink-200" />
                  </div>
                  <p className="font-bold text-ink-300">Tu lista de favoritos está vacía</p>
                  <p className="text-sm text-ink-400 mt-1">Toca el corazón en cualquier producto para guardarlo aquí.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((p) => (
                    <div key={p.id} className="flex gap-3 items-center bg-ink-50 rounded-2xl p-3">
                      <button
                        onClick={() => { onProductClick(p); onClose(); }}
                        className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-ink-100 p-1 shrink-0"
                      >
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-ink-900 text-sm truncate">{p.name}</div>
                        <div className="text-brand-600 font-black">{p.priceNow}€</div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => onBuy(p)}
                          className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                          aria-label="Añadir al carrito"
                          title="Añadir al carrito"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleFavorite(p.id)}
                          className="p-2 bg-white border border-ink-200 text-ink-500 hover:text-brand-600 hover:border-brand-300 rounded-lg transition-colors"
                          aria-label="Quitar"
                          title="Quitar de favoritos"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
