import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sharedMinersApiPlugin } from './vite-shared-api-plugin.js'

import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sharedMinersApiPlugin()
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        admin: resolve(process.cwd(), 'admin.html')
      }
    }
  },
  server: {
    watch: {
      ignored: ['**/.data/**', '**/miners.json', '**/src/data/miners.json']
    }
  }
})

