"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";

interface CategoriesProps {
  onSelect: (cat: Category) => void;
}

const CATS: Array<{
  name: Category;
  desc: string;
  count: string;
  emoji: string;
}> = [
  { name: "Hogar", desc: "Piezas que transforman tu espacio", count: "109 piezas", emoji: "⌂" },
  { name: "Belleza", desc: "Cuidado y bienestar diario", count: "35 piezas", emoji: "✦" },
  { name: "Tecnología", desc: "Gadgets que facilitan el día", count: "28 piezas", emoji: "◉" },
  { name: "Cocina", desc: "Para cocinar como en casa", count: "13 piezas", emoji: "❋" },
  { name: "Deporte", desc: "Mantente activo, en casa", count: "12 piezas", emoji: "△" },
  { name: "Niños", desc: "Para los más pequeños", count: "3 piezas", emoji: "✿" },
];

export function Categories({ onSelect }: CategoriesProps) {
  return (
    <section id="categorias" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Por categoría
          </p>
          <h2 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
            Encuentra <span className="font-display-italic text-clay-700">tu pieza</span>
          </h2>
        </div>
        <a
          href="#catalogo"
          className="link-underline hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
        >
          Ver todo el catálogo
        </a>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {CATS.map((cat, i) => (
          <motion.button
            key={cat.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            onClick={() => onSelect(cat.name)}
            className="group relative bg-background p-8 text-left transition-colors hover:bg-clay-50"
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl text-clay-400 transition-transform duration-500 group-hover:scale-110">
                {cat.emoji}
              </span>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <h3 className="mt-8 font-display text-2xl text-foreground">
              {cat.name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{cat.desc}</p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {cat.count}
            </p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
