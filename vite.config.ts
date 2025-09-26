import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
    host: '0.0.0.0',
    hmr: {
      port: 5173,
      host: 'localhost',
      protocol: 'ws'
    },
    cors: {
      origin: false
    },
    proxy: {
      '/backend': {
        target: 'http://backend:3000',
        ws: true,
        rewrite: path => path.replace(/^\/backend/, '')
      }
    }
  },
    // Add optimizeDeps configuration for Vite 7
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'html2canvas-pro'
      ],
      // Force pre-bundling to avoid hanging
      force: true
    },
    
    // Explicitly set esbuild options for better compatibility
    esbuild: {
      jsx: 'automatic'
    }
})
