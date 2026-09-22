# Deploy en GitHub Pages — dropes-v2

## Setup de una sola vez

```bash
# 1. Crear el repo en GitHub (NO clonar el viejo Dropes)
#    Entra a https://github.com/new
#    Nombre: dropes-v2
#    Visibility: Public (Pages solo funciona en repos públicos con cuenta gratuita)
#    NO inicialices con README

# 2. Desde la carpeta del proyecto:
cd /home/z/my-project/download/dropes-v2

git init
git remote add origin https://github.com/eddyflores100-lang/dropes-v2.git
git checkout -b main
git add .
git commit -m "feat: dropes-v2 initial commit"
git push -u origin main

# 3. Configurar GitHub Pages
#    Repo → Settings → Pages → Build and deployment → Source: GitHub Actions

# 4. Añadir la API key como secret (NO en código)
#    Repo → Settings → Secrets and variables → Actions → New repository secret
#    Name: VITE_DROPEA_API_KEY
#    Value: <tu_api_key_de_Dropea>
#    (repite para VITE_DROPEA_SHOP_ID = 12928)

# 5. ¡Listo! El workflow se ejecuta en cada push a main
```

## URL final

```
https://eddyflores100-lang.github.io/dropes-v2/
```

## Deploy manual (alternativa al workflow)

```bash
# Sin GitHub Actions — solo script local
npm run deploy

# Esto ejecuta:
#   1. npm run build  (tsc + vite build + post-build .nojekyll + 404.html)
#   2. gh-pages -d dist -b gh-pages  (pushea dist/ a la rama gh-pages)
```

Requiere configurar Pages con **Source: Deploy from a branch** → `gh-pages` branch, `/ (root)` folder.

## Verificar que el deploy funcionó

1. Repo → **Actions** → busca el workflow "Deploy to GitHub Pages" → debe estar verde ✅
2. Repo → **Settings → Pages** → verás la URL publicada
3. Visita la URL — debe cargar la home con el catálogo

## Actualizar el sitio (cualquier cambio)

```bash
git add .
git commit -m "fix: lo que hayas cambiado"
git push origin main
# → el Action re-deploya automáticamente en ~1 min
```

## Troubleshooting

### La página sale en blanco / 404
- Verifica que **Source = GitHub Actions** (no "Deploy from a branch")
- Revisa el log del Action: `Actions → Deploy to GitHub Pages → build`
- Comprueba que `VITE_DROPEA_API_KEY` esté configurada como Secret (no commit .env)

### Las imágenes no cargan
- Es normal: las imágenes vienen de `api.dropea.com` que puede tener CORS o estar caído
- Las imágenes locales (favicon, sitemap) sí cargan

### Los estilos se ven rotos
- Verifica que `base: '/dropes-v2/'` esté en `vite.config.ts`
- Si usas otro repo name, actualiza `VITE_REPO_NAME` en `.env`

### El Action falla en "Configure GitHub Pages"
- Ve a Settings → Pages y asegúrate de que **Source = GitHub Actions**
- El Action `configure-pages` habilita Pages automáticamente la primera vez
