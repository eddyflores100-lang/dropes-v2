# Migration Guide — Dropes v1 → v2

This document walks you through every step needed to adopt **Dropes v2** starting from the original `Dropes` repo at <https://github.com/eddyflores100-lang/Dropes>.

## TL;DR

```bash
# 1. Pull the new project
cd /home/z/my-project/download/dropes-v2

# 2. Copy your existing catalog (or skip if you'll re-sync from Dropea)
cp /path/to/old/Dropes/src/data/products.json src/data/products.json

# 3. Configure environment
cp .env.example .env
# Edit .env:
#   VITE_DROPEA_API_KEY="..."      ← your real Dropea API key
#   VITE_DROPEA_SHOP_ID="12928"    ← your Dropea shop id
#   VITE_PUBLIC_SITE_URL="https://your-domain.com"

# 4. Install & run
npm install
npm run dev          # → http://localhost:3000
```

If everything looks good, refresh the catalog from Dropea and rebuild the sitemap:

```bash
npm run sync         # pulls latest catalog from Dropea
npm run sitemap      # regenerates public/sitemap.xml
npm run build        # production build → dist/
```

---

## What's different and why

| Area                  | v1 (Dropes)                                  | v2 (Dropes)                                                    |
| --------------------- | -------------------------------------------- | -------------------------------------------------------------- |
| Build                 | Vite 6 + React 19                            | Same — but `tsc --noEmit` runs before `vite build`             |
| Motion library        | `package.json` has `motion` but imports say `framer-motion` (broken) | `motion` package + `motion/react` import path (consistent)     |
| TypeScript            | `any` everywhere, `strict` not enforced      | `strict` + `noUnusedLocals` + `noUnusedParameters` enabled     |
| API key handling      | Hardcoded in 11 files                        | Read from `import.meta.env.VITE_DROPEA_API_KEY`                |
| Cart / favorites      | In-memory only, favorites no-op              | `useCart` / `useFavorites` hooks + localStorage persistence    |
| Auth                  | None                                         | `useAuth` local email-only magic auth + cross-tab sync         |
| Order history         | None (just fires-and-forgets the API call)   | `useOrders` persists last 50 orders locally                    |
| Email in checkout     | Hardcoded `cliente@tienda.com`               | Required, validated, persisted                                 |
| Catalog refresh       | Manual `sync.ts` run, dumps to JSON          | `npm run sync` script with pagination + auto-categorization   |
| SEO                   | None                                         | `index.html` meta + structured data, `robots.txt`, sitemap.xml |
| Firebase              | Configured but unused                        | Removed                                                        |
| Unused deps           | 5 unused packages (`firebase`, `axios`, etc.) | Removed                                                        |
| Temp / junk files     | 14 files (temp_*.json, sync_*.txt, etc.)      | Removed / consolidated into `scripts/sync-dropea.ts`           |

---

## Step-by-step migration

### Step 1 — Provision the new project

You already have v2 in `/home/z/my-project/download/dropes-v2/`. Either continue there or copy it to your preferred location:

```bash
cp -r /home/z/my-project/download/dropes-v2 /path/to/your/workspace/
cd /path/to/your/workspace/dropes-v2
```

### Step 2 — Rotate the Dropea API key

Because the v1 key was published to a public GitHub repo, treat it as compromised:

1. Sign in to your Dropea dropshipper dashboard.
2. Revoke the leaked key.
3. Generate a new one.
4. Save it locally — you'll paste it into `.env` next.

