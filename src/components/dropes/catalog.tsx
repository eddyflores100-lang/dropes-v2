"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Filter, ChevronDown } from "lucide-react";
import type { Product, Category, SortOption } from "@/lib/types";
import { parsePrice, formatEuro, discountPercent } from "@/lib/format";
import { useCart } from "@/lib/cart-store";

interface CatalogProps {
  products: Product[];
  onOpen: (p: Product) => void;
  selectedCategory?: Category | null;
}

const CATEGORIES: Array<Category | "Todas"> = [
  "Todas",
  "Hogar",
  "Belleza",
  "Tecnología",
  "Cocina",
  "Deporte",
  "Niños",
];

const SORTS: Array<{ value: SortOption; label: string }> = [
  { value: "relevant", label: "POPULARIDAD EN ESPAÑA" },
  { value: "price-asc", label: "PRECIO ↑" },
  { value: "price-desc", label: "PRECIO ↓" },
  { value: "name", label: "A → Z" },
];

const PER_PAGE = 12;

const TAG_COLORS: Record<string, string> = {
  "TOP VENTAS": "bg-brand-red text-white",
  "SUPER VENTAS": "bg-brand-yellow text-black",
  PREMIUM: "bg-brand-black text-white",
  INNOVACIÓN: "bg-brand-red text-white",
  "CINE EN CASA": "bg-brand-yellow text-black",
};

const TAG2_COLORS: Record<string, string> = {
  PREMIUM: "bg-brand-black text-white",
  "COCINA PRO": "bg-brand-yellow text-black border border-black",
  "BLUETOOTH 5.3": "bg-brand-cobalt text-white",
  "ECO-TECH": "bg-emerald-600 text-white",
  CONFORT: "bg-brand-black text-white",
  SEGURIDAD: "bg-brand-red text-white",
  DESCANSO: "bg-brand-black text-white",
  "HD WIRELESS": "bg-brand-cobalt text-white",
};

