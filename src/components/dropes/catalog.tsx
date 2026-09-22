"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product, Category, SortOption } from "@/lib/types";
import { ProductCard } from "./product-card";

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
  { value: "relevant", label: "Relevancia" },
  { value: "price-asc", label: "Precio ↑" },
  { value: "price-desc", label: "Precio ↓" },
  { value: "name", label: "A → Z" },
];

const PER_PAGE = 24;

export function Catalog({ products, onOpen, selectedCategory }: CatalogProps) {
  const [category, setCategory] = useState<Category | "Todas">(
    selectedCategory ?? "Todas"
  );
  const [sort, setSort] = useState<SortOption>("relevant");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];
    if (category !== "Todas") {
      result = result.filter((p) => p.category === category);
    }
    if (sort === "price-asc") {
      result.sort((a, b) => parseFloat(a.priceNow) - parseFloat(b.priceNow));
    } else if (sort === "price-desc") {
      result.sort((a, b) => parseFloat(b.priceNow) - parseFloat(a.priceNow));
    } else if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [products, category, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const displayed = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCategory = (c: Category | "Todas") => {
    setCategory(c);
    setPage(1);
    setShowFilters(false);
  };

  return (
    <section id="catalogo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Catálogo
          </p>
          <h2 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
            {category === "Todas" ? (
              <>
                Todas las <span className="font-display-italic text-clay-700">piezas</span>
              </>
            ) : (
              category
            )}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "pieza" : "piezas"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* mobile filter toggle */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtros
          </Button>

          {/* desktop sort */}
          <div className="relative hidden lg:block">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="appearance-none rounded-full border border-border bg-background py-2 pl-4 pr-10 text-sm font-medium text-foreground outline-none transition-colors hover:bg-clay-50"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Categorías
            </h3>
            <ul className="space-y-1">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => handleCategory(c)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      category === c
                        ? "bg-foreground text-background"
                        : "text-foreground hover:bg-clay-50"
                    )}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Ordenar
              </h3>
              <ul className="space-y-1">
                {SORTS.map((s) => (
                  <li key={s.value}>
                    <button
                      onClick={() => setSort(s.value)}
                      className={cn(
                        "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        sort === s.value
                          ? "font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div>
          {displayed.length === 0 ? (
            <div className="grid place-items-center py-20 text-center">
              <p className="font-display text-2xl text-muted-foreground">
                Sin resultados
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Prueba con otra categoría.
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
            >
              {displayed.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  onOpen={onOpen}
                />
              ))}
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-full text-sm transition-colors",
                      page === i + 1
                        ? "bg-foreground text-background"
                        : "text-foreground hover:bg-clay-50"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                {totalPages > 7 && (
                  <>
                    <span className="px-1 text-muted-foreground">…</span>
                    <button
                      onClick={() => setPage(totalPages)}
                      className="grid h-9 w-9 place-items-center rounded-full text-sm hover:bg-clay-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-background p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-xl">Filtros</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-clay-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h4 className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Categorías
            </h4>
            <div className="mb-6 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCategory(c)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    category === c
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground hover:bg-clay-50"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <h4 className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Ordenar
            </h4>
            <div className="flex flex-wrap gap-2">
              {SORTS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSort(s.value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    sort === s.value
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground hover:bg-clay-50"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <Button
              className="mt-8 w-full justify-center"
              onClick={() => setShowFilters(false)}
            >
              Ver {filtered.length} piezas
            </Button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
