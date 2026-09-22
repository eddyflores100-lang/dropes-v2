/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DROPEA_API_KEY: string;
  readonly VITE_DROPEA_SHOP_ID: string;
  readonly VITE_PUBLIC_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
