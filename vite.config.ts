import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

import type { Plugin } from 'vite';

function assistantApiPlugin(): Plugin {
  return {
    name: 'assistant-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/assistant')) {
          const mod = await server.ssrLoadModule('/src/api/assistant/route.ts');
          return mod.assistantMiddleware(req, res, next);
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), assistantApiPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@/core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@/data': fileURLToPath(new URL('./src/data', import.meta.url)),
      '@/api': fileURLToPath(new URL('./src/api', import.meta.url)),
      '@/styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
