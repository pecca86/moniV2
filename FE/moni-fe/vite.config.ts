import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
//     '/api/moni/': {
//         target: 'http://<container-idn>:8080',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api\/moni/, '/api/moni')
//         secure: false,
    }
  }
})


