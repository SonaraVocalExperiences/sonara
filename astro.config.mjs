// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
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

/**
 * One @font-face per Inter subset, with its unicode range from @fontsource-variable/inter/index.css.
 * @param {string} subset
 * @param {string} unicodeRange
 * @returns {NonNullable<Parameters<ReturnType<typeof fontProviders.local>['resolveFont']>[0]['options']>['variants'][number]}
 */
const interSubset = (subset, unicodeRange) => ({
  src: [`@fontsource-variable/inter/files/inter-${subset}-wght-normal.woff2`],
  weight: '100 900',
  style: 'normal',
  unicodeRange: [unicodeRange],
});

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
  // Self-hosted from the installed package (no network at build, no visitor data to a font CDN).
  // Two families so Layout.astro can preload just latin with <Font preload>: --font-inter (latin,
  // with the metric-matched fallback, measured from latin) and --font-inter-scripts (every other
  // subset, no fallback of its own). Each subset only downloads when a page uses its characters,
  // so a browser-translated page still gets Inter. global.css lists scripts first.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          interSubset(
            'latin',
            'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
          ),
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Inter Scripts',
      cssVariable: '--font-inter-scripts',
      fallbacks: [],
      options: {
        variants: [
          interSubset(
            'latin-ext',
            'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'
          ),
          interSubset(
            'vietnamese',
            'U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB'
          ),
          interSubset('greek', 'U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF'),
          interSubset('greek-ext', 'U+1F00-1FFF'),
          interSubset('cyrillic', 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116'),
          interSubset('cyrillic-ext', 'U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F'),
        ],
      },
    },
  ],
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