function ProductCardBrutal({
  product,
  onOpen,
  onBuy,
  index,
}: {
  product: Product;
  onOpen: (p: Product) => void;
  onBuy: (p: Product) => void;
  index: number;
}) {
  const [added, setAdded] = useState(false);
  const price = parsePrice(product.priceNow);
  const was = parsePrice(product.priceWas);
  const discount = discountPercent(product.priceWas, product.priceNow);
  const tagColor = TAG_COLORS[product.tag] || "bg-brand-red text-white";
  const tag2Color = (product.tag2 && TAG2_COLORS[product.tag2]) || "bg-brand-black text-white";

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuy(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-brand-cream brutal-border p-4 shadow-brutal hover:shadow-brutal-lg transition-all flex flex-col justify-between group">
      <div>
        <div
          className="relative aspect-square w-full brutal-border bg-white overflow-hidden mb-3 cursor-pointer"
          onClick={() => onOpen(product)}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            referrerPolicy="no-referrer"
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.tag && (
            <span className={`absolute top-2 left-2 ${tagColor} font-mono font-black text-[10px] px-2 py-0.5 brutal-border uppercase`}>
              {product.tag}
            </span>
          )}
          {product.tag2 && (
            <span className={`absolute top-2 right-2 ${tag2Color} font-mono font-bold text-[10px] px-2 py-0.5`}>
              {product.tag2}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-amber-500 mb-1 font-mono text-xs font-bold">
          <span>★★★★★</span>
          <span className="text-gray-500 text-[11px]">({product.reviews.replace("opiniones", "REVIEWS")})</span>
        </div>

        <h3 className="font-headline font-black text-base uppercase text-brand-black line-clamp-2 leading-tight cursor-pointer" onClick={() => onOpen(product)}>
          {product.name}
        </h3>
      </div>

      <div className="pt-4 mt-auto">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-display font-black text-2xl text-brand-black">{formatEuro(price)}€</span>
          {was > 0 && <span className="font-mono text-xs text-gray-500 line-through">{formatEuro(was)}€</span>}
          {discount > 0 && (
            <span className="font-mono text-[10px] font-black bg-brand-yellow px-1 border border-black">-{discount}%</span>
          )}
        </div>
        <button
          onClick={handleBuy}
          className={`w-full ${added ? "bg-emerald-600" : "bg-brand-black hover:bg-brand-red"} text-white brutal-border py-2.5 font-headline font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors`}
        >
          {added ? (
            <>✓ ¡AÑADIDO AL PEDIDO!</>
          ) : (
            <>
              <ShoppingBag className="text-base" />
              <span>PEDIR CONTRA REEMBOLSO</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function Catalog({ products, onOpen, selectedCategory }: CatalogProps) {
  const [category, setCategory] = useState<Category | "Todas">(selectedCategory ?? "Todas");
  const [sort, setSort] = useState<SortOption>("relevant");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const add = useCart((s) => s.add);

  const filtered = useMemo(() => {
    let result = [...products];
    if (category !== "Todas") {
      result = result.filter((p) => p.category === category);
    }
    if (sort === "price-asc") result.sort((a, b) => parseFloat(a.priceNow) - parseFloat(b.priceNow));
    else if (sort === "price-desc") result.sort((a, b) => parseFloat(b.priceNow) - parseFloat(a.priceNow));
    else if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, category, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const displayed = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <section className="w-full py-16 bg-brand-purewhite brutal-border-b" id="catalogo">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-yellow font-mono text-xs font-black uppercase px-3 py-1 brutal-border mb-3">
              <span>CATÁLOGO OFICIAL 2026</span>
              <span>•</span>
              <span>LOS MÁS DESEADOS</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-brand-black uppercase tracking-tight leading-none">
              LOS MÁS VENDIDOS <span className="text-brand-red italic">DEL MES.</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden font-mono text-xs font-bold uppercase bg-brand-cream brutal-border px-3 py-2 shadow-brutal flex items-center gap-2"
            >
              <Filter className="text-sm" />
              FILTROS
            </button>
            <div className="hidden lg:flex items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase bg-brand-cream brutal-border px-3 py-2">
                ORDENADO POR: {SORTS.find((s) => s.value === sort)?.label}
              </span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none bg-brand-purewhite brutal-border px-3 py-2 pr-8 font-mono text-xs font-bold uppercase shadow-brutal focus:outline-none cursor-pointer"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={`shrink-0 font-mono text-xs font-black uppercase px-4 py-2 brutal-border transition-all ${
                category === c
                  ? "bg-brand-red text-brand-purewhite shadow-brutal"
                  : "bg-brand-cream text-brand-black hover:bg-brand-yellow"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Mobile filters */}
        {showFilters && (
          <div className="lg:hidden mb-8 p-4 bg-brand-cream brutal-border shadow-brutal space-y-3">
            <div>
              <p className="font-mono text-xs font-black uppercase mb-2">ORDENAR POR:</p>
              <div className="flex flex-wrap gap-2">
                {SORTS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSort(s.value)}
                    className={`font-mono text-xs font-bold uppercase px-3 py-1.5 brutal-border ${
                      sort === s.value ? "bg-brand-black text-white" : "bg-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {displayed.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display font-black text-3xl text-brand-black uppercase">Sin resultados</p>
            <p className="font-mono text-sm text-gray-600 mt-2">Prueba con otra categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayed.map((p, i) => (
              <ProductCardBrutal
                key={p.id}
                product={p}
                onOpen={onOpen}
                onBuy={(prod) => add(prod)}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="font-mono text-xs font-black uppercase px-4 py-2 brutal-border bg-brand-cream shadow-brutal disabled:opacity-40 hover:bg-brand-yellow transition-colors"
            >
              ← ANTERIOR
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 font-mono text-xs font-black brutal-border ${
                    page === i + 1
                      ? "bg-brand-red text-white shadow-brutal"
                      : "bg-brand-cream hover:bg-brand-yellow"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="font-mono text-xs font-black uppercase px-4 py-2 brutal-border bg-brand-cream shadow-brutal disabled:opacity-40 hover:bg-brand-yellow transition-colors"
            >
              SIGUIENTE →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
