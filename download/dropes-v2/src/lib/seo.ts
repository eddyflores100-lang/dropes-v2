/**
 * src/lib/seo.ts
 * ------------------------------------------------------------------
 * Helper to set document.title + meta tags without a framework.
 * Used by individual views when react-helmet-async isn't worth the overhead.
 * ------------------------------------------------------------------
 */

export interface SeoOptions {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name'): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function applySeo(opts: SeoOptions): void {
  document.title = opts.title;
  if (opts.description) {
    setMeta('description', opts.description);
    setMeta('og:description', opts.description, 'property');
    setMeta('twitter:description', opts.description);
  }
  setMeta('og:title', opts.title, 'property');
  setMeta('twitter:title', opts.title);
  if (opts.canonical) {
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = opts.canonical;
  }
  if (opts.image) {
    setMeta('og:image', opts.image, 'property');
    setMeta('twitter:image', opts.image);
  }
}

/** Build the sitemap.xml as a string from the product catalog. */
export function buildSitemap(
  products: Array<{ id: string }>,
  baseUrl = 'https://dropes.example.com'
): string {
  const urls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    ...products.map((p) => ({
      loc: `${baseUrl}/producto/${p.id}`,
      priority: '0.7',
      changefreq: 'weekly',
    })),
  ];
  const today = new Date().toISOString().split('T')[0];
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
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}
