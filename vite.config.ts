import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const pwaPlugins = VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['vite.svg', 'pwa-192.png', 'pwa-512.png'],
  manifest: {
    name: 'NewsHub - Your Personalized News',
    short_name: 'NewsHub',
    description: 'A personalized news aggregator with 100+ sources',
    theme_color: '#2563eb',
    background_color: '#f9fafb',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/news-hub/',
    start_url: '/news-hub/',
    icons: [
      { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
    navigateFallback: '/news-hub/index.html',
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 } },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: { cacheName: 'gstatic-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 } },
      },
    ],
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), ...pwaPlugins as PluginOption[]],
  base: '/news-hub/',
})