### Step 3 — Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```bash
VITE_DROPEA_API_KEY="your_new_dropea_api_key"
VITE_DROPEA_SHOP_ID="12928"
VITE_PUBLIC_SITE_URL="https://your-production-domain.com"
```

> ⚠️ **Security note**: `VITE_*` variables are inlined into the browser bundle. Anyone can extract the Dropea key from the built JavaScript. For a fully secure setup, see [§ Next-level: serverless proxy](#next-level-serverless-proxy) below.

### Step 4 — Migrate the catalog

**Option A — Keep your existing 200-product catalog (fast, recommended for now):**

```bash
cp /path/to/old/Dropes/src/data/products.json src/data/products.json
```

**Option B — Re-sync from Dropea (fresh data, requires the API to be back online):**

As of 2026-09-22, Dropea's GraphQL API returns:

```json
{
  "errors": [{
    "message": "Estamos migrando dropea a la nueva versión (v2). La API GraphQL está temporalmente deshabilitada.",
    "extensions": { "code": "MAINTENANCE_V2_MIGRATION" }
  }]
}
```

Once the API is back, run:

```bash
npm run sync
```

The script paginates through `products(limit: 100, after: $cursor)` and writes `src/data/products.json` atomically. After syncing, regenerate the sitemap:

```bash
npm run sitemap
```

### Step 5 — Install and run

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Verify:

- [ ] Home loads with the refreshed design
- [ ] Hero carousel rotates every 6s
- [ ] Clicking a product opens `ProductDetail` (fullscreen)
- [ ] Heart icon on a product card adds it to favorites
- [ ] Click the heart icon in navbar → `FavoritesDrawer` opens with saved items
- [ ] Click the user icon → `LoginModal` opens
- [ ] Sign in with a fake email → name appears in navbar
- [ ] Add items to cart → cart badge updates
- [ ] Click cart → `CheckoutModal` opens
- [ ] Fill the form with an invalid email → see validation error
- [ ] Submit → goes to "success" step (the actual Dropea call will fail until the API is back, but the UI flow works)
- [ ] After checkout, sign in via `LoginModal` → your order appears in history

### Step 6 — Build for production

```bash
npm run build
```

Output goes to `dist/`. Deploy to any static host:

- **Vercel**: `vercel --prod` (set env vars in the dashboard)
- **Netlify**: `netlify deploy --prod --dir=dist`
- **Cloudflare Pages**: `wrangler pages deploy dist`
- **Firebase Hosting** (if you really want to keep it): `firebase deploy --only hosting`

### Step 7 — Submit sitemap to Google

1. Deploy to production.
2. Visit <https://search.google.com/search-console> and add your property.
3. Submit `https://your-domain.com/sitemap.xml`.
4. Update `public/robots.txt` with your real domain.

---

## Next-level: serverless proxy

To fully hide the Dropea API key from the browser, move the `createOrder` call to a serverless function. The frontend should call your own endpoint instead of `api.dropea.com`.

### Option 1 — Vercel Edge Function (`api/order.ts`)

```ts
// api/order.ts (Vercel)
export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await req.json();
  const res = await fetch('https://api.dropea.com/graphql/dropshippers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.DROPEA_API_KEY!, // server-only env var, no VITE_ prefix
    },
    body: JSON.stringify(body),
  });

  // Add per-IP rate limiting here (e.g. Upstash Redis)
  return new Response(res.body, { status: res.status });
}
```

Update `src/lib/dropea.ts` to call `/api/order` instead of `api.dropea.com`. Now the real key only lives on the server.

### Option 2 — Migrate to Next.js 16

If you want SSR + API routes + Prisma + server components, the migration is straightforward because all the React components are framework-agnostic. See `README.md` for the Next.js option in the original clarifying questions.

---

## FAQ

### I'm getting "VITE_DROPEA_API_KEY no configurada"

You didn't copy `.env.example` to `.env`, or the file is empty. Run `cp .env.example .env` and fill in the real values.

### The Dropea API returns `MAINTENANCE_V2_MIGRATION`

Dropea is migrating to v2 of their API. The current GraphQL endpoint is temporarily disabled. You can:

- **Wait it out** — the v2 API may use a different schema. You'll likely need to update the GraphQL queries in `src/lib/dropea.ts` and `scripts/sync-dropea.ts`.
- **Keep using v1 catalog** — your `products.json` snapshot still works for browsing. The checkout button will error, but the UI is fully functional.

### Can I keep Firebase Hosting?

Yes — the `dist/` folder is plain static files. Add this `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

Then `firebase deploy --only hosting`. The reason v2 doesn't ship `firebase.json` by default is that most modern deploys use Vercel/Netlify which auto-configure SPA fallback.

### How do I customize the design?

All design tokens are in `src/index.css` under the `@theme` block. Change `--color-brand-600` to adjust the primary red, or swap `--font-display` to change the heading font. The `glass` and `mesh-bg` utilities are also defined there.

### How do I add a new product?

You don't add products directly — they come from Dropea. Run `npm run sync` periodically to refresh prices and stock.

---

## Rollback plan

If v2 has issues and you need to revert to v1:

1. `cd /path/to/v1/Dropes`
2. `git checkout ac94b30` (last v1 commit)
3. `npm install`
4. `npm run dev`

v1 still works (with all its warts). Just remember: the API key in v1 is the **leaked** one — rotate it before relying on v1 in production.
