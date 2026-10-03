import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

// The jsx-a11y rules come in re-namespaced as `astro/jsx-a11y/*`; eslint-plugin-astro
// wraps eslint-plugin-jsx-a11y itself, so that plugin is never registered directly.
export default defineConfig([
  globalIgnores(['.astro/**', '.sanity/**', 'dist/**', '.netlify/**', 'src/env.d.ts', 'sanity.types.ts']),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs['flat/recommended'],
  astro.configs['flat/jsx-a11y-recommended'],
  {
    // TypeScript resolves identifiers itself, and `no-undef` cannot see type-only
    // or ambient declarations, so it reports false positives on TS sources.
    files: ['**/*.ts', '**/*.tsx', '**/*.astro'],
    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: ['astro.config.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        URL: 'readonly',
      },
    },
  },
  prettier,
]);
