import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://darkslategrey-quetzal-544290.hostingersite.com/',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://darkslategrey-quetzal-544290.hostingersite.com/',
        changeOrigin: true,
      }
    }
  }
})