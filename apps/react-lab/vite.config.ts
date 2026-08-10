import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { getSearchSuggestions } from './src/experiments/async-workflows/search/search.mock-api';

const SEARCH_API_PATH = '/search-api/items';

function searchApiMockPlugin(): Plugin {
  return {
    name: 'local-search-api',
    configureServer(server) {
      server.middlewares.use(SEARCH_API_PATH, (request, response, next) => {
        if (request.method !== 'GET') {
          next();
          return;
        }

        const url = new URL(request.url ?? '', 'http://localhost');
        const query = url.searchParams.get('q') ?? '';
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(getSearchSuggestions(query)));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const searchApiTarget = env.SEARCH_API_TARGET;

  const server = searchApiTarget
    ? {
        port: 5173,
        proxy: {
          '/search-api': {
            target: searchApiTarget,
            changeOrigin: true,
            rewrite: (path: string) => path.replace(/^\/search-api/, '/api'),
          },
        },
      }
    : {
        port: 5173,
      };

  return {
    plugins: [react(), ...(searchApiTarget ? [] : [searchApiMockPlugin()])],
    server,
    test: {
      environment: 'jsdom',
    },
  };
});
