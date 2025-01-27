import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
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
