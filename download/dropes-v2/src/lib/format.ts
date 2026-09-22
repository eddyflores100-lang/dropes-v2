/**
 * src/lib/format.ts
 * ------------------------------------------------------------------
 * Currency / number formatters used across the UI.
 * ------------------------------------------------------------------
 */

export function parsePrice(value: string | number): number {
  const n = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export function formatEuro(value: number): string {
  return value.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function subtotal(items: Array<{ priceNow: string; quantity: number }>): number {
  return items.reduce((sum, i) => sum + parsePrice(i.priceNow) * i.quantity, 0);
}

export function discountPercent(priceWas: string, priceNow: string): number {
  const was = parsePrice(priceWas);
  const now = parsePrice(priceNow);
  if (was <= 0 || now <= 0 || now >= was) return 0;
  return Math.round((1 - now / was) * 100);
}
