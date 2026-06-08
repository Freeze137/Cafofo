import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração do Vite com o plugin oficial do React (Fast Refresh).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
})
