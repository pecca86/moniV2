import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev config for running FE locally with hot reload against k3s backend.
// Usage: npm run dev:k8s
// Assumes k3s cluster is running (k8s-dev-local) with backend accessible at localhost:8080 via Traefik ingress.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/actuator': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
