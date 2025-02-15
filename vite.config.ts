import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Redirige todas las solicitudes que comiencen con /api
      '/api': {
        target: 'https://ecommerceplantilla-back.fileit-contact.workers.dev/api', // La URL de tu backend
        changeOrigin: true, // Necesario para evitar problemas de CORS
        secure: false, // Si tu backend usa HTTPS, cámbialo a true
        rewrite: (path) => path.replace(/^\/api/, ''), // Elimina el prefijo /api
      },
    },
  },
})
