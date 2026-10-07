import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        // In Docker Compose, 'backend' resolves via the service name.
        // For local (non-Docker) dev, set BACKEND_URL=http://localhost:4000
        target: process.env.BACKEND_URL || 'http://backend:4000',
        changeOrigin: true,
      },
    },
  },
})
