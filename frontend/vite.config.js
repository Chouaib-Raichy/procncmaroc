import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'remove-unused-preloads',
      transformIndexHtml(html) {
        return html.replace(/<link rel="modulepreload"[^>]*vendor-animations[^>]*>\n\s*/g, '');
      },
    },
    {
      name: 'async-css',
      transformIndexHtml(html) {
        return html.replace(
          /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/,
          `<link rel="preload" as="style" href="$1" onload="this.onload=null;this.rel='stylesheet'">\n    <noscript><link rel="stylesheet" crossorigin href="$1"></noscript>`
        );
      },
    },
  ],
  appType: 'spa',
  server: { port: 3000 },
  build: {
    chunkSizeWarningLimit: 600,
    sourcemap: false,
    cssCodeSplit: true,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          // framer-motion NOT listed here — all pages using it are lazy-loaded,
          // so it will be automatically code-split without a separate eager chunk.
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) return 'vendor-maps';
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) return 'vendor-router';
          if (id.includes('node_modules/react-helmet-async')) return 'vendor-meta';
        },
      },
    },
  },
})
