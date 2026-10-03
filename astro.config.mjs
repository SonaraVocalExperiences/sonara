// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

import { projectId, dataset, locales, defaultLocale } from './sanity.constants';

// rolldown-vite drops `react-compiler-runtime`'s named exports, breaking Visual Editing.
// The shim re-exports them; see src/shims/react-compiler-runtime.mjs.
const reactCompilerRuntimeShim = fileURLToPath(new URL('./src/shims/react-compiler-runtime.mjs', import.meta.url));

// Config runs before Astro loads `.env`. The dataset is public, so only draft preview
// needs the token: warn, don't fail, so CI can run without it.
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
if (!env.SANITY_API_READ_TOKEN) {
  console.warn(
    'SANITY_API_READ_TOKEN is not set, so draft-mode preview will not work. Add a Viewer token from sanity.io/manage → API → Tokens to .env locally and to the Netlify site environment.'
  );
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.sonaravocalexperiences.com',
  output: 'server',
  adapter: netlify(),
  i18n: {
    defaultLocale,
    locales: locales.map((l) => l.id),
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sanity({
      projectId,
      dataset,
      apiVersion: '2025-05-29',
      useCdn: true,
      studioBasePath: '/admin',
      stega: { studioUrl: '/admin' },
    }),
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [{ find: /^react-compiler-runtime$/, replacement: reactCompilerRuntimeShim }],
    },
    // Pre-bundle Visual Editing so the shim is inlined into it.
    optimizeDeps: {
      include: ['@sanity/visual-editing', '@sanity/visual-editing/react'],
    },
  },
});
