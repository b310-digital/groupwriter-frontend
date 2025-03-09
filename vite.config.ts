import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // html2canvas-pro is used instead of html2canvas since it supports tailwind's oklch() color function
  resolve: {
    alias: {
      html2canvas: path.resolve(__dirname, 'node_modules/html2canvas-pro')
    }
  },
  plugins: [react()],
  build: {
    assetsInlineLimit: 0
  },
  server: {
    // Needed for playwright setup within docker compose, so the playwright container can reach the frontend
    allowedHosts: ['editor'],
    proxy: {
      '/backend': {
        target: 'ws://backend:3000',
        ws: true,
        rewrite: path => path.replace(/^\/backend/, '')
      }
    }
  }
})
