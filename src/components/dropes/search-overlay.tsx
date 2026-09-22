"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Search, X, ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { parsePrice, formatEuro } from "@/lib/format";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (p: Product) => void;
  products: Product[];
}

export function SearchOverlay({ isOpen, onClose, onOpenProduct, products }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const results = query.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-20 max-w-2xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-3xl border border-border bg-background shadow-2xl">
              <div className="flex items-center gap-3 border-b border-border px-6 py-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar piezas..."
                  className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-clay-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {query.trim() === "" ? (
                <div className="px-6 py-12 text-center">
                  <Search className="mx-auto h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Escribe para buscar en el catálogo
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    Sin resultados para "{query}"
                  </p>
                </div>
              ) : (
                <ul className="max-h-96 overflow-y-auto p-2">
                  {results.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => {
                          onOpenProduct(p);
                          onClose();
                        }}
                        className="flex w-full items-center gap-4 rounded-2xl p-3 text-left transition-colors hover:bg-clay-50"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-clay-50">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            unoptimized
                            referrerPolicy="no-referrer"
                            sizes="56px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {p.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.category} · {formatEuro(parsePrice(p.priceNow))}€
                          </p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
