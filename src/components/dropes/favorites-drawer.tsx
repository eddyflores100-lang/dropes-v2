"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
import { parsePrice, formatEuro } from "@/lib/format";
import productsData from "@/data/products.json";

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (p: Product) => void;
}

const ALL_PRODUCTS = productsData as Product[];

export function FavoritesDrawer({ isOpen, onClose, onOpenProduct }: FavoritesDrawerProps) {
  const favorites = useCart((s) => s.favorites);
  const toggleFav = useCart((s) => s.toggleFavorite);
  const add = useCart((s) => s.add);

  const items = ALL_PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-foreground/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display text-xl">
                Favoritos
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({items.length})
                </span>
              </h2>
              <button
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-clay-50"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-clay-50">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mt-6 font-display text-xl">Sin favoritos aún</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Toca el corazón en cualquier pieza para guardarla aquí.
                </p>
                <Button onClick={onClose} variant="outline" className="mt-6 rounded-full">
                  Explorar catálogo
                </Button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <ul className="space-y-4">
                  {items.map((p) => (
                    <li key={p.id} className="flex gap-4 border-b border-border/60 pb-4">
                      <button
                        onClick={() => {
                          onOpenProduct(p);
                          onClose();
                        }}
                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-clay-50"
                      >
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          unoptimized
                          referrerPolicy="no-referrer"
                          sizes="100px"
                          className="object-contain p-2"
                        />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {p.category}
                        </p>
                        <h3 className="mt-0.5 line-clamp-2 text-sm font-medium">
                          {p.name}
                        </h3>
                        <p className="mt-1 font-medium text-foreground">
                          {formatEuro(parsePrice(p.priceNow))}€
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => add(p)}
                            className="rounded-full bg-foreground text-background hover:bg-clay-700"
                          >
                            <ShoppingBag className="mr-1 h-3 w-3" />
                            Añadir
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleFav(p.id)}
                            className="rounded-full"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
