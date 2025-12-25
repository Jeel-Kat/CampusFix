import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'mapbox': ['mapbox-gl'],
          'date': ['date-fns'],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    headers: {
      // Relax COOP to silence window.closed warnings from Firebase popup flow
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
  },
})
