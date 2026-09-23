"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, ShoppingBag, Truck, Shield, RotateCcw, Minus, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { parsePrice, formatEuro, discountPercent } from "@/lib/format";
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
  }, [product]);

  if (!product) return null;

  const price = parsePrice(product.priceNow);
  const was = parsePrice(product.priceWas);
  const discount = discountPercent(product.priceWas, product.priceNow);
  const related = ALL_PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-brand-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto my-4 max-w-5xl bg-brand-cream brutal-border shadow-brutal-xl sm:my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 w-10 h-10 bg-brand-purewhite brutal-border flex items-center justify-center shadow-brutal hover:bg-brand-yellow transition-colors"
              aria-label="Cerrar"
            >
              <X />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative aspect-square bg-brand-purewhite brutal-border-r overflow-hidden">
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
                  <span className="absolute top-4 left-4 bg-brand-red text-white font-mono font-black text-xs px-3 py-1 brutal-border">
                    -{discount}% DTO
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-6 sm:p-8 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  {product.tag && (
                    <span className="bg-brand-red text-white font-mono font-black text-[10px] px-2 py-1 brutal-border uppercase">
                      {product.tag}
                    </span>
                  )}
                  <span className="font-mono text-[10px] font-bold uppercase bg-brand-yellow text-black px-2 py-1 brutal-border">
                    {product.category}
                  </span>
                </div>

                <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-brand-black leading-tight">
                  {product.name}
                </h1>

                <div className="mt-3 flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-600">
                    {product.stars} · {product.reviews}
                  </span>
                </div>

                <div className="mt-6 flex items-baseline gap-3">
                  <span className="font-display font-black text-4xl text-brand-black">
                    {formatEuro(price * qty)}€
                  </span>
                  {was > 0 && (
                    <span className="font-mono text-base text-gray-500 line-through">
                      {formatEuro(was * qty)}€
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="font-mono text-xs font-black bg-brand-yellow text-black px-2 py-0.5 brutal-border">
                      AHORRO {formatEuro((was - price) * qty)}€
                    </span>
                  )}
                </div>

                <p className="mt-6 font-body text-sm text-gray-700 leading-relaxed">
                  {product.description || "Pieza de la curaduría DROPES con garantía oficial de 3 años. Diseñada y fabricada con materiales premium. Incluye todos los accesorios necesarios para un uso inmediato, con envío gratis en 24-48h a toda la península."}
                </p>

                {/* Quantity */}
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center brutal-border bg-brand-purewhite shadow-brutal">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-brand-yellow transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-mono font-black text-lg">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-brand-yellow transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-mono text-xs font-bold uppercase text-gray-600">
                    Subtotal: {formatEuro(price * qty)}€
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => {
                      add(product, qty);
                      onClose();
                    }}
                    className="flex-1 bg-brand-red hover:bg-brand-black text-brand-purewhite brutal-border py-4 font-headline font-black text-sm uppercase tracking-wider shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    AÑADIR AL PEDIDO
                  </button>
                  <button
                    onClick={() => toggleFav(product.id)}
                    className={`w-14 brutal-border flex items-center justify-center shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all ${
                      isFav ? "bg-brand-red text-white" : "bg-brand-purewhite"
                    }`}
                  >
                    <Heart className={isFav ? "fill-white" : ""} />
                  </button>
                </div>

                {/* Trust */}
                <div className="mt-6 grid grid-cols-3 gap-2 pt-6 border-t-2 border-brand-black">
                  {[
                    { icon: Truck, label: "ENVÍO 24/48H" },
                    { icon: Shield, label: "PAGO SEGURO" },
                    { icon: RotateCcw, label: "30 DÍAS" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center text-center">
                      <Icon className="text-brand-red text-xl" />
                      <span className="font-mono text-[10px] font-bold uppercase mt-1">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="brutal-border-t p-6 sm:p-8 bg-brand-cream">
                <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-4">
                  TAMBIÉN TE PUEDE GUSTAR
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {related.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onOpenProduct(p)}
                      className="bg-brand-purewhite brutal-border p-3 shadow-brutal hover:shadow-brutal-lg hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-left"
                    >
                      <div className="relative aspect-square overflow-hidden brutal-border bg-brand-cream mb-2">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          unoptimized
                          referrerPolicy="no-referrer"
                          sizes="150px"
                          className="object-contain p-2"
                        />
                      </div>
                      <h3 className="font-headline font-black text-xs uppercase line-clamp-2 text-brand-black">
                        {p.name}
                      </h3>
                      <p className="font-display font-black text-sm text-brand-red mt-1">
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
