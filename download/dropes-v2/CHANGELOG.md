# Changelog

All notable changes to **Dropes v2** are documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.0.0] — 2026-09-22

### Added

- **Strict TypeScript** types shared across the codebase: `Product`, `CartItem`, `Customer`, `OrderRequest`, `OrderRecord`, `LocalUser`, `GraphQLResponse`, `SortOption`, `FavoriteSet`. (`src/types/index.ts`)
- **Typed storage layer** (`src/lib/storage.ts`) with single-source-of-truth key names: `dropes:cart`, `dropes:favorites`, `dropes:user`, `dropes:orders`, `dropes:seen_upsell`.
- **Cart hook** (`src/hooks/useCart.ts`) — state + localStorage sync, no more prop drilling.
- **Favorites hook** (`src/hooks/useFavorites.ts`) — wishlist now actually works (was a no-op in v1).
- **Auth hook** (`src/hooks/useAuth.ts`) — email-only local "magic" sign-in with cross-tab sync.
- **Orders hook** (`src/hooks/useOrders.ts`) — local order history (last 50).
- **Dropea client** (`src/lib/dropea.ts`) — typed GraphQL wrapper that reads the API key from `import.meta.env.VITE_DROPEA_API_KEY` instead of being hardcoded.
- **SEO helper** (`src/lib/seo.ts`) — `applySeo()` to set title/meta/canonical from any view, and `buildSitemap()` generator.
- **Format helpers** (`src/lib/format.ts`) — `parsePrice`, `formatEuro`, `subtotal`, `discountPercent` (i18n-aware ES locale).
- **Sync script** (`scripts/sync-dropea.ts`) — paginated catalog sync (handles `hasMore` + `next_cursor`), auto-categorization via keyword match, atomic write. Loads env via Node 22 native `--env-file` flag.
- **Sitemap generator** (`scripts/build-sitemap.ts`) — emits `public/sitemap.xml` with one URL per product.
- **`LoginModal`** — sign-in flow + signed-in view with last 5 orders + sign-out.
- **`FavoritesDrawer`** — side drawer showing saved items with quick "add to cart" / "remove".
- **`SearchOverlay`** — full-screen search with live results (top 6 matches).
- **`WhyUs`**, **`PaymentMethods`** — new content sections replacing inline markup.
- **`robots.txt`** + **`sitemap.xml`** in `public/`.
- **SEO meta tags** + **structured data** (OnlineStore schema) in `index.html`.
- **Inter + Sora** Google Fonts wired up via `index.html` `<link>` preconnect.
- **`.env.example`** with clear comments and a SECURITY NOTE explaining the VITE_ prefix gotcha.
- **`MIGRATION.md`** with step-by-step upgrade from the original Dropes repo.

### Changed

- **`framer-motion` → `motion/react`**. The v1 `package.json` declared `motion` (the new package name), but all 9 component files imported from `"framer-motion"` — a broken combination that only worked because the lockfile still had the old `framer-motion` entry. All imports now use `motion/react` consistently.
- **Design refresh**: switched from heavy black-on-zinc with `italic` everything to a lighter Apple/Stripe-inspired aesthetic — Inter for body, Sora for headings, soft mesh gradient backgrounds, glassmorphism navbar, gradient accent buttons. Reduced `tracking-tighter`/`italic` overuse.
- **Navbar** is now glassmorphic, sticky, with a favorites counter badge and avatar when signed in. Mobile drawer works (was a no-op in v1).
- **CheckoutModal** now requires a real email (was hardcoded to `cliente@tienda.com`), validates Spanish phone format (`^[679]\d{8}$`), validates Spanish ZIP (`^\d{5}$`).
- **ProductDetail** heart button now actually toggles favorites instead of doing nothing.
- **BestSellers** product cards: heart icon toggles favorites (filled when favorited), search/sort bar moved into a single glass container.
- **`tsconfig.json`** — enabled `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`, `forceConsistentCasingInFileNames`. Path alias `@/*` → `src/*`.
- **`vite.config.ts`** — explicitly define only `VITE_DROPEA_API_KEY` and `VITE_DROPEA_SHOP_ID`; manual chunk splitting for `react-vendor` and `motion-vendor`; build target bumped to `es2022`.
- **`package.json`**:
  - `name`: `react-example` → `dropes-v2`
  - `version`: `0.0.0` → `2.0.0`
  - Added `description`, `lint`, `sync`, `sitemap` scripts
  - Removed `@google/genai`, `axios`, `better-sqlite3`, `express`, `firebase`, `react-helmet-async` (didn't support React 19), `autoprefixer` (built into Tailwind 4), `dotenv` (using Node 22 native `--env-file`)
  - Added `@types/react`, `@types/react-dom`

### Removed

- **`firebase.ts`** — initialized Realtime Database but nothing imported it.
- **`firebase.json`**, **`database.rules.json`** — Firebase hosting config (the project deploys as a static SPA; use Vercel / Netlify / Cloudflare Pages instead).
- **`@google/genai`** — Google Gemini SDK, never imported.
- **`axios`** — replaced by native `fetch` in the Dropea client.
- **`better-sqlite3`**, **`express`** — server-side deps with no usage in the frontend.
- **`vite.config.ts`'s `define`** entry for `process.env.GEMINI_API_KEY` — vestigial AI Studio cruft.
- **All temp / one-off files**: `temp_args.json`, `temp_fields.json`, `temp_queries.json`, `temp_query.js`, `sync_out.txt`, `sync_log.txt`, `input_types.json`, `mutation.json`, `metadata.json`, `introspect.cjs`, `introspect_product_input.cjs`, `fetch_200.js`, `check_product_ids.cjs`, `get_shops.cjs`, `get_countries.cjs`, `database.rules.json`. All either moved into a single `scripts/sync-dropea.ts` or removed entirely.
- **`.env.example`** entries for `GEMINI_API_KEY` and `APP_URL` — leftover from AI Studio scaffolding.

### Fixed

- **Broken build**: v1's mismatched `motion` package + `framer-motion` imports would have failed on a fresh `npm install`. v2 uses `motion/react` consistently and builds cleanly.
- **API key exposure**: Dropea API key was hardcoded in 11 files (4 frontend, 7 scripts). Now read exclusively from `import.meta.env.VITE_DROPEA_API_KEY` (frontend) or `process.env.VITE_DROPEA_API_KEY` (sync script).
- **Fake email bug**: `CheckoutModal` defaulted `email` to `"cliente@tienda.com"` and never asked the customer. This silently sent Dropea a fake customer record for every order. Now a required validated field.
- **Wishlist no-op**: the heart buttons in `BestSellers` and `ProductDetail` had no `onClick` handler. Now wired to `useFavorites`.

### Security

- **API key handling**: documented in `.env.example` that VITE_* env vars are inlined into the client bundle and visible in devtools. Added SECURITY NOTE pointing to the recommended serverless proxy / Next.js migration path (see `MIGRATION.md`).
- **`.gitignore`**: now covers `.env*`, `temp_*.json`, `sync_*.txt`, `input_types.json`, `mutation.json`, `metadata.json`, `.firebase/`, `firebase-debug.log`.

## [1.0.0] — 2026-09-15

Initial public release from AI Studio scaffold. See original [`Dropes`](https://github.com/eddyflores100-lang/Dropes) repository for v1 source.
