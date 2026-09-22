/**
 * scripts/build-sitemap.ts
 * ------------------------------------------------------------------
 * Build /public/sitemap.xml from the product catalog.
 * Run after `npm run sync` to keep the sitemap fresh.
 *
 * Usage: npm exec tsx scripts/build-sitemap.ts
 * ------------------------------------------------------------------
 */

import { writeFileSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const productsPath = resolve(__dirname, '../src/data/products.json');
const outPath = resolve(__dirname, '../public/sitemap.xml');

const baseUrl = process.env.VITE_PUBLIC_SITE_URL ?? 'https://dropes.example.com';

interface Product { id: string; }

const products = JSON.parse(readFileSync(productsPath, 'utf8')) as Product[];
const today = new Date().toISOString().split('T')[0];

const urls = [
  { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
  { loc: `${baseUrl}/#products-section`, priority: '0.9', changefreq: 'daily' },
  { loc: `${baseUrl}/#categorias`, priority: '0.6', changefreq: 'weekly' },
  ...products.map((p) => ({
    loc: `${baseUrl}/producto/${p.id}`,
    priority: '0.7',
    changefreq: 'weekly' as const,
  })),
];

const body = urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(outPath, xml, 'utf8');
console.log(`✅ Sitemap written (${urls.length} URLs) → ${outPath}`);
