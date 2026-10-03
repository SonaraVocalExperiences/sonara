import { languageFilter } from '@sanity/language-filter';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';
import { projectId, dataset, locales, defaultLocale } from './sanity.constants';

const languageConfig = locales.map((l) => ({ id: l.id, title: l.title }));

export default defineConfig({
  name: 'sonara',
  title: 'Sonara',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
    }),
    internationalizedArray({
      languages: languageConfig,
      defaultLanguages: [defaultLocale],
      fieldTypes: ['string', 'text'],
    }),
    languageFilter({
      supportedLanguages: languageConfig,
      defaultLanguages: [defaultLocale],
      documentTypes: ['homePage'],
    }),
  ],
  releases: { enabled: false },
  scheduledDrafts: { enabled: false },
  schema: {
    types: schemaTypes,
  },
});
