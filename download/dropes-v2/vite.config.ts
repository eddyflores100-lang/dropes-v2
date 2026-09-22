import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      // Expose only VITE_ prefixed env vars to the client.
      // The Dropea API key is intentionally exposed (public-facing dropship API);
      // for a true production setup, proxy via a serverless function.
      'import.meta.env.VITE_DROPEA_API_KEY': JSON.stringify(env.VITE_DROPEA_API_KEY ?? ''),
      'import.meta.env.VITE_DROPEA_SHOP_ID': JSON.stringify(env.VITE_DROPEA_SHOP_ID ?? '12928'),
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    build: {
      target: 'es2022',
      sourcemap: false,
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
