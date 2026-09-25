import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
const frontend = fileURLToPath(new URL('./frontend', import.meta.url));
const shared = fileURLToPath(new URL('./shared', import.meta.url));
export default defineConfig({
  root: frontend,
  plugins: [react(), {
    name: 'local-private-paths',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        let pathname: string;
        try { pathname = decodeURIComponent((request.url ?? '/').split('?')[0]).replaceAll('\\', '/'); }
        catch { response.statusCode = 400; response.end('Invalid path'); return; }
        if (/(^|\/)\.(?:env[^/]*|runtime|git)(?:\/|$)/i.test(pathname)) {
          response.statusCode = 403; response.end('Private path'); return;
        }
        next();
      });
    }
  }],
  envDir: false,
  build: { outDir: '../dist', emptyOutDir: true },
  server: {
    port: Number(process.env.AI4TJU_WEB_PORT ?? 5173), strictPort: true,
    host: '127.0.0.1',
    fs: { allow: [frontend, shared], deny: ['**/.env*', '**/.runtime/**'] },
    watch: { ignored: ['**/.venv/**', '**/.tools/**', '**/.runtime/**'] },
    proxy: { '/api': { target: 'http://127.0.0.1:' + (process.env.AI4TJU_API_PORT ?? '8000') } }
  }
});
