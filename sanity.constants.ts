export const projectId = '9aw7995u';
export const dataset = 'production';

/** Business name, never translated. */
export const siteName = 'Sonara Vocal Experiences';

/** The single source for locales: Studio languages, Astro i18n routes, and the nav switcher.
 *  The first entry is the default locale, served unprefixed at `/`. `id` is used in URLs and
 *  Sanity's `language` values; `hreflang` (BCP 47, with region) only in `<html lang>` and
 *  alternate links, so a region change never needs a content migration. */
export const locales = [
  { id: 'es', hreflang: 'es-ES', title: 'Español', label: 'ES' },
  { id: 'ca', hreflang: 'ca-ES', title: 'Català', label: 'CA' },
  { id: 'en', hreflang: 'en-US', title: 'English', label: 'ENG' },
] as const;

export type LocaleId = (typeof locales)[number]['id'];

export const defaultLocale: LocaleId = locales[0].id;
