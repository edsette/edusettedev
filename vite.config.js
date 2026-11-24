import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/edusettedev/',
  plugins: [react()],
  server: { port: 5503, strictPort: true },
  preview: { port: 5503, strictPort: true },
})
