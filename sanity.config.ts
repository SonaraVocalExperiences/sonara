import { languageFilter } from '@sanity/language-filter';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';
import { projectId, dataset } from './sanity.constants';

export const locales = [
  { id: 'es', title: 'Español' },
  { id: 'ca', title: 'Català' },
  { id: 'en', title: 'English' },
] as const;

export type SiteLocale = (typeof locales)[number]['id'];

export default defineConfig({
  name: 'sonara',
  title: 'Sonara',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4321',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
    }),
    internationalizedArray({
      languages: locales,
      defaultLanguages: ['es'],
      fieldTypes: ['string', 'text'],
    }),
    languageFilter({
      supportedLanguages: locales,
      defaultLanguages: ['es'],
      documentTypes: ['homePage'],
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
