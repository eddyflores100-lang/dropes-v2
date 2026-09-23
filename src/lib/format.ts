import type { Product } from "./types";

export function parsePrice(value: string | number): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const n = parseFloat(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export function formatEuro(value: number): string {
  return value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function subtotal(items: Array<{ priceNow: string; quantity: number }>): number {
  return items.reduce((acc, i) => acc + parsePrice(i.priceNow) * i.quantity, 0);
}

export function discountPercent(priceWas: string, priceNow: string): number {
  const was = parsePrice(priceWas);
  const now = parsePrice(priceNow);
  if (was <= 0 || now <= 0 || now >= was) return 0;
  return Math.round((1 - now / was) * 100);
}

/** Top N products by reviews count (proxy for popularity). */
export function topProducts(products: Product[], n: number): Product[] {
  return [...products]
    .sort((a, b) => parsePrice(b.profit) - parsePrice(a.profit))
    .slice(0, n);
}

export function relatedProducts(products: Product[], current: Product, n = 4): Product[] {
  return products
    .filter((p) => p.id !== current.id && p.category === current.category)
    .slice(0, n);
}
