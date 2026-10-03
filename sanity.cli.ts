import { defineCliConfig } from 'sanity/cli';
import { projectId, dataset } from './sanity.constants';

export default defineCliConfig({
  api: { projectId, dataset },
  schemaExtraction: {
    path: '.sanity/schema.json',
  },
  typegen: {
    path: './src/**/*.{ts,astro}',
    schema: '.sanity/schema.json',
    generates: './sanity.types.ts',
  },
});
