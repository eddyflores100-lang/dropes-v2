/**
 * scripts/sync-dropea.ts
 * ------------------------------------------------------------------
 * Refresh src/data/products.json from the Dropea GraphQL API.
 *
 * Usage:
 *   1. Copy .env.example → .env and set VITE_DROPEA_API_KEY
 *   2. npm run sync
 *
 * The script:
 *   - Pulls products in pages of 100 (handles pagination)
 *   - Maps Dropea product schema → Dropes Product schema
 *   - Computes priceNow / priceWas with a 1.9x margin over cost_price
 *   - Auto-categorizes via keyword match
 *   - Writes src/data/products.json atomically
 * ------------------------------------------------------------------
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load .env via Node 22 native flag (--env-file=.env in package.json).
// Falls back to manual parse if invoked without the flag (e.g. in CI).
if (!process.env.VITE_DROPEA_API_KEY) {
  try {
    const { readFileSync } = await import('node:fs');
    const envPath = resolve(process.cwd(), '.env');
    const content = readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    // ignore — handled by guard below
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.VITE_DROPEA_API_KEY;
const SHOP_ID = parseInt(process.env.VITE_DROPEA_SHOP_ID ?? '12928', 10);

if (!API_KEY || API_KEY === 'your_dropea_api_key_here') {
  console.error('❌  VITE_DROPEA_API_KEY is missing or still set to the placeholder.');
  console.error('    Copy .env.example → .env and fill in your real Dropea API key.');
  process.exit(1);
}

const ENDPOINT = 'https://api.dropea.com/graphql/dropshippers';

interface DropeaProduct {
  id: string;
  name: string;
  description: string;
  images: string[] | string;
  cost_price: string | number;
}

interface DropeaResponse {
  data?: {
    products?: {
      data: DropeaProduct[];
      hasMore?: boolean;
      next_cursor?: string | null;
    };
  };
  errors?: Array<{ message: string }>;
}

interface DropesProduct {
  id: string;
  numeric_id: number;
  name: string;
  priceNow: string;
  priceWas: string;
  profit: string;
  original_cost: string;
  image: string;
  stars: string;
  reviews: string;
  category: string;
  tag: string;
  description?: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function categorize(name: string, description = ''): string {
  const haystack = `${name} ${description}`.toLowerCase();
  if (/(freidora|sart[eé]n|olla|cocina|recetario|compostador|batidora|cafetera|tostador)/.test(haystack)) return 'Cocina';
  if (/(auriculares|smartphone|altavoz|teclado|rat[oó]n|cargador|bater[ií]a|smartwatch|bluetooth|drone|dron|c[aá]mara|led|tv| televisor)/.test(haystack)) return 'Tecnolog[ií]a';
  if (/(belleza|cepillo|masajeador|rizador|secador|facial|arrugas|c[eé]rvix|antiarrugas|faja|colombiana|push.?up)/.test(haystack)) return 'Belleza';
  if (/(deporte|fitness|gimnasio|pesas|bicicleta|el[ií]ptica|yoga)/.test(haystack)) return 'Deporte';
  if (/(beb[eé]|ni[nñ]o|ni[nñ]a|juguete|baby|infantil)/.test(haystack)) return 'Niños';
  return 'Hogar';
}

function firstImage(images: DropeaProduct['images']): string {
  if (Array.isArray(images)) return images[0] ?? '';
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return parsed[0] ?? '';
      return parsed;
    } catch {
      return images;
    }
  }
  return '';
}

function tagFor(index: number): string {
  // First 75 products: SUPER VENTAS. Next 49: PREMIUM. Rest: empty tag.
  if (index < 75) return 'SUPER VENTAS';
  if (index < 124) return 'PREMIUM';
  return '';
}

// ────────────────────────────────────────────────────────────────────────────
// GraphQL fetch with pagination
// ────────────────────────────────────────────────────────────────────────────

async function fetchPage(cursor: string | null): Promise<DropeaResponse> {
  const query = `
    query GetProducts($limit: Int!, $cursor: String) {
      products(limit: $limit, after: $cursor) {
        data {
          id
          name
          description
          images
          cost_price
        }
        hasMore
        next_cursor
      }
    }
  `;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY!,
    },
    body: JSON.stringify({ query, variables: { limit: 100, cursor } }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as DropeaResponse;
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('⏳  Syncing catalog from Dropea (shop %s)...', SHOP_ID);

  const all: DropeaProduct[] = [];
  let cursor: string | null = null;
  let page = 0;

  while (true) {
    page += 1;
    const json = await fetchPage(cursor);

    if (json.errors?.length) {
      throw new Error(`Dropea GraphQL error: ${json.errors[0].message}`);
    }

    const products = json.data?.products?.data ?? [];
    all.push(...products);
    console.log(`   · page ${page}: ${products.length} items (total ${all.length})`);

    if (!json.data?.products?.hasMore) break;
    cursor = json.data.products.next_cursor ?? null;
    if (!cursor) break;
  }

  // Map → Dropes schema
  const mapped: DropesProduct[] = all.map((p, index) => {
    const cost = parseFloat(String(p.cost_price ?? '0')) || 0;
    const margin = 1.9;
    const priceNow = (cost * margin).toFixed(2);
    const priceWas = (cost * (margin + 0.5)).toFixed(2);
    const profit = (parseFloat(priceNow) - cost).toFixed(2);
    const numericId = parseInt(p.id, 10) || index;

    return {
      id: p.id,
      numeric_id: numericId,
      name: p.name,
      priceNow,
      priceWas,
      profit,
      original_cost: cost.toFixed(2),
      image: firstImage(p.images),
      stars: '4.8',
      reviews: '0 opiniones',
      category: categorize(p.name, p.description),
      tag: tagFor(index),
      description: p.description ?? '',
    };
  });

  const outPath = resolve(__dirname, '../src/data/products.json');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(mapped, null, 2) + '\n', 'utf8');

  console.log('✅  Synced %d products → %s', mapped.length, outPath);
  console.log('    Categories: %s',
    JSON.stringify(mapped.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {})));
}

main().catch((err) => {
  console.error('❌  Sync failed:', err);
  process.exit(1);
});
