import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sharedMinersApiPlugin } from './vite-shared-api-plugin.js'

// Dedicated Config for DGMS Central Command Portal on Port 5174
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sharedMinersApiPlugin(),
    {
      name: 'rewrite-root-to-admin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '/index.html') {
            req.url = '/admin.html';
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 5174,
    host: true,
    watch: {
      ignored: ['**/.data/**', '**/miners.json', '**/src/data/miners.json']
    }
  }
})

