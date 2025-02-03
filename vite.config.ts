import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // The html2canvas library does not support oklch() color function from tailwind
  // Therefore, we overwirte and use html2canvas-pro instead
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
    proxy: {
      '/backend': {
        target: 'ws://backend:3000',
        ws: true,
        rewrite: path => path.replace(/^\/backend/, '')
      }
    }
  }
})
