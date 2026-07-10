import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const searchApiTarget = env.SEARCH_API_TARGET || 'https://api.datamuse.com';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/search-api': {
          target: searchApiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/search-api/, ''),
        },
      },
    },
    test: {
      environment: 'jsdom',
    },
  };
});
