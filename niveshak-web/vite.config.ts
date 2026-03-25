import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable.png'],
      manifest: {
        name: 'Niveshak.AI — Goal-Matched Investment Discovery',
        short_name: 'Niveshak.AI',
        description: 'Aapke sapno ke liye, sahi nivesh \u2014 India\u2019s first goal-matched investment discovery platform.',
        theme_color: '#E07B39',
        background_color: '#FAFAF8',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'en-IN',
        categories: ['finance', 'utilities'],
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icon-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: '/screenshot-landing.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Landing page',
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        // Cache app shell + pages
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Network-first for navigation, stale-while-revalidate for assets
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        // Keep SW enabled in dev so we can test it
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@pages':      path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@store':      path.resolve(__dirname, './src/store'),
      '@i18n':       path.resolve(__dirname, './src/i18n'),
      '@engine':     path.resolve(__dirname, './src/engine'),
      '@data':       path.resolve(__dirname, './src/data'),
      '@lib':        path.resolve(__dirname, './src/lib'),
      '@constants':  path.resolve(__dirname, './src/constants'),
      '@hooks':      path.resolve(__dirname, './src/hooks'),
      '@t':          path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
    host: true,   // binds to 0.0.0.0 so mobile on same Wi-Fi can connect
    open: true,
  },
  build: {
    // Meaningful chunk names, keep bundle lean
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-router')) return 'vendor';
            if (id.includes('zustand')) return 'zustand';
            if (id.includes('i18n-js')) return 'i18n';
          }
        },
      },
    },
  },
});
