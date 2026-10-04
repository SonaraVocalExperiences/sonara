export const projectId = '9aw7995u';
export const dataset = 'production';

/** Business name, never translated. */
export const siteName = 'Sonara Vocal Experiences';

/** The single source for locales: Studio languages, Astro i18n routes, and the language switcher.
 *  The first entry is the default locale, served unprefixed at `/`. `id` is used in URLs and
 *  Sanity's `language` values; `hreflang` (BCP 47, with region) in `<html lang>`, alternate links,
 *  and the switcher's `lang`/`hreflang`, so a region change never needs a content migration.
 *  `title` is the Studio label. `label` is the switcher's visible abbreviation, and must be the
 *  start of `name` (the language's own name, its accessible name) to satisfy WCAG 2.5.3.
 *  `navLabel` names the switcher's `<nav>` landmark when that locale is the current page. */
export const locales = [
  { id: 'es', hreflang: 'es-ES', title: 'Español', label: 'ES', name: 'Español', navLabel: 'Idioma' },
  { id: 'ca', hreflang: 'ca-ES', title: 'Català', label: 'CA', name: 'Català', navLabel: 'Idioma' },
  { id: 'en', hreflang: 'en-US', title: 'English', label: 'EN', name: 'English', navLabel: 'Language' },
] as const;

export type LocaleId = (typeof locales)[number]['id'];

export const defaultLocale: LocaleId = locales[0].id;
