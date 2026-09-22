"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, Heart, ShoppingBag, Truck, Shield, RotateCcw, Minus, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { parsePrice, formatEuro, discountPercent, relatedProducts } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import productsData from "@/data/products.json";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenProduct: (p: Product) => void;
}

const ALL_PRODUCTS = productsData as Product[];

export function ProductModal({ product, onClose, onOpenProduct }: ProductModalProps) {
  const add = useCart((s) => s.add);
  const toggleFav = useCart((s) => s.toggleFavorite);
  const isFav = useCart((s) => (product ? s.favorites.includes(product.id) : false));
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      setQty(1);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product, setQty]);

  if (!product) return null;

  const price = parsePrice(product.priceNow);
  const was = parsePrice(product.priceWas);
  const discount = discountPercent(product.priceWas, product.priceNow);
  const related = relatedProducts(ALL_PRODUCTS, product, 4);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-background/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto my-4 min-h-[calc(100vh-2rem)] max-w-6xl rounded-3xl border border-border bg-background shadow-2xl sm:my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-clay-50"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 gap-8 p-4 sm:p-6 md:grid-cols-2 md:gap-10 md:p-10">
              {/* Image */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-clay-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  unoptimized
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-10"
                />
                {discount > 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-clay-600 px-3 py-1 text-[11px] font-medium text-white">
                    −{discount}%
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="rounded-full text-[10px] uppercase tracking-wider">
                    {product.category}
                  </Badge>
                  {product.tag && (
                    <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-wider">
                      {product.tag}
                    </Badge>
                  )}
                </div>

                <h1 className="mt-4 font-display text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
                  {product.name}
                </h1>

                <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="text-clay-600">★ {product.stars}</span>
                  <span>·</span>
                  <span>{product.reviews}</span>
                </div>

                <div className="mt-6 flex items-baseline gap-3">
                  <span className="font-display text-4xl text-foreground">
                    {formatEuro(price * qty)}€
                  </span>
                  {was > 0 && (
                    <span className="text-base text-muted-foreground line-through">
                      {formatEuro(was * qty)}€
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="rounded-full bg-clay-100 px-2 py-0.5 text-[11px] font-medium text-clay-700">
                      Ahorras {formatEuro((was - price) * qty)}€
                    </span>
                  )}
                </div>

                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  {product.description ||
                    "Pieza de la curaduría Dropes, con garantía oficial de 2 años. Diseñada para durar yfabricada con materiales premium. Incluye todos los accesorios necesarios para un uso inmediato, con envío gratis en 24-48h a toda la península."}
                </p>

                {/* Quantity + actions */}
                <div className="mt-8 flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="grid h-10 w-10 place-items-center text-foreground hover:bg-clay-50"
                        aria-label="Restar"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-medium tabular-nums">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(qty + 1)}
                        className="grid h-10 w-10 place-items-center text-foreground hover:bg-clay-50"
                        aria-label="Sumar"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Subtotal: {formatEuro(price * qty)}€
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        add(product, qty);
                        onClose();
                      }}
                      className="flex-1 justify-center rounded-full bg-foreground text-background hover:bg-clay-700"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Añadir al carrito
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toggleFav(product.id)}
                      className="rounded-full"
                      aria-label="Favorito"
                    >
                      <Heart className={cn("h-4 w-4", isFav && "fill-clay-500 text-clay-500")} />
                    </Button>
                  </div>
                </div>

                {/* Trust */}
                <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6">
                  {[
                    { icon: Truck, label: "Envío 24-48h" },
                    { icon: Shield, label: "Pago seguro" },
                    { icon: RotateCcw, label: "30 días" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center text-center">
                      <Icon className="h-5 w-5 text-clay-600" />
                      <span className="mt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="border-t border-border p-6 sm:p-10">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-display text-2xl">También te puede gustar</h2>
                  <button
                    onClick={onClose}
                    className="link-underline hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
                  >
                    Seguir explorando
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                  {related.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onOpenProduct(p)}
                      className="group text-left"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-clay-50">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          unoptimized
                          referrerPolicy="no-referrer"
                          sizes="200px"
                          className="object-contain p-4 img-zoom"
                        />
                      </div>
                      <h3 className="mt-2 line-clamp-1 text-sm text-foreground group-hover:text-clay-700">
                        {p.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatEuro(parsePrice(p.priceNow))}€
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

