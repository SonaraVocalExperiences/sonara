import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.document().schemaType('homePage').documentId('homePage').title('Homepage');
