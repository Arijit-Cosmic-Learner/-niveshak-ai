import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Niveshak.AI',
        short_name: 'Niveshak',
        description: 'Aapke sapno ke liye, sahi nivesh',
        theme_color: '#0D0D0D',
        background_color: '#0D0D0D',
        display: 'standalone',
        orientation: 'portrait',
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
        ],
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
    open: true,
  },
});
