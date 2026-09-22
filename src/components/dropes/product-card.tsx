"use client";

import { motion } from "motion/react";
import { Heart, Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { parsePrice, formatEuro, discountPercent } from "@/lib/format";
import { useCart } from "@/lib/cart-store";

interface ProductCardProps {
  product: Product;
  index?: number;
  onOpen: (p: Product) => void;
  variant?: "default" | "feature" | "compact";
}

export function ProductCard({
  product,
  index = 0,
  onOpen,
  variant = "default",
}: ProductCardProps) {
  const add = useCart((s) => s.add);
  const toggleFav = useCart((s) => s.toggleFavorite);
  const isFav = useCart((s) => s.favorites.includes(product.id));

  const price = parsePrice(product.priceNow);
  const was = parsePrice(product.priceWas);
  const discount = discountPercent(product.priceWas, product.priceNow);

  if (variant === "feature") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="group cursor-pointer"
        onClick={() => onOpen(product)}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-clay-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            referrerPolicy="no-referrer"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-8 img-zoom"
          />
          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-foreground px-3 py-1 text-[11px] font-medium text-background">
              −{discount}%
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFav(product.id);
            }}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:scale-110"
            aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isFav ? "fill-clay-500 text-clay-500" : "text-foreground/60"
              )}
            />
          </button>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {product.category}
            </p>
            <h3 className="mt-1.5 font-display text-lg leading-snug text-foreground">
              {product.name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {product.reviews}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-xl text-foreground">
              {formatEuro(price)}€
            </p>
            {was > 0 && (
              <p className="text-sm text-muted-foreground line-through">
                {formatEuro(was)}€
              </p>
            )}
          </div>
        </div>
      </motion.article>
    );
  }

  if (variant === "compact") {
    return (
      <motion.article
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.04 }}
        className="group flex cursor-pointer items-center gap-4"
        onClick={() => onOpen(product)}
      >
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-clay-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            referrerPolicy="no-referrer"
            className="object-contain p-2 img-zoom"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-medium text-foreground">
            {product.name}
          </h4>
          <p className="text-sm text-muted-foreground">
            {formatEuro(price)}€
          </p>
        </div>
      </motion.article>
    );
  }

  // default
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div
        className="relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-clay-50"
        onClick={() => onOpen(product)}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          unoptimized
          referrerPolicy="no-referrer"
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-6 img-zoom"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.tag && (
            <Badge
              variant="secondary"
              className="rounded-full border border-border/60 bg-background/90 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider backdrop-blur"
            >
              {product.tag}
            </Badge>
          )}
          {discount > 0 && (
            <span className="w-fit rounded-full bg-clay-600 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
              −{discount}%
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(product.id);
          }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:scale-110"
          aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isFav ? "fill-clay-500 text-clay-500" : "text-foreground/60"
            )}
          />
        </button>

        <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              add(product);
            }}
            className="w-full rounded-full bg-foreground text-background hover:bg-clay-700"
            size="sm"
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Añadir
          </Button>
        </div>
      </div>

      <div
        className="mt-3 cursor-pointer"
        onClick={() => onOpen(product)}
      >
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {product.category}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm leading-snug text-foreground transition-colors group-hover:text-clay-700">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-medium text-foreground">
            {formatEuro(price)}€
          </span>
          {was > 0 && (
            <span className="text-xs text-muted-foreground line-through">
              {formatEuro(was)}€
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
