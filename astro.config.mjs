import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { projectId, dataset } from './sanity.constants.ts';

const env = loadEnv(process.env.MODE ?? process.env.NODE_ENV ?? 'development', process.cwd(), '');

const token = env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_READ_TOKEN;

if (!token) {
  throw new Error(
    'Missing SANITY_API_READ_TOKEN. Add a Viewer token from sanity.io/manage → API → Tokens to .env (local) or Netlify env vars (production).',
  );
}

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ['PUBLIC_'],
    resolve: {
      dedupe: ['react', 'react-dom', 'react-is', 'styled-components'],
    },
    optimizeDeps: {
      include: [
        '@sanity/visual-editing',
        '@sanity/visual-editing/react',
        'react/compiler-runtime',
        'lodash/isObject.js',
        'lodash/groupBy.js',
        'lodash/keyBy.js',
        'lodash/partition.js',
        'lodash/sortedIndex.js',
      ],
    },
  },
  integrations: [
    sanity({
      projectId,
      dataset,
      token,
      useCdn: false,
      apiVersion: '2025-05-29',
      studioBasePath: '/admin',
      studioRouterHistory: 'hash',
      stega: {
        studioUrl: '/admin',
      },
    }),
    react(),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'ca', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
