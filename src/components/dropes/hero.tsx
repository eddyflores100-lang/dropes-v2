"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ArrowUpRight, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { parsePrice, formatEuro, discountPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

interface HeroProps {
  products: Product[];
  onProductClick: (p: Product) => void;
}

export function Hero({ products, onProductClick }: HeroProps) {
  const slides = products.slice(0, 3);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((p) => (p + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [slides.length]);

  const active = slides[index];
  if (!active) return null;

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-background pt-16">
      {/* Background grain */}
      <div className="grain absolute inset-0 opacity-50" />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl grid-cols-1 gap-8 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-16">
        {/* Left: editorial text */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex items-center gap-2 self-start rounded-full border border-border bg-background/60 px-3 py-1.5 backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-clay-600" />
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Colección {new Date().getFullYear()}
            </span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tight text-foreground">
                Objetos
                <br />
                <span className="font-display-italic text-clay-700">
                  que duran.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                Curaduría de piezas premium para el hogar, la belleza y la
                tecnología. Envío gratis en 24-48h, contra reembolso o tarjeta.
                30 días para devolver sin preguntas.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onProductClick(active)}
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-all hover:bg-clay-700 hover:shadow-xl hover:shadow-clay-700/10"
                >
                  Ver pieza destacada
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <a
                  href="#catalogo"
                  className="link-underline text-sm font-medium text-foreground"
                >
                  Explorar catálogo
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* slide indicators */}
          <div className="mt-12 flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="group flex items-center gap-2"
                aria-label={`Slide ${i + 1}`}
              >
                <span
                  className={cn(
                    "h-px transition-all",
                    i === index ? "w-12 bg-foreground" : "w-6 bg-border group-hover:bg-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] tabular-nums",
                    i === index ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  0{i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: product showcase */}
        <div className="relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] w-full max-w-md cursor-pointer lg:max-w-lg"
            onClick={() => onProductClick(active)}
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-clay-100/60 blur-2xl" />

            <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] border border-border/60 bg-clay-50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={active.image}
                    alt={active.name}
                    fill
                    unoptimized
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-10"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* price tag floating */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between rounded-2xl border border-border/60 bg-background/90 p-4 backdrop-blur">
                <div className="min-w-0">
                  <p className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {active.category}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                    {active.name.split(" ").slice(0, 4).join(" ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg text-foreground">
                    {formatEuro(parsePrice(active.priceNow))}€
                  </p>
                  {discountPercent(active.priceWas, active.priceNow) > 0 && (
                    <p className="text-[11px] text-clay-600">
                      −{discountPercent(active.priceWas, active.priceNow)}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* shipping bar */}
      <div className="relative border-t border-border/60 bg-clay-50/40 py-3">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" />
            Envío gratis 24-48h
          </span>
          <span className="hidden sm:inline">·</span>
          <span>Contra reembolso disponible</span>
          <span className="hidden sm:inline">·</span>
          <span>30 días devolución</span>
          <span className="hidden sm:inline">·</span>
          <span>Garantía oficial 2 años</span>
        </div>
      </div>
    </section>
  );
}
