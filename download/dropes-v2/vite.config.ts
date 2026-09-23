import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// GitHub Pages serves at https://<user>.github.io/<repo>/
// Vite needs `base` to match the repo path so asset URLs resolve correctly.
// Override with VITE_BASE_PATH env var for custom subpaths or root domain.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const repoName = env.VITE_REPO_NAME ?? 'dropes-v2';
  const base = env.VITE_BASE_PATH ?? `/${repoName}/`;

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      'import.meta.env.VITE_DROPEA_API_KEY': JSON.stringify(env.VITE_DROPEA_API_KEY ?? ''),
      'import.meta.env.VITE_DROPEA_SHOP_ID': JSON.stringify(env.VITE_DROPEA_SHOP_ID ?? '12928'),
      'import.meta.env.VITE_PUBLIC_SITE_URL': JSON.stringify(env.VITE_PUBLIC_SITE_URL ?? ''),
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    build: {
      target: 'es2022',
      sourcemap: false,
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'motion-vendor': ['motion'],
          },
        },
      },
    },
  };
});
