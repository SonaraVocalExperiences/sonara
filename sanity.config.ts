import { defineConfig, defineSingleton } from 'sanity';
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
      languageFilter: { documentTypes: ['homePage'] },
    }),
  ],
  document: {
    singletons: [defineSingleton({ documentId: 'homePage', schemaType: 'homePage', title: 'Homepage' })],
  },
  releases: { enabled: false },
  scheduledDrafts: { enabled: false },
  schema: {
    types: schemaTypes,
  },
});
