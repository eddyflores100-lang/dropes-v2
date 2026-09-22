/**
 * scripts/post-build.ts
 * ------------------------------------------------------------------
 * Post-build hook for GitHub Pages deploy.
 * Adds .nojekyll and 404.html (SPA fallback) to dist/.
 * Called automatically by `npm run deploy`.
 * ------------------------------------------------------------------
 */

import { writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');

if (!existsSync(distDir)) {
  console.error('❌ dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

// .nojekyll — tell GitHub Pages to not run Jekyll, so _assets/ folders work
writeFileSync(resolve(distDir, '.nojekyll'), '');
console.log('✓ Created dist/.nojekyll');

// 404.html — GitHub Pages serves this for any unknown route.
// Copy index.html so client-side routing works.
const indexHtml = resolve(distDir, 'index.html');
if (existsSync(indexHtml)) {
  copyFileSync(indexHtml, resolve(distDir, '404.html'));
  console.log('✓ Created dist/404.html (SPA fallback)');
} else {
  console.warn('⚠ dist/index.html not found — skipping 404.html');
}

console.log('✓ Post-build complete');
