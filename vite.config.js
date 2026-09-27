import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sharedMinersApiPlugin } from './vite-shared-api-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sharedMinersApiPlugin()
  ],
  server: {
    watch: {
      ignored: ['**/.data/**', '**/miners.json', '**/src/data/miners.json']
    }
  }
})

