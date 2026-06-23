import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
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
  },
})
