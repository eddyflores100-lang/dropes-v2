"use client";

import {
  Smartphone, Home, Sparkles, Dumbbell, UtensilsCrossed, Baby,
} from "lucide-react";
import type { Category } from "@/lib/types";

interface CategoriesProps {
  onSelect: (cat: Category) => void;
}

const CATS: Array<{
  name: Category;
  icon: typeof Smartphone;
  bg: string;
  hover: string;
  iconBg: string;
  count: string;
  rotate: string;
}> = [
  { name: "Tecnología", icon: Smartphone, bg: "bg-blue-100 hover:bg-blue-200", iconBg: "bg-brand-cobalt text-white", count: "42 GADGETS", rotate: "group-hover:rotate-6" },
  { name: "Hogar", icon: Home, bg: "bg-emerald-100 hover:bg-emerald-200", iconBg: "bg-emerald-600 text-white", count: "38 SOLUCIONES", rotate: "group-hover:-rotate-6" },
  { name: "Belleza", icon: Sparkles, bg: "bg-pink-100 hover:bg-pink-200", iconBg: "bg-pink-600 text-white", count: "27 CUIDADOS", rotate: "group-hover:rotate-6" },
  { name: "Deporte", icon: Dumbbell, bg: "bg-amber-100 hover:bg-amber-200", iconBg: "bg-amber-500 text-black", count: "19 ARTÍCULOS", rotate: "group-hover:-rotate-6" },
  { name: "Cocina", icon: UtensilsCrossed, bg: "bg-orange-100 hover:bg-orange-200", iconBg: "bg-orange-600 text-white", count: "31 UTENSILIOS", rotate: "group-hover:rotate-6" },
  { name: "Niños", icon: Baby, bg: "bg-purple-100 hover:bg-purple-200", iconBg: "bg-purple-600 text-white", count: "15 NOVEDADES", rotate: "group-hover:-rotate-6" },
];

export function Categories({ onSelect }: CategoriesProps) {
  return (
    <section className="w-full py-16 bg-brand-cream brutal-border-b" id="categorias">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block bg-brand-black text-brand-yellow font-mono text-xs font-black uppercase px-3 py-1 brutal-border mb-2">
            NAVEGACIÓN POR DEPARTAMENTOS
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-brand-black uppercase tracking-tight">
            EXPLORA POR <span className="bg-brand-yellow px-2">CATEGORÍA.</span>
          </h2>
          <p className="font-body text-base text-gray-700 font-semibold mt-2">
            Encuentra la solución exacta con garantía de devolución y envío express.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATS.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelect(cat.name)}
              className={`${cat.bg} brutal-border p-6 flex flex-col items-center justify-center text-center shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group`}
            >
              <div className={`w-14 h-14 ${cat.iconBg} brutal-border flex items-center justify-center mb-3 shadow-brutal ${cat.rotate} transition-transform`}>
                <cat.icon className="text-3xl font-black" />
              </div>
              <span className="font-display font-black text-lg uppercase text-brand-black">{cat.name}</span>
              <span className="font-mono text-xs font-bold text-gray-700 mt-1">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
