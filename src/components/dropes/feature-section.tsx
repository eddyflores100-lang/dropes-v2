"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

interface FeatureSectionProps {
  products: Product[];
  onOpen: (p: Product) => void;
}

export function FeatureSection({ products, onOpen }: FeatureSectionProps) {
  if (products.length < 2) return null;
  const [main, ...rest] = products;

  return (
    <section id="novedades" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Piezas destacadas
          </p>
          <h2 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
            Lo <span className="font-display-italic text-clay-700">mejor</span> de esta semana
          </h2>
        </div>
        <a
          href="#catalogo"
          className="link-underline hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
        >
          Ver todo
        </a>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Big feature card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductCard product={main} index={0} onOpen={onOpen} variant="feature" />
        </motion.div>

        {/* Side cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {rest.slice(0, 2).map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i + 1}
              onOpen={onOpen}
              variant="feature"
            />
          ))}
        </div>
      </div>

      {/* Editorial quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-24 border-y border-border py-16 text-center"
      >
        <p className="mx-auto max-w-3xl font-display text-2xl leading-snug tracking-tight text-foreground sm:text-3xl">
          <span className="font-display-italic text-clay-700">"</span>
          No vendemos cosas. Vendemos piezas que merecen quedarse contigo años,
          no meses. Cada una pasa por un proceso de curaduría que prioriza
          materiales, función y durabilidad sobre la tendencia.
          <span className="font-display-italic text-clay-700">"</span>
        </p>
        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          — Equipo de curaduría Dropes
        </p>
      </motion.div>
    </section>
  );
}
