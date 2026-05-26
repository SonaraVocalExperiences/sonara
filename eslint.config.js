import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['.astro/**', 'dist/**', 'src/env.d.ts'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  prettier,
  {
    rules: {
      // Add project-specific rules here
    },
  }
);
